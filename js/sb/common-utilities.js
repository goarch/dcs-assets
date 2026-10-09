function setLiturgyOptionsByEparchy() {
    state.eparchySelect = eparchySelect.value;

    const selectedDiocese = dioceseData?.[state.eparchySelect];

    // Pre-Communion Prayers: offered unless the chosen Metropolis turns it off
    // (option_li_precommunion_prayers: false in sb-diocese-data.js; all true for now)
    if (precommunionPrayers) {
        precommunionPrayers.style.display = (selectedDiocese && selectedDiocese.option_li_precommunion_prayers === false) ? 'none' : '';
    }

    // 2. If no valid diocese is found, hide both or exit safely
    if (!selectedDiocese) {
        if (postGospel) postGospel.style.display = 'none';
        if (extenedCompLitany) extenedCompLitany.style.display = 'none';
        return;
    }

    // 3. Apply options safely
    if (postGospel) {
        postGospel.style.display = selectedDiocese.option_li_litanies_after_gospel ? '' : 'none';
    }

    if (extenedCompLitany) {
        extenedCompLitany.style.display = selectedDiocese.option_li_extended_completion_litany ? '' : 'none';
    }
}

/**
 * Asynchronous Worker: Pulls structural markup out of index.html
 */
async function fetchSourceHTML(type) {
    try {
        const response = await fetch(`https://dcs.goarch.org/goa/dcs/h/b/sb/${type}/${state.currentLang}/index.html`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Extract raw markup as plain string text
        const htmlText = await response.text();

        if (type === 'lit') {
            state.fetchedHTMLContentLit = htmlText;
        } else if (type === 'ord') {
            state.fetchedHTMLContentOrd = htmlText;
        } else if (type === 'cli') {
            state.fetchedHTMLContentCli = htmlText;
        } else if (type === 'mat') {
            state.fetchedHTMLContentMat = htmlText;
        } else if (type === 'ves') {
            state.fetchedHTMLContentVes = htmlText;
        }

    } catch (error) {
        console.error(`Could not fetch layout content for type "${type}":`, error);

        const errorFallbackHTML = `<p style="color:red; font-weight:bold;">Error loading target template asset (${type}).</p>`;

        // Correctly route the error fallback markup based on type parameter
        if (type === 'lit') {
            state.fetchedHTMLContentLit = errorFallbackHTML;
        } else if (type === 'ord') {
            state.fetchedHTMLContentOrd = errorFallbackHTML;
        } else if (type === 'cli') {
            state.fetchedHTMLContentCli = errorFallbackHTML;
        } else if (type === 'mat') {
            state.fetchedHTMLContentMat = errorFallbackHTML;
        } else if (type === 'ves') {
            state.fetchedHTMLContentVes = errorFallbackHTML;
        }
    }
    console.log("Fetch complete!");
}

async function fetchDatedSourceHTML(type) {
    const dateInput = document.getElementById('service-date-picker').value;
    if (!dateInput) {
        alert("Please select a date first.");
        return;
    }
    const [year, month, day] = dateInput.split('-');
    try {
        const response = await fetch(`https://dcs.goarch.org/goa/dcs/h/s/${year}/${month}/${day}/${type}/${state.currentLang}/index.html`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Extract raw markup as plain string text
        const htmlText = await response.text();

        if (type === 'li') {
            state.fetchedHTMLContentLi = htmlText;
        } else if (type === 've2') {
            state.fetchedHTMLContentVe2 = htmlText;
        } else if (type === 'li2') {
            state.fetchedHTMLContentLi2 = htmlText;
        } else if (type === 'li3') {
            state.fetchedHTMLContentLi3 = htmlText;
        }

    } catch (error) {
        console.error(`Could not fetch layout content for type "${type}":`, error);

        const errorFallbackHTML = `<p style="color:red; font-weight:bold;">Error loading target template asset (${type}).</p>`;

        // Correctly route the error fallback markup based on type parameter
        if (type === 'li') {
            state.fetchedHTMLContentLi = errorFallbackHTML;
        } else if (type === 've2') {
            state.fetchedHTMLContentVe2 = errorFallbackHTML;
        } else if (type === 'li2') {
            state.fetchedHTMLContentLi2 = errorFallbackHTML;
        } else if (type === 'li3') {
            state.fetchedHTMLContentLi3 = errorFallbackHTML;
        }
    }
    console.log("Dated Fetch complete!");
}

/**
 * Vespers: shows the two Lity options only if that day's second Vespers (ve2,
 * already fetched with fetchDatedSourceHTML('ve2')) contains the Lity sections.
 * Shared by service-builder-vespers.js and service-builder-hvespers.js.
 */
function updateLityOptionsForDay() {
    const ve2 = state.fetchedHTMLContentVe2 || '';
    const hasPart2 = ve2.includes('brc_ve_lity_part2_first');
    const hasPart3 = ve2.includes('brc_ve_lity_part3_rest');
    state.ve2LityExists = hasPart2 && hasPart3;

    const part1 = document.getElementById("ve_lity_part1");
    const part2 = document.getElementById("ve_lity_part2");

    if (!state.ve2Exists || !state.ve2LityExists) {
        if (part1) part1.style.display = "none";
        if (part2) part2.style.display = "none";
    } else {
        // Revert back to the CSS stylesheet default layout
        if (part1) part1.style.display = "";
        if (part2) part2.style.display = "";
    }
}

//-------------------------------------------------------------------------CONTENT SWAP---------------------------------------------------------------
// executeContentSwap, getNextUntilSiblings, removeNextUntilSiblings and insertAfter
// live in js/lib/alwb.js (one copy for the DCS site). In a buildMode panel,
// js/sb/sb-embed.js provides executeContentSwap(key), which calls the alwb.js one.

function handleDeaconCheckbox() { //COMMON
    // ac.sb.PrBl: "PRIEST" before a line the priest says right after the deacon's;
    // without a deacon the priest says both, so the label is left out
    const dataKeys = ['ac.sb.DePr', 'ac.sb.DeBl', 'ac.sb.DePe', 'ac.sb.PrBl'];

    if (state.liOptDeacon) {
        swapEnarxisDeacon();
        dataKeys.forEach(key => switchActor(key, actorMapping[key].defen, actorMapping[key].defgr));
        displayTr("class", "ddebl", "block");
        displayTr("class", "adebl", "block");
    } else {
        swapEnarxisNoDeacon();
        dataKeys.forEach(key => switchActor(key, actorMapping[key].alten, actorMapping[key].altgr));
        displayTr("class", "ddebl", "none");
        displayTr("class", "adebl", "none");
    }
}

function handleConsecrationDeaconCheckbox() { //COMMON
    const dataKeys = ['ac.sb.DePr', 'ac.sb.DeBl', 'ac.sb.DePe', 'ac.sb.PrBl'];

    if (state.liOptDeacon) {
        dataKeys.forEach(key => switchActor(key, actorMapping[key].defen, actorMapping[key].defgr));
        displayTr("class", "ddebl", "block");
        displayTr("class", "adebl", "block");
    } else {
        dataKeys.forEach(key => switchActor(key, actorMapping[key].alten, actorMapping[key].altgr));
        displayTr("class", "ddebl", "none");
        displayTr("class", "adebl", "none");
    }
}

function isHymnBetweenApolytikion2AndKontakion() {
    if (!state.serviceWin || state.serviceWin.closed) return false;
    const doc = state.serviceWin.document;

    // 1. Locate the deep boundary elements
    const startEl = doc.querySelector('.erc_li_apolytikion2');
    const endEl = doc.querySelector('.brc_li_kontakion');

    if (!startEl || !endEl) return false;

    // 2. Set up a TreeWalker to look only at Element nodes
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null, false);

    // 3. Fast-forward the walker to our starting element
    while (walker.nextNode()) {
        if (walker.currentNode === startEl) break;
    }

    // 4. Step forward element-by-element across any nested boundaries
    while (walker.nextNode()) {
        const currentEl = walker.currentNode;

        // If we hit our target deep end element, stop hunting
        if (currentEl === endEl) {
            break;
        }

        // Check if this element contains the hymn class
        if (currentEl.classList.contains('hymn')) {
            return true; // Found it!
        }
    }

    return false; // Traversed the gap completely without finding a hymn
}

//------------------------------------------------------------------------------End of swap part

function clearPatronSaintIfMatched(stringToFindEn) {
    // 1. Locate the master English span
    const targetSpan = state.serviceWin.document.querySelector("[data-key*='en_US'][data-key$='DA.insert1']");

    // Safety check: if the span doesn't exist on the page, bail out safely
    if (!targetSpan) return;

    // 2. Create a case-insensitive regular expression from your search string
    // The 'i' flag makes it ignore upper vs lower case differences
    const searchRegex = new RegExp(stringToFindEn, 'i');

    // 3. Test the text content against the case-insensitive regex
    if (searchRegex.test(targetSpan.textContent)) {

        // 4. Combine both target endings into a single query pass
        const elementsToClear = state.serviceWin.document.querySelectorAll(
            "[data-key$='cl.localpatronsaint1.dismissal'], [data-key$='cl.localpatronsaint1.supplication']"
        );

        // 5. Clear all matches in one loop
        elementsToClear.forEach(element => {
            element.textContent = '';
        });

        console.log(`Case-insensitive match for "${stringToFindEn}" found in DA.insert1. Cleared ${elementsToClear.length} total patron saint rubrics.`);
    }
}

// Populate the dropdown list from the JSON mapping
function populateEparchyDropdown() {
    const jurisSelect = document.getElementById('jurisdiction-select');
    const eparchySection = document.getElementById('section-eparchy');
    const eparchySelect = document.getElementById('eparchy-select');

    // Safety check: Exit if the elements don't exist in the DOM
    if (!jurisSelect || !eparchySection || !eparchySelect) return;

    const selectedJuris = jurisSelect.value;

    // Clear out any old options cleanly
    eparchySelect.innerHTML = '';

    // Verify a selection exists and has matching options inside eparchyMapping object
    if (selectedJuris && eparchyMapping[selectedJuris]) {
        // Reveal the section framework
        eparchySection.style.display = 'block';

        eparchyMapping[selectedJuris].forEach(item => {
            // Safety guard: ensure item and item.value actually exist 
            if (item && item.value !== undefined && item.value !== 'undefined') {
                const opt = document.createElement('option');
                opt.value = item.value;

                // Best practice: Use textContent instead of innerHTML for simple text options
                opt.textContent = item.text || item.value;

                eparchySelect.appendChild(opt);
            }
        });

        // applyOverrides(); // Uncomment if you need this to execute immediately after build
    } else {
        // Collapse section frame if choice becomes invalid or empty
        eparchySection.style.display = 'none';
    }
}

function populateCelebrantDropdown() {

    // Safety guard clause if elements are missing from the DOM
    if (!celebrantSelect) return;
    const currentEparchyId = eparchySelect ? eparchySelect.value : null;

    // 1. Wipe out existing selections natively (Replaces .empty())
    celebrantSelect.innerHTML = '';

    // 2. Create an in-memory document fragment for high-performance DOM insertion
    const fragment = document.createDocumentFragment();

    // 3. Create and configure the default option node natively
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '-Select Celebrant-';
    fragment.appendChild(defaultOpt);

    // 4. Process Diocese Data loop
    for (const eparchyId in dioceseData) {
        const eparchy = dioceseData[eparchyId];
        const englishTitle = eparchy.keys["client_en_US_goa|cl.bishop1.title"];

        if (englishTitle) {
            const opt = document.createElement('option');
            opt.value = eparchyId;
            opt.textContent = englishTitle;

            if (eparchyId === currentEparchyId) {
                opt.selected = true;
            }
            fragment.appendChild(opt);
        }
    }

    // 5. Process Auxiliary Bishop Data loop
    for (const bishopId in bishopData) {
        const bishop = bishopData[bishopId];
        const englishTitle = bishop.keys["client_en_US_goa|cl.bishop2.title"];

        if (englishTitle) {
            const opt = document.createElement('option');
            opt.value = bishopId;
            opt.textContent = englishTitle;

            if (bishopId === currentEparchyId) {
                opt.selected = true;
            }
            fragment.appendChild(opt);
        }
    }

    // 6. Push all bundled options into the live DOM in one single paint cycle
    celebrantSelect.appendChild(fragment);
}

// 1. Declare the global variable
// let parishList = null;

// async function loadParishData() {
//     try {
//         const response = await fetch('./js/JSON/goa_chicago.json');
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         // 2. Save the JSON data directly to the global variable
//         parishList = await response.json();

//         console.log("parishList is ready:", parishList);
//     } catch (error) {
//         console.error("Failed to load parish data:", error);
//     }
// }

let fullParishList = []; // Your global array

// Each parish's own texts (the "client_..." fields of its entry in the
// Metropolis JSON files), by the parish's unique ID. The Parish list uses that
// ID as each option's value, so the scripts read the chosen parish's texts as
// parishData[parishSelect.value].keys. 'apolytikion' is the parish's
// apolytikionID: the name of the parish's Apolytikion (shared by parishes that
// sing the same one), matched against the meDA.note / peDA.note values.
const parishData = {};

function registerParishTexts(parish) {
    const keys = {};
    Object.keys(parish).forEach(field => {
        if (field.indexOf('|') !== -1) keys[field] = parish[field];
    });
    parishData[parish.ID] = {
        label: parish.label,
        apolytikion: parish.apolytikionID || '',
        keys: keys
    };
}

// True when the service already contains the parish's Apolytikion: the service's
// hidden .sbparishname cells hold the day's meDA.note / peDA.note values, which name
// the Apolytikia in that service (e.g. "holy_cross sophia"). Whole names only, so
// "peter" does not match "peter_paul".
function parishApolytikionInService(parishId, extractedParishNames) {
    const parish = parishData[parishId];
    if (!parish || !parish.apolytikion) return false;
    return (extractedParishNames || '').split(/\s+/).indexOf(parish.apolytikion) !== -1;
}

const fileNames = [
    "goa_newjersey.json",
    "goa_pittsburgh.json",
    "goa_sanfrancisco.json",
    "goa_archdiocese.json",
    "goa_atlanta.json",
    "goa_boston.json",
    "goa_chicago.json",
    "goa_denver.json",
    "goa_detroit.json"
];

async function loadAllJsonFiles() {
    for (const fileName of fileNames) {
        try {
            const response = await fetch(`${typeof SB_JSON_PATH !== 'undefined' ? SB_JSON_PATH : './js/JSON/'}${fileName}`);
            const data = await response.json();

            // Push all items from the loaded array into fullParishList
            fullParishList.push(...data);
            data.forEach(registerParishTexts);
        } catch (error) {
            console.error(`Failed to load ${fileName}:`, error);
        }
    }

    console.log('Finished loading. Total items:', fullParishList.length);
}

const parishListsLoaded = loadAllJsonFiles();


async function populateParishDropdown() {
    // 1. Get the current selected value safely
    // (Handles whether eparchySelect is a DOM element or a direct string variable)
    const selectedEparchyValue = typeof eparchySelect === 'object' && eparchySelect !== null
        ? eparchySelect.value
        : eparchySelect;

    // 2. Clear out old parish options
    parishSelect.innerHTML = '';

    // 3. Add a default placeholder option
    let defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '-- Select a Parish --';
    parishSelect.appendChild(defaultOpt);

    // 4. Filter and populate matching parishes
    if (selectedEparchyValue) {
        fullParishList
            .filter(parish => parish.Eparchy === selectedEparchyValue)
            .forEach(parish => {
                let opt = document.createElement('option');
                opt.value = parish.ID; // unique (several parishes share a patron saint)
                opt.textContent = parish.label; // textContent is safer & faster for dropdown labels

                parishSelect.appendChild(opt);
            });
    }
}

function switchActor(actorKey, altActorEn, altActorGr) { //COMMON
    const enKeyBase = "actors_en_US_goa|";
    const grKeyBase = "actors_gr_GR_cog|";
    const doc = state.serviceWin.document;

    const fullEnKey = `${enKeyBase}${actorKey}`;
    const fullGrKey = `${grKeyBase}${actorKey}`;

    // An actor label has a row of its own: when it is emptied in both languages
    // (e.g. ac.sb.PrBl without a deacon) the row is hidden instead of left blank
    const rowDisplay = (altActorEn || altActorGr) ? 'table-row' : 'none';
    const setRow = el => {
        const parentRow = el.closest('tr');
        if (parentRow) parentRow.style.display = rowDisplay;
    };

    // Update English Elements
    const elementsEn = doc.querySelectorAll(`[data-key="${fullEnKey}"]`);
    elementsEn.forEach(el => {
        el.textContent = altActorEn;
        setRow(el);
    });

    // Update Greek Elements
    const elementsGr = doc.querySelectorAll(`[data-key="${fullGrKey}"]`);
    elementsGr.forEach(el => {
        el.textContent = altActorGr;
        setRow(el);
    });
}

// Optimized Helper: Since we already found the element, just find its row instantly
function showTrDirect(element) {
    if (element) {
        const parentRow = element.closest('tr');
        if (parentRow) {
            parentRow.style.display = 'table-row';
        }
    }
}

////////////////////////////////////////////////////////////////////APPLY BUTTON VISUALS///////////////////////////////////////////
// 1. Define the types of events you want to listen for

// --- STATE & SCOPING VARIABLES ---
let isFormDirty = false;
const targetEvents = ['input', 'click'];
const targetElements = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];

const btnPreview = document.getElementById('btn-view-preview');

// --- 1. GLOBAL STATE TRACKING LISTENERS ---
targetEvents.forEach(eventType => {
    document.addEventListener(eventType, (event) => {
        // Ignore clicks on our primary execution button itself
        if (event.target.id === 'btn-view-preview') return;

        if (targetElements.includes(event.target.tagName)) {
            isFormDirty = true;
            updateButtonUIState();
        }
    });
});

// --- 2. THE DYNAMIC BUTTON TEXT CONTROLLER ---
function updateButtonUIState() {
    if (!btnPreview) return;

    // Grab the live radio selection state right now
    const selectedLanguage = document.querySelector('input[name="serviceLanguage"]:checked')?.value || "bilingual";
    const isWindowOpen = state.serviceWin && !state.serviceWin.closed;

    // Condition 1: Window is completely shut OR the user chose a language that doesn't match the active window
    if (!isWindowOpen || state.activeWindowLang !== selectedLanguage) {
        btnPreview.textContent = "Preview the service";
        btnPreview.disabled = false;
    }
    // Condition 2: Window is open, languages match perfectly, but changes were made on the panel
    else if (isWindowOpen && isFormDirty) {
        btnPreview.textContent = "Show updates to service";
        btnPreview.disabled = false;
    }
    // Condition 3: Window is open, languages match, and everything is synchronized
    else {
        btnPreview.textContent = "Changes Applied";
        btnPreview.disabled = true;
    }
}

function openServiceWinFromDCS() {
    // 1. Get the raw query string from window.location.search
    const queryString = window.location.search;
    // 2. Parse it with URLSearchParams
    const urlParams = new URLSearchParams(queryString);

    // 3. Extract individual parameters using .get()
    state.openServiceFromDCS = urlParams.get('fromDCS');
    const tempDate = urlParams.get('dateFromDCS');
    const tempLang = urlParams.get('langFromDCS');
    

    if (state.openServiceFromDCS) {
        state.serviceCode = urlParams.get('serviceCodeFromDCS');
        const dateObj = new Date(tempDate);
        const formattedDate = dateObj.toLocaleDateString('en-CA');

        //set the date and language in the panel
        document.getElementById('service-date-picker').value = formattedDate;
        // Find the radio input with matching value and set checked to true
        const targetRadio = document.querySelector(`input[name="serviceLanguage"][value="${tempLang}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
        }

        const hierachicalButton = document.getElementById('hiButtonContainer');
        if (hierachicalButton) {
            // find service name between '-' and '.html'
            const match = window.location.href.match(/-([^.-]+)\.html/);
            const result = match ? match[1] : null;

            hierachicalButton.innerHTML = hierachicalButtonHTML;
            const switchButton = document.getElementById('switchToHiLit');
            switchButton.addEventListener('click', () => {
                state.serviceWin.close();
                window.location.replace(`https://dcs.goarch.org/sbDev/sb-h${result}.html${window.location.search}`, '_blank');
            });
        }

        console.log("Launched from DCS");

        handlePreviewOrUpdate();
    }
}


// Cleanly hand off the click event to your new named function
btnPreview?.addEventListener('click', handlePreviewOrUpdate);
// --- 3. THE UNIFIED CLICK ACTION ---

async function handlePreviewOrUpdate() {
    // 1. Grab live panel selections
    const selectedLanguage = document.querySelector('input[name="serviceLanguage"]:checked')?.value || "bilingual";
    const selectedDate = document.getElementById('service-date-picker')?.value;

    const isWindowOpen = state.serviceWin && !state.serviceWin.closed;

    if (!isWindowOpen) {
        // ACTION A: No window open at all. Launch fresh.
        if (btnPreview) {
            btnPreview.disabled = true;
            btnPreview.textContent = "Launching Preview...";
        }

        await launchService(selectedLanguage);

        isFormDirty = false;
        updateButtonUIState();
    } else {
        // 🔥 ACTION B: Window IS open. Re-launch if EITHER the language OR the date has changed!
        const hasLanguageChanged = state.activeWindowLang !== selectedLanguage;
        const hasDateChanged = state.serviceDatePicker !== selectedDate;

        if (hasLanguageChanged || hasDateChanged) {
            if (btnPreview) {
                btnPreview.disabled = true;
                btnPreview.textContent = "Switching Service...";
            }

            state.serviceWin.close();
            state.serviceWin = null;

            // Re-launch fresh window with the new choices
            await launchService(selectedLanguage);

            isFormDirty = false;
            updateButtonUIState();
        } else {
            // ACTION C: Window is open, date and language match perfectly. Push edits live.
            if (btnPreview) {
                btnPreview.disabled = true;
                btnPreview.textContent = "Applying updates...";
            }

            applyChanges();

            isFormDirty = false;
            updateButtonUIState();

            showToast("Changes applied to service!");
        }
    }
}

// --- AUTOMATIC LANGUAGE SWITCH LISTENER ---

// Target the flex container holding your language radio buttons
const languageRadioGroup = document.querySelector('.launch-btn-group');

if (languageRadioGroup) {
    languageRadioGroup.addEventListener('change', (event) => {
        // Ensure the change event specifically came from our language radios
        if (event.target.name === 'serviceLanguage') {

            // Check if a secondary preview window is currently open right now
            const isWindowOpen = state.serviceWin && !state.serviceWin.closed;

            if (isWindowOpen) {
                console.log("Language changed while window was open. Auto-switching...");

                // Trigger your named function to automatically handle the teardown and reload
                handlePreviewOrUpdate();
            } else {
                // If the window is closed, just update the button's text/state normally
                updateButtonUIState();
            }
        }
    });
}

// --- AUTOMATIC DATE SWITCH LISTENER ---

const datePicker = document.getElementById('service-date-picker');

if (datePicker) {
    datePicker.addEventListener('change', () => {
        // Check if a secondary preview window is currently open right now
        const isWindowOpen = state.serviceWin && !state.serviceWin.closed;

        if (isWindowOpen) {
            console.log("Date changed while window was open. Auto-switching date path...");

            // Trigger the handler to teardown and reload the window with the new date
            handlePreviewOrUpdate();
        } else {
            console.log("Date changed while window was closed. Updating UI text only.");
            updateButtonUIState();
        }
    });
}

// --- 4. TOAST FACTORY ENGINE ---
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    toastContainer.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => { toast.classList.add('show'); }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); }, 400);
    }, 2500);
}


/* ============================================================
   5. EXPORT UTILITIES
   ============================================================ */

async function exportToWord() {
    await handlePreviewOrUpdate();
    performUnifiedExport('word');
}

/**
 * Entry point for PDF Export
 */
async function exportToPDF() {
    await handlePreviewOrUpdate();
    performUnifiedExport('pdf');
}

/* ============================================================
   performUnifiedExport, generatePDFFile and generateWordFile live in
   js/lib/alwb.js (one copy for the DCS site). In a buildMode panel,
   js/sb/sb-embed.js provides performUnifiedExport(format), which calls
   the alwb.js one for the service page.
   ============================================================ */


function displayTr(locatorType, valueToFind, displayType) {
    // Standardize 'block' to 'table-row' for valid structural <tr> layouts
    displayType = displayType === "block" ? "table-row" : displayType;

    let elements = [];

    // 1. Find all target elements depending on the locator type
    if (locatorType === 'data-key') {
        // Safe escaping just in case your keys contain special characters like periods or pipes
        const escapedValue = CSS.escape(valueToFind);
        elements = state.serviceWin.document.querySelectorAll(`[data-key="${escapedValue}"]`);

    } else if (locatorType === 'class') {
        const escapedClass = CSS.escape(valueToFind);
        elements = state.serviceWin.document.querySelectorAll(`.${escapedClass}`);
    }

    // 2. Loop through all found elements, find their closest <tr> parent, and update the display
    elements.forEach(element => {
        const parentRow = element.closest('tr');
        if (parentRow) {
            parentRow.style.display = displayType;
        }
    });
}

function displayClass(className, displayType) {
    // 1. Find all elements matching the class name
    // (CSS.escape handles any spaces or special characters in the class safely)
    const escapedClass = CSS.escape(className);
    const elements = state.serviceWin.document.querySelectorAll(`.${escapedClass}`);

    // 2. Loop through all found elements and change their display directly
    elements.forEach(element => {
        element.style.display = displayType;
    });
}


const liturgyOptionsHTML = `
            <details>
                <summary>Liturgy Content Options</summary>
                <div id="section-li-liturgy-options" class="sb-control-group">
                    <div class="toggle-group" style="display: block;">
                        <!-- Antiphons: shown only when the day has a "li3" service (showAntiphonOptionsForDay) -->
                        <!-- Each row: two equal halves (flex: 1 1 0), so the second choices line up -->
                        <div id="antiphonOptions" style="display: none; margin-bottom: 8px;">
                            <div class="li-options-col" style="margin-bottom: 8px;" title="Antiphon 1 or Psalm 102 (Typika).">
                                <label class="li-option-label" style="flex: 1 1 0;"><input type="radio" name="li_opt_antiphon1" id="li_opt_antiphon1_antiphon" value="antiphon" checked> Antiphon 1</label>
                                <label class="li-option-label" style="flex: 1 1 0;"><input type="radio" name="li_opt_antiphon1" id="li_opt_antiphon1_typika" value="typika"> Psalm 102</label>
                            </div>
                            <div class="li-options-col" style="margin-bottom: 8px;" title="Antiphon 2 or Psalm 145 (Typika).">
                                <label class="li-option-label" style="flex: 1 1 0;"><input type="radio" name="li_opt_antiphon2" id="li_opt_antiphon2_antiphon" value="antiphon" checked> Antiphon 2</label>
                                <label class="li-option-label" style="flex: 1 1 0;"><input type="radio" name="li_opt_antiphon2" id="li_opt_antiphon2_typika" value="typika"> Psalm 145</label>
                            </div>
                            <div class="li-options-col" style="margin-bottom: 8px;" title="Antiphon 3 or the Beatitudes.">
                                <label class="li-option-label" style="flex: 1 1 0;"><input type="radio" name="li_opt_antiphon3" id="li_opt_antiphon3_antiphon" value="antiphon" checked> Antiphon 3</label>
                                <label class="li-option-label" style="flex: 1 1 0;"><input type="radio" name="li_opt_antiphon3" id="li_opt_antiphon3_beatitudes" value="beatitudes"> Beatitudes</label>
                            </div>
                        </div>
                        <div id="postGospel" class="li-options-col" style="margin-bottom: 8px; display: none;"
                            title="Inserts the litanies after the Gospel.">
                            <input type="checkbox" id="li_opt_litanies">
                            <label for="li_opt_litanies" class="li-option-label">Litanies after Gospel</label>
                        </div>
                        <div id="extenedCompLitany" class="li-options-col" style="margin-bottom: 8px; display: none;"
                            title="Inserts additional petitions.">
                            <input type="checkbox" id="li_opt_extendedlitany">
                            <label for="li_opt_extendedlitany" class="li-option-label">Extended Completion
                                Litany</label>
                        </div>
                        <!-- Offered unless the chosen Metropolis turns it off (setLiturgyOptionsByEparchy);
                             ticked or not to match the service when the panel opens (sb-embed.js) -->
                        <div id="precommunionPrayers" class="li-options-col" style="margin-bottom: 8px;"
                            title="Inserts the Prayers before Communion.">
                            <input type="checkbox" id="li_opt_precommunionprayers">
                            <label for="li_opt_precommunionprayers" class="li-option-label">Pre-Communion
                                Prayers</label>
                        </div>

                        <!-- Main Memorial Option -->
                        <div class="li-options-col" style="margin-bottom: 8px;" title="Inserts the Memorial Service.">
                            <input type="checkbox" id="li_opt_memorial">
                            <label for="li_opt_memorial" class="li-option-label">Memorial Service (if allowed)</label>
                        </div>

                        <!-- Sub Option 1 -->
                        <div
                            style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; margin-left: 48px;">
                            <input type="checkbox" id="li_opt_memorial_apolytikion"
                                style="transform: scale(1.15); cursor: pointer;">
                            <label for="li_opt_memorial_apolytikion" class="li-option-label">Memorial
                                Apolytikion (after Small Entrance)</label>
                        </div>

                        <!-- Sub Option 2 -->
                        <div
                            style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; margin-left: 48px;">
                            <input type="checkbox" id="li_opt_memorial_evlogetaria"
                                style="transform: scale(1.15); cursor: pointer;">
                            <label for="li_opt_memorial_evlogetaria" class="li-option-label">Memorial Service -
                                Evlogetaria, Kontakion</label>
                        </div>

                        <!-- Sub Option 3 -->
                        <div
                            style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; margin-left: 48px;">
                            <input type="checkbox" id="li_opt_memorial_trisagion"
                                style="transform: scale(1.15); cursor: pointer;">
                            <label for="li_opt_memorial_trisagion" class="li-option-label">Trisagion Service</label>
                        </div>

                        <div class="li-options-col" style="margin-bottom: 8px;" title="Inserts the Blessing of Loaves.">
                            <input type="checkbox" id="li_opt_blessing_of_loaves">
                            <label for="li_opt_blessing_of_loaves" class="li-option-label">Blessing of Loaves</label>
                        </div>
                    </div>
                </div>
            </details>`;

const litOpts = document.getElementById('liturgyOptions')
if (litOpts) {
    litOpts.innerHTML = liturgyOptionsHTML;
}

/**
 * Antiphons 1-3 (Liturgy and Hierarchical Liturgy panels). Offered only when the
 * day has a "li3" service (Typika and Beatitudes). Each can stay the Antiphon or be
 * replaced: Antiphon 1 by Typika 1 and Antiphon 2 by Typika 2 (source 'lit'),
 * Antiphon 3 by the Beatitudes (that day's li3). Going back to an Antiphon takes it
 * from that day's li2. The panel needs datedSources ['li2', 'li3'].
 */
function dayHasTypikaService() {
    const li3 = state.fetchedHTMLContentLi3 || '';
    return li3 !== '' && li3.indexOf('Error loading target template asset') === -1;
}

// Called when the panel opens (SB_PANEL.onOpen)
function showAntiphonOptionsForDay() {
    const options = document.getElementById('antiphonOptions');
    if (options) options.style.display = dayHasTypikaService() ? '' : 'none';
}

// What each Antiphon place shows now: the published service has the Antiphons
const antiphonsShown = { 1: 'antiphon', 2: 'antiphon', 3: 'antiphon' };

/**
 * Matins panels (ma, hma), when they open: em (Matins in the evening, Holy Week)
 * has its litanies built in, so there is no "End Litanies and Dismissal" option.
 */
function matinsAdjustOptionsForService() {
    if (state.serviceCode !== 'em') return;
    const endLitanies = document.getElementById('ma_opt_dismissal');
    const option = endLitanies && endLitanies.closest('.li-options-col');
    if (option) option.style.display = 'none';
}

/**
 * Runs the swap-map entry 'key' only if the service has its target place
 * (begin marker), so services without that part are left alone silently.
 */
function swapKeyIfInService(key) {
    const entry = swapMapping[key];
    const doc = state.serviceWin && state.serviceWin.document;
    if (!entry || !doc || !doc.querySelector(`.${entry.targetBegin}`)) return;
    executeContentSwap(entry);
}

/*
 * Celebrant Hierarch (shared). Used by the Hierarchical Vesperal Liturgy panel;
 * based on the Hierarchical Liturgy's functions, with every swap run only where
 * the service has a place for it. The older hierarchical scripts (hliturgy,
 * hvespers, hmatins, consecrationliturgy) still have their own copies
 * (setDefaultCelebrant, handleCelebrantChange, applyGuestCelebrant,
 * updateActorHierarch): candidates to switch to these later.
 * Needs the panel's eparchySelect / celebrantSelect elements and state.celebrantSelect.
 */

// A new Metropolis: its own hierarch becomes the celebrant
function hierarchicalDefaultCelebrant() {
    if (eparchySelect && eparchySelect.value && celebrantSelect) {
        celebrantSelect.value = eparchySelect.value;
    }
}

// The Metropolis' names in all its data keys
function hierarchicalApplyMetropolisKeys() {
    if (!state.eparchySelect || !dioceseData[state.eparchySelect]) return;
    Object.entries(dioceseData[state.eparchySelect].keys).forEach(([key, textValue]) => {
        state.serviceWin.document.querySelectorAll(`[data-key='${CSS.escape(key)}']`).forEach(el => {
            el.textContent = textValue;
        });
    });
}

// Commemorations, diptychs, fimi, names and actor labels for the chosen celebrant
function hierarchicalCelebrantChange() {
    const localEparchyId = eparchySelect.value;
    const celebrantId = celebrantSelect.value;
    if (!celebrantId) return;

    if (celebrantId === localEparchyId) {
        // The Metropolis' own hierarch
        try {
            swapKeyIfInService('hi_commemoration_supplication');
            swapKeyIfInService('hi_commemoration_great_litany');
            swapKeyIfInService('diptychs_archbishop_or_metropolitan');
            if (dioceseData[localEparchyId]) dioceseData[localEparchyId].fimis();
            hierarchicalApplyMetropolisKeys();
        } catch (error) {
            console.error("Error executing local swaps:", error);
        }
    } else {
        hierarchicalGuestCelebrant(celebrantId);
    }
    hierarchicalActorLabels();
}

// A visiting Metropolitan (away fimi) or an auxiliary bishop
function hierarchicalGuestCelebrant(guestId) {
    const doc = state.serviceWin.document;
    const setKeys = keys => Object.keys(keys).forEach(key => {
        if (keys[key] !== "") {
            doc.querySelectorAll(`[data-key*="${key}"]`).forEach(el => { el.textContent = keys[key]; });
        }
    });

    const guestData = dioceseData[guestId];
    try {
        if (!guestData || !guestData.keys) {
            // Auxiliary bishop
            const guestBishop = bishopData[guestId];
            if (!guestBishop || !guestBishop.keys) return;
            guestBishop.fimis();
            swapKeyIfInService('hi_commemoration_supplication_and_bishop');
            swapKeyIfInService('hi_commemoration_great_litany_and_bishop');
            swapKeyIfInService('diptychs_bishop');
            hierarchicalApplyMetropolisKeys();
            setKeys({ ...guestBishop.keys });
        } else {
            // Visiting Metropolitan: his away fimi replaces the fimi
            guestData.fimis();
            swapKeyIfInService('hi_commemoration_supplication');
            swapKeyIfInService('hi_commemoration_great_litany');
            swapKeyIfInService('diptychs_archbishop_or_metropolitan');
            const overrideKeys = { ...guestData.keys };
            ['gr', 'en'].forEach(lang => {
                const awayFimiKey = `client_${lang}_US_goa|cl.bishop1.away_fimi.text`;
                if (overrideKeys[awayFimiKey]) overrideKeys[`client_${lang}_US_goa|cl.bishop1.fimi.text`] = overrideKeys[awayFimiKey];
            });
            setKeys(overrideKeys);
        }
    } catch (error) {
        console.error(error);
    }
}

// Actor labels and rubrics for the celebrant's rank (Archbishop, Metropolitan, Bishop)
function hierarchicalActorLabels() {
    const celebrantId = state.celebrantSelect;
    const rank = dioceseData[celebrantId] ? dioceseData[celebrantId].rank : (bishopData[celebrantId] || {}).rank;
    if (!rank) return;
    ['ac.sb.PrHi', 'ac.sb.ChHi', 'ac.sb.ClHi', 'ac.sb.ReHi', 'ac.Hierarch'].forEach(key => {
        switchActor(key, actorMapping[key][rank + '_alten'], actorMapping[key][rank + '_altgr']);
    });
    const ranksForRubric = episcopalRankConversions.episcopalRanks[rank];
    state.serviceWin.document.querySelectorAll("[data-key$='.rubric']").forEach(element => {
        Object.entries(ranksForRubric).forEach(([oldRank, newRank]) => {
            if (element.textContent.includes(oldRank)) element.textContent = element.textContent.replaceAll(oldRank, newRank);
        });
    });
}

// Called by applyChanges: swaps only the places whose choice changed
function handleAntiphonOptions() {
    const options = document.getElementById('antiphonOptions');
    if (!options || options.style.display === 'none') return;

    const swaps = {
        1: { antiphon: swapAntiphon1, typika: swapTypika1 },
        2: { antiphon: swapAntiphon2, typika: swapTypika2 },
        3: { antiphon: swapAntiphon3, beatitudes: swapBeatitudes }
    };
    [1, 2, 3].forEach(n => {
        const chosen = document.querySelector(`input[name="li_opt_antiphon${n}"]:checked`);
        if (!chosen || chosen.value === antiphonsShown[n]) return;
        swaps[n][chosen.value]();
        antiphonsShown[n] = chosen.value;
    });
}

const hierachicalButtonHTML = `<div class="sb-section">
    <button type="button" class="sb-btn-toggle" id="switchToHiLit" style="background-color: #b30000; color: white; padding: 14px 20px;">
        Switch to Hierarchical
    </button>
</div>`;



