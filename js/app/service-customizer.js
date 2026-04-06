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

    /* --- NEW WINDOW PLACEMENT LOGIC --- */

    // 1. Get the current Customizer Panel's position and size
    const pLeft = window.screenX || window.screenLeft;
    const pTop = window.screenY || window.screenTop;
    //const pWidth = window.outerWidth;
    const serviceWidth = 650;
    const pHeight = window.outerHeight;

    // 2. Define features: match panel height/width and snap to the RIGHT
    // We add 'resizable=yes,scrollbars=yes' to ensure the Liturgy text is readable
    const features = `height=${pHeight},width=${serviceWidth},top=${pTop},left=${pLeft + 500},resizable=yes,scrollbars=yes,toolbar=no,menubar=no`;

    // 3. Open the service in a specific window instead of a generic tab
    serviceWin = window.open(targetUrl, 'DCS_Service_Display', features);

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

    // --- NEW LOGIC: Reveal Export Tools ---
    // Once a category is clicked, the service is "configured" enough to export.
    document.getElementById('section-export-tools').style.display = 'block';
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
        const hliList = [
            'hli_enarxis', 'hli_antiphons', 'hli_smallentrance', 
            'hli_apolytikion1', 'hli_apolytikion2', 'hli_kontakion',
            'hli_trisagion', 'hli_fimi', 'hli_readings', 'hli_liturgy', 'hli_dismissal'
        ];
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
            if (!config) return; // Safety check

            const isChecked = $('#' + config.checkId).is(':checked');

            config.fields.forEach(field => {
                const $input = $('#' + field.inputId);
                const val = $input.val() || ''; // Get value or empty string

                // If checked AND has text, use it. Otherwise, use underscores.
                const finalVal = (isChecked && val.trim().length > 0) ? val : "_______";

                // Find exact data-key matches in the service tab
                $s.find(`[data-key="${field.dataKey}"]`).text(finalVal);
            });
        });
    }
}

/* ============================================================
   5. EXPORT UTILITIES
   ============================================================ */

/**
 * Entry point for Word Export
 */
function exportToWord() {
    performUnifiedExport('word');
}

/**
 * Entry point for PDF Export
 */
function exportToPDF() {
    performUnifiedExport('pdf');
}

/**
 * Core logic that grabs, cleans, and processes the service table
 */
async function performUnifiedExport(format) {
    // Check if the global serviceWin is active
    if (!serviceWin || serviceWin.closed) {
        alert("Please open and customize a service first.");
        return;
    }

    const serviceDoc = serviceWin.document;
    const liveTable = serviceDoc.getElementById('biTable') || serviceDoc.querySelector('table');

    if (!liveTable) {
        alert("Could not find the liturgy table to export.");
        return;
    }

    // 1. Create the clean clone
    const target = liveTable.cloneNode(true);

    // 1. SELECTORS TO REMOVE (Purge tag AND content)
    const selectorsToRemove = [
        'script', 'style', '.jqm-dropdown', '.key', '.noprintdesig',
        '[style*="display: none"]', '[style*="display:none"]',
        '.nodisplay', '.noprintactor', '.noprintrub', '.noprintprayer',
        '[class^="bcc_"]', '[class*=" bcc_"]', '[class^="ecc_"]', '[class*=" ecc_"]',
        '[class^="bmc_"]', '[class*=" bmc_"]', '[class^="emc_"]', '[class*=" emc_"]',
        '[class^="bkmrk"]', '[class*=" bkmrk"]',
        '[class^="source"]', '[class*=" source"]',
        '.dummy'
    ];

    target.querySelectorAll(selectorsToRemove.join(',')).forEach(el => el.remove());

    // 2. CLASSES TO UNWRAP (Remove tag, but KEEP the text content)
    const classesToUnwrap = [
        '.achoir', '.aclergy', '.adeacon', '.ahierarch',
        '.dchoir', '.dclergy', '.ddeacon', '.dhierarch',
        '.dpeople', '.dpriest', '.dwachoir', '.dwadeacon',
        '.kvp'
    ];

    target.querySelectorAll(classesToUnwrap.join(',')).forEach(el => {
        // This dissolves the span but leaves the words for Word to read
        el.replaceWith(...el.childNodes);
    });

    // 3. The Vacuum: Remove empty rows
    target.querySelectorAll('tr').forEach(row => {
        const hasText = row.textContent.replace(/\u00a0/g, ' ').trim().length > 0;
        if (!hasText && !row.querySelector('img')) row.remove();
    });

    // 4. Execution
    const fileName = serviceDoc.title || "Customized_Service";
    if (format === 'word') {
        await generateWordFile(target, fileName);
    } else {
        await generatePDFFile(target, fileName);
    }
}

/**
 * Specifically handles the Word blob and CSS injection
 */
async function generateWordFile(element, filename) {
    const cssPath = "css/dcs_word_styles.css"; // Path relative to liturgy HTML
    let cssText = "";

    try {
        const response = await fetch(cssPath);
        cssText = await response.text();
    } catch (e) {
        console.warn("External CSS not found, using basic formatting.");
    }

    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><style>${cssText}</style></head>
        <body><div class="Section1">${element.outerHTML}</div></body>
        </html>`;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + ".doc";
    link.click();
}


function generatePDFFile(element, filename) {
    const printWin = window.open('', '_blank', 'width=900,height=800');
    const rootURL = "https://dcs.goarch.org/goa/dcs/";

    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <base href="${rootURL}">
            <title>${filename}</title>
            <link rel="stylesheet" href="css/dcs_word_styles.css">
            <style>
                @page {
                    size: 8.5in 11in;
                    /* THE NEW FLOOR: 0.75 inches from the bottom edge */
                    margin: 0.5in 0.75in 0.75in 0.75in;
                    counter-increment: page;

                    /* LEFT FOOTER: Anchored exactly at the .75in margin */
                    @bottom-left {
                        content: "Powered by Digital Chant Stand: A National Ministry of the Greek Orthodox Archdiocese of America";
                        font-family: "Times New Roman", serif;
                        font-size: 10pt;
                        font-style: italic;
                        color: #a91827;
                        border-top: 0.1pt solid #a91827;
                        width: 6.5in; 
                        padding-top: 5pt;
                        vertical-align: top;
                    }

                    /* RIGHT FOOTER: Anchored exactly at the .75in margin */
                    @bottom-right {
                        content: counter(page);
                        font-family: "Times New Roman", serif;
                        font-size: 10pt;
                        font-weight: normal;
                        color: #a91827;
                        border-top: 0.1pt solid #a91827;
                        width: 0.5in; 
                        padding-top: 5pt;
                        text-align: right;
                        vertical-align: top;
                    }
                }

                body { margin: 0; padding: 0; font-family: "Times New Roman", serif; background: white; }

                /* 1. THE HEADER (Text and Line) */
                .master-table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    table-layout: fixed; 
                }

                thead { 
                    display: table-header-group; 
                }

                .header-container {
                    height: 25pt;
                    text-align: center;
                    vertical-align: bottom;
                    color: #a91827;
                    font-size: 11pt;
                    font-weight: normal;
                    padding-bottom: 4pt; /* Space between text and line */
                    border-bottom: 0.4pt solid #C0C0C0; /* The Gray Line */
                }

                /* 2. THE GUARANTEED SPACE AFTER THE LINE */
                /* This creates a dedicated invisible gap that repeats with the header */
                .header-spacer {
                    height: 15pt;
                }

                /* Reset the main cell padding since we are using the spacer instead */
                .master-table > tbody > tr > td {
                    padding-top: 0 !important;
                    vertical-align: top;
                }

                /* BILINGUAL CONTENT FLOW (No clipping) */
                .dcs-export-container { width: 100%; margin-top: 0;} /* We use the TD padding instead for better reliability */
                .dcs-export-container table, 
                .dcs-export-container tbody { display: block !important; width: 100% !important; }
                .dcs-export-container tr { 
                    display: flex !important; 
                    width: 100% !important;
                    break-inside: auto !important;
                }
                .dcs-export-container td { 
                    display: block !important; 
                    width: 50% !important; 
                    padding: 4pt 10pt;
                    word-wrap: break-word;
                }

                /* Color Overrides for Liturgical Content */
                .actor, .red, .boldred, .rubric { color: #a91827 !important; }
            </style>
        </head>
        <body>
            <table class="master-table">
                <thead>
                    <tr><th class="header-container">Divine Liturgy</th></tr>
                    <tr><th class="header-spacer"></th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="dcs-export-container">
                                ${element.outerHTML}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <script>
                window.onload = function() {
                    // Slight delay to ensure all assets (fonts/CSS) are rendered 
                    // before the print dialog freezes the page.
                    setTimeout(() => { window.print(); }, 1200);
                };
            <\/script>
        </body>
        </html>
    `);

    printWin.document.close();
}


$(document).ready(function () {
    // Jurisdiction listener
    $('#jurisdiction-select').on('change', updateEntityDropdown);

    // Metropolis listener
    $('#entity-select').on('change', handleMetropolisChange);

    // Categories
    $('#btn-standard').on('click', () => setServiceCategory('standard'));
    $('#btn-hli').on('click', () => setServiceCategory('hierarchical'));

    // 1. Instant Listeners (Checkboxes)
    // We use 'change' here so the liturgy range swaps immediately when clicked.
    $('#liturgy-options-container, #section-ordination').on('change', 'input[type="checkbox"]', applyOverrides);

    // 2. Delayed Listeners (Name Text Fields)
    // By removing 'input' and only using 'change', the lag disappears. 
    // The service updates only when the user tabs out or clicks away.
    $('#section-ordination').on('change', 'input[type="text"]', applyOverrides);
});
