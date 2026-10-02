/**
 * Application State - The Single Source of Truth
 */

const state = {
    // 1. Service Window Tracking
    serviceWin: null,

    currentLang: 'gr-en',
    activeWindowLang: 'gr-en',

    serviceCode: 've',

    // 2. Service Launch & Configuration
    serviceDatePicker: "",
    jurisdictionSelect: "goa", // Matches the default <option value="goa"> in HTML
    eparchySelect: "",

    // 3. Celebrant Options
    liOptDeacon: true, // Matches 'checked' attribute in HTML
    liOptConcelebration: false,

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


// 2. Manual Commit Trigger Action

function applyChanges() {
    state.eparchySelect = eparchySelect.value;
    state.parishSelect = parishSelect.value;

    state.veOptVesperalPrayers = veOptVesperalPrayers.checked;
    state.veOptAnoixantaria = veOptAnoixantaria.checked;
    state.veOptStichologia = veOptStichologia.checked;
    state.veOptLity = veOptLity.checked;
    state.veOptFullLity = veOptFullLity.checked;

    state.liOptDeacon = liOptDeacon.checked;
    state.liOptConcelebration = liOptConcelebration.checked;

    if (state.parishSelect) {
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

        handleConcelebrationCheckbox();
        handleDeaconCheckbox();

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
        const targetUrl = `${baseUrl}${year}/${month}/${day}/${state.serviceCode}/${state.currentLang}/index.html`;

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
            await fetchDatedSourceHTML('ve2');
            await fetchSourceHTML('ves');
        
            applyChanges();
            resolve();
        }, { once: true });
    });
}

parishSelect.addEventListener('change', () => {
    state.parishSelect = parishSelect.value;
});

eparchySelect.addEventListener('change', () => {
    populateParishDropdown();
});

// 2. Listen for the DOM to be ready, then execute
document.addEventListener('DOMContentLoaded', () => {

    populateEparchyDropdown();
    openServiceWinFromDCS();

});

function handleConcelebrationCheckbox() {

    if (state.liOptConcelebration) {

        swapVespersConcelebrationEntrance();
        swapVespersConcelebrationProkeimenon();
        swapVespersConcelebrationProkeimenonChoir();

        switchActor('ac.sb.PrCl', actorMapping['ac.sb.PrCl'].alten, actorMapping['ac.sb.PrCl'].altgr);
    } else {

        swapVespersEntrance();
        swapVespersProkeimenon();
        swapVespersConcelebrationProkeimenonChoirNo();

        switchActor('ac.sb.PrCl', actorMapping['ac.sb.PrCl'].defen, actorMapping['ac.sb.PrCl'].defgr);
    }
}