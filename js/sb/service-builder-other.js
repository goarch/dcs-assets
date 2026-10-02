/**
 * Service Builder: services that need little or no customization
 * (sb-panel-other.html, for mo / mo# and co / co# services).
 *
 * The only choices are the Metropolis and Parish: applying them fills in the
 * hierarch's names (the Metropolis' data keys) and the parish's dismissal and
 * supplication wherever the service has a place for them. Without those lists
 * (e.g. a page with export buttons only) Apply simply does nothing.
 *
 * Replaces service-builder-liturgy.js, which sb-other.html used: that script
 * expects the Liturgy options and fails without them.
 */

/**
 * Application State - The Single Source of Truth
 */
const state = {
    // 1. Service Window Tracking
    serviceWin: null,

    serviceCode: 'mo',

    currentLang: 'gr-en',
    activeWindowLang: 'gr-en',

    // 2. Service Launch & Configuration
    serviceDatePicker: "",
    jurisdictionSelect: "goa", // Matches the default <option value="goa"> in HTML
    eparchySelect: "",

    extractedParishNames: "",

    // 3. Parish Details
    parishSelect: "",

    // Dismissal Overrides
    clientGrUsGoaLocalpatronsaint1Dismissal: "",
    clientEnUsGoaLocalpatronsaint1Dismissal: "",
    clientGrUsGoaLocalpatronsaint1Supplication: "",
    clientEnUsGoaLocalpatronsaint1Supplication: "",

    // 4. Global Document Source Representation Cache
    fetchedHTMLContentLit: ""
};

// Cache Control UI Elements (the Export panel has none of these)
const serviceDatePicker = document.getElementById('service-date-picker');
const eparchySelect = document.getElementById('eparchy-select');
const parishSelect = document.getElementById('parish-select');


function applyChanges() {
    state.eparchySelect = eparchySelect ? eparchySelect.value : "";
    state.parishSelect = parishSelect ? parishSelect.value : "";

    const parish = state.parishSelect && typeof parishData !== 'undefined' ? parishData[state.parishSelect] : null;
    if (parish && parish.keys) {
        state.clientEnUsGoaLocalpatronsaint1Dismissal = parish.keys['client_en_US_goa|cl.localpatronsaint1.dismissal'] || "";
        state.clientGrUsGoaLocalpatronsaint1Dismissal = parish.keys['client_gr_US_goa|cl.localpatronsaint1.dismissal'] || "";
        state.clientEnUsGoaLocalpatronsaint1Supplication = parish.keys['client_en_US_goa|cl.localpatronsaint1.supplication'] || "";
        state.clientGrUsGoaLocalpatronsaint1Supplication = parish.keys['client_gr_US_goa|cl.localpatronsaint1.supplication'] || "";
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

        const updateIfExists = (key, textValue) => {
            serviceWinDoc.querySelectorAll(`[data-key='${CSS.escape(key)}']`).forEach(element => {
                element.textContent = textValue;
            });
        };

        // Metropolis: all of its data keys (hierarch's names and titles)
        if (state.eparchySelect && typeof dioceseData !== 'undefined' && dioceseData[state.eparchySelect]) {
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
    } catch (error) {
        console.error("Failed to safely update serviceWinChild window DOM:", error);
    }
}


/**
 * Standalone Service Builder app: opens the service in its own window.
 * (In the DCS website the service page itself is the service window.)
 */
function launchService(lang) {
    return new Promise((resolve) => {
        state.serviceDatePicker = serviceDatePicker ? serviceDatePicker.value : "";

        if (!state.serviceDatePicker) {
            alert("Please select a date.");
            return;
        }

        if (state.serviceWin && !state.serviceWin.closed) {
            state.serviceWin.focus();
            resolve();
            return;
        }

        state.currentLang = lang;
        state.activeWindowLang = lang;

        const [year, month, day] = state.serviceDatePicker.split('-');
        const targetUrl = `https://dcs.goarch.org/goa/dcs/h/s/${year}/${month}/${day}/${state.serviceCode}/${state.currentLang}/index.html`;

        const pLeft = window.screenX || window.screenLeft;
        const pTop = window.screenY || window.screenTop;
        const features = `height=${window.outerHeight},width=650,top=${pTop},left=${pLeft + 500},resizable=yes,scrollbars=yes`;

        state.serviceWin = window.open(targetUrl, '_blank', features);
        state.serviceWin.addEventListener('load', () => {
            applyChanges();
            resolve();
        }, { once: true });
    });
}


if (parishSelect) {
    parishSelect.addEventListener('change', () => {
        state.parishSelect = parishSelect.value;
    });
}

if (eparchySelect) {
    eparchySelect.addEventListener('change', () => {
        populateParishDropdown(); // common-utilities.js
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateEparchyDropdown(); // common-utilities.js (does nothing without the Metropolis list)
    openServiceWinFromDCS();
});
