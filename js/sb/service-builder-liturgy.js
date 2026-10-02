/**
 * Application State - The Single Source of Truth
 */
const state = {
    // 1. Service Window Tracking
    serviceWin: null,

    serviceCode: 'li',

    currentLang: 'gr-en',

    activeWindowLang: 'gr-en',

    // 2. Service Launch & Configuration
    serviceDatePicker: "",
    jurisdictionSelect: "goa", // Matches the default <option value="goa"> in HTML
    eparchySelect: "",

    extractedParishNames: "",

    // 3. Celebrant Options
    liOptDeacon: true, // Matches 'checked' attribute in HTML
    liOptConcelebration: false,

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

    // 7. Global Document Source Representation Cache
    fetchedHTMLContentLit: "",

    apolykikionDataKeysToUpdate: [
        'client_gr_US_goa|cl.Apolytikion1.title',
        'client_gr_US_goa|cl.Apolytikion1.mode',
        'client_gr_US_goa|cl.Apolytikion1.text',
        'client_en_US_goa|cl.Apolytikion1.title',
        'client_en_US_goa|cl.Apolytikion1.mode',
        'client_en_US_goa|cl.Apolytikion1.text'

    ],

    dismissalDataKeysToUpdate: [
        'client_gr_US_goa|cl.localpatronsaint1.dismissal',
        'client_en_US_goa|cl.localpatronsaint1.dismissal'
    ]
};

const dataKeysToUpdate = [...state.apolykikionDataKeysToUpdate, ...state.dismissalDataKeysToUpdate];

// Cache Control UI Elements
// ==========================================
// 1. SERVICE LAUNCH & CONFIGURATION
// ==========================================
const serviceDatePicker = document.getElementById('service-date-picker');
const launchServiceGrEn = document.getElementById('launchServiceGrEn');
const launchServiceGr = document.getElementById('launchServiceGr');
const launchServiceEn = document.getElementById('launchServiceEn');

// Gets whichever value is currently chosen ('bilingual', 'english', or 'greek')
const selectedLanguage = document.querySelector('input[name="serviceLanguage"]:checked')?.value;
// 2. Attach a listener to the parent container holding the radio inputs
//const languageGroup = document.querySelector('.launch-btn-group');

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
const previewButton = document.getElementById('btn-view-preview');
const btnApplyAll = document.getElementById('btn-apply-all');
const btnExportWord = document.getElementById('btn-export-word');
const btnExportPdf = document.getElementById('btn-export-pdf');
const toastContainer = document.getElementById('toast-container');

const sub1 = document.getElementById('li_opt_memorial_apolytikion');
const sub2 = document.getElementById('li_opt_memorial_evlogetaria');
const sub3 = document.getElementById('li_opt_memorial_trisagion');

const subOptions = [sub1, sub2, sub3];



// 2. Manual Commit Trigger Action
function applyChanges() {
    state.eparchySelect = eparchySelect.value;
    state.parishSelect = parishSelect.value;

    state.currentLang = selectedLanguage;

    state.liOptLitanies = liOptLitanies.checked;
    state.liOptExtendedlitany = liOptExtendedlitany.checked;
    state.liOptPrecommunionprayers = liOptPrecommunionprayers.checked;
    state.liOptMemorial = liOptMemorial.checked;
    state.sub1 = sub1.checked;
    state.sub2 = sub2.checked;
    state.sub3 = sub3.checked;
    state.liOptBlessingOfLoaves = liOptBlessingOfLoaves.checked;
    state.liOptDeacon = liOptDeacon.checked;
    state.liOptConcelebration = liOptConcelebration.checked;

    //state.liOptApolytikion = liOptApolytikion.checked;
    if (state.parishSelect) {
        state.clientEnUsGoaApolytikion1Mode = parishData[state.parishSelect].keys['client_en_US_goa|cl.Apolytikion1.mode'];
        state.clientEnUsGoaApolytikion1Text = parishData[state.parishSelect].keys['client_en_US_goa|cl.Apolytikion1.text'];
        state.clientEnUsGoaApolytikion1Title = parishData[state.parishSelect].keys['client_en_US_goa|cl.Apolytikion1.title'];
        state.clientGrUsGoaApolytikion1Mode = parishData[state.parishSelect].keys['client_gr_US_goa|cl.Apolytikion1.mode'];
        state.clientGrUsGoaApolytikion1Text = parishData[state.parishSelect].keys['client_gr_US_goa|cl.Apolytikion1.text'];
        state.clientGrUsGoaApolytikion1Title = parishData[state.parishSelect].keys['client_gr_US_goa|cl.Apolytikion1.title'];

        // state.liOptDismissal = liOptDismissal.checked;
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

        //Apolytikion
        if (state.parishSelect == null) { alert("Please select a parish first."); return; }
        //if the parish's saint isn't contained in the baked in celebrated daily saints - INJECT APOLYTIKION
        if (!(state.extractedParishNames.includes(state.parishSelect))) {
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



/**
 * Event Listeners
 */

// 1. Create the reusable worker function
function launchService(lang) {
    // Return a Promise so other functions can wait for it to finish loading
    return new Promise((resolve) => {
        state.serviceDatePicker = serviceDatePicker.value;

        if (!state.serviceDatePicker) {
            alert("Please select a date.");
            return; // Note: You might want to reject() here or handle errors
        }

        if (state.serviceWin && !state.serviceWin.closed) {
            state.serviceWin.focus();
            resolve(); // Window is already open, resolve immediately
            return;
        }

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

            const parishElements = state.serviceWin.document.querySelectorAll('.sbparishname');
            state.extractedParishNames = "";

            if (parishElements.length > 0) {
                state.extractedParishNames = Array.from(parishElements)
                    .map(el => el.textContent.trim())
                    .join(' ');
            }

            applyChanges();

            // 🔥 CRITICAL: Tell the browser it is now safe to proceed with exporting!
            resolve();
        }, { once: true });
    });
}

parishSelect.addEventListener('change', () => {
    state.parishSelect = parishSelect.value;
});
// parishSelect.addEventListener('change', populateDefaultFourApolytikionFields);
eparchySelect.addEventListener('change', () => {
    setLiturgyOptionsByEparchy();
    populateParishDropdown();
});

// 2. Listen for the DOM to be ready, then execute
document.addEventListener('DOMContentLoaded', () => {
    populateEparchyDropdown();
    openServiceWinFromDCS();
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


function handleConcelebrationCheckbox() {

    if (state.liOptConcelebration) {

        swapConcelebrationSmallEntrance();
        swapApolytikion1Concelebration();
        swapApolytikion2Yes();
        swapKontakionYes();
        swapTrisagionHolygodConcelebration();
        swapTrisagionBaptizedConcelebration();
        swapTrisagionCrossConcelebration();

        switchActor('ac.sb.PrCl', actorMapping['ac.sb.PrCl'].alten, actorMapping['ac.sb.PrCl'].altgr);
        switchActor('ac.sb.ClHi', actorMapping['ac.sb.ClHi'].defen, actorMapping['ac.sb.ClHi'].defgr);

        // 1. Target the elements across the service window document natively
        const refrains = state.serviceWin.document.querySelectorAll('.sblieisodikonrefrain');
        // 2. Loop through and change the style display property on each element
        refrains.forEach(refrain => {
            refrain.style.display = 'block';
        });

        if (isHymnBetweenApolytikion2AndKontakion()) {
            swapApolytikion2Yes();
            console.log("hymn found between");
        } else {
            swapApolytikion2No();
            console.log("hymn NOT found between");
        }

    } else {
        swapSmallEntrance();
        swapApolytikion1Choir();
        swapApolytikion2No();
        swapKontakionNo();
        swapTrisagionBaptized();
        swapTrisagionCross();
        swapTrisagionHolygod();

        switchActor('ac.sb.PrCl', actorMapping['ac.sb.PrCl'].defen, actorMapping['ac.sb.PrCl'].defgr);

        const refrains = state.serviceWin.document.querySelectorAll('.sblieisodikonrefrain');
        refrains.forEach(refrain => {
            refrain.style.display = 'none';
        });
    }
}
