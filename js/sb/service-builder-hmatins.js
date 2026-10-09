/**
 * Application State - The Single Source of Truth
 */
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


    extractedParishName: "",

    // 3. Celebrant Options
    liOptDeacon: true, // Matches 'checked' attribute in HTML

    // 5. Parish Details & Apolytikion Fields
    parishSelect: "",
  
    // Dismissal Overrides
    clientGrUsGoaLocalpatronsaint1Dismissal: "",
    clientEnUsGoaLocalpatronsaint1Dismissal: "",
    clientGrUsGoaLocalpatronsaint1Supplication: "",
    clientEnUsGoaLocalpatronsaint1Supplication: "",

    // 6. Matins Content Toggles
    maOptMatinsOrdinary: false,
    maOptMatinsPrayers: false,
    maOptLaudsStichologia: false,
    maOptDismissal: false,

    // 7. Global Document Source Representation Cache
    fetchedHTMLContentLit: "",
    fetchedHTMLContentOrd: "",
    fetchedHTMLContentCli: "",
    fetchedHTMLContentLi: "",
    fetchedHTMLContentMat: "",

    ordDeaconCheck: false,
    deaconNameGrAcc: "",
    deaconNameEn: "",

};

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
const liOptConcelebration = document.getElementById('li_opt_concelebration');

// ==========================================
// 4. PARISH DETAILS & APOLYTIKION FIELDS
// ==========================================
const parishSelect = document.getElementById('parish-select');

// ==========================================
// 5. LITURGY CONTENT TOGGLES
// ==========================================

const maOptMatinsOrdinary = document.getElementById('ma_opt_matins_ordinary');
const maOptMatinsPrayers = document.getElementById('ma_opt_matins_prayers');
const maOptLaudsStichologia = document.getElementById('ma_opt_lauds_stichologia');
const maOptDismissal = document.getElementById('ma_opt_dismissal');

// ==========================================
// 6. ACTION EXECUTION & EXPORT BUTTONS
// ==========================================
const btnApplyAll = document.getElementById('btn-apply-all');
const btnExportWord = document.getElementById('btn-export-word');
const btnExportPdf = document.getElementById('btn-export-pdf');
const toastContainer = document.getElementById('toast-container');

const ordDeaconCheck = document.getElementById('ord-subdeacon-check');
const deaconNameGrAcc = document.getElementById('subdeacon-name-gr-acc');
const deaconNameEn = document.getElementById('subdeacon-name-en');


function applyChanges() {
    state.eparchySelect = eparchySelect.value;
    state.parishSelect = parishSelect.value;

    state.maOptMatinsOrdinary = maOptMatinsOrdinary.checked;
    state.maOptMatinsPrayers = maOptMatinsPrayers.checked;
    state.maOptLaudsStichologia = maOptLaudsStichologia.checked;
    state.maOptDismissal = maOptDismissal.checked;

    state.celebrantSelect = celebrantSelect.value;

    state.liOptDeacon = liOptDeacon.checked;


    if (state.parishSelect) {
        state.clientEnUsGoaLocalpatronsaint1Dismissal = parishData[state.parishSelect].keys['client_en_US_goa|cl.localpatronsaint1.dismissal'];
        state.clientGrUsGoaLocalpatronsaint1Dismissal = parishData[state.parishSelect].keys['client_gr_US_goa|cl.localpatronsaint1.dismissal'];
        state.clientEnUsGoaLocalpatronsaint1Supplication = parishData[state.parishSelect].keys["client_en_US_goa|cl.localpatronsaint1.supplication"];
        state.clientGrUsGoaLocalpatronsaint1Supplication = parishData[state.parishSelect].keys["client_gr_US_goa|cl.localpatronsaint1.supplication"];
    }
    state.ordDeaconCheck = ordDeaconCheck.checked;
    state.deaconNameGrAcc = deaconNameGrAcc.value;
    state.deaconNameEn = deaconNameEn.value;

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

        if (state.maOptMatinsOrdinary) {
            swapMatinsOrdinarySection1Ascension();
            swapMatinsOrdinarySection1Normal();
            swapMatinsOrdinarySection1Paschal();
            swapMatinsOrdinarySection3PsalmsLitany();

        } else {
            swapRemoveMatinsOrdinary();
            swapRemoveMatinsOrdinarySection1Ascension();
            swapRemoveMatinsOrdinarySection1Normal();
            swapRemoveMatinsOrdinarySection1Paschal();
            swapRemoveMatinsOrdinarySection3PsalmsLitany();
        }

        if (state.maOptMatinsPrayers) {
            swapMatinsOrdinarySection2Prayers();
        } else {
            swapRemoveMatinsOrdinarySection2Prayers();
        }

        if (state.maOptLaudsStichologia) {
            swapLaudsStichologiaFor4();
            swapLaudsStichologiaFor6();
        } else {
            swapRemoveLaudsStichologia();
        }

        if (state.maOptDismissal) {
            swapMatinsEndLitanies();
            swapMatinsDismissal();
            swapMatinsDismissalEnd();
        } else {
            swapRemoveMatinsEndLitanies();
            swapRemoveMatinsDismissal();
            swapRemoveMatinsDismissalEnd();
        }



        const updateIfExists = (key, textValue) => {
            // 1. Find ALL elements with the matching data-key
            const elements = serviceWinDoc.querySelectorAll(`[data-key='${CSS.escape(key)}']`);

            // 2. Loop through every match found and update natively
            elements.forEach(element => {
                element.textContent = textValue;
                // element.style.color = 'black';
            });
        };

        //Eparchy key changes                                                                    MODEL FOR CHANGING ALL KEYS FOR ALL OF AN OBJECTS KEYS
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


        //deal with supplication and dismissal
        if (state.parishSelect) {
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

        // handleConcelebrationCheckbox();
        updateSubdeaconOrdinationNames();
        handleCelebrantChange();
        handleDeaconCheckbox();

    } catch (error) {
        console.error("Failed to safely update serviceWinChild window DOM:", error);
    }
}



/**
 * Event Listeners
 */

// 1. Create the reusable worker function
function launchService(lang) {
    return new Promise((resolve) => {

        state.serviceDatePicker = serviceDatePicker.value;
        state.eparchySelect = eparchySelect.value;

        if (!state.serviceDatePicker) {
            alert("Please select a date.");
            return;
        }

        if (!state.eparchySelect) {
            alert("Please select a Metropolis and Celebrant Hierarch.");
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
        const targetUrl = `${baseUrl}${year}/${month}/${day}/ma/${state.currentLang}/index.html`;

        const pLeft = window.screenX || window.screenLeft;
        const pTop = window.screenY || window.screenTop;
        const serviceWidth = 650;
        const pHeight = window.outerHeight;

        const features = `height=${pHeight},width=${serviceWidth},top=${pTop},left=${pLeft + 500},resizable=yes,scrollbars=yes`;

        state.serviceWin = window.open(targetUrl, '_blank', features);

        state.serviceWin.addEventListener('load', async () => {

            await fetchSourceHTML('lit');
            await fetchSourceHTML('mat');
            await fetchDatedSourceHTML('li');
            await fetchSourceHTML('ord');

            convertToHierarchicalMatins();

            applyChanges();
            resolve();
        }, { once: true });
    });
}



/**
 * Turns the (published) Matins in the service window into Hierarchical
 * Matins. Used after launchService() opens its window, and by the DCS
 * buildMode panel (sb-panel-hmatins.html) when it opens.
 * (The swaps replace the former displayClass("sbhmakatavasias") and
 * displayClass("sbhmalaudsmode") steps; no service uses those classes.)
 */
function convertToHierarchicalMatins() {
    swapKatavasiasHierarchicalYes();
    swapOde9HierarchicalYes();
    swapExaposteilarionHierarchicalYes();

    // No Kairos at em (Matins in the evening): no Liturgy follows
    if (state.serviceCode !== 'em') swapLaudsHierarchicalKairosYes();
    swapLaudsHierarchicalMode();    // hierarchical Lauds modes 1-8 (sb-swap-mapping.js)
}

eparchySelect.addEventListener('change', () => {
    populateParishDropdown();
    setDefaultCelebrant();
});

parishSelect.addEventListener('change', () => {
    state.parishSelect = parishSelect.value;
});


// 2. Listen for the DOM to be ready, then execute
document.addEventListener('DOMContentLoaded', () => {
    populateEparchyDropdown();
    populateCelebrantDropdown();
    toggleOrdinationNameFields('subdeacon');
    openServiceWinFromDCS();
});


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

    if (!celebrantEparchyId) return;

    // 3. Evaluate Hierarchy State
    if (celebrantEparchyId === localEparchyId) {
        console.log("celebrantEparchyId === localEparchyId");

        try {
            swapFimiBishop0Bishop111();
            swapHiCommemorationSupplication();//???FAILS
            swapHiCommemorationGreatLitany();
            swapDiptychsArchbishopOrMetropolitan();

            //Eparchy key changes                                                                    MODEL FOR CHANGING ALL KEYS FOR ALL OF AN OBJECTS KEYS
            if (state.eparchySelect && dioceseData[state.eparchySelect]) {
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
    // console.log("in applyGuestCelebrant, ID=" + guestEparchyId);

    // 1. Safe state checking using centralized window tracking
    const serviceWinDoc = state.serviceWin.document;

    let overrideKeys = null;
    const languages = ['gr', 'en'];

    const guestData = dioceseData[guestEparchyId];
    // console.log("GuestData: ", guestData);

    // If not a Metropolitan
    if (!guestData || !guestData.keys) {
        // console.log("Not a Guest Metropolitan");
        const guestBishopData = bishopData[guestEparchyId];

        if (!guestBishopData || !guestBishopData.keys) {
            // console.log("Not a simple bishop");
            return;
        } else {
            // console.log("Simple bishop");
            overrideKeys = { ...guestBishopData.keys };

            try {
                // Wait for asynchronous text swaps to finish parsing

                swapHiCommemorationSupplicationAndBishop();
                swapHiCommemorationGreatLitanyAndBishop();

                //Eparchy key changes                                                                    MODEL FOR CHANGING ALL KEYS FOR ALL OF AN OBJECTS KEYS
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

            swapHiCommemorationSupplication();//FAILS???
            swapHiCommemorationGreatLitany();

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
        });
    });

}

function updateSubdeaconOrdinationNames() {

    // 2. Toggle name fields visibility containers natively
    const nameFieldsEl = document.getElementById('subdeacon-name-fields');
    if (nameFieldsEl) {
        nameFieldsEl.style.display = state.ordDeaconCheck ? 'block' : 'none';
    }

    if (state.ordDeaconCheck) {
        swapOrdinationSubdeaconYes();
        const deaconObjs = ordinationMapping.subdeacon.fields;

        //const isWindowAccessible = state.serviceWin && !state.serviceWin.closed;
        const serviceWinDoc = state.serviceWin.document;

        deaconObjs.forEach(deaconObj => {
            const sourceElement = document.getElementById(deaconObj.inputId);

            if (sourceElement) {
                const val = sourceElement.value;

                if (serviceWinDoc) {
                    // Use native querySelector with textContent assignment
                    const targetEl = serviceWinDoc.querySelector(`[data-key='${deaconObj.dataKey}']`);
                    if (targetEl) {
                        targetEl.textContent = val;
                    }
                }
            } else {
                console.warn(`Source element with ID ${deaconObj.inputId} was not found.`);
            }
        });
    } else {
        swapOrdinationSubdeaconNo();
    }
}


function toggleOrdinationNameFields(type) {
    // 1. Get the checkbox element natively and check its boolean state
    const checkbox = document.getElementById(`ord-${type}-check`);
    const isChecked = checkbox ? checkbox.checked : false;

    // 2. UI: Toggle the specific name fields layout container
    const nameFieldsEl = document.getElementById(`${type}-name-fields`);
    if (nameFieldsEl) {
        nameFieldsEl.style.display = isChecked ? 'block' : 'none';
    }
}

ordDeaconCheck.addEventListener('change', () => {
    // Calls your toggle function with 'priest' passed as the argument
    toggleOrdinationNameFields('subdeacon');
});
