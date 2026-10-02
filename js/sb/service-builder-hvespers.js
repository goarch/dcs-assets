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

    extractedParishNames: "",

    // 3. Celebrant Options
    liOptDeacon: true, // Matches 'checked' attribute in HTML

    // 5. Parish Details & Apolytikion Fields
    parishSelect: "",


    // Dismissal Overrides
    clientGrUsGoaLocalpatronsaint1Dismissal: "",
    clientEnUsGoaLocalpatronsaint1Dismissal: "",
    clientGrUsGoaLocalpatronsaint1Supplication: "",
    clientEnUsGoaLocalpatronsaint1Supplication: "",

    // 6. Vespers Content Toggles
    veOptVesperalPrayers: false,
    veOptAnoixantaria: false,
    veOptStichologia: false,
    veOptLity: false,
    veOptFullLity: false,

    // 7. Global Document Source Representation Cache
    fetchedHTMLContentLit: "",
    fetchedHTMLContentOrd: "",
    fetchedHTMLContentCli: "",
    fetchedHTMLContentLi: "",
    fetchedHTMLContentMat: "",
    fetchedHTMLContentVes: "",
    fetchedHTMLContentVe2: "",

    ve2Exists: true,
    ve2LityExists: true

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

// ==========================================
// 4. PARISH DETAILS & APOLYTIKION FIELDS
// ==========================================
const parishSelect = document.getElementById('parish-select');

const veOptVesperalPrayers = document.getElementById('ve_opt_vesperal_prayers');
const veOptAnoixantaria = document.getElementById('ve_opt_anoixantaria');
const veOptStichologia = document.getElementById('ve_opt_stichologia');
const veOptLity = document.getElementById('ve_opt_lity');
const veOptFullLity = document.getElementById('ve_opt_full_lity');
// ==========================================
// 6. ACTION EXECUTION & EXPORT BUTTONS
// ==========================================
const btnApplyAll = document.getElementById('btn-apply-all');
const btnExportWord = document.getElementById('btn-export-word');
const btnExportPdf = document.getElementById('btn-export-pdf');
const toastContainer = document.getElementById('toast-container');



function applyChanges() {
    state.eparchySelect = eparchySelect.value;
    state.celebrantSelect = celebrantSelect.value;

    state.veOptVesperalPrayers = veOptVesperalPrayers.checked;
    state.veOptAnoixantaria = veOptAnoixantaria.checked;
    state.veOptStichologia = veOptStichologia.checked;
    state.veOptLity = veOptLity.checked;
    state.veOptFullLity = veOptFullLity.checked;

    state.liOptDeacon = liOptDeacon.checked;

    if (state.parishSelect) {
        //state.liOptDismissal = liOptDismissal.checked;
        state.clientEnUsGoaLocalpatronsaint1Dismissal = parishData[state.parishSelect].keys['client_en_US_goa|cl.localpatronsaint1.dismissal'];
        state.clientGrUsGoaLocalpatronsaint1Dismissal = parishData[state.parishSelect].keys['client_gr_US_goa|cl.localpatronsaint1.dismissal'];
        state.clientEnUsGoaLocalpatronsaint1Supplication = parishData[state.parishSelect].keys["client_en_US_goa|cl.localpatronsaint1.supplication"];
        state.clientGrUsGoaLocalpatronsaint1Supplication = parishData[state.parishSelect].keys["client_gr_US_goa|cl.localpatronsaint1.supplication"];
    }

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


        if (state.veOptVesperalPrayers) {
            swapVesperalPrayersYes();
        } else {
            swapVesperalPrayersNo();
        }

        if (state.veOptAnoixantaria) {
            swapVespersAnoixantariaYes();
        } else {
            swapVespersAnoixantariaNo();
        }

        if (state.veOptStichologia) {
            swapVespersStichologiaFor6();
            swapVespersStichologiaFor8();
            swapVespersStichologiaFor10();
        } else {
            swapVespersStichologiaFor6No();
            swapVespersStichologiaFor8No();
            swapVespersStichologiaFor10No();
        }

        if (state.veOptLity) {
            swapVespersLityPart1TitleActor();
            swapVespersLityPart2First();
            swapVespersLityPart4Litany();
            swapVespersLityPart5Theotokoshymn();
            swapVespersLityPart6Blessingofloaves();
            swapVespersEndWhenLoaves();
        } else {
            swapVespersLityPart1TitleActorNo();
            swapVespersLityPart2FirstNo();
            swapVespersLityPart4LitanyNo();
            swapVespersLityPart5TheotokoshymnNo();
            swapVespersLityPart6BlessingofloavesNo();
            swapVespersEnd();
        }

        if (state.veOptFullLity) {
            swapVespersLityPart3Rest();
        } else {
            swapVespersLityPart3RestNo();
        }


        const updateIfExists = (key, textValue) => {
            // 1. Find ALL elements with the matching data-key
            const elements = serviceWinDoc.querySelectorAll(`[data-key='${CSS.escape(key)}']`);

            // 2. Loop through every match found and update natively
            elements.forEach(element => {
                element.textContent = textValue;
                element.style.color = 'black';
            });
        };


        if (state.parishSelect == null) { alert("Please select a parish first."); return; }
        //if the parish's saint isn't the same as the saint of the day - INJECT APOLYTIKION

        //Dismissal / Supplication
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

        handleCelebrantChange();

        handleDeaconCheckbox();

        switchActor('ac.sb.PrCl', actorMapping['ac.sb.PrCl'].alten, actorMapping['ac.sb.PrCl'].altgr);

    } catch (error) {
        console.error("Failed to safely update serviceWinChild window DOM:", error);
    }
}

veOptLity.addEventListener("click", onVeOptLityClick);
function onVeOptLityClick() {
    if (veOptLity && !veOptLity.checked) {
        if (veOptFullLity) {
            veOptFullLity.checked = false;
        }
    }
}
veOptFullLity.addEventListener("click", onVeOptFullLityClick);
function onVeOptFullLityClick() {
    if (veOptFullLity && veOptFullLity.checked) {
        if (veOptLity) {
            veOptLity.checked = true;
        }
    }
}

serviceDatePicker.addEventListener("change", async () => {

    await fetchDatedSourceHTML('ve2');
    updateLityOptionsForDay(); // common-utilities.js
});

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
        const targetUrl = `${baseUrl}${year}/${month}/${day}/ve/${state.currentLang}/index.html`;

        const pLeft = window.screenX || window.screenLeft;
        const pTop = window.screenY || window.screenTop;
        const serviceWidth = 650;
        const pHeight = window.outerHeight;

        const features = `height=${pHeight},width=${serviceWidth},top=${pTop},left=${pLeft + 500},resizable=yes,scrollbars=yes`;

        state.serviceWin = window.open(targetUrl, '_blank', features);

        state.serviceWin.addEventListener('load', async () => {
            // Now these will pause execution safely and sequentially as intended!
            await fetchSourceHTML('lit');
            await fetchSourceHTML('mat');
            await fetchDatedSourceHTML('li');
            await fetchSourceHTML('ord');
            await fetchDatedSourceHTML('ve2');
            await fetchSourceHTML('ves');

            convertToHierarchicalVespers();

            applyChanges();

            resolve();
        }, { once: true });
    });
}

/**
 * Turns the (published) Vespers in the service window into Hierarchical
 * Vespers. Used after launchService() opens its window, and by the DCS
 * buildMode panel (sb-panel-hvespers.html) when it opens.
 */
function convertToHierarchicalVespers() {
    // Hierarchical modes 1-8, Entrance, Prokeimenon and Trisagion (sb-swap-mapping.js)
    swapVespersHierarchical();
//    swapVespersHierarchicalEntrance();
 //   swapVespersHierarchicalProkeimenon();
  //  swapVespersConcelebrationProkeimenonChoir();
}

parishSelect.addEventListener('change', () => {
    state.parishSelect = parishSelect.value;
});

eparchySelect.addEventListener('change', () => {
    populateParishDropdown();
    setDefaultCelebrant();
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
            swapHiCommemorationSupplication();
            swapHiCommemorationGreatLitany();

            //Eparchy key changes      
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

        // GUEST: Apply the special guest logic
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
        try {

            swapHiCommemorationSupplication();
            swapHiCommemorationGreatLitany();

            overrideKeys = { ...guestData.keys };

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

document.addEventListener('DOMContentLoaded', () => {
    populateEparchyDropdown();
    populateCelebrantDropdown();
    openServiceWinFromDCS();

});


function updateActorHierarch() {
    const dataKey = ['ac.sb.PrHi', 'ac.sb.ChHi', 'ac.sb.ClHi', 'ac.sb.ReHi', 'ac.Hierarch'];

    // Grabbing the selected layout ID from your state
    const idSelected = state.celebrantSelect;

    // Safe lookup fallback logic
    const rank = dioceseData[idSelected] ? dioceseData[idSelected].rank : bishopData[idSelected].rank;
    const ranksForRubric = episcopalRankConversions.episcopalRanks[rank];

    // 1. Loop through keys natively
    dataKey.forEach(key => {
        console.log(`actorMapping[key][rank + '_alten']: ${actorMapping[key][rank + '_alten']}`);
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
