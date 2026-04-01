/* ============================================================
   1. GLOBAL VARIABLES
   ============================================================ */
var serviceWin = null;

/* ============================================================
   2. TAB MANAGEMENT & WATERFALL FLOW
   ============================================================ */

function launchService() {
    const dateInput = document.getElementById('service-date-picker').value;
    if (!dateInput) {
        alert("Please select a date first.");
        return;
    }

    const parts = dateInput.split('-');
    const year = parts[0], month = parts[1], day = parts[2];
    const targetUrl = `https://dcs.goarch.org/goa/dcs/h/s/${year}/${month}/${day}/li1/gr-en/index.html`;

    // Connect to a named tab "DCS_Service_Display"
    serviceWin = window.open(targetUrl, 'DCS_Service_Display');

    if (serviceWin) {
        serviceWin.focus();
        // Step 1: Reveal Jurisdiction
        document.getElementById('section-jurisdiction').style.display = 'block';
    } else {
        alert("Pop-up/Tab blocked! Please allow pop-ups for this site.");
    }
}

function updateEntityDropdown() {
    const jurisSelect = document.getElementById('jurisdiction-select');
    const entitySection = document.getElementById('section-entity');
    const selectedJuris = jurisSelect.value;

    const entitySelect = document.getElementById('entity-select');
    entitySelect.innerHTML = '';

    if (selectedJuris && entityMapping[selectedJuris]) {
        // Step 2: Reveal Metropolis
        entitySection.style.display = 'block';

        entityMapping[selectedJuris].forEach(item => {
            let opt = document.createElement('option');
            opt.value = item.value;
            opt.innerHTML = item.text;
            entitySelect.appendChild(opt);
        });
        applyOverrides();
    } else {
        entitySection.style.display = 'none';
    }
}

// Step 3: Triggered when Metropolis is selected
function handleMetropolisChange() {
    // Reveal Category buttons
    document.getElementById('section-category-selection').style.display = 'block';
    applyOverrides();
}

/* ============================================================
   3. CATEGORY SELECTION
   ============================================================ */

function setServiceCategory(category) {
    const isHli = (category === 'hierarchical');
    const btnStd = document.getElementById('btn-standard');
    const btnHli = document.getElementById('btn-hli');

    // 1. Toggle Button Visuals
    btnStd.classList.toggle('active', !isHli);
    btnHli.classList.toggle('active', isHli);

    // 2. Instant Panel Swap
    if (isHli) {
        $('#section-liturgy-options').hide();
        $('#section-hli-liturgy-options').show();
        $('#section-ordination').show();
    } else {
        $('#section-hli-liturgy-options').hide();
        $('#section-ordination').hide();
        $('#section-liturgy-options').show();
    }

    // 3. Reset Checkboxes
    $('#liturgy-options-container input, #section-ordination input').prop('checked', false);
    $('.name-field-group').hide();

    // 4. Update the actual Service Tab
    updateServiceVisibility(category);
}

/* ============================================================
   4. EXPLICIT VISIBILITY MAPPING
   ============================================================ */
function updateServiceVisibility(category) {
    if (!serviceWin || serviceWin.closed) return;
    const $s = $(serviceWin.document);

    // 1. THE MASTER WIPE (Hide all BCC/ECC ranges)
    // We target every row that has a 'bcc_' class and hide it + everything until its 'ecc_' match
    $s.find('tr:has([class*="bcc_"])').each(function () {
        const bccClass = $(this).find('[class*="bcc_"]').attr('class').split(' ')[0];
        const slug = bccClass.replace('bcc_', '');
        hideBlock($s, slug);
    });

    if (category === 'standard') {
        // 2. EXPLICIT STANDARD LIST
        const standardList = [
            'li_enarxis', 'li_antiphons', 'li_smallentrance',
            'li_apolytikion1', 'li_apolytikion2', 'li_kontakion',
            'li_trisagion', 'li_readings', 'li_liturgy', 'li_dismissal'
        ];
        standardList.forEach(slug => showBlock($s, slug));

        // Standard Options
        if ($('#li_opt_litanies').is(':checked')) showBlock($s, 'li_opt_litanies');
        if ($('#li_opt_precommunionprayers').is(':checked')) showBlock($s, 'li_opt_precommunionprayers');
        if ($('#li_opt_memorial').is(':checked')) showBlock($s, 'li_opt_memorial');

    } else if (category === 'hierarchical') {
        // 1. SHOW HIERARCHICAL BASE BLOCKS
        const hliList = ['hli_enarxis', 'hli_antiphons', 'hli_smallentrance', 'hli_fimi', 'hli_readings', 'hli_dismissal'];
        hliList.forEach(slug => showBlock($s, slug));

        // 2. COORDINATED ORDINATION LOGIC
        const isDeacon = $('#ord-deacon-check').is(':checked');
        const isPriest = $('#ord-priest-check').is(':checked');

        // Initial Wipe of all ordination-related blocks and default liturgy
        hideBlock($s, 'hli_liturgy');
        hideBlock($s, 'hli_ordination_deacon');
        hideBlock($s, 'hli_ordination_priest');
        hideBlock($s, 'hli_ordination_priest_and_deacon');

        if (isDeacon && isPriest) {
            // BOTH: Show ONLY the special combined block
            showBlock($s, 'hli_ordination_priest_and_deacon');
        }
        else if (isDeacon) {
            // DEACON ONLY
            showBlock($s, 'hli_ordination_deacon');
        }
        else if (isPriest) {
            // PRIEST ONLY
            showBlock($s, 'hli_ordination_priest');
        }
        else {
            // NEITHER: Restore the default liturgy
            showBlock($s, 'hli_liturgy');
        }

        // 3. HIERARCHICAL OPTIONS
        if ($('#hli_opt_litanies').is(':checked')) showBlock($s, 'hli_opt_litanies');
        if ($('#hli_opt_precommunionprayers').is(':checked')) showBlock($s, 'hli_opt_precommunionprayers');
        if ($('#hli_opt_memorial').is(':checked')) showBlock($s, 'hli_opt_memorial');
    }
}

function toggleNameFields(type) {
    const isChecked = $('#ord-' + type + '-check').is(':checked');

    // 1. UI: Toggle only the specific name fields for this ordination in the customizer
    $('#' + type + '-name-fields').toggle(isChecked);

    // 2. VISIBILITY: Refresh the blocks shown in the service tab
    updateServiceVisibility('hierarchical');

    // 3. TEXT: Push name values or underscores to the service tab
    // This uses the mapping in sc-ordination-data.js to find the right data-keys
    applyOverrides();
}

/* ============================================================
   RANGE HELPERS
   ============================================================ */

/**
 * Shows everything between bcc_slug and ecc_slug inclusive
 */
function showBlock($s, slug) {
    const bcc = '.bcc_' + slug;
    const ecc = '.ecc_' + slug;
    $s.find('tr:has(' + bcc + ')')
        .nextUntil('tr:has(' + ecc + ')')
        .addBack()
        .add($s.find('tr:has(' + ecc + ')'))
        .show();
}

/**
 * Hides everything between bcc_slug and ecc_slug inclusive
 */
function hideBlock($s, slug) {
    const bcc = '.bcc_' + slug;
    const ecc = '.ecc_' + slug;
    $s.find('tr:has(' + bcc + ')')
        .nextUntil('tr:has(' + ecc + ')')
        .addBack()
        .add($s.find('tr:has(' + ecc + ')'))
        .hide();
}


function toggleLiturgyOption(checkbox) {
    const category = $('#btn-hli').hasClass('active') ? 'hierarchical' : 'standard';
    updateServiceVisibility(category);
}

function applyOverrides() {
    if (!serviceWin || serviceWin.closed) return;
    const $s = $(serviceWin.document);

    // 1. Jurisdiction Text Replacement
    const selectedID = document.getElementById('entity-select').value;
    if (selectedID && dioceseData[selectedID]) {
        const dataKeys = dioceseData[selectedID].keys;
        Object.keys(dataKeys).forEach(key => {
            $s.find(`[data-key*="${key}"]`).text(dataKeys[key]);
        });
    }

    // 2. Refresh Visibility
    const isStd = $('#btn-standard').hasClass('active');
    const isHli = $('#btn-hli').hasClass('active');
    if (isStd || isHli) {
        updateServiceVisibility(isStd ? 'standard' : 'hierarchical');
    }

    // 3. Ordination Name Replacement
    if (isHli) {
        ['deacon', 'priest'].forEach(role => {
            const config = ordinationMapping[role];
            const isChecked = $('#' + config.checkId).is(':checked');
            config.fields.forEach(field => {
                const val = $('#' + field.inputId).val();
                const finalVal = (isChecked && val.trim().length > 0) ? val : "_______";
                $s.find(`[data-key="${field.dataKey}"]`).text(finalVal);
            });
        });
    }
}

$(document).ready(function () {
    // Jurisdiction listener
    $('#jurisdiction-select').on('change', updateEntityDropdown);

    // Metropolis listener
    $('#entity-select').on('change', handleMetropolisChange);

    // Categories
    $('#btn-standard').on('click', () => setServiceCategory('standard'));
    $('#btn-hli').on('click', () => setServiceCategory('hierarchical'));

    // Options & Ordination Names
    $('#liturgy-options-container, #section-ordination').on('input change', 'input', applyOverrides);
});
