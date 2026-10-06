/**
 * Service Builder: Vesperal Liturgy (sb-panel-vesperalliturgy.html, for vl and vl2).
 * Website only: the panel runs in the service page's buildMode frame (see
 * js/sb/sb-embed.js), which provides the service window, date and language.
 *
 * Vespers joined to a Divine Liturgy, so the choices come from both panels:
 *  - Metropolis and Parish: hierarch's names, parish dismissal and supplication
 *    (no parish Apolytikion)
 *  - Deacon: handleDeaconCheckbox() in common-utilities.js
 *  - Concelebration: the Vespers entrance (source 'ves'), the Trisagion and the
 *    ac.sb.PrCl actor (source 'lit')
 *  - Vespers options: Vesperal Prayers, Anoixantaria, Stichologia (source 'ves')
 *  - Liturgy option: Pre-Communion Prayers (source 'lit')
 * Only the parts the day's service has a place for are swapped; options with no
 * place in the service are hidden when the panel opens.
 */

/**
 * Application State - The Single Source of Truth
 */
const state = {
    // 1. Service Window Tracking
    serviceWin: null,

    currentLang: 'gr-en',
    activeWindowLang: 'gr-en',

    serviceCode: 'vl',

    // 2. Service Launch & Configuration
    serviceDatePicker: "",
    jurisdictionSelect: "goa", // Matches the default <option value="goa"> in HTML
    eparchySelect: "",

    extractedParishNames: "",

    // 3. Celebrant Options
    liOptDeacon: true, // Matches 'checked' attribute in HTML
    liOptConcelebration: false,

    // 4. Parish Details
    parishSelect: "",

    // Dismissal Overrides
    clientGrUsGoaLocalpatronsaint1Dismissal: "",
    clientEnUsGoaLocalpatronsaint1Dismissal: "",
    clientGrUsGoaLocalpatronsaint1Supplication: "",
    clientEnUsGoaLocalpatronsaint1Supplication: "",

    // 5. Content Toggles (start as the service is published)
    veOptVesperalPrayers: false,
    veOptAnoixantaria: false,
    veOptStichologia: true,
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
const liOptConcelebration = document.getElementById('li_opt_concelebration');
const veOptVesperalPrayers = document.getElementById('ve_opt_vesperal_prayers');
const veOptAnoixantaria = document.getElementById('ve_opt_anoixantaria');
const veOptStichologia = document.getElementById('ve_opt_stichologia');
const liOptPrecommunionprayers = document.getElementById('li_opt_precommunionprayers');


// True if the service has a place (begin marker) for this part, e.g. 've_entrance'
function vlHas(part) {
    const doc = state.serviceWin && state.serviceWin.document;
    return !!(doc && doc.querySelector(`.brc_${part}`));
}

// Runs the yes / no swap of a part, only if the service has a place for it
function vlSwap(part, on, swapYes, swapNo) {
    if (vlHas(part)) (on ? swapYes : swapNo)();
}

// Called when the panel opens (SB_PANEL.onOpen): no place in the service, no option
function vlShowOptionsForDay() {
    const show = (id, visible) => {
        const option = document.getElementById(id);
        if (option) option.style.display = visible ? '' : 'none';
    };
    show('vl_vesperal_prayers_option', vlHas('ve_vesperal_prayers'));
    show('vl_anoixantaria_option', vlHas('ve_vespers_introductory_psalm'));
    show('vl_stichologia_option', ['ve_stichologia_for_6', 've_stichologia_for_8', 've_stichologia_for_10'].some(vlHas));
    show('vl_precommunion_option', vlHas('li_precommunion_prayers'));
}


function applyChanges() {
    state.eparchySelect = eparchySelect.value;
    state.parishSelect = parishSelect.value;

    state.liOptDeacon = liOptDeacon.checked;
    state.liOptConcelebration = liOptConcelebration.checked;
    state.veOptVesperalPrayers = veOptVesperalPrayers.checked;
    state.veOptAnoixantaria = veOptAnoixantaria.checked;
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

        // Vespers options
        vlSwap('ve_vesperal_prayers', state.veOptVesperalPrayers, swapVesperalPrayersYes, swapVesperalPrayersNo);
        vlSwap('ve_vespers_introductory_psalm', state.veOptAnoixantaria, swapVespersAnoixantariaYes, swapVespersAnoixantariaNo);
        vlSwap('ve_stichologia_for_6', state.veOptStichologia, swapVespersStichologiaFor6, swapVespersStichologiaFor6No);
        vlSwap('ve_stichologia_for_8', state.veOptStichologia, swapVespersStichologiaFor8, swapVespersStichologiaFor8No);
        vlSwap('ve_stichologia_for_10', state.veOptStichologia, swapVespersStichologiaFor10, swapVespersStichologiaFor10No);

        // Liturgy option
        vlSwap('li_precommunion_prayers', state.liOptPrecommunionprayers, swapPrecommunionPrayersOn, swapPrecommunionPrayersOff);

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

        handleConcelebrationCheckbox();

        // Deacon (common-utilities.js); the opening exchange is swapped only if the service has it
        if (vlHas('li_enarxis')) {
            handleDeaconCheckbox();
        } else {
            handleConsecrationDeaconCheckbox();
        }

    } catch (error) {
        console.error("Failed to safely update serviceWinChild window DOM:", error);
    }
}


// Concelebration: the Vespers entrance, the Trisagion (whichever the day has), ac.sb.PrCl
function handleConcelebrationCheckbox() {
    const on = state.liOptConcelebration;
    vlSwap('ve_entrance', on, swapVespersConcelebrationEntrance, swapVespersEntrance);
    vlSwap('li_trisagion_holygod', on, swapTrisagionHolygodConcelebration, swapTrisagionHolygod);
    vlSwap('li_trisagion_baptized', on, swapTrisagionBaptizedConcelebration, swapTrisagionBaptized);
    vlSwap('li_trisagion_cross', on, swapTrisagionCrossConcelebration, swapTrisagionCross);

    const actor = actorMapping['ac.sb.PrCl'];
    switchActor('ac.sb.PrCl', on ? actor.alten : actor.defen, on ? actor.altgr : actor.defgr);
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
