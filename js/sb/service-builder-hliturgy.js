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
    liOptApolytikion: false,
    clientGrUsGoaApolytikion1Title: "",
    clientGrUsGoaApolytikion1Mode: "",
    clientGrUsGoaApolytikion1Text: "",
    clientEnUsGoaApolytikion1Title: "",
    clientEnUsGoaApolytikion1Mode: "",
    clientEnUsGoaApolytikion1Text: "",

    // Dismissal Overrides
    liOptDismissal: false,
    clientGrUsGoaLocalpatronsaint1Dismissal: "",
    clientEnUsGoaLocalpatronsaint1Dismissal: "",
    clientGrUsGoaLocalpatronsaint1Supplication: "",
    clientEnUsGoaLocalpatronsaint1Supplication: "",

    // 6. Liturgy Content Toggles
    liOptLitanies: false,
    liOptExtendedlitany: false,
    liOptPrecommunionprayers: false,
    liOptMemorial: false,
    liOptBlessingOfLoaves: false,

    ordDeaconCheck: false,
    deaconNameGrAcc: "",
    deaconNameGrGen: "",
    deaconNameEn: "",
    ordPriestCheck: false,
    priestNameGrAcc: "",
    priestNameGrGen: "",
    priestNameEn: "",

    // 7. Global Document Source Representation Cache
    fetchedHTMLContentLit: "",
    fetchedHTMLContentOrd: ""
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
const liOptApolytikion = document.getElementById('li_opt_apolytikion');

// Greek Apolytikion Slots
const clientGrUsGoaApolytikion1Title = document.getElementById('client_gr_US_goa|cl.Apolytikion1.title');
const clientGrUsGoaApolytikion1Mode = document.getElementById('client_gr_US_goa|cl.Apolytikion1.mode');
const clientGrUsGoaApolytikion1Text = document.getElementById('client_gr_US_goa|cl.Apolytikion1.text');

// English Apolytikion Slots
const clientEnUsGoaApolytikion1Title = document.getElementById('client_en_US_goa|cl.Apolytikion1.title');
const clientEnUsGoaApolytikion1Mode = document.getElementById('client_en_US_goa|cl.Apolytikion1.mode');
const clientEnUsGoaApolytikion1Text = document.getElementById('client_en_US_goa|cl.Apolytikion1.text');

// Dismissal Overrides
const liOptDismissal = document.getElementById('li_opt_dismissal');
const clientGrUsGoaLocalpatronsaint1Dismissal = document.getElementById('client_gr_US_goa|cl.localpatronsaint1.dismissal');
const clientEnUsGoaLocalpatronsaint1Dismissal = document.getElementById('client_en_US_goa|cl.localpatronsaint1.dismissal');

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

//===========================================
// 7. ORDINATION
//===========================================
const ordDeaconCheck = document.getElementById('ord-deacon-check');
const deaconNameGrAcc = document.getElementById('deacon-name-gr-acc');
const deaconNameGrGen = document.getElementById('deacon-name-gr-gen');
const deaconNameEn = document.getElementById('deacon-name-en');
const ordPriestCheck = document.getElementById('ord-priest-check');
const priestNameGrAcc = document.getElementById('priest-name-gr-acc');
const priestNameGrGen = document.getElementById('priest-name-gr-gen');
const priestNameEn = document.getElementById('priest-name-en');

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
        state.clientEnUsGoaApolytikion1Mode = parishData[state.parishSelect].keys['client_en_US_goa|cl.Apolytikion1.mode'];
        state.clientEnUsGoaApolytikion1Text = parishData[state.parishSelect].keys['client_en_US_goa|cl.Apolytikion1.text'];
        state.clientEnUsGoaApolytikion1Title = parishData[state.parishSelect].keys['client_en_US_goa|cl.Apolytikion1.title'];
        state.clientGrUsGoaApolytikion1Mode = parishData[state.parishSelect].keys['client_gr_US_goa|cl.Apolytikion1.mode'];
        state.clientGrUsGoaApolytikion1Text = parishData[state.parishSelect].keys['client_gr_US_goa|cl.Apolytikion1.text'];
        state.clientGrUsGoaApolytikion1Title = parishData[state.parishSelect].keys['client_gr_US_goa|cl.Apolytikion1.title'];

        state.clientEnUsGoaLocalpatronsaint1Dismissal = parishData[state.parishSelect].keys['client_en_US_goa|cl.localpatronsaint1.dismissal'];
        state.clientGrUsGoaLocalpatronsaint1Dismissal = parishData[state.parishSelect].keys['client_gr_US_goa|cl.localpatronsaint1.dismissal'];
        state.clientEnUsGoaLocalpatronsaint1Supplication = parishData[state.parishSelect].keys["client_en_US_goa|cl.localpatronsaint1.supplication"];
        state.clientGrUsGoaLocalpatronsaint1Supplication = parishData[state.parishSelect].keys["client_gr_US_goa|cl.localpatronsaint1.supplication"];
    }

    state.ordDeaconCheck = ordDeaconCheck.checked;
    state.deaconNameGrAcc = deaconNameGrAcc.value;
    state.deaconNameGrGen = deaconNameGrGen.value;
    state.deaconNameEn = deaconNameEn.value;
    state.ordPriestCheck = ordPriestCheck.checked;
    state.priestNameGrAcc = priestNameGrAcc.value;
    state.priestNameGrGen = priestNameGrGen.value;
    state.priestNameEn = priestNameEn.value;

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

        // Antiphons 1-3 or Typika / Beatitudes (only on days with a li3 service)
        handleAntiphonOptions(); // common-utilities.js

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

        const updateIfExists = (key, textValue) => {
            const element = serviceWinDoc.querySelector(`[data-key='${CSS.escape(key)}']`);
            if (element) {
                element.textContent = textValue;
            }
        };
        //Apolytikion

        if (state.parishSelect == null) { alert("Please select a parish first."); return; }
        //if the parish's saint isn't the same as the saint of the day - INJECT APOLYTIKION
        if (!(parishApolytikionInService(state.parishSelect, state.extractedParishNames))) {
            swapLocalApolytikionYes();

            // 2. Safely update Greek elements
            updateIfExists("client_gr_US_goa|cl.Apolytikion1.title", state.clientGrUsGoaApolytikion1Title);
            updateIfExists("client_gr_US_goa|cl.Apolytikion1.mode", state.clientGrUsGoaApolytikion1Mode);
            updateIfExists("client_gr_US_goa|cl.Apolytikion1.text", state.clientGrUsGoaApolytikion1Text);

            // 3. Safely update English elements
            updateIfExists("client_en_US_goa|cl.Apolytikion1.title", state.clientEnUsGoaApolytikion1Title);
            updateIfExists("client_en_US_goa|cl.Apolytikion1.mode", state.clientEnUsGoaApolytikion1Mode);
            updateIfExists("client_en_US_goa|cl.Apolytikion1.text", state.clientEnUsGoaApolytikion1Text);
            displayTr("class", "sbliparishapolytikionrubric", "none");
        } else {
            swapLocalApolytikionNo();
            displayTr("class", "sbliparishapolytikionrubric", "block");
        }

        if (state.parishSelect) {
            displayTr("class", "sbliparishapolytikionrubric", "none");
        } else {
            displayTr("class", "sbliparishapolytikionrubric", "block");
        }

        if (isHymnBetweenApolytikion2AndKontakion()) {
            swapApolytikion2Yes();
            console.log("hymn found between");
        } else {
            swapApolytikion2No();
            console.log("hymn NOT found between");
        }

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

        // Ordination swaps
        if (state.ordDeaconCheck) {
            swapOrdinationDeaconYes();
        } else {
            swapOrdinationDeaconNo();
        }
        if (state.ordPriestCheck) {
            swapOrdinationPriestPart1Yes();
            swapOrdinationPriestPart2Yes();
            swapOrdinationPriestPart3Yes();
        } else {
            swapOrdinationPriestPart1No();
            swapOrdinationPriestPart2No();
            swapOrdinationPriestPart3No();
        }

        switchActor('ac.sb.PrCl', actorMapping['ac.sb.PrCl'].alten, actorMapping['ac.sb.PrCl'].altgr);

        handleCelebrantChange();
        updateDeaconOrdinationNames();
        updatePriestOrdinationNames();
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
        const targetUrl = `${baseUrl}${year}/${month}/${day}/li/${state.currentLang}/index.html`;

        const pLeft = window.screenX || window.screenLeft;
        const pTop = window.screenY || window.screenTop;
        const serviceWidth = 650;
        const pHeight = window.outerHeight;

        const features = `height=${pHeight},width=${serviceWidth},top=${pTop},left=${pLeft + 500},resizable=yes,scrollbars=yes`;

        state.serviceWin = window.open(targetUrl, '_blank', features);

        state.serviceWin.addEventListener('load', async () => {
            // Now these will pause execution safely and sequentially as intended!
            await fetchSourceHTML('lit');
            await fetchSourceHTML('ord');

            convertToHierarchicalService();

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
            applyChanges();

            resolve();
        }, { once: true });
    });
}

/**
 * Turns the (published) Divine Liturgy in the service window into the
 * Hierarchical Divine Liturgy. Needs the 'lit' and 'ord' source texts.
 * Used after launchService() opens its window, and by the DCS buildMode
 * panel (sb-panel-hliturgy.html) when it opens.
 */
function convertToHierarchicalService() {
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
    swapKontakionYes();
    swapApolytikion2Yes();
    swapHiSmallEntrance();
    swapApolytikion1Hierarchical();
    swapGreatEntranceHierarchical();

    // 1. Target the elements across the service window document natively
    const refrains = state.serviceWin.document.querySelectorAll('.sblieisodikonrefrain');
    // 2. Loop through and change the style display property on each element
    refrains.forEach(refrain => {
        refrain.style.display = 'block';
    });
}

// 2. Attach the streamlined listeners to your buttons

document.addEventListener('DOMContentLoaded', () => {
    populateEparchyDropdown();
    populateCelebrantDropdown();
    openServiceWinFromDCS();

});

parishSelect.addEventListener('change', () => {
    state.parishSelect = parishSelect.value;
});
// parishSelect.addEventListener('change', populateDefaultFourApolytikionFields);


ordPriestCheck.addEventListener('change', () => {
    // Calls your toggle function with 'priest' passed as the argument
    toggleOrdinationNameFields('priest');
});

ordDeaconCheck.addEventListener('change', () => {
    // Calls your toggle function with 'priest' passed as the argument
    toggleOrdinationNameFields('deacon');
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

function updateDeaconOrdinationNames() {

    // 2. Toggle name fields visibility containers natively
    const nameFieldsEl = document.getElementById('deacon-name-fields');
    if (nameFieldsEl) {
        nameFieldsEl.style.display = state.ordDeaconCheck ? 'block' : 'none';
    }

    if (state.ordDeaconCheck) {
        const deaconObjs = ordinationMapping.deacon.fields;

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
    }
}

function updatePriestOrdinationNames() {

    // 2. Toggle name fields visibility containers natively
    const nameFieldsEl = document.getElementById('priest-name-fields');
    if (nameFieldsEl) {
        nameFieldsEl.style.display = state.ordPriestCheck ? 'block' : 'none';
    }

    if (state.ordPriestCheck) {
        const priestObjs = ordinationMapping.priest.fields;

        //const isWindowAccessible = state.serviceWin && !state.serviceWin.closed;
        const serviceWinDoc = state.serviceWin.document;

        priestObjs.forEach(priestObj => {
            const sourceElement = document.getElementById(priestObj.inputId);

            if (sourceElement) {
                const val = sourceElement.value;

                if (serviceWinDoc) {
                    // Use native querySelector with textContent assignment
                    const targetEl = serviceWinDoc.querySelector(`[data-key='${priestObj.dataKey}']`);
                    if (targetEl) {
                        targetEl.textContent = val;
                    }
                }
            } else {
                console.warn(`Source element with ID ${priestObj.inputId} was not found.`);
            }
        });
    }
}

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
            // swapFimiBishop0Bishop111();
            swapHiCommemorationSupplication();//???FAILS
            swapHiCommemorationGreatLitany();
            swapDiptychsArchbishopOrMetropolitan();

            //Eparchy key changes                                                                    MODEL FOR CHANGING ALL KEYS FOR ALL OF AN OBJECTS KEYS
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
                guestBishopData.fimis();
                swapHiCommemorationSupplicationAndBishop();
                swapHiCommemorationGreatLitanyAndBishop();
                swapDiptychsBishop();

                // console.log("Finished SIMPLE bishop swaps");

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

            guestData.fimis();
            swapHiCommemorationSupplication();//FAILS???
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
        });
    });



}