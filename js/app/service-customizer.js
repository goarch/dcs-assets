/* ============================================================
   1. SELF-LAUNCHER (Force Popup Mode)
   ============================================================ */
(function () {
    if (window.name !== "SC_Control_Panel") {
        const features = `width=450,height=850,left=50,top=50,resizable=yes,scrollbars=yes`;
        window.open(window.location.href, "SC_Control_Panel", features);

        // Stop everything else and let the user know it's moving
        document.body.innerHTML = "<div style='padding:20px; font-family:sans-serif;'><h2>Launching Control Panel...</h2><p>This window will now close.</p></div>";
        setTimeout(() => { window.close(); }, 1000);
        throw new Error("Redirecting to Popup Mode..."); // Stops further script execution
    }
})();

/* ============================================================
   2. GLOBAL VARIABLES
   ============================================================ */
var serviceWin = null;

/* ============================================================
   3. REST OF YOUR FUNCTIONS (launchService, applyOverrides, etc.)
   ============================================================ */

function launchService() {
    const dateInput = document.getElementById('service-date-picker').value;
    if (!dateInput) {
        alert("Please select a date first.");
        return;
    }

    // Parse YYYY-MM-DD from the picker
    const parts = dateInput.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    // THE VERIFIED URL STRUCTURE (with li1/ correction)
    const baseUrl = "https://dcs.goarch.org/goa/dcs/h/s/";
    const targetUrl = `${baseUrl}${year}/${month}/${day}/li1/gr-en/index.html`;

    const width = 450;
    const height = 850;
    const features = `width=${width},height=${height},resizable=yes,scrollbars=yes`;

    console.log("Launching verified URL: " + targetUrl);

    serviceWin = window.open(targetUrl, 'DCS_Service_Window', features);

    if (serviceWin) {
        updateStatus(true);
        serviceWin.focus();
    } else {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
    }
}

function updateEntityDropdown() {
    const jurisSelect = document.getElementById('jurisdiction-select');
    const entitySelect = document.getElementById('entity-select');
    const entitySection = document.getElementById('section-entity');
    const selectedJuris = jurisSelect.value;

    // 1. Clear previous options
    entitySelect.innerHTML = '';

    // 2. Check if the mapping exists for the selection
    if (selectedJuris && entityMapping[selectedJuris]) {

        // Show the hidden section
        entitySection.style.display = 'block';

        // 3. Populate the dropdown
        entityMapping[selectedJuris].forEach(item => {
            let opt = document.createElement('option');
            opt.value = item.value;
            opt.innerHTML = item.text;
            entitySelect.appendChild(opt);
        });

        // 4. Trigger the first update immediately
        applyOverrides();

    } else {
        // Hide it if no jurisdiction is selected
        entitySection.style.display = 'none';
    }
}

function replaceEntityText() {
    // CRITICAL UPDATE: Look at the new window, not an iframe
    if (!window.serviceWin || window.serviceWin.closed) {
        console.error("Service window is not open.");
        return;
    }

    // Access the document of the standalone window
    var $s = $(window.serviceWin.document);

    // Loop through the mappings
    for (var entityId in entityMapping) {
        var inputElement = document.getElementById(entityId);
        if (inputElement) {
            var value = inputElement.value;
            var mapping = entityMapping[entityId];

            // If the mapping has classes (data-keys)
            if (mapping.classes) {
                $.each(mapping.classes, function (i, keyString) {
                    // Use your clever 'contains' selector to find the key
                    var target = $s.find('[data-key*="' + keyString + '"]');

                    if (target.length > 0) {
                        target.text(value);
                    }
                });
            }
        }
    }
    console.log("Text replacement via data-key complete in standalone window.");
}

function applyOrdinationOverrides() {
    if (!serviceWin || serviceWin.closed) return;
    var $s = $(serviceWin.document);

    $.each(ordinationMapping, function (role, config) {
        // Only push if the checkbox for this role is actually checked
        if ($('#' + config.checkId).is(':checked')) {
            $.each(config.fields, function (i, field) {
                var val = $('#' + field.inputId).val();
                // We use your 'contains' selector to find the DCS key in the other window
                $s.find('[data-key*="' + field.dataKey + '"]').text(val);
            });
        }
    });
}

function setServiceCategory(category) {
    console.log("Service Category selected: " + category);

    const btnStd = document.getElementById('btn-standard');
    const btnHli = document.getElementById('btn-hli');

    // 1. Swap the 'active' class for the UI toggle effect
    if (category === 'standard') {
        btnStd.classList.add('active');
        btnHli.classList.remove('active');
    } else if (category === 'hierarchical') {
        btnHli.classList.add('active');
        btnStd.classList.remove('active');
    }

    // 2. Immediately push the change to the standalone service window
    updateServiceVisibility(category);
}

function updateServiceVisibility(category) {
    // CRITICAL: Connect to the popup window we launched earlier
    if (!serviceWin || serviceWin.closed) {
        console.error("Service window is not open.");
        return;
    }

    // Access the jQuery and Document of the popup window
    const $s = $(serviceWin.document);

    const isHierarchical = (category === 'hierarchical');

    // --- PART 1: UI PANEL LOGIC (Side Control Panel) ---
    const ordSection = document.getElementById('section-ordination');
    const deaconCheck = document.getElementById('ord-deacon-check');
    const priestCheck = document.getElementById('ord-priest-check');
    const deaconFields = document.getElementById('deacon-name-fields');
    const priestFields = document.getElementById('priest-name-fields');

    if (ordSection) {
        ordSection.style.display = isHierarchical ? 'block' : 'none';
    }

    if (!isHierarchical) {
        if (deaconCheck) deaconCheck.checked = false;
        if (priestCheck) priestCheck.checked = false;
        if (deaconFields) deaconFields.style.display = 'none';
        if (priestFields) priestFields.style.display = 'none';
    } else {
        if (deaconFields) deaconFields.style.display = (deaconCheck && deaconCheck.checked) ? 'flex' : 'none';
        if (priestFields) priestFields.style.display = (priestCheck && priestCheck.checked) ? 'flex' : 'none';
    }

    // --- PART 2: CLEAN SLATE (In the Service Window) ---
    // Hide every row containing any BCC/ECC pair to start fresh
    $s.find('tr:has([class*="bcc_"])').each(function () {
        const bccClass = $(this).find('[class*="bcc_"]').attr('class').split(' ')[0];
        const eccClass = bccClass.replace('bcc_', 'ecc_');
        $s.find('tr:has(.' + bccClass + ')')
            .nextUntil('tr:has(.' + eccClass + ')')
            .addBack()
            .add($s.find('tr:has(.' + eccClass + ')'))
            .hide();
    });

    // --- PART 3: SERVICE VISIBILITY ---
    // Show primary category (Standard "li_" vs Hierarchical "hli_")
    const prefix = isHierarchical ? 'hli_' : 'li_';
    $s.find('tr:has([class*="bcc_' + prefix + '"])').each(function () {
        const bccClass = $(this).find('[class*="bcc_' + prefix + '"]').attr('class').split(' ')[0];

        // Skip ordination blocks here; they are toggled by checkboxes
        if (bccClass.includes('ordination')) return;

        showBlock($s, bccClass.replace('bcc_', ''));
    });

    // --- PART 4: SUBSET VISIBILITY (Ordinations) ---
    if (isHierarchical) {
        if (deaconCheck && deaconCheck.checked) {
            showBlock($s, 'hli_ordination_deacon');
        }
        if (priestCheck && priestCheck.checked) {
            showBlock($s, 'hli_ordination_priest');
        }
    }
}

/**
 * Helper function to show a specific BCC/ECC range in the popup
 */
function showBlock($s, slug) {
    const bcc = 'bcc_' + slug;
    const ecc = 'ecc_' + slug;
    $s.find('tr:has(.' + bcc + ')')
        .nextUntil('tr:has(.' + ecc + ')')
        .addBack()
        .add($s.find('tr:has(.' + ecc + ')'))
        .show();
}

function applyOverrides() {
    // 1. SETUP THE STANDALONE WINDOW ACCESS
    // Instead of FrameText, we use the window we opened via the Launch button
    if (!serviceWin || serviceWin.closed) return;

    const serviceDoc = serviceWin.document;
    const $s = $(serviceDoc); // Using the local jQuery to talk to the popup

    // 2. PART A: JURISDICTION TEXT REPLACEMENT
    const selectedID = document.getElementById('entity-select').value;
    if (selectedID && dioceseData[selectedID]) {
        const dataKeys = dioceseData[selectedID].keys;
        Object.keys(dataKeys).forEach(key => {
            const val = dataKeys[key];
            if (val !== "") {
                // Use a partial match [data-key*="..."] to be safe with complex keys
                $s.find(`[data-key*="${key}"]`).text(val);
            }
        });
        console.log("Text replaced for: " + dioceseData[selectedID].label);
    }

    // 3. PART B: SERVICE CATEGORY VISIBILITY
    const isStd = document.getElementById('btn-standard').classList.contains('active');
    const isHli = document.getElementById('btn-hli').classList.contains('active');

    if (isStd || isHli) {
        const category = isStd ? 'standard' : 'hierarchical';
        updateServiceVisibility(category);
    }

    // 4. PART C: ORDINATION NAME REPLACEMENT
    // PART C: ORDINATION NAME REPLACEMENT
    // 4. PART C: ORDINATION NAME REPLACEMENT
    if (isHli) {
        ['deacon', 'priest'].forEach(role => {
            const config = ordinationMapping[role];
            const checkEl = document.getElementById(config.checkId);
            const isChecked = checkEl && checkEl.checked;

            config.fields.forEach(field => {
                const inputEl = document.getElementById(field.inputId);

                // YESTERDAY'S LOGIC + LENGTH PROTECTION
                // We check if value exists AND has a length > 0. 
                // If not, we FORCE the underscores "_______"
                const finalVal = (isChecked && inputEl && inputEl.value.trim().length > 0)
                    ? inputEl.value
                    : "_______";

                // Push to the service window
                $s.find(`[data-key="${field.dataKey}"]`).text(finalVal);
            });
        });
    }
}

$(document).ready(function () {
    // 1. Set the date picker to today automatically
    const dateInput = document.getElementById('service-date-picker');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // 2. Your other listeners (like the ones for the dropdowns)
    console.log("Service Customizer Initialized for March 29, 2026");
});

$(document).ready(function () {

    // --- JURISDICTION & DIOCESE LISTENER ---
    // When the first dropdown changes, update the second one
    $('#jurisdiction-select').on('change', function () {
        updateEntityDropdown();
    });

    // When a specific Metropolis is chosen, push the keys to the service
    $('#entity-select').on('change', function () {
        replaceEntityText();
    });

    // --- ORDINATION LISTENER ---
    // '.on("input")' triggers as you type each letter (Real-Time)
    // '.on("change")' triggers when you check/uncheck a box
    $('#section-ordination').on('input change', 'input', function () {
        applyOrdinationOverrides();
    });

    // --- SERVICE CATEGORY TOGGLES ---
    $('#btn-standard').on('click', function () {
        setServiceCategory('standard');
    });

    $('#btn-hli').on('click', function () {
        setServiceCategory('hierarchical');
    });

    console.log("Real-time listeners attached and ready.");
});

$(document).ready(function () {
    // Trigger update as you type names
    $('#section-ordination').on('input', 'input[type="text"]', function () {
        applyOverrides();
    });

    // Trigger update when you check/uncheck Deacon/Priest
    $('#section-ordination').on('change', 'input[type="checkbox"]', function () {
        applyOverrides();
    });
});

// --- JQUERY INITIALIZATION ---
$(document).ready(function () {
    console.log("Service Customizer Engine Ready.");
    // Bind your button clicks here
});
