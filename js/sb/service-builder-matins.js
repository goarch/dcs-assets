/**
 * Application State - The Single Source of Truth
 */

const state = {
    // 1. Service Window Tracking
    serviceWin: null,

    serviceCode: 'ma',

    currentLang: 'gr-en',
    activeWindowLang: 'gr-en',

    // 2. Service Launch & Configuration
    serviceDatePicker: "",
    jurisdictionSelect: "goa", // Matches the default <option value="goa"> in HTML
    eparchySelect: "",

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
    fetchedHTMLContentMat: ""
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


function applyChanges() {
    state.eparchySelect = eparchySelect.value;
    state.parishSelect = parishSelect.value;

    state.maOptMatinsOrdinary = maOptMatinsOrdinary.checked;
    state.maOptMatinsPrayers = maOptMatinsPrayers.checked;
    state.maOptLaudsStichologia = maOptLaudsStichologia.checked;
    state.maOptDismissal = maOptDismissal.checked;

    state.liOptDeacon = liOptDeacon.checked;
   
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
    // You can call other initialization routines here too
});