const state = {
    // 1. Service Window Tracking
    serviceWin: null,

    currentLang: 'gr-en',
    activeWindowLang: 'gr-en',

    // 2. Service Launch & Configuration
    serviceDatePicker: "",
    jurisdictionSelect: "goa", // Matches the default <option value="goa"> in HTML
    eparchySelect: "",
    celebrantSelect: "",

    extractedParishNames: "",

    // 3. Celebrant Options
    liOptDeacon: true, // Matches 'checked' attribute in HTML

    // 5. Parish Details 
    parishSelect: "",

    // Dismissal Overrides
    clientGrUsGoaLocalpatronsaint1Dismissal: "",
    clientEnUsGoaLocalpatronsaint1Dismissal: "",
    clientGrUsGoaLocalpatronsaint1Supplication: "",
    clientEnUsGoaLocalpatronsaint1Supplication: "",

    clientEnUsGoaClConsecrationName: "",
    clientGrUsGoaClConsecrationName: "",
    clientEnUsGoaClConsecrationPrayer1: "",
    clientGrUsGoaClConsecrationPrayer1: "",

    // 6. Liturgy Content Toggles
    liOptLitanies: false,
    liOptExtendedlitany: false,
    liOptPrecommunionprayers: false,
    liOptMemorial: false,
    liOptBlessingOfLoaves: false,

    // 7. Global Document Source Representation Cache
    fetchedHTMLContentLit: "",
    fetchedHTMLContentOrd: "",
    fetchedHTMLContentCli: "",
    fetchedHTMLContentLi: "",

    epistleSelect: "",
    gospelSelect: "",
    communionHymnSelect: "",

    fullRelicList: [],

    dismissalDataKeysToUpdate: [
        'client_gr_US_goa|cl.localpatronsaint1.dismissal',
        'client_en_US_goa|cl.localpatronsaint1.dismissal'
    ]
};

const dataKeysToUpdate = [...state.dismissalDataKeysToUpdate];

// Cache Control UI Elements
// ==========================================
// 1. SERVICE LAUNCH & CONFIGURATION
// ==========================================
const serviceDatePicker = document.getElementById('service-date-picker');
const launchServiceGrEn = document.getElementById('launchServiceGrEn');
const launchServiceGr = document.getElementById('launchServiceGr');
const launchServiceEn = document.getElementById('launchServiceEn');


const jurisdictionSelect = document.getElementById('jurisdiction-select');
const eparchySelect = document.getElementById('eparchy-select');
const celebrantSelect = document.getElementById('celebrant-select');

// ==========================================
// 2. CELEBRANT OPTIONS
// ==========================================
const liOptDeacon = document.getElementById('li_opt_deacon');

// ==========================================
// 4. PARISH DETAILS 
// ==========================================
const parishSelect = document.getElementById('parish-select');


// ==========================================
// 5. LITURGY CONTENT TOGGLES
// ==========================================
const liOptLitanies = document.getElementById('li_opt_litanies');
const liOptExtendedlitany = document.getElementById('li_opt_extendedlitany');
const liOptPrecommunionprayers = document.getElementById('li_opt_precommunionprayers');
const liOptMemorial = document.getElementById('li_opt_memorial');
const liOptBlessingOfLoaves = document.getElementById('li_opt_blessing_of_loaves');

const postGospel = document.getElementById("postGospel");
const extenedCompLitany = document.getElementById("extenedCompLitany");
const precommunionPrayers = document.getElementById("precommunionPrayers");

// ==========================================
// 6. ACTION EXECUTION & EXPORT BUTTONS
// ==========================================
const btnApplyAll = document.getElementById('btn-apply-all');
const btnExportWord = document.getElementById('btn-export-word');
const btnExportPdf = document.getElementById('btn-export-pdf');
const toastContainer = document.getElementById('toast-container');

const epistleSelect = document.getElementById('epistle-select');
const gospelSelect = document.getElementById('gospel-select');
const communionHymnSelect = document.getElementById('communion-hymn-select');


const sub1 = document.getElementById('li_opt_memorial_apolytikion');
const sub2 = document.getElementById('li_opt_memorial_evlogetaria');
const sub3 = document.getElementById('li_opt_memorial_trisagion');

const subOptions = [sub1, sub2, sub3];


function applyChanges() {
    state.eparchySelect = eparchySelect.value;
    state.celebrantSelect = celebrantSelect.value;
    state.liOptLitanies = liOptLitanies.checked;

    state.liOptExtendedlitany = liOptExtendedlitany.checked;
    state.liOptPrecommunionprayers = liOptPrecommunionprayers.checked;
    state.liOptMemorial = liOptMemorial.checked;
    state.sub1 = sub1.checked;
    state.sub2 = sub2.checked;
    state.sub3 = sub3.checked;
    state.liOptBlessingOfLoaves = liOptBlessingOfLoaves.checked;
    state.liOptDeacon = liOptDeacon.checked;

    if (state.parishSelect) {
        state.clientEnUsGoaClConsecrationName = parishData[parishSelect.value].keys["client_en_US_goa|cl.consecration.name"];
        state.clientGrUsGoaClConsecrationName = parishData[parishSelect.value].keys["client_gr_US_goa|cl.consecration.name"];
        state.clientEnUsGoaClConsecrationPrayer1 = parishData[parishSelect.value].keys["client_en_US_goa|cl.consecration.prayer1"];
        state.clientGrUsGoaClConsecrationPrayer1 = parishData[parishSelect.value].keys["client_gr_US_goa|cl.consecration.prayer1"];
    }

    state.epistleSelect = epistleSelect.value;
    state.gospelSelect = gospelSelect.value;
    state.communionHymnSelect = communionHymnSelect.value;

    // Commit snapshot to service layout canvas
    updateServiceWindow();
}


/**
 * Core Orchestrator: Direct DOM Manipulation Engine
 */
async function updateServiceWindow() {
    const serviceWinChild = state.serviceWin;

    // Safety Gate: Ensure serviceWinChild window context is alive
    if (!serviceWinChild || serviceWinChild.closed) {
        alert("The service window is not open. Please launch it first.");
        return;
    }

    // Step 1: Run asynchronous template gathering
    try {
        const serviceWinDoc = serviceWinChild.document; //don't change

        //example for when the service has elements by data-key to replace
        const singleKey = 'stuff|more_stuf_id';
        // 1. querySelectorAll finds EVERY instance and returns a list
        const targetElements = serviceWinDoc.querySelectorAll(`[data-key='${CSS.escape(singleKey)}']`);
        // 2. Loop through the list and update each element natively
        targetElements.forEach(targetElement => {
            targetElement.textContent = "val"; //"val" would be a variable most likely
        });

        if (state.liOptLitanies) {
            swapPostGospelLitaniesChrysOn();
            swapPostGospelLitaniesBasilOn();
        } else {
            swapPostGospelLitaniesChrysOff();
            swapPostGospelLitaniesBasilOff();
        }

        if (state.liOptExtendedlitany) {
            swapExtendedCompLitanyOn();
        } else {
            swapExtendedCompLitanyOff();
        }

        if (state.liOptPrecommunionprayers) {
            swapPrecommunionPrayersOn();
        } else {
            swapPrecommunionPrayersOff();
        }

        //Memorial sub options
        if (state.sub1) {
            swapMemorialHymnYes();
        } else {
            swapMemorialHymnNo();
        }
        //Memorial sub options
        if (state.sub2) {
            swapTrisagionServiceOff();
            swapMemorialServiceOn();
        } else {
            //Memorial sub options
            if (state.sub3) {
                swapMemorialServiceOff();
                swapTrisagionServiceOn();
            } else {
                swapMemorialServiceOff();
                swapTrisagionServiceOff();
            }
        }

        if (state.liOptBlessingOfLoaves) {
            swapBlessingOfLoavesOn();
        } else {
            swapBlessingOfLoavesOff();
        }
        ///////////////////////////////////////////////////////////////
        if (state.epistleSelect === 'feast') {
            swapConsecrationEpistleFeast();
        } else {
            swapConsecrationEpistleDefault();
        }

        if (state.gospelSelect === 'feast') {
            swapConsecrationGospelFeast();
        } else {
            swapConsecrationGospelDefault();
        }

        if (state.communionHymnSelect === 'feast') {
            swapConsecrationCommunionHymnFeast();
        } else {
            swapConsecrationCommunionHymnDefault();
        }

        console.log("state.clientEnUsGoaClConsecrationName" + state.clientEnUsGoaClConsecrationName)

        // 1. Refactored helper function using querySelectorAll
        const updateIfExists = (key, textValue) => {
            const elements = serviceWinDoc.querySelectorAll(`[data-key='${CSS.escape(key)}']`);

            elements.forEach(element => {
                element.textContent = textValue;
                element.style.color = 'black';
                console.log("found key");
            });
        };

        if (state.parishSelect) {
            updateIfExists("client_en_US_goa|cl.consecration.name", state.clientEnUsGoaClConsecrationName);
            updateIfExists("client_gr_US_goa|cl.consecration.name", state.clientGrUsGoaClConsecrationName);
            updateIfExists("client_en_US_goa|cl.consecration.prayer1", state.clientEnUsGoaClConsecrationPrayer1);
            updateIfExists("client_gr_US_goa|cl.consecration.prayer1", state.clientGrUsGoaClConsecrationPrayer1);

            updateIfExists("client_gr_US_goa|cl.localpatronsaint1.dismissal", state.clientGrUsGoaLocalpatronsaint1Dismissal);
            updateIfExists("client_en_US_goa|cl.localpatronsaint1.dismissal", state.clientEnUsGoaLocalpatronsaint1Dismissal);
            updateIfExists("client_gr_US_goa|cl.localpatronsaint1.supplication", state.clientGrUsGoaLocalpatronsaint1Supplication);
            updateIfExists("client_en_US_goa|cl.localpatronsaint1.supplication", state.clientEnUsGoaLocalpatronsaint1Supplication);
        }
        const longerStringEn = state.clientEnUsGoaLocalpatronsaint1Dismissal.length >= state.clientEnUsGoaLocalpatronsaint1Supplication.length ? state.clientEnUsGoaLocalpatronsaint1Dismissal : state.clientEnUsGoaLocalpatronsaint1Supplication;
        //if there is a non blank
        if (longerStringEn !== "") {
            clearPatronSaintIfMatched(longerStringEn);
        }

        updateRelicsInService();

        switchActor('ac.sb.PrCl', actorMapping['ac.sb.PrCl'].alten, actorMapping['ac.sb.PrCl'].altgr);
        handleCelebrantChange();
        handleConsecrationDeaconCheckbox();

    } catch (error) {
        console.error("Failed to safely update serviceWinChild window DOM:", error);
    }
}

/**
 * Event Listeners
 */
//on launch
// 1. Create the reusable worker function
function launchService(lang) {
    return new Promise((resolve) => {
        state.serviceDatePicker = serviceDatePicker.value;

        if (!state.serviceDatePicker) {
            alert("Please select a date.");
            return;
        }

        if (state.serviceWin && !state.serviceWin.closed) {
            state.serviceWin.focus();
            return;
        }

        // Update the state language dynamically based on what was passed
        state.currentLang = lang;
        state.activeWindowLang = lang;

        const [year, month, day] = state.serviceDatePicker.split('-');
        const baseUrl = `https://dcs.goarch.org/goa/dcs/h/s/`;
        const targetUrl = `${baseUrl}${year}/${month}/${day}/li/${state.currentLang}/index.html`;

        const pLeft = window.screenX || window.screenLeft;
        const pTop = window.screenY || window.screenTop;
        const serviceWidth = 650;
        const pHeight = window.outerHeight;

        const features = `height=${pHeight},width=${serviceWidth},top=${pTop},left=${pLeft + 500},resizable=yes,scrollbars=yes`;

        state.serviceWin = window.open(targetUrl, '_blank', features); //'DCS_Service_Display' changed to _blank due to timing issues on launch 

        state.serviceWin.addEventListener('load', async () => {
            // Now these will pause execution safely and sequentially as intended!
            await fetchSourceHTML('lit');
            await fetchSourceHTML('cli');
            await fetchDatedSourceHTML('li');

            //For Apolytikion
            // 1. Match any data-key starting with either the English or Greek parish prefix
            const parishElements = state.serviceWin.document.querySelectorAll('.sbparishname');

            // Initialize your variable with a safe fallback blank string
            state.extractedParishNames = "";

            if (parishElements.length > 0) {
                // 2. Map through elements to grab their text, then join them with a single space
                state.extractedParishNames = Array.from(parishElements)
                    .map(el => el.textContent.trim()) // .trim() cleans up loose whitespace padding
                    .join(' ');                       // Merges them all into a single space-separated string
            }

            convertToConsecrationService();

            applyChanges();
            resolve();
        }, { once: true });
    });
}

/**
 * Turns the (published) Divine Liturgy in the service window into the
 * Consecration Liturgy (always hierarchical). Needs the 'lit' and 'cli' source
 * texts. Used after launchService() opens its window, and by the DCS buildMode
 * panel (sb-panel-consecrationliturgy.html) when it opens.
 */
function convertToConsecrationService() {
    swapExtendedCompLitanyOff();
    swapMemorialServiceOff();
    swapPrecommunionPrayersOff();
    swapHierarchicalDismissal();
    swapHiCommemorationGreatLitany();
    swapKissOfPeaceClHi();
    swapHierarchicalPostCherubicRubric();
    swapTrisagionHolygodHierarchical();
    swapTrisagionBaptizedHierarchical();
    swapTrisagionCrossHierarchical();
    //for consecration
    swapConsecrationTitle();
    swapConsecrationEnarxis();
    swapConsecrationPart1();
    swapConsecrationCherubic();
    swapGreatEntranceHierarchical();

    // 1. Target the elements across the service window document natively
    const refrains = state.serviceWin.document.querySelectorAll('.sblieisodikonrefrain');
    // 2. Loop through and change the style display property on each element
    refrains.forEach(refrain => {
        refrain.style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateEparchyDropdown();
    populateCelebrantDropdown();
    loadRelics();
});

parishSelect.addEventListener('change', () => {
    state.parishSelect = parishSelect.value;
});


eparchySelect.addEventListener('change', () => {
    setDefaultCelebrant();
    populateParishDropdown();
    setLiturgyOptionsByEparchy();
});

// 1. When MAIN option is changed:
liOptMemorial.addEventListener('change', () => {
    const isChecked = liOptMemorial.checked;
    // Check/uncheck all sub-options to match main option
    subOptions.forEach(sub => sub.checked = isChecked);
});

// 2. When ANY SUB option is changed:
subOptions.forEach(sub => {
    sub.addEventListener('change', () => {
        // Rule: If sub-option 2 is checked, sub-option 3 MUST become checked
        if (sub2.checked) {
            sub3.checked = true;
        }

        // Check if AT LEAST ONE sub-option is checked
        const hasAnyChecked = subOptions.some(item => item.checked);

        // Rule: If any sub option is checked, main option becomes checked.
        // Rule: If all sub options are unchecked, main option becomes unchecked.
        liOptMemorial.checked = hasAnyChecked;
    });
});

// clearPatronSaintIfMatched() is in common-utilities.js (one shared copy; the
// copy that was here replaced it and failed with "stringToFind is not defined").


// 1. Load, sort, and render relics from JSON
async function loadRelics() {
    try {
        // SB_JSON_PATH is set in the DCS site (js/sb/sb-embed.js); the standalone app uses ./js/JSON/
        const response = await fetch(`${typeof SB_JSON_PATH !== 'undefined' ? SB_JSON_PATH : './js/JSON/'}relic_saints.json`);
        const data = await response.json();

        // Push all items into fullRelicList
        state.fullRelicList.push(...data);

        // Sort by rank numerically (rank 1 first)
        state.fullRelicList.sort((a, b) => parseInt(a.rank, 10) - parseInt(b.rank, 10));

        // Generate HTML string matching your structure
        const htmlContent = state.fullRelicList.map(item => `
            <div class="li-options-col" style="margin-bottom: 8px;" title="${item.name_english}">
                <input type="checkbox" id="li_opt_relic_${item.ID}" data-id="${item.ID}">
                <label for="li_opt_relic_${item.ID}" class="li-option-label">${item.label}</label>
            </div>
        `).join('');

        // Inject into the relicList container
        const container = document.getElementById('relicList');
        if (container) {
            container.innerHTML = htmlContent;
            // Attach event listener to handle input field updates dynamically
            attachRelicSelectionListener();
        }

    } catch (error) {
        console.error(`Failed to load relic_saints.json:`, error);
    }

    console.log('Finished loading relics');
}

// 2. Attach event delegation listener to the relic container
function attachRelicSelectionListener() {
    const container = document.getElementById('relicList');
    if (!container) return;

    // Use event delegation on the container
    container.addEventListener('change', (e) => {
        if (!e.target.matches('input[type="checkbox"]')) return;

        updateRelicTextInputs();
    });
}

// 3. Format arrays of names into natural language strings with conjunctions
// Updated helper function to format joined lists with commas and conjunctions
// 1. Helper function that keeps ALL original string formatting and commas intact
function formatJoinedListKeepAllCommas(items, conjunction) {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];

    // 2 or more items: "Item 1, Item 2, and Item 3,"
    const allButLast = items.slice(0, -1).join(' ');
    const last = items[items.length - 1];
    return `${allButLast} ${conjunction} ${last}`;
}

// 2. Main function to update text inputs
function updateRelicTextInputs() {
    const grInput = document.getElementById('consecration-relics-names-gr-gen');
    const enInput = document.getElementById('consecration-relics-names-en');
    
    if (!grInput || !enInput) return;

    // Get all checked boxes inside relicList
    const checkedBoxes = Array.from(
        document.querySelectorAll('#relicList input[type="checkbox"]:checked')
    );

    // Map back to state objects preserving rank order
    const selectedRelics = checkedBoxes.map(box => {
        const id = parseInt(box.dataset.id, 10);
        return state.fullRelicList.find(relic => relic.ID === id);
    }).filter(Boolean);

    // Extract exact raw strings from JSON
    const greekNames = selectedRelics.map(r => r.name_greek);
    const englishNames = selectedRelics.map(r => r.name_english);

    // Join with language-appropriate conjunctions
    grInput.value = formatJoinedListKeepAllCommas(greekNames, 'καὶ');
    enInput.value = formatJoinedListKeepAllCommas(englishNames, 'and');
}

// (The parish lists are loaded once by common-utilities.js; loading them here
// as well listed every parish twice.)

function setDefaultCelebrant() {
    // 1. Grab element value natively

    const localEparchyId = eparchySelect ? eparchySelect.value : null;

    if (!localEparchyId) return;

    // 2. Safely look up that value in diocese data
    if (dioceseData[localEparchyId] && dioceseData[localEparchyId].keys) {
        const celebrantsName = dioceseData[localEparchyId].keys["client_en_US_goa|cl.bishop1.title"];
        // console.log('celebrantsName: ' + celebrantsName);
    }

    // 3. Set the celebrant dropdown selection natively to match the local ID
    if (celebrantSelect) {
        celebrantSelect.value = localEparchyId;
    }
}

function handleCelebrantChange() {

    const localEparchyId = eparchySelect.value;
    const celebrantEparchyId = celebrantSelect.value;

    if (!celebrantEparchyId || !localEparchyId) return;

    // 3. Evaluate Hierarchy State
    if (celebrantEparchyId === localEparchyId) {
        console.log("celebrantEparchyId === localEparchyId");

        try {
            swapHiCommemorationSupplication();
            swapHiCommemorationGreatLitany();
            swapDiptychsArchbishopOrMetropolitan();

            //Eparchy key changes    
            if (state.eparchySelect && dioceseData[state.eparchySelect]) {
                dioceseData[state.eparchySelect].fimis();
                const dataKeys = dioceseData[state.eparchySelect].keys;

                // Object.entries splits the object into [key, value] pairs instantly
                Object.entries(dataKeys).forEach(([key, textValue]) => { //used bject.keys(dataKeys).forEach(key => { in older iteration
                    const targetElements = state.serviceWin.document.querySelectorAll(`[data-key='${CSS.escape(key)}']`);

                    targetElements.forEach(targetElement => {
                        targetElement.textContent = textValue; // Cleaner mapping reference
                    });
                });
            }
        } catch (error) {
            console.error("Error executing local swaps:", error);
        }


    } else {
        console.log("celebrantEparchyId != localEparchyId");

        // GUEST: Apply the special guest logic with away_fimi
        applyGuestCelebrant(celebrantEparchyId);
    }
    updateActorHierarch();
}

function applyGuestCelebrant(guestEparchyId) {
    // 1. Safe state checking using centralized window tracking
    const serviceWinDoc = state.serviceWin.document;

    let overrideKeys = null;
    const languages = ['gr', 'en'];

    const guestData = dioceseData[guestEparchyId];
    // If not a Metropolitan
    if (!guestData || !guestData.keys) {
        const guestBishopData = bishopData[guestEparchyId];

        if (!guestBishopData || !guestBishopData.keys) {
            return;
        } else {
            overrideKeys = { ...guestBishopData.keys };

            try {
                // Wait for asynchronous text swaps to finish parsing
                guestBishopData.fimis();
                swapHiCommemorationSupplicationAndBishop();
                swapHiCommemorationGreatLitanyAndBishop();
                swapDiptychsBishop();

                //Eparchy key changes                                                        
                if (state.eparchySelect && dioceseData[state.eparchySelect]) {
                    const dataKeys = dioceseData[state.eparchySelect].keys;

                    // Object.entries splits the object into [key, value] pairs instantly
                    Object.entries(dataKeys).forEach(([key, textValue]) => { //used bject.keys(dataKeys).forEach(key => { in older iteration
                        const targetElements = serviceWinDoc.querySelectorAll(`[data-key='${CSS.escape(key)}']`);

                        targetElements.forEach(targetElement => {
                            targetElement.textContent = textValue; // Cleaner mapping reference
                        });
                    });
                }

                // Update text content natively across all matched attributes
                Object.keys(overrideKeys).forEach(key => {
                    const val = overrideKeys[key];
                    if (val !== "") {
                        // console.log('Simple bishop key: ' + key);

                        // Native multi-element string selector lookup (*= matching pattern)
                        const elements = serviceWinDoc.querySelectorAll(`[data-key*="${key}"]`);
                        elements.forEach(el => {
                            el.textContent = val;
                        });
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
    } else {
        // console.log("Guest Metropolitan");
        try {

            guestData.fimis();
            swapHiCommemorationSupplication();
            swapHiCommemorationGreatLitany();
            swapDiptychsArchbishopOrMetropolitan();


            overrideKeys = { ...guestData.keys };

            languages.forEach(lang => {
                const fimiKey = `client_${lang}_US_goa|cl.bishop1.fimi.text`;
                const awayFimiKey = `client_${lang}_US_goa|cl.bishop1.away_fimi.text`;

                if (overrideKeys[awayFimiKey]) {
                    overrideKeys[fimiKey] = overrideKeys[awayFimiKey];
                }
            });

            // Update text content natively for Metropolitan keys
            Object.keys(overrideKeys).forEach(key => {
                const val = overrideKeys[key];
                if (val !== "") {
                    console.log('Metropolitan key: ' + key);

                    // Native multi-element string selector lookup
                    const elements = serviceWinDoc.querySelectorAll(`[data-key*="${key}"]`);
                    elements.forEach(el => {
                        el.textContent = val;
                    });
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

}


function updateActorHierarch() {
    const dataKey = ['ac.sb.PrHi', 'ac.sb.ChHi', 'ac.sb.ClHi', 'ac.sb.ReHi', 'ac.Hierarch'];

    // Grabbing the selected layout ID from your state
    const idSelected = state.celebrantSelect;

    // Safe lookup fallback logic
    const rank = dioceseData[idSelected] ? dioceseData[idSelected].rank : bishopData[idSelected].rank;
    const ranksForRubric = episcopalRankConversions.episcopalRanks[rank];

    // 1. Loop through keys natively
    dataKey.forEach(key => {
        switchActor(key, actorMapping[key][rank + '_alten'], actorMapping[key][rank + '_altgr']);
    });

    // 2. Window state safety rail
    const serviceWinDoc = state.serviceWin.document;

    // 3. Find all elements with a data-key ending in '.rubric' natively
    const rubricElements = serviceWinDoc.querySelectorAll("[data-key$='.rubric']");

    // 4. Native loop replaces jQuery's .each()
    rubricElements.forEach(element => {
        // Get current layout text natively
        let currentText = element.textContent;

        // Loop through conversions simultaneously
        Object.entries(ranksForRubric).forEach(([oldRank, newRank]) => {
            if (currentText.includes(oldRank)) {
                // Replace text and assign it straight back to the DOM node
                let updatedText = currentText.replaceAll(oldRank, newRank);
                element.textContent = updatedText;
            }
            // The 'g' flag means global (match all instances), and 'i' means case-insensitive (optional)
            const titleRegex = /Metropolitan|Archbishop|Bishop/g;

            if (titleRegex.test(currentText)) {
                // 2. Replace any matched word with your new rank string straight back to the DOM
                element.textContent = currentText.replaceAll(titleRegex, newRank);
            }
        });
    });

    //changes Blank to Choirs 
    // const dataKey = 'ac.sb.BlCh';
    // showTr("actors_en_US_goa|" + dataKey);
    // showTr("actors_gr_GR_cog|" + dataKey);
}


// Writes the relic names into the service (plain DOM code: the panel does not load jQuery)
function updateRelicsInService() {
    if (!state.serviceWin || state.serviceWin.closed) return;
    const serviceWinDoc = state.serviceWin.document;

    [
        ['consecration-relics-names-gr-gen', 'client_gr_US_goa|cl.relic_saints.text'],
        ['consecration-relics-names-en', 'client_en_US_goa|cl.relic_saints.text']
    ].forEach(([inputId, dataKey]) => {
        const sourceElement = document.getElementById(inputId);
        if (!sourceElement) {
            console.warn(`Source element with ID "${inputId}" was not found.`);
            return;
        }
        serviceWinDoc.querySelectorAll(`[data-key='${CSS.escape(dataKey)}']`).forEach(el => {
            el.textContent = sourceElement.value;
        });
    });
}
