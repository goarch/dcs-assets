/**
 * sb-embed.js: runs a Service Builder panel page (e.g. sb-panel-liturgy.html)
 * inside the buildMode overlay frame of a DCS service page.
 *
 * In the standalone Service Builder app, the panel opens the service in a new
 * window (state.serviceWin). Here the service is the page that contains the
 * frame, so that page becomes state.serviceWin, and the date and language
 * come from its address.
 *
 * Load this BEFORE the Service Builder scripts: service-builder-liturgy.js reads
 * the language radio as soon as it loads, and common-utilities.js starts loading
 * the parish lists from SB_JSON_PATH as soon as it loads.
 *
 * Each panel page can describe itself in window.SB_PANEL (an inline script
 * before this file), e.g.:
 *   var SB_PANEL = {
 *     id: 'hli',                           // this panel's id in BUILD_PANEL_PAGES (alwb.js)
 *     sources: ['lit', 'ord'],             // source texts to load (default ['lit'])
 *     datedSources: ['li'],                // that day's services to load (fetchDatedSourceHTML)
 *     optionalSources: ['ve2'],            // may not exist on every day: not reported as problems
 *     onOpen: function () { ... },         // runs once everything is loaded (may be async)
 *     canApply: function () { return ...; }, // false while required choices are missing
 *     needsMessage: 'Choose a Metropolis first',
 *     ignoreChoices: '#relicList input'    // inputs that don't count as choices of their own
 *   };
 * The other panels this service can switch to come from alwb.js (getBuildPanelChoices).
 */

var SB_PANEL_SETTINGS = window.SB_PANEL || {};
var SB_SOURCE_NAMES = { lit: 'Liturgy', ord: 'Ordination', cli: 'Consecration', mat: 'Matins', ves: 'Vespers', li: "day's Liturgy",
  li2: "day's Antiphons (li2)", li3: "day's Typika and Beatitudes (li3)" };

// Parish list folder in the DCS site (the standalone app uses './js/JSON/')
var SB_JSON_PATH = 'js/sb/JSON/';

var sbHostWindow = (window.parent && window.parent !== window) ? window.parent : null;

// e.g. /goa/dcs/h/s/2026/09/30/li3/gr-en/index.html
var sbHostService = (function () {
  if (!sbHostWindow) return null;
  var path = sbHostWindow.location.pathname;
  var match = path.match(/\/h\/s\/(\d{4})\/(\d{2})\/(\d{2})\/([a-z]+\d*)\/([a-z-]+)\//i);
  if (!match) return null;
  return {
    date: match[1] + '-' + match[2] + '-' + match[3],
    serviceCode: match[4].toLowerCase(),
    lang: match[5].toLowerCase(),
    // DCS site root of the service page, e.g. https://dcs.goarch.org/goa/dcs/
    siteRoot: sbHostWindow.location.origin + path.slice(0, match.index + 1)
  };
})();

// The Service Builder fetches its source texts from the live site
// (https://dcs.goarch.org/goa/dcs/...). Fetch them from the same site as the
// service page instead, so staging and test copies work too (and the browser
// doesn't block the request as cross-site).
var SB_LIVE_SITE_ROOT = 'https://dcs.goarch.org/goa/dcs/';
if (sbHostService && sbHostService.siteRoot !== SB_LIVE_SITE_ROOT) {
  var sbOriginalFetch = window.fetch.bind(window);
  window.fetch = function (resource, options) {
    if (typeof resource === 'string' && resource.indexOf(SB_LIVE_SITE_ROOT) === 0) {
      resource = sbHostService.siteRoot + resource.slice(SB_LIVE_SITE_ROOT.length);
    }
    return sbOriginalFetch(resource, options);
  };
}

/*
 * The swap and export functions exist once, in js/lib/alwb.js on the service
 * page. These two connectors keep the Service Builder's calls working
 * (executeContentSwap(key) in sb-swap-mapping.js, performUnifiedExport(format)
 * in common-utilities.js) by calling the service page's copies.
 */
function executeContentSwap(key) {
  if (!state.serviceWin || state.serviceWin.closed) return;
  var sourceHTML = {
    lit: state.fetchedHTMLContentLit,
    ord: state.fetchedHTMLContentOrd,
    cli: state.fetchedHTMLContentCli,
    li: state.fetchedHTMLContentLi,
    mat: state.fetchedHTMLContentMat,
    ves: state.fetchedHTMLContentVes,
    ve2: state.fetchedHTMLContentVe2,
    li2: state.fetchedHTMLContentLi2,
    li3: state.fetchedHTMLContentLi3
  }[key && key.sourceDoc];
  return state.serviceWin.executeContentSwap(key, sourceHTML, state.serviceWin.document);
}

function performUnifiedExport(format) {
  if (!state.serviceWin || state.serviceWin.closed) return;
  return state.serviceWin.performUnifiedExport(format);
}

// Set the (hidden) date and language controls to match the service page
if (sbHostService) {
  var sbDatePicker = document.getElementById('service-date-picker');
  if (sbDatePicker) sbDatePicker.value = sbHostService.date;
  var sbLangRadio = document.querySelector('input[name="serviceLanguage"][value="' + sbHostService.lang + '"]');
  if (sbLangRadio) sbLangRadio.checked = true;
}

/**
 * Matins panels: when a Matins page loads, alwb.js inserts the Matins Ordinary
 * (including the Twelve Matins Prayers). The standalone app opens the service
 * without it, so its "Matins Ordinary" / "Twelve Matins Prayers" options start
 * unticked. Here they start matching the page, so the first Apply does not
 * remove the Ordinary the user is already looking at.
 */
async function sbSyncMatinsOrdinaryOptions() {
  if (!sbHostWindow) return;
  try {
    await sbHostWindow.matinsOrdinaryReady;
  } catch (error) { /* the page reports its own errors */ }
  var inserted = !!sbHostWindow.matinsOrdinaryInserted;
  ['ma_opt_matins_ordinary', 'ma_opt_matins_prayers'].forEach(function (id) {
    var box = document.getElementById(id);
    if (box) box.checked = inserted;
  });
}

/**
 * Pre-Communion Prayers: the option starts matching the page, so leaving it as
 * it is changes nothing. Published Liturgy, Presanctified and Vesperal Liturgy
 * pages include the prayers (ticked); the Hierarchical and Consecration
 * conversions remove them when their panel opens (unticked).
 */
function sbSyncPrecommunionOption() {
  var box = document.getElementById('li_opt_precommunionprayers');
  if (!box || !sbHostWindow) return;
  var doc = sbHostWindow.document;
  var begin = doc.querySelector('.brc_li_precommunion_prayers');
  var end = doc.querySelector('.erc_li_precommunion_prayers');
  var beginRow = begin && begin.closest('tr');
  var endRow = end && end.closest('tr');
  if (!beginRow || !endRow) return;
  box.checked = beginRow.nextElementSibling !== endRow;
}

// Shows a message at the top of the panel (problems in red)
function sbShowStatus(message, isError) {
  var status = document.getElementById('sb-embed-status');
  if (!status) {
    status = document.createElement('div');
    status.id = 'sb-embed-status';
    status.style.cssText = 'margin: 10px 20px; font-weight: bold;';
    document.body.insertBefore(status, document.body.firstChild);
  }
  status.style.color = isError ? '#b30000' : '#333';
  status.textContent = message;
  status.style.display = message ? 'block' : 'none';
}

/*
 * Apply Changes / Return to service
 *  - "Apply Changes" is active only when the panel's choices differ from the
 *    ones last applied to the service (or, before any Apply, from the choices
 *    the panel opened with). It applies them and the panel stays open, so the
 *    user can go on to export or print.
 *  - "Return to service" (in alwb.js) applies any pending changes first, then
 *    closes the panel, so choices are never lost by forgetting to Apply.
 *  - The Word / PDF buttons already apply pending changes before exporting.
 */
var sbReady = false;
var sbAppliedChoices = null;   // snapshot of the choices currently applied to the service
var sbHasApplied = false;

// Current state of every choice in the panel (the hidden date/language never change)
function sbPanelChoices() {
  var parts = [];
  document.querySelectorAll('main input, main select').forEach(function (el) {
    if (el.id === 'service-date-picker' || el.name === 'serviceLanguage') return;
    if (SB_PANEL_SETTINGS.ignoreChoices && el.matches(SB_PANEL_SETTINGS.ignoreChoices)) return;
    parts.push((el.id || el.name) + '=' + ((el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value));
  });
  return parts.join('|');
}

function sbHasPendingChanges() {
  return sbReady && sbAppliedChoices !== null && sbPanelChoices() !== sbAppliedChoices;
}

// False while choices this panel requires are missing (e.g. no Metropolis yet)
function sbCanApply() {
  return typeof SB_PANEL_SETTINGS.canApply !== 'function' || !!SB_PANEL_SETTINGS.canApply();
}

// Replaces common-utilities.js's updateButtonUIState() for the embedded panel
// (it is called from there after every click or input in the panel)
function sbUpdateApplyButton() {
  var applyButton = document.getElementById('btn-view-preview');
  var pending = sbHasPendingChanges();
  var canApply = sbCanApply();
  if (applyButton) {
    if (!sbReady) {
      applyButton.disabled = true;
      applyButton.textContent = 'Loading…';
    } else if (pending && !canApply) {
      applyButton.disabled = true;
      applyButton.textContent = SB_PANEL_SETTINGS.needsMessage || 'Apply Changes';
    } else {
      applyButton.disabled = !pending;
      applyButton.textContent = (pending || !sbHasApplied) ? 'Apply Changes' : 'Changes Applied';
    }
  }
  // Let the overlay's "Return to service" link say whether it will apply changes
  if (sbHostWindow && typeof sbHostWindow.setBuildPanelPending === 'function') {
    sbHostWindow.setBuildPanelPending(pending && canApply);
  }
}

// Called by alwb.js before the panel closes ("Return to service" / menu list button)
async function sbApplyPendingChanges() {
  if (sbHasPendingChanges() && sbCanApply()) {
    await handlePreviewOrUpdate();
  }
}

// Switch buttons: reload the service as published with another panel open
function sbSwitchPanel(panelId) {
  if (!sbHostWindow || typeof sbHostWindow.switchBuildPanel !== 'function') return;
  if ((sbHasApplied || sbHasPendingChanges()) &&
    !confirm('Switching reloads the service as published. The changes made in this panel will be discarded. Continue?')) {
    return;
  }
  sbHostWindow.switchBuildPanel(panelId);
}

// A row of buttons at the top of the panel, one per panel this service offers
// (e.g. Standard | Hierarchical | Consecration), the current one highlighted
function sbAddSwitchButtons() {
  if (!sbHostWindow || typeof sbHostWindow.getBuildPanelChoices !== 'function') return;
  var choices = sbHostWindow.getBuildPanelChoices();
  var main = document.querySelector('main');
  if (!main || !choices || choices.length < 2 || document.getElementById('sb-switch-panels')) return;

  var section = document.createElement('div');
  section.className = 'sb-section';
  section.id = 'sb-switch-panels';
  var label = document.createElement('label');
  label.className = 'input-label';
  label.textContent = SB_PANEL_SETTINGS.switchLabel || 'Type of service';
  section.appendChild(label);

  var row = document.createElement('div');
  row.style.cssText = 'display: flex; gap: 6px; margin-bottom: 15px;';
  choices.forEach(function (choice) {
    var isCurrent = choice.id === SB_PANEL_SETTINGS.id;
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = choice.label;
    button.title = isCurrent ? 'Current: ' + choice.title : 'Switch to ' + choice.title;
    button.disabled = isCurrent;
    button.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    button.style.cssText = 'flex: 1; padding: 10px 6px; border-radius: 4px; font-weight: bold; font-size: 14px;' +
      (isCurrent ? 'background: #a91827; color: #fff; border: 1px solid #a91827; cursor: default;'
        : 'background: #fff; color: #a91827; border: 1px solid #a91827; cursor: pointer;');
    if (!isCurrent) button.addEventListener('click', function () { sbSwitchPanel(choice.id); });
    row.appendChild(button);
  });
  section.appendChild(row);
  main.insertBefore(section, main.firstChild);
}

// Runs after all the Service Builder scripts have loaded
document.addEventListener('DOMContentLoaded', async function () {
  var applyButton = document.getElementById('btn-view-preview');

  if (!sbHostService) {
    if (applyButton) applyButton.textContent = 'Open this panel from a service page';
    sbShowStatus('This panel only works when opened from a service page.', true);
    return;
  }

  // Use this panel's Apply button behavior instead of the standalone app's
  updateButtonUIState = sbUpdateApplyButton;

  // Remember the choices each time they are applied (Apply Changes, export, Return)
  var serviceBuilderApply = applyChanges;
  applyChanges = function () {
    // Required choices missing (e.g. no Metropolis): leave the service as it is
    // (exports still work, with the service as currently shown)
    if (!sbCanApply()) return;
    serviceBuilderApply();
    // Swapped-in rows show both languages: keep the page's G / E view
    if (typeof sbHostWindow.reapplyLanguageView === 'function') sbHostWindow.reapplyLanguageView();
    sbAppliedChoices = sbPanelChoices();
    sbHasApplied = true;
  };

  // The service page itself is the "service window"
  state.serviceWin = sbHostWindow;
  state.serviceCode = sbHostService.serviceCode;
  state.serviceDatePicker = sbHostService.date;
  state.currentLang = sbHostService.lang;
  state.activeWindowLang = sbHostService.lang;

  sbAddSwitchButtons();
  sbShowStatus('Loading the service texts and parish lists…', false);

  // Same preparation launchService() does after opening its window,
  // plus waiting for the parish lists started by common-utilities.js
  var sources = SB_PANEL_SETTINGS.sources || ['lit'];
  var datedSources = SB_PANEL_SETTINGS.datedSources || [];
  await Promise.all(
    sources.map(function (type) { return fetchSourceHTML(type); })
      .concat(datedSources.map(function (type) { return fetchDatedSourceHTML(type); }))
      .concat([parishListsLoaded]));

  var problems = [];
  var dateParts = sbHostService.date.split('-');
  var optionalSources = SB_PANEL_SETTINGS.optionalSources || [];
  sources.concat(datedSources).forEach(function (type) {
    if (optionalSources.indexOf(type) !== -1) return;
    var html = state['fetchedHTMLContent' + type.charAt(0).toUpperCase() + type.slice(1)];
    if (!html || html.indexOf('Error loading target template asset') !== -1) {
      var address = datedSources.indexOf(type) !== -1
        ? 'h/s/' + dateParts.join('/') + '/' + type + '/' + state.currentLang + '/index.html'
        : 'h/b/sb/' + type + '/' + state.currentLang + '/index.html';
      problems.push('The ' + (SB_SOURCE_NAMES[type] || type) + ' source text could not be loaded (' +
        sbHostService.siteRoot + address + '), so the options cannot be applied.');
    }
  });
  if (fullParishList.length === 0) {
    problems.push('The parish lists could not be loaded (' + sbHostService.siteRoot + SB_JSON_PATH + ').');
  }

  // Panel-specific preparation of the service (e.g. converting it to hierarchical)
  if (problems.length === 0 && typeof SB_PANEL_SETTINGS.onOpen === 'function') {
    try {
      await SB_PANEL_SETTINGS.onOpen();
    } catch (error) {
      console.error('[sb-embed] Preparing the service failed:', error);
      problems.push('The service could not be prepared for this panel.');
    }
    if (typeof sbHostWindow.reapplyLanguageView === 'function') sbHostWindow.reapplyLanguageView();
  }

  var parishElements = sbHostWindow.document.querySelectorAll('.sbparishname');
  state.extractedParishNames = Array.from(parishElements).map(function (el) {
    return el.textContent.trim();
  }).join(' ');

  // A Metropolis chosen while the lists were still loading got an empty Parish list
  var eparchySelectEl = document.getElementById('eparchy-select');
  if (eparchySelectEl && eparchySelectEl.value) populateParishDropdown();

  sbShowStatus(problems.join(' '), problems.length > 0);

  // After onOpen (e.g. the Hierarchical conversion), before the snapshot below
  sbSyncPrecommunionOption();

  // Nothing has been changed yet: the service is as published
  sbAppliedChoices = sbPanelChoices();
  sbReady = true;
  sbUpdateApplyButton();
});
