/**
 * Service Builder: Presanctified Liturgy (sb-panel-presanctified.html, for pl1).
 * Website only: the panel runs in the service page's buildMode frame (see
 * js/sb/sb-embed.js), which provides the service window, date and language.
 *
 * Choices: Metropolis and Parish (hierarch's names, parish dismissal and
 * supplication), Deacon, Stichologia of "Lord I have cried" and Pre-Communion
 * Prayers. Everything is done with the existing swaps and shared functions:
 *  - Stichologia: the Vespers swaps (source 'ves'), for the stichologia the day has
 *  - Pre-Communion Prayers: the Liturgy swaps (source 'lit')
 *  - Deacon: handleDeaconCheckbox() in common-utilities.js (opening from 'lit')
 * The Presanctified Liturgy has no parish Apolytikion.
 */

/**
 * Application State - The Single Source of Truth
 */
const state = {
    // 1. Service Window Tracking
    serviceWin: null,

    currentLang: 'gr-en',
    activeWindowLang: 'gr-en',

    serviceCode: 'pl1',

    // 2. Service Launch & Configuration
    serviceDatePicker: "",
    jurisdictionSelect: "goa", // Matches the default <option value="goa"> in HTML
    eparchySelect: "",

    extractedParishNames: "",

    // 3. Celebrant Options
    liOptDeacon: true, // Matches 'checked' attribute in HTML

    // 4. Parish Details
    parishSelect: "",

    // Dismissal Overrides
    clientGrUsGoaLocalpatronsaint1Dismissal: "",
    clientEnUsGoaLocalpatronsaint1Dismissal: "",
    clientGrUsGoaLocalpatronsaint1Supplication: "",
    clientEnUsGoaLocalpatronsaint1Supplication: "",

    // 5. Presanctified Content Toggles
    veOptStichologia: true, // Matches 'checked' attribute in HTML
    liOptPrecommunionprayers: false,

    // 6. Global Document Source Representation Cache
    fetchedHTMLContentLit: "",
    fetchedHTMLContentVes: ""
};

// Cache Control UI Elements
const serviceDatePicker = document.getElementById('service-date-picker');
const eparchySelect = document.getElementById('eparchy-select');
const parishSelect = document.getElementById('parish-select');
const liOptDeacon = document.getElementById('li_opt_deacon');
const veOptStichologia = document.getElementById('ve_opt_stichologia');
const liOptPrecommunionprayers = document.getElementById('li_opt_precommunionprayers');


// The stichologia of "Lord I have cried" the day has: 6, 8 or 10 verses (none on some days)
function plStichologiaVersions() {
    const doc = state.serviceWin && state.serviceWin.document;
    if (!doc) return [];
    return [6, 8, 10].filter(n => doc.querySelector(`.brc_ve_stichologia_for_${n}`));
}

// Called when the panel opens (SB_PANEL.onOpen): no stichologia that day, no option
function plShowStichologiaOptionForDay() {
    const option = document.getElementById('pl_stichologia_option');
    if (option) option.style.display = plStichologiaVersions().length ? '' : 'none';
}


function applyChanges() {
    state.eparchySelect = eparchySelect.value;
    state.parishSelect = parishSelect.value;

    state.liOptDeacon = liOptDeacon.checked;
    state.veOptStichologia = veOptStichologia.checked;
    state.liOptPrecommunionprayers = liOptPrecommunionprayers.checked;

    if (state.parishSelect && parishData[state.parishSelect]) {
        const keys = parishData[state.parishSelect].keys;
        state.clientEnUsGoaLocalpatronsaint1Dismissal = keys['client_en_US_goa|cl.localpatronsaint1.dismissal'] || "";
        state.clientGrUsGoaLocalpatronsaint1Dismissal = keys['client_gr_US_goa|cl.localpatronsaint1.dismissal'] || "";
        state.clientEnUsGoaLocalpatronsaint1Supplication = keys['client_en_US_goa|cl.localpatronsaint1.supplication'] || "";
        state.clientGrUsGoaLocalpatronsaint1Supplication = keys['client_gr_US_goa|cl.localpatronsaint1.supplication'] || "";
    }

    // Commit snapshot to service layout canvas
    updateServiceWindow();
}


/**
 * Core Orchestrator: Direct DOM Manipulation Engine
 */
function updateServiceWindow() {
    const serviceWinChild = state.serviceWin;

    // Safety Gate: Ensure serviceWinChild window context is alive
    if (!serviceWinChild || serviceWinChild.closed) {
        alert("The service window is not open. Please launch it first.");
        return;
    }

    try {
        const serviceWinDoc = serviceWinChild.document;

        // Stichologia of "Lord I have cried": only the version(s) the day has
        const stichologiaSwaps = {
            6: [swapVespersStichologiaFor6, swapVespersStichologiaFor6No],
            8: [swapVespersStichologiaFor8, swapVespersStichologiaFor8No],
            10: [swapVespersStichologiaFor10, swapVespersStichologiaFor10No]
        };
        plStichologiaVersions().forEach(n => {
            stichologiaSwaps[n][state.veOptStichologia ? 0 : 1]();
        });

        if (state.liOptPrecommunionprayers) {
            swapPrecommunionPrayersOn();
        } else {
            swapPrecommunionPrayersOff();
        }

        const updateIfExists = (key, textValue) => {
            serviceWinDoc.querySelectorAll(`[data-key='${CSS.escape(key)}']`).forEach(element => {
                element.textContent = textValue;
            });
        };

        // Metropolis: all of its data keys (hierarch's names and titles)
        if (state.eparchySelect && dioceseData[state.eparchySelect]) {
            Object.entries(dioceseData[state.eparchySelect].keys).forEach(([key, textValue]) => {
                updateIfExists(key, textValue);
            });
        }

        // Parish: dismissal and supplication
        if (state.parishSelect) {
            updateIfExists("client_gr_US_goa|cl.localpatronsaint1.dismissal", state.clientGrUsGoaLocalpatronsaint1Dismissal);
            updateIfExists("client_en_US_goa|cl.localpatronsaint1.dismissal", state.clientEnUsGoaLocalpatronsaint1Dismissal);
            updateIfExists("client_gr_US_goa|cl.localpatronsaint1.supplication", state.clientGrUsGoaLocalpatronsaint1Supplication);
            updateIfExists("client_en_US_goa|cl.localpatronsaint1.supplication", state.clientEnUsGoaLocalpatronsaint1Supplication);

            const longerStringEn = state.clientEnUsGoaLocalpatronsaint1Dismissal.length >= state.clientEnUsGoaLocalpatronsaint1Supplication.length
                ? state.clientEnUsGoaLocalpatronsaint1Dismissal : state.clientEnUsGoaLocalpatronsaint1Supplication;
            if (longerStringEn !== "") {
                clearPatronSaintIfMatched(longerStringEn); // common-utilities.js
            }
        }

        handleDeaconCheckbox(); // common-utilities.js

    } catch (error) {
        console.error("Failed to safely update serviceWinChild window DOM:", error);
    }
}


/**
 * Used by common-utilities.js when the service window is not open; in the
 * website panel the service page is always open, so this only applies.
 */
function launchService(lang) {
    return new Promise((resolve) => {
        if (state.serviceWin && !state.serviceWin.closed) {
            applyChanges();
        }
        resolve();
    });
}


parishSelect.addEventListener('change', () => {
    state.parishSelect = parishSelect.value;
});

eparchySelect.addEventListener('change', () => {
    populateParishDropdown(); // common-utilities.js
});

document.addEventListener('DOMContentLoaded', () => {
    populateEparchyDropdown(); // common-utilities.js
    openServiceWinFromDCS();   // common-utilities.js
});
