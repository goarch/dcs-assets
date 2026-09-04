var resized = false;
var originalFontSize;
var adjustedFontSize;
var elements;
var alertShown = false;
var maxWidth = screen.width;
var viewport = document.getElementsByName('viewport')[0];
var bilingual = (($(".leftCell").length > 0) && ($(".RightCell").length > 0));
var displayingBilingual = true;
var indexPage = false;
var lang1;
var lang2;
var lang1IsGreek = false;
var lang2IsGreek = false;
var dayBackgroundColor;
var dayFontColor;
var dayMenuIconColor;
var dayMenuBarColor;
var redElements;


var isMobile = {
  Android: function () {
    return (navigator.userAgent.match(/Android/i) != null);
  },
  AndroidPhone: function () {
    return (
      (navigator.userAgent.match(/Android/i) != null)
      && (navigator.userAgent.match(/Mobile/i) != null)
    );
  },
  BlackBerry: function () {
    return (navigator.userAgent.match(/BlackBerry/i) != null);
  },
  iOS: function () {
    return (navigator.userAgent.match(/iPhone|iPad|iPod/i) != null);
  },
  iPhone: function () {
    return (navigator.userAgent.match(/iPhone/i) != null);
  },
  iPad: function () {
    return (navigator.userAgent.match(/iPad/i) != null);
  },
  iPod: function () {
    return (navigator.userAgent.match(/iPod/i) != null);
  },
  Opera: function () {
    return (navigator.userAgent.match(/Opera Mini/i) != null);
  },
  Windows: function () {
    return (navigator.userAgent.match(/IEMobile/i) != null);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

if (typeof alwbTooltips != 'undefined') {
  $(".tip-audio1").attr("title", alwbTooltips.l1.Audio);
  $(".tip-byzantine1").attr("title", alwbTooltips.l1.Byzantine);
  $(".tip-western1").attr("title", alwbTooltips.l1.Western);
  $(".tip-audio2").attr("title", alwbTooltips.l2.Audio);
  $(".tip-byzantine2").attr("title", alwbTooltips.l2.Byzantine);
  $(".tip-western2").attr("title", alwbTooltips.l2.Western);
}

function swapLang(myRow) {
  $(myRow.cells).toggle();
}

function stopSwap(myRow) {
  $("tr:has(.media-group)").removeAttr("onclick", "swapLang(this)");
}

function resumeSwap(myRow) {
  $("tr:has(.media-group)").attr("onclick", "swapLang(this)");
}

function hideAllLeft() {
  $("td").css("display", "");
  $("div.media-group-empty").css("display", "");
  $("div.media-group-empty").addClass("m-g-e");
  $("tr:has(p.alttext,p.chant,p.heirmos,p.hymn,p.hymnlinefirst,p.hymnlinemiddle,p.hymnlinelast,p.prayer,p.prayerzero,p.verse,p.versecenter,p.inaudible,p.dialog,p.dialogzero,p.reading,p.readingzero,p.readingcenter,p.readingcenterzero,p.rubric,.media-group,.dialogafteractor,p.iambiccanon1,p.iambiccanon234,p.iambiccanon5)").attr("onclick", "swapLang(this)");
  $(".media-icon,i,li").attr("onmousedown", "stopSwap(this)");
  $(".media-icon,i,li").attr("onmouseout", "resumeSwap(this)");
  $("td:even").css("background-color", "#FFF7E6");
  $("td:even").css("display", "none");
  $("td").css("border", "0");

  // Added
  $('.fa-columns.ages-col-picker').show();
  $('.fa-caret-square-o-right.ages-col-picker').hide();
  $('.fa-caret-square-o-left.ages-col-picker').show();

  displayingBilingual = false;
}

function hideAllRight() {
  $("td").css("display", "");
  $("div.media-group-empty").css("display", "");
  $("div.media-group-empty").addClass("m-g-e");
  $("tr:has(p.alttext,p.chant,p.heirmos,p.hymn,p.hymnlinefirst,p.hymnlinemiddle,p.hymnlinelast,p.prayer,p.prayerzero,p.verse,p.versecenter,p.inaudible,p.dialog,p.dialogzero,p.reading,p.readingzero,p.readingcenter,p.readingcenterzero,p.rubric,.media-group,.dialogafteractor,p.iambiccanon1,p.iambiccanon234,p.iambiccanon5)").attr("onclick", "swapLang(this)");
  $(".media-icon,i,li").attr("onmousedown", "stopSwap(this)");
  $(".media-icon,i,li").attr("onmouseout", "resumeSwap(this)");
  $("td:even").css("background-color", "#FFF7E6");
  $("td:odd").css("display", "none");
  $("td").css("border", "0");

  // Added
  $('.fa-columns.ages-col-picker').show();
  $('.fa-caret-square-o-left.ages-col-picker').hide();
  $('.fa-caret-square-o-right.ages-col-picker').show();

  displayingBilingual = false;
}

function editTextIndex() {
  $(document).ready(function () {
    $.ajax({
      url: "indexmodifier.json",
      success: function (data) {
        $.each(data, function (index, value) {
          try {
            var type = $("a.index-file-link").attr("href");
            var newType =
              type.substring(4, 8) +
              type.substring(9, 11) +
              type.substring(12, 14);

            if (newType.includes(index)) {
              var x = document.getElementsByClassName("index-service-day");

              $.each(value, function (i, v) {
                for (var i = 0; i < x.length; i++) {
                  console.log(x[i].textContent);
                  if (x[i].textContent == v.prevText && newType == index) {
                    x[i].innerHTML = v.altText;
                  }
                }
              });
            }
          } catch (e) { }
        });
      }
    });
  });
}

editTextIndex();

function showAll() {
  $("div.media-group-empty").css("display", "none");
  $("tr").removeAttr("onclick");
  $(".media-icon,i,li").removeAttr("onmousedown", "stopSwap(this)");
  $(".media-icon,i,li").removeAttr("onmouseout", "resumeSwap(this)");
  $("td").css("display", "");
  $("td").css("border", "");
  $("td:even").css("background-color", "#FBF0D9");

  // Added
  $('.fa-columns.ages-col-picker').hide();
  $('.fa-caret-square-o-left.ages-col-picker').show();
  $('.fa-caret-square-o-right.ages-col-picker').show();

  displayingBilingual = true;
}

$.expr[':'].notext = function detectNoText(x) { return x.innerHTML && x.innerHTML.replace(/(<!--.*(?!-->))|\s+/g, '').length === 0 }

function notAvailable() {
  $('p.hymn:has(span.dummy)').removeClass("hymn").addClass("notavailable").text("This text was inaccessible at the time of publication or unavailable due to copyright restrictions.").css("background-color", "white");
}

$.expr[':'].noValue = function detectNoValue(x) {
  if ($(x).find("div.media-group").length > 0) {
    return false;
  } else if ($(x).text().trim().length === 0) {
    return true;
  } else {
    return false;
  }
};

function hideEmptyRows() {
  $("tr:noValue").css("display", "none");
}


function setViewPort() {
  viewport.setAttribute('content', 'width = ' + screen.width + ', user-scalable=yes');
}

function getLanguages() {
  return $("title").data("language");
}

function setLangVars() {
  if (indexPage) {
    lang1IsGreek = false;
    lang2IsGreek = false;
    bilingual = false;
  } else {
    var langs = getLanguages();
    if (langs.indexOf("-") > -1) {
      var parts = langs.split("-");
      lang1 = parts[0];
      if (parts.length > 0) {
        lang2 = parts[1];
      } else {
        lang2 = "";
      }
      lang1IsGreek = (lang1.indexOf("Greek") > -1);
      lang2IsGreek = (lang2.indexOf("Greek") > -1);
    } else {
      lang1 = langs;
      lang1IsGreek = (lang1.indexOf("Greek") > -1);
      lang2 = "";
    }
  }
}

function showInfo() {
  alert(
    "Device=" + navigator.userAgent
    + "\nscreen.height=" + screen.height
    + "\nscreen.width=" + screen.width
    + '\nwindow.height=' + jQuery(window).height()
    + " \nwindow.width=" + jQuery(window).width()
  );
}


function getClock() {
  d = new Date();
  nhour = d.getHours();
  nmin = d.getMinutes();
  if (nhour == 0) {
    ap = " AM";
    nhour = 12;
  } else if (nhour <= 11) {
    ap = " AM";
  } else if (nhour == 12) {
    ap = " PM";
  } else if (nhour >= 13) {
    ap = " PM";
    nhour -= 12;
  }
  if (nmin <= 9) {
    nmin = "0" + nmin;
  }
  $('#clockbox').text(nhour + ":" + nmin + ap);
  setTimeout("getClock()", 1000);
};

$(window).bind("load", function () {
  $("span.media-icon").attr("title", "Open Lang 2 Western");
  $("span.media-icon-audio").attr("title", "Open Lang 2 Audio");
  $('.content').css('top', parseInt($('.navbar').css("height")) + 10);
  $('#accordion').on('show.bs.collapse', function () {
    if (active) $('#accordion .in').collapse('hide');
  });
  $('body').on('touchstart.dropdown', '.dropdown-menu', function (e) {
    e.stopPropagation();
  });

});

function scaleFont() {
  //	alert(navigator.userAgent);
  var tabletScalerLandscapeAccordion = 1;
  var tabletScalerPortraitAccordion = 1;

  var phoneScalerLandscapeAccordion = 1;
  var phoneScalerPortraitAccordion = 1;

  var tabletScalerLandscape = 1.5;
  var tabletScalerPortrait = 1.5;

  var phoneScalerLandscape = 2.5;
  var phoneScalerPortrait = 3;

  var phoneScalerLandscapeMonolingual = 1.5;
  var phoneScalerPortraitMonolingual = 1.0;

  // Android
  var androidTabletScalerLandscapeAccordion = 1;
  var androidTabletScalerPortraitAccordion = 1;

  var androidPhoneScalerLandscapeAccordion = 1;
  var androidPhoneScalerPortraitAccordion = 1;

  var androidTabletScalerLandscape = 1.2;
  var androidTabletScalerPortrait = 1.5;

  var androidPhoneScalerLandscape = 3.0;
  var androidPhoneScalerPortrait = 3.0;

  var scaler = 1;
  var portrait = (window.innerHeight > window.innerWidth);

  if (isMobile.Android()) {
    if (portrait) {
      scaler = androidPhoneScalerPortrait;
    } else {
      scaler = androidPhoneScalerLandscape;
    }
  } else if (isMobile.iOS()) {
    if (isMobile.iPhone()) {
      $(".navbar-default").css("position", "relative");
      if (portrait) {
        if (displayingBilingual) {
          scaler = phoneScalerPortrait;
        } else {
          scaler = phoneScalerPortraitMonolingual;
        }
      } else {
        if (displayingBilingual) {
          scaler = phoneScalerLandscape;
        } else {
          scaler = phoneScalerLandscapeMonolingual;
        }
      }
    } else if (isMobile.iPad()) {
      if (portrait) {
        scaler = tabletScalerPortrait;
      } else {
        scaler = tabletScalerLandscape;
      }
    }
  } else if (isMobile.any()) {
    if (portrait) {
      scaler = phoneScalerPortrait;
    } else {
      scaler = phoneScalerLandscape;
    }
  }
  adjustedFontSize = elements.css('font-size');
  var adjustedFontSizeNum = parseFloat(adjustedFontSize, 10);
  var newFontSize = adjustedFontSizeNum * scaler;
  $(".content").css('font-size', newFontSize);
  if (isMobile.any()) {
    $("agesMenu").css("padding-top", "15px");
  }
  if (isMobile.AndroidPhone()) {
    $(".index-content").css('font-size', "300%");
    $(".panel-title").css('font-size', "150%");
  }
  resized = true;
  originalFontSize = newFontSize;
  adjustedFontSize = newFontSize;
  resizeNume();
  setViewPort();
  resizeMenuIcons();
  offsetContent();
  return false;
}

function offsetContent() {
  $(".content").css('top', $(".agesMenu").height());
  if (indexPage) {
    $(".index-content").css('top', $(".agesMenu").height() + 15);
  }
}

function resizeNume(size) {
  var byz = $(".byzscore");
  if (byz.length > 0) {
    byz.css('height', adjustedFontSize);
    byz.css('width', adjustedFontSize * 1.3);
  }
}
function setFontTo(size) {
  adjustedFontSize = parseFloat(adjustedFontSize, 10) * size;
  elements.css('font-size', adjustedFontSize);
  //	resizeMenuIcons();
}

function resizeMenuIcons() {
  var menuFont = 25;
  var portrait = (window.innerHeight > window.innerWidth);
  var menuScaler = 1.0;

  if (isMobile.Android()) {
    if (portrait) {
      menuScaler = 2;
    } else {
      menuScaler = 1.5;
    }
  } else if (isMobile.iOS()) {
    if (isMobile.iPhone()) {
      if (indexPage) {
        if (portrait) {
          menuScaler = 1;
        } else {
          menuScaler = .7;
        }
      } else {
        if (displayingBilingual) {
          if (portrait) {
            menuScaler = 3;
          } else {
            menuScaler = 2;
          }
        } else {
          if (portrait) {
            menuScaler = 1.5;
          } else {
            menuScaler = .9;
          }
        }
      }
    } else if (isMobile.iPad()) {
      if (portrait) {
        menuScaler = 1;
      } else {
        menuScaler = .7;
      }
    }
  } else { // desktop
    if (indexPage) {
      if (portrait) {
        menuScaler = .5;
      } else {
        menuScaler = .5;
      }
    } else {
      if (displayingBilingual) {
        if (portrait) {
          menuScaler = .5;
        } else {
          menuScaler = .5;
        }
      } else {
        if (portrait) {
          menuScaler = .5;
        } else {
          menuScaler = .5;
        }
      }
    }
  }
  $("i.ages-menu-link, ul.jqm-dropdown-menu").css("font-size", (menuFont * menuScaler + "pt"));
  offsetContent();
}
$(window).on('resize orientationChanged', function () {
  return false;
});

$(document).ready(function () {
  $('.collapse').collapse();
  adjustedFontSize = $("body").css('font-size');
  dayBackgroundColor = $("body").css('background-color');
  dayFontColor = $("body").css('color');
  dayMenuIconColor = $("i.ages-menu-link").css('color');
  dayMenuBarColor = $("div.agesMenu").css('background-color');
  redElements = $('*').filter(function () { return ($(this).css('color') == "rgb(255, 0, 0)"); });

  /* Remove Content from Dropdown Menu */
  $('div#jqm-dropdown-pages > ul > li:eq(10)').remove(); // help
  $('div#jqm-dropdown-pages > ul > li:eq(9)').remove(); // hr
  $('div#jqm-dropdown-pages > ul > li:eq(8)').remove(); // browser info link
  $('div#jqm-dropdown-pages > ul > li:eq(7)').remove(); // hr
  $('div#jqm-dropdown-pages > ul > li:eq(6)').remove(); // donate link
  // Change Dropdown Menu items
  $('div#jqm-dropdown-pages > ul > li:eq(2)').html('<a href="https://dcs.goarch.org/goa/dcs/parish.html" target="_blank"><i class="fa fa-list-alt">&nbsp;Today\'s Services</i></a>');
  $('div#jqm-dropdown-pages > ul > li:eq(1)').html('<a href="booksindex.html"><i class="fa fa-arrows">&nbsp;Music, Sacraments, Other</i></a>');
  $('div#jqm-dropdown-pages > ul > li:eq(0)').html('<a href="servicesindex.html"><i class="fa fa-calendar">&nbsp;Services Calendar</i></a>'); 

  if (getLanguages()) {
    setLangVars();
  }

  if ($(".panel-group").length > 0) {
    indexPage = true;
  }
  if (isMobile.any()) {
    $(".clockbox").remove();
    $(".agesMenu a .fa").css('font-size', '12pt');
  }

  getClock();
  elements = $(".content");

  // Increase Font Size
  $(".increaseFont").click(function () {
    setFontTo(1.2);
    resizeNume();
    return false;
  });
  // Decrease Font Size
  $(".decreaseFont").click(function () {
    setFontTo(0.8);
    resizeNume();
    return false;
  });

  $('.dayMode').toggle(); // Added

  $(".dayMode").click(function () {
    $("html, body, body *").css('background-color', dayBackgroundColor);
    $("p").css('color', dayFontColor);
    $(redElements).css('color', 'red');
    $("i.ages-menu-link *").css('color', dayMenuIconColor);
    $("div.agesMenu, div.agesMenu *").css('background-color', dayMenuBarColor);

    $('.dayMode').toggle(); // Added
    $('.nightMode').toggle(); // Added

    return false;
  });

  $(".nightMode").click(function () {
    $("html, body, body *").css('background-color', 'black');
    $("p").css('color', '#FBF0D9');
    $(redElements).css('color', 'red');
    $("i.ages-menu-link *").css('color', dayMenuIconColor);
    $("div.agesMenu, div.agesMenu *").css('background-color', dayMenuBarColor);

    $('.dayMode').toggle(); // Added
    $('.nightMode').toggle(); // Added

    return false;
  });


  if ($('title').data('language')) {
    var lang_array = $('title').data('language').split('-');
    if (lang_array.length == 2) {
      if (displayingBilingual) {
        $('.fa-columns.ages-col-picker').hide();
      }
    }
  }

  $.fn.visible = function () {
    return this.css('visibility', 'visible');
  };

  $.fn.invisible = function () {
    return this.css('visibility', 'hidden');
  };

  $.fn.visibilityToggle = function () {
    return this.css('visibility', function (i, visibility) {
      return (visibility == 'visible') ? 'hidden' : 'visible';
    });
  };

  $(".versionMode").click(function () {
    $("span.versiondesignation").visibilityToggle();
    $("p.source").visibilityToggle();
    $("p.source0").visibilityToggle();
    return false;
  });

  /*******************
  // --- 1. Core Scrolling Function ---
  /**
   * NOTE: The function 'scrollToTop()' is assumed to be defined elsewhere in this same file.
   * We are removing its definition here to prevent duplication, but the call in setupTopModeButtonListener 
   * will work because it is available in the global scope (or module scope if using modules).
   */


  // --- 2. Button Insertion Function (Simplified) ---
  /**
   * Inserts the 'topMode' button immediately after the element with the class 'versionMode'.
   */
  function insertTopModeButton() {
    // Find the existing element to insert after.
    const existingElement = document.querySelector('.versionMode');

    // Define the HTML for the new button, now including the 'title' attribute for the hover tooltip.
    const newButtonHTML = `
        <a href="#" class="topMode" title="Scroll to Top">
            <i class="fa fa-arrow-up topMode ages-menu-link"></i>
        </a>
    `;

    // Insert the new HTML after the existing element, if found.
    if (existingElement) {
      existingElement.insertAdjacentHTML('afterend', newButtonHTML.trim());
    }
  }
  // --- 3. Setup and Event Listener Binding ---
  /**
   * Finds the newly inserted button and attaches the click event listener 
   * to execute the existing scrollToTop() function.
   */
  function setupTopModeButtonListener() {
    // 1. Call the function to ensure the button is in the DOM.
    insertTopModeButton();

    // 2. Find the new button using its class selector.
    const topButton = document.querySelector('.topMode');

    // 3. Attach the event listener.
    if (topButton) {
      // When clicked, prevent the default anchor action and call the existing scrollToTop() function.
      topButton.addEventListener('click', (event) => {
        event.preventDefault();
        // Call the function that already exists in your script
        scrollToTop();
      });
    }
  }
  // --- Execute Setup (Using 'document ready' pattern) ---
  (function () {
    if (document.readyState === 'loading') {
      // If the document is still loading, wait for the DOMContentLoaded event.
      document.addEventListener('DOMContentLoaded', setupTopModeButtonListener);
    } else {
      // If the script is loaded after the DOM is ready, execute immediately.
      setupTopModeButtonListener();
    }
  })();

  /************************************************ */

  // function setCookie(cname, cvalue, exdays) {
  //     var d = new Date();
  //     d.setTime(d.getTime() + (exdays*24*60*60*1000));
  //     var expires = "expires="+d.toUTCString();
  //     document.cookie = cname + "=" + cvalue + "; " + expires;
  // }
  // function getCookie(cname) {
  //     var name = cname + "=";
  //     var ca = document.cookie.split(';');
  //     for(var i=0; i<ca.length; i++) {
  //         var c = ca[i];
  //         while (c.charAt(0)==' ') c = c.substring(1);
  //         if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  //     }
  //     return "";
  // }
  // show_media = getCookie('showmedialinks');
  // show_media = "block";

  // if (!isMobile.iPad()) {
  //   // $('a.versionMode').after('<a href="#" class="mediaMode"><i class="fa fa-music mediaMode ages-menu-link"></i></a>');
  //   // $('.mediaMode').click(function() {
  //   //   $('.media-group').toggle();
  //   //   var media_val = $('.media-group:first').css('display');
  //   //   setCookie('showmedialinks',media_val,100);
  //   //   return false;
  //   // });	
  //   $('.media-group').toggle();
  //   if (show_media == "none") {
  //     $('.media-group').hide();
  //   } else if(show_media == "block") {
  //     $('.media-group').show();
  //   }
  // }

  // Test to see if this is an extended service file
  if ((window.location.href.indexOf('ma2') >= 0) || (window.location.href.indexOf('MA2') >= 0)) {
    $('body').append('<div class="pref-panel"><h2>Service Preferences</h2></div>')

    $('a.versionMode').after('<a href="#" class="prefMode"><i class="fa fa-list-ul prefMode ages-menu-link"></i></a>');

    // Check for Eothinon Gospel
    var has_eothinon_gospel = false;
    if ($('.bmc_eothinongospel_position1').length > 0) {
      has_eothinon_gospel = true;
    }

    // Determine which canons are present
    var opt_class_list = [];
    var opt_list = [];
    $('[class^="bmc_"]').each(function () {

      var class_name = $(this).attr('class');
      var class_text = $(this).text();
      if (opt_class_list.indexOf(class_name) == -1) {
        opt_class_list.push(class_name);
        opt_list.push({ class: class_name, text: class_text });
      }
    });

    var canon_list = [];
    for (var i = 0; i < opt_class_list.length; i++) {
      var ode1_index = opt_class_list[i].indexOf("ode1_");
      if (ode1_index >= 0) {
        canon_list.push(opt_class_list[i].substr(ode1_index + 5));
      }
    };

    var spacer_text = "<div class='pref-spacer'></div>";

    $(".pref-panel").append("<div class='pref-opts'></div>");
    $(".pref-opts").append("<div class='pref-instructions'><p class='dialog'>" +
      "The pre-selected default preferences will display the Matins service as it is in the regular Matins file. Use this panel to choose which parts of the canon to display, and also the position of the " +
      "Kontakia and Katavasias, and whether or not to display end litanies and dismissal. Certain selections will make others inaccesible, to prevent mistakes. </p><p class='dialog'>There is no longer the option to reposition the Sunday Eothinon Gospel. Only the order used by the EP and GOA is provided.</p>" +
      "<p class='dialog'>Once you have " +
      " selected your preferences, click Apply. You will then be taken to the text of the service. If you want to change " +
      "your preferences, click on the Preferences Button on the right hand corner of the left frame.</p>" +
      "<p>PDF EXPORT AND PRINT</p><p class='dialog'>To print the customized service as it appears in " +
      "your browser in the left frame, after you apply your options, use the print button at the top of the customized service. The iPad app does not yet support printing of the customized text.</p></div>");

    // 1. Append the Apply button
    $(".pref-opts").append('<div class="pref-closer">Apply</div>');

    // 2. Append the Matins Ordinary checkbox immediately after Apply
    var isMatinsChecked = localStorage.getItem("pref_matinsOrdinary") === "true";
    var matinsCheckedAttr = isMatinsChecked ? " checked" : "";

    $(".pref-opts").append(
      spacer_text +
      "<div class='pref-left'><label for='cb-matinsOrdinary'>Matins Ordinary</label></div>" +
      "<div class='pref-right'><input id='cb-matinsOrdinary' type='checkbox'" + matinsCheckedAttr + "></div>"
    );

    var prev_ode = null; var cur_ode = null;
    opt_list.forEach(function (item) {
      var className = item.class;
      var dispText = item.text;
      if (className.indexOf('bmc_eothinongospel_position1') == 0) {
        var gospel_label1 = $('.bmc_eothinongospel_position1:first').text();
        $('.pref-opts').append("<div class='pref-left'><label for='radio-eothinon-1'>" + gospel_label1 + "</label></div>"
          + "<div class='pref-right'><input id='radio-eothinon-1' type='radio' name='radio-eothinon'></div>");
      } else if (className.indexOf('bmc_eothinongospel_position2') == 0) {
        var gospel_label2 = $('.bmc_eothinongospel_position2:first').text();
        $(".pref-opts").append("<div class='pref-left'><label for='radio-eothinon-2'>" + gospel_label2 + "</label></div>"
          + "<div class='pref-right'><input id='radio-eothinon-2' type='radio' name='radio-eothinon'></div>");

      } else if (className.indexOf('bmc_magnificat') == 0) {
        if (className.indexOf('modeofcanon') >= 0) {
          $(".pref-opts").append(spacer_text + "<div class='pref-left'><label for='radio-mag-modeofcanon'>" + dispText + "</label></div>"
            + "<div class='pref-right'><input id='radio-mag-modeofcanon' type='radio' name='radio-magnificat'></div>");
        } else if (className.indexOf('modeokatavasia') >= 0) {
          $(".pref-opts").append(spacer_text + "<div class='pref-left'><label for='radio-mag-katavasia'>" + dispText + "</label></div>"
            + "<div class='pref-right'><input id='radio-mag-katavasia' type='radio' name='radio-magnificat'></div>"
            + spacer_text);
        }
      } else {
        var idx = className.indexOf('ode');
        if (idx > 0) {
          cur_ode = className.slice(idx + 3, idx + 4);
        }
        if ((cur_ode !== prev_ode) || (className.indexOf('litany') >= 0)) {
          $(".pref-opts").append(spacer_text);
        }

        prev_ode = cur_ode;

        if (className.indexOf('matins_end_no_dismissal') >= 0) {
          $hr = $('<hr>').css({ 'border': '1px solid #555', 'width': '80%' });
          $('.pref-opts').append($hr);
        }

        if (className !== 'bmc_matins_dismissal') {
          $('.pref-opts').append(make_checkbox(className, dispText));
        }

        if ((className == "bmc_ode3_litany") ||
          (className == "bmc_ode6_litany") ||
          (className == "bmc_ode8_katavasia")) {
          $(".pref-opts").append(spacer_text);
        }
      }
    });

    function make_checkbox(className, dispText) {
      var cb_id = "cb_" + className.slice(4);
      var out_html = "<div class='pref-left'><label for='" + cb_id + "'>" + dispText + "</label></div>"
        + "<div class='pref-right'><input id='" + cb_id + "' type='checkbox'></div>";
      var $cb = $("<input>", { type: 'checkbox', id: cb_id });
      var $right = $("<div></div>").addClass('pref-right').append($cb);
      var $left = $('<div></div>').addClass('pref-left');
      var $label = $('<label></label>').text(dispText).attr('for', cb_id);
      $left.append($label);
      var $container = $('<div></div>').append($left).append($right);
      return $container;
    }

    $(".pref-opts").append("<div class='pref-closer'>Apply</div>");

    // Add print and services preference links
    if (!isMobile.iPad())
    //  $(".content").prepend('<p class="print-btn"><a href="#" class="print-service"><i class="fa fa-print" title="Print this frame"></i></a></p>');
      $(".content").prepend('<p class="print-btn"><a style="cursor: pointer;" onclick="performUnifiedExport(\'pdf\'); return false;"><i class="fa fa-print" title="Print this frame"></i></a></p>');

    $(".content").prepend('<p class="print-btn"><a href="#" class="prefMode"><i class="fa fa-list-ul prefMode" title="Open service preferences"></i></a></p>');

    // Bind click functions for Eothinon Gospels
    $("#radio-eothinon-1, #radio-eothinon-2").click(function () {
      show_eothinon(this.id.slice(-1));
    });

    // Bind click functions for Kontakion
    $('#cb_kontakion_position1, #cb_kontakion_position2, #cb_kontakion_position12').click(function () {
      var kNum = parseInt(this.id.split('_')[2].slice(8));
      show_kontakion(kNum, this.checked);
      if (kNum == 12) {
        show_kontakion(1, false);
        show_kontakion(2, false);
        $("#cb_kontakion_position1").prop("checked", false);
      } else if ((kNum == 1) || (kNum == 2)) {
        //} else if (kNum == 1) {
        show_kontakion(12, false);
        $("#cb_kontakion_position12").prop("checked", false);
      }
    });

    // Bind click functions for canon odes
    $('[id^="cb_ode"]').click(function () {
      if (this.checked) {
        $('tr:has(p.bmc_' + this.id.slice(3) + ')').nextUntil('tr:has(p.emc_' + this.id.slice(3) + ')').show();
      } else {
        $('tr:has(p.bmc_' + this.id.slice(3) + ')').nextUntil('tr:has(p.emc_' + this.id.slice(3) + ')').hide();
      }

      if (this.id.indexOf('_katavasia') >= 0) {
        var test_katavasia = check_ode_katavasia();
        if (test_katavasia) {
          $('#cb_odes1345678_katavasia').prop('checked', false);
          $('tr:has(p.bmc_odes1345678_katavasia)').nextUntil('tr:has(p.emc_odes1345678_katavasia)').hide();
          $("#cb_odes1345678_katavasia").attr('disabled', true);
        } else {
          $('#cb_odes1345678_katavasia').attr('disabled', false);
        }
      }
    });

    // Bind click function for midode Kathisma
    $("#cb_ode3_kathisma").click(function () {
      if (this.checked) {
        $("tr:has(p.bmc_ode3_kathisma)").nextUntil('tr:has(p.emc_ode3_kathisma)').show();
      } else {
        $("tr:has(p.bmc_ode3_kathisma)").nextUntil('tr:has(p.emc_ode3_kathisma)').hide();
      }
    });

    // Bind click function for katavasia1345678
    $("#cb_odes1345678_katavasia").click(function () {
      if (this.checked) {
        $("tr:has(p.bmc_odes1345678_katavasia)").nextUntil('tr:has(p.emc_odes1345678_katavasia)').show();
      } else {
        $('tr:has(p.bmc_odes1345678_katavasia)').nextUntil('tr:has(p.emc_odes1345678_katavasia)').hide();
      }
    });

    // Bind click function for magnificat
    $("#radio-mag-katavasia, #radio-mag-modeofcanon").click(function () {
      if (this.id == "radio-mag-katavasia") {
        $("tr:has(p.bmc_magnificat_modeokatavasia)").nextUntil("tr:has(p.emc_magnificat_modeofkatavasia)").show();
        $("tr:has(p.bmc_magnificat_modeofcanon)").nextUntil("tr:has(p.emc_magnificat_modeofcanon)").hide();
      } else if (this.id == "radio-mag-modeofcanon") {
        $("tr:has(p.bmc_magnificat_modeofcanon)").nextUntil("tr:has(p.emc_magnificat_modeofcanon)").show();
        $("tr:has(p.bmc_magnificat_modeokatavasia)").nextUntil("tr:has(p.emc_magnificat_modeofkatavasia)").hide();
      }
    });

    // Bind click functions for showing and hiding Service Preferences panel
    $('.prefMode').click(function (ev) {
      ev.preventDefault();
      $(".pref-panel").show();
    });

    $('.pref-closer').click(async function () {
      const includeOrdinary = $("#cb-matinsOrdinary").is(":checked");

      // Store preference state
      localStorage.setItem("pref_matinsOrdinary", includeOrdinary);

      if (includeOrdinary) {
        // If not already fetched/swapped, run your fetch & swap block
        await loadAndSwapMatinsOrdinary();
      } else {
        // Purge rows between markers cleanly
        removeMatinsOrdinarySections();
      }

      $(".pref-panel").hide();
    });
    
    // Bind click functions for dismissal options
    $('#cb_matins_end_no_dismissal').click(function () {
      if (this.checked) {
        $('tr:has(p.bmc_matins_end_no_dismissal)').nextUntil('tr:has(p.emc_matins_end_no_dismissal)').show();
        $('tr:has(p.bmc_matins_end_before_dismissal)').nextUntil('tr:has(p.emc_matins_end_before_dismissal)').hide();
        $('tr:has(p.bmc_matins_dismissal)').nextUntil('tr:has(p.emc_matins_dismissal)').hide();
        $('tr:has(p.bmc_matins_close)').nextUntil('tr:has(p.emc_matins_close)').hide();
        if ($('#cb_matins_end_before_dismissal').prop('checked'))
          $('#cb_matins_end_before_dismissal').click();
      } else {
        $('tr:has(p.bmc_matins_end_no_dismissal)').nextUntil('tr:has(p.emc_matins_end_no_dismissal)').hide();
      }
    });
    $('#cb_matins_end_before_dismissal').click(function () {
      if (this.checked) {
        $('tr:has(p.bmc_matins_end_before_dismissal)').nextUntil('tr:has(p.emc_matins_end_before_dismissal)').show();
        $('tr:has(p.bmc_matins_dismissal)').nextUntil('tr:has(p.emc_matins_dismissal)').show();
        // Hide dismissal 1 if it's visible
        if ($('#cb_matins_end_no_dismissal').prop('checked')) {
          $('#cb_matins_end_no_dismissal').click();
        }
      } else {
        $('tr:has(p.bmc_matins_end_before_dismissal)').nextUntil('tr:has(p.emc_matins_end_before_dismissal)').hide();
        $('tr:has(p.bmc_matins_dismissal)').nextUntil('tr:has(p.emc_matins_dismissal)').hide();
      }
    });
    $('#cb_matins_close').click(function () {
      console.log("cb clicked!");
      if (this.checked) {
        $('tr:has(p.bmc_matins_close)').nextUntil('tr:has(p.emc_matins_close)').show();
      } else {
        $('tr:has(p.bmc_matins_close)').nextUntil('tr:has(p.emc_matins_close)').hide();
      }
    })

    // Make it look like a default service
    hide_all_canons();
    show_kontakion(1, false);
    show_kontakion(2, false);
    $("#cb_kontakion_position12").click();
    $("#radio-eothinon-2").click();
    $("#cb_odes1345678_katavasia").click();
    $("#cb_ode9_katavasia").click();
    $('#cb_ode9_katavasia').prop('disabled', true);
    $('tr:has(p.bmc_matins_end_no_dismissal)').nextUntil('tr:has(p.emc_matins_end_no_dismissal)').hide();
    $('tr:has(p.bmc_matins_end_before_dismissal)').nextUntil('tr:has(p.emc_matins_end_before_dismissal)').hide();
    $('tr:has(p.bmc_matins_dismissal)').nextUntil('tr:has(p.emc_matins_dismissal)').hide();
    $('tr:has(p.bmc_matins_close)').nextUntil('tr:has(p.emc_matins_close)').hide();
    $('tr:has(p.bmc_magnificat_modeokatavasia)').nextUntil('tr:has(p.emc_magnificat_modeofkatavasia)').hide();
    $('tr:has(p.bmc_magnificat_modeofcanon)').nextUntil('tr:has(p.emc_magnificat_modeofcanon)').hide();
    $("#radio-mag-katavasia").click();

    $('.pref-panel').show();

    $("tr:has(p[class^='bmc_'])").hide();
    $("tr:has(p[class^='emc_'])").hide();
    $("body").append('<div class="page-num-footer"></div>');
  }


  function hide_all_canons() {
    $('tr:has([class^="bmc_ode"])').each(function () {
      $(this).nextUntil('tr:has([class^="emc_ode"])').hide();
    });
  }

  function short_litany_html(ode_num) {
    if ($('.bmc_ode' + ode_num + '_litany').length > 0) {
      var p_label = $('.bmc_ode' + ode_num + '_litany:first').text();
      var out_html = "<div class='pref-left'><label for='cb-ode" + ode_num + "_litany'>" + p_label + "</label></div>"
        + "<div class='pref-right'><input id='cb-ode" + ode_num + "_litany' type='checkbox'></div>";
      return out_html;
    }
    return "";
  }


  // Show selected eothinon Gospel reading, hide the other
  function show_eothinon(num) {
    var show_gospel = num;
    var hide_gospel = num == 1 ? 2 : 1;
    $("tr:has(p.bmc_eothinongospel_position" + show_gospel + ")").nextUntil("tr:has(p.emc_eothinongospel_position" + show_gospel + ")")
      .show();
    $("tr:has(p.bmc_eothinongospel_position" + hide_gospel + ")").nextUntil("tr:has(p.emc_eothinongospel_position" + hide_gospel + ")")
      .hide();

  }

  function show_kontakion(num, showhide) {
    var show_kontak = num;
    if (showhide)
      $("tr:has(p.bmc_kontakion_position" + show_kontak + ")").nextUntil("tr:has(p.emc_kontakion_position" + show_kontak + ")").show();
    else
      $("tr:has(p.bmc_kontakion_position" + show_kontak + ")").nextUntil("tr:has(p.emc_kontakion_position" + show_kontak + ")").hide();
  }


  function check_ode_katavasia() {
    var ode_katavasia_shown = false;
    $('input[type=checkbox]').filter('[id$="katavasia"]').each(function () {
      if ((this.id.indexOf('ode9') < 0) && (this.checked) && (this.id.indexOf('odes1345678') < 0)) {
        ode_katavasia_shown = true;
      }
    });
    return ode_katavasia_shown;
  }


  // $('a.mediaMode').attr('data-toggle','tooltip');
  // $('a.mediaMode').attr('data-placement','bottom');
  // $('a.mediaMode').attr('title','Show/Hide media links')
  // $('[data-toggle="tooltip"]').tooltip({
  //   delay : {
  //     "hide" : 5000
  //   }
  // });
  // $('a.mediaMode').tooltip('show');
  // $('a.mediaMode').trigger('mouseout');

  if ($('.services-index-table').length > 0) { // Service index page
    var monthStr;
    switch (new Date().getMonth()) {
      case 0:
        monthStr = "January";
        break;
      case 1:
        monthStr = "February";
        break;
      case 2:
        monthStr = "March";
        break;
      case 3:
        monthStr = "April";
        break;
      case 4:
        monthStr = "May";
        break;
      case 5:
        monthStr = "June";
        break;
      case 6:
        monthStr = "July";
        break;
      case 7:
        monthStr = "August";
        break;
      case 8:
        monthStr = "September";
        break;
      case 9:
        monthStr = "October";
        break;
      case 10:
        monthStr = "November";
        break;
      case 11:
        monthStr = "December";
    }
    var yearStr = new Date().getFullYear();
    var dateString = monthStr + " " + yearStr;

    $('.index-month').each(function () {
      if ($(this).text() == dateString) {
        $("html, body").scrollTop($(this).offset().top - 50);
      }
    });
  }

  //  notAvailable();
  hideEmptyRows();

});


$(document).ready(function () {
  convertClassToId();
  //hideClassesForParish();
  insertVespersTOB();
  insertLiturgyTOB();
  insertVesperalLiturgyTOB();
  fetchMatinsHTML();
  insertMatinsTOB();
  convertClassToId();
});


function insertVespersTOB() {
  // --- Constants ---
  const VALID_ENDINGS = ['.ve', '.ve1', '.ve2', '.ve3', '.ve4', '.ve5', '.ve6', '.ve7', '.ve8', '.ve9', '.pl1', '.pl5'];
  const TARGET_TABLE_ID = "biTable";
  const NEW_DIV_ID = "LoB";
  const pageTitle = document.title;

  // 1. Initial Validation
  if (!VALID_ENDINGS.some(ending => pageTitle.endsWith(ending))) {
    return false;
  }

  console.log(`Document is a Vespers. Running content insertion script.`);

  // ----------------------------------------------
  // --- Core Utility Functions (Encapsulated) ---
  // ----------------------------------------------

  /**
   * Extracts the service date (month/day) from the <title> tag content and 
   * infers the year by comparing it to the file generation date.
   */
  function getServiceDate() {
    const titleElement = document.querySelector('title');

    if (!titleElement) {
      console.error("Could not find the <title> element in the document.");
      return null;
    }

    // 1. Extract the File Generation Date/Time from data-timestamp
    const timestamp = titleElement.getAttribute('data-timestamp');
    if (!timestamp) { return null; }

    const parts = timestamp.split('.');
    if (parts.length < 3) { return null; }

    const fileGenerationDate = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10),
      12, 0, 0
    );
    const fileGenerationYear = fileGenerationDate.getFullYear();

    // 2. Extract the Month and Day from title tag content (e.g., 'se.m08.d05.ve')
    const filenameContent = titleElement.textContent;
    const dateMatch = filenameContent ? filenameContent.match(/m(\d{2})\.d(\d{2})/) : null;

    if (!dateMatch || dateMatch.length < 3) {
      console.error(`Could not parse month/day from title content: ${filenameContent}`);
      return null;
    }

    const serviceMonthIndex = parseInt(dateMatch[1], 10) - 1;
    const serviceDay = parseInt(dateMatch[2], 10);

    // 3. Infer the Service Year
    let serviceYear = fileGenerationYear;
    let initialServiceDate = new Date(serviceYear, serviceMonthIndex, serviceDay, 12, 0, 0);

    // If the service date has already passed in the file generation year, assume next year.
    if (initialServiceDate < fileGenerationDate) {
      serviceYear += 1;
      console.log(`Service date before generation date. Inferring year ${serviceYear}.`);
    } else {
      console.log(`Service year inferred as ${serviceYear}.`);
    }

    // 4. Create the final and accurate Date object
    const finalServiceDate = new Date(serviceYear, serviceMonthIndex, serviceDay, 12, 0, 0);
    console.log(`Final Service Liturgical Date: ${finalServiceDate.toDateString()}`);
    return finalServiceDate;
  }

  /**
   * Checks the liturgical date against special requirements for conditional links.
   * @returns {Object} An object containing the active link(s) keyed by their bookmark number.
   */
  function isSpecialDay() {
    const liturgicalDate = getServiceDate();
    if (!liturgicalDate) { return {}; }

    const month = liturgicalDate.getMonth();
    const day = liturgicalDate.getDate();
    const dayOfWeek = liturgicalDate.getDay();

    const specialLinks = {};
    const isNotSunday = (dayOfWeek !== 0);
    const isSaturday = (dayOfWeek === 6);

    // 1. Pre-festal Canon (Bkmrk06: Jan 2-5 OR Dec 20-24, NOT Sunday)
    const isPreCanonJan = (month === 0) && (day >= 2 && day <= 5) && isNotSunday;
    const isPreCanonDec = (month === 11) && (day >= 20 && day <= 24) && isNotSunday;
    if (isPreCanonJan || isPreCanonDec) { specialLinks['Bkmrk06'] = 'Pre-festal Canon'; }

    // 2. Akathist (Bkmrk07: Mar 25 OR Mar 26, AND is a Saturday)
    const isMarch = (month === 2);
    const isDate25or26 = (day === 25 || day === 26);
    const isAkathistDay = isMarch && isDate25or26 && isSaturday;
    if (isAkathistDay) { specialLinks['Bkmrk07'] = 'Akathist'; }

    // 3. Paraklesis (Bkmrk08: Aug 2-5, NOT Sunday)
    const isParaklesisDay = (month === 7) && (day >= 2 && day <= 5) && isNotSunday;
    if (isParaklesisDay) { specialLinks['Bkmrk08'] = 'Paraklesis'; }

    return specialLinks;
  }

  /**
   * Generates the HTML string for the conditional links, ensuring they are ordered 6, 7, 8.
   * Since only one link will ever be active, this guarantees Bkmrk06 is checked before Bkmrk07, etc.
   * @returns {string} The HTML string for the optional links.
   */
  function getOptionalLinksHTML() {
    const activeLinks = isSpecialDay();
    let optionalLinks = '';

    const linkMap = {
      'Bkmrk06': `<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk06(); return false;">Pre-festal Canon</a></p>`,
      'Bkmrk07': `<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk07(); return false;">Akathist</a></p>`,
      'Bkmrk08': `<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk08(); return false;">Paraklesis</a></p>`,
    };

    // Explicitly iterate through the desired order: Bkmrk06, Bkmrk07, Bkmrk08
    const orderedKeys = ['Bkmrk06', 'Bkmrk07', 'Bkmrk08'];

    orderedKeys.forEach(key => {
      // If the date condition was met for this bookmark number
      if (activeLinks.hasOwnProperty(key)) {
        optionalLinks += linkMap[key];
      }
    });

    return optionalLinks;
  }

  // ----------------------------------------------
  // --- Insertion Logic ---
  // ----------------------------------------------

  const bkmrk09HTML = `<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk09(); return false;">Trisagion - Apolytikia</a></p>`;

  // Base links (Bkmrk 01 through 05)
  const baseLinksHTML = `
    <p class="lobTitle">Quick Links</p>
    <p class="bookmarklink"><a href="#" onclick="scrollToBkmrk01(); return false;">Lord, I have cried</a></p>
    <p class="bookmarklink"><a href="#" onclick="scrollToBkmrk02(); return false;">Entrance | Gladsome Light</a></p>
    <p class="bookmarklink"><a href="#" onclick="scrollToBkmrk03(); return false;">Prokeimenon | Readings</a></p>
    <p class="bookmarklink"><a href="#" onclick="scrollToBkmrk04(); return false;">Litanies</a></p>
    <p class="bookmarklink"><a href="#" onclick="scrollToBkmrk05(); return false;">Aposticha</a></p>
  `;

  function addDivBeforeTable() {
    const table = document.getElementById(TARGET_TABLE_ID);

    if (!table) {
      console.warn(`Target table with ID '${TARGET_TABLE_ID}' not found. Aborting content insertion.`);
      return false;
    }

    const newDiv = document.createElement("div");
    newDiv.id = NEW_DIV_ID;

    const optionalLinks = getOptionalLinksHTML();

    // Construct the final HTML: Bkmrk01-05 + Conditional Links (6, 7, 8 in order) + Bkmrk09
    newDiv.innerHTML = baseLinksHTML + optionalLinks + bkmrk09HTML;

    const parent = table.parentNode;
    parent.insertBefore(newDiv, table);

    return true;
  }

  // Execute the content insertion
  const insertionSuccess = addDivBeforeTable();
  return insertionSuccess;
}

function insertLiturgyTOB() {

  const pageTitle = document.title;
  const validEndings = ['.li', '.li1', '.li4', '.li6', '.li9'];

  //Service is a liturgy
  //if (pageTitle.endsWith('.li')) {
  if (validEndings.some(ending => pageTitle.endsWith(ending))) {
    console.log(`Document is a Divine Liturgy. Running content insertion script.`);

    // --- Content Insertion Script ---
    // Function to create and insert the div before the table
    function addDivBeforeTable() {
      // Step 1: Get a reference to the table using its ID
      const table = document.getElementById("biTable");

      // Step 2: Create the new div element
      const newDiv = document.createElement("div");

      // Step 3: Add the new ID to the div
      newDiv.id = "LoB";

      // Step 4: Add the new class to the div
      //newDiv.classList.add("bookmarkDivStyle");

      // Step 5: Add content to the new div using innerHTML with a template literal
      // const currentPath used when href is a link to one bookmark and not the onclick
      // const currentPath = document.location.origin + document.location.pathname;

      newDiv.innerHTML = `<p class="lobTitle">Quick Links</p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk03(); return false;">Small Entrance</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk04(); return false;">Epistle Reading</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk05(); return false;">Gospel Reading</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk06(); return false;">Great Entrance</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk07(); return false;">The Creed</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk08(); return false;">Lord's Prayer</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk09(); return false;">Memorial Service (as allowed and needed)</a></p>
`;
      // Step 6: Get the parent element of the table and insert the new div
      const parent = table.parentNode;
      parent.insertBefore(newDiv, table);
    }

    // Call the function to run the code
    addDivBeforeTable();

    //convertClassToId();
    return; //stop b/c li is finished processing
  }//end if
}//end insertLiturgyTOB

function insertVesperalLiturgyTOB() {

  const pageTitle = document.title;
  const validEndings = ['.vl', '.vl2'];

  //Service is a vesperal liturgy
  //if (pageTitle.endsWith('.li')) {
  if (validEndings.some(ending => pageTitle.endsWith(ending))) {
    console.log(`Document is a Vesperal Liturgy. Running content insertion script.`);

    // --- Content Insertion Script ---
    // Function to create and insert the div before the table
    function addDivBeforeTable() {
      // Step 1: Get a reference to the table using its ID
      const table = document.getElementById("biTable");

      // Step 2: Create the new div element
      const newDiv = document.createElement("div");

      // Step 3: Add the new ID to the div
      newDiv.id = "LoB";

      // Step 4: Add the new class to the div
      //newDiv.classList.add("bookmarkDivStyle");

      // Step 5: Add content to the new div using innerHTML with a template literal
      // const currentPath used when href is a link to one bookmark and not the onclick
      // const currentPath = document.location.origin + document.location.pathname;

      newDiv.innerHTML = `<p class="lobTitle">Quick Links</p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk01(); return false;">Lord, I have cried</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk02(); return false;">Entrance | Gladsome Light</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk03(); return false;">Readings</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk04(); return false;">Epistle Reading</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk05(); return false;">Gospel Reading</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk06(); return false;">Great Entrance</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk07(); return false;">The Creed</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk08(); return false;">Lord's Prayer</a></p>
`;
      // Step 6: Get the parent element of the table and insert the new div
      const parent = table.parentNode;
      parent.insertBefore(newDiv, table);
    }

    // Call the function to run the code
    addDivBeforeTable();

    //convertClassToId();
    return; //stop b/c li is finished processing
  }//end if
}//end insertVesperalLiturgyTOB


function insertMatinsTOB() {

  const pageTitle = document.title;
  const validEndings = ['.ma', '.ma2', '.ma3', '.ma4', '.ma5', '.ma6', '.ma9'];

  //Service is a matins
  if (validEndings.some(ending => pageTitle.endsWith(ending))) {
    console.log("Document is a Matins. Running insertMatinsTOB script.");

    // --- Content Insertion Script ---
    // Function to create and insert the div before the table
    function addDivBeforeTable() {
      // Step 1: Get a reference to the table using its ID
      const table = document.getElementById("biTable");

      // Step 2: Create the new div element
      const newDiv = document.createElement("div");

      // Step 3: Add the new ID to the div
      newDiv.id = "LoB";

      // Step 4: Add the new class to the div
      //newDiv.classList.add("bookmarkDivStyle");

      // Step 5: Add content to the new div using innerHTML with a template literal
      // const currentPath used when href is a link to one bookmark and not the onclick
      // const currentPath = document.location.origin + document.location.pathname;

      newDiv.innerHTML = `<p class="lobTitle">Quick Links</p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk01(); return false;">Six Psalms</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk02(); return false;">God is the Lord / Alleluia</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk03(); return false;">Kathismata</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk04(); return false;">Evlogetaria (Saturdays / Sundays)</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk05(); return false;">Antiphons (Sundays / Feastdays)</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk06(); return false;">Synaxarion</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk07(); return false;">Katavasias / Heirmos</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk08(); return false;">Gospel (Sundays / Feastdays) - Psalm 50</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk09(); return false;">Magnificat / Ode ix</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk10(); return false;">Exaposteilaria</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk11(); return false;">Lauds</a></p>
<p class="bookmarklink"><a href="#" onclick="scrollToBkmrk12(); return false;">Doxology</a></p>
`;
      // Step 6: Get the parent element of the table and insert the new div
      const parent = table.parentNode;
      parent.insertBefore(newDiv, table);
    }

    // Call the function to run the code
    addDivBeforeTable();

  }//end if
}//end insertMatinsTOB

function convertClassToId() {
  //add R to bkmrk in rightCell
  appendLetterRtoRightBkmrkStyles();

  // Get all elements with a class attribute that starts with "bkmrk"
  // AND that do NOT already have an 'id' attribute defined.
  const bookmarks = document.querySelectorAll('[class^="bkmrk"]:not([id])');

  // Loop through the NodeList of elements
  bookmarks.forEach(bookmark => {
    // Convert the DOMTokenList (classList) to an array and find the
    // specific class that starts with "bkmrk".
    const oldClassName = Array.from(bookmark.classList).find(cls =>
      cls.startsWith('bkmrk')
    );

    // Only proceed if a matching class was found
    if (oldClassName) {
      // Replace the specific class (e.g., "bkmrk01") with the generic class "bkmrk".
      bookmark.classList.replace(oldClassName, 'bkmrk');

      // Set the id of the element to the unique class name.
      bookmark.id = oldClassName;
    }
  });
}

function removeHtmlLinkBeforeTable() {
  //This function is called in insertMatinsOrdinary
  // 1. Find the starting element: <p class="designation">_</p>
  // We use querySelectorAll to find all matching paragraphs and search by content.
  const paragraphs = document.querySelectorAll('p.designation');
  let startElement = null;

  for (let p of paragraphs) {
    if (p.textContent.trim() === '_') {
      startElement = p;
      break;
    }
  }

  // Check if the starting element was found
  if (!startElement) {
    console.error("Starting <p class='designation'>_</p> element not found.");
    return;
  }

  // 2. Get the Parent Element
  const parent = startElement.parentNode;
  if (!parent) return;

  // 3. Iteratively remove the starting element and the following three siblings (4 total)
  let currentElement = startElement;
  let elementsToRemove = 4; // The four <p> tags in your content block

  for (let i = 0; i < elementsToRemove; i++) {
    // Get the next element to remove *before* removing the current one
    const nextElement = currentElement ? currentElement.nextElementSibling : null;

    if (currentElement) {
      // **REMOVE** the element from the DOM
      parent.removeChild(currentElement);
    }

    // Move to the next element for the next iteration
    currentElement = nextElement;

    // Safety break if the sequence runs out early
    if (!currentElement && i < elementsToRemove - 1) {
      break;
    }
  }

  console.log('The specified content block before the table has been removed.');
}

function appendLetterRtoRightBkmrkStyles() {
  //This function is called in convertClassToId
  // Selects all elements with the class 'rightCell'
  const rightCells = document.querySelectorAll('.rightCell');

  // 1. Iterate over each element identified as a 'rightCell'
  rightCells.forEach(cell => {
    // 2. Select all elements *within* this 'rightCell'
    const allElements = cell.querySelectorAll('*');

    // 3. Iterate over all inner elements
    allElements.forEach(element => {
      // Get the current list of classes
      const classList = element.classList;

      // To safely use replace without skipping classes, 
      // we first convert the classList (DOMTokenList) to a standard Array.
      const classesArray = Array.from(classList);

      // Iterate over the classes in the array
      classesArray.forEach(className => {

        // Check if the class name STARTS WITH 'bkmrk'
        if (className.startsWith('bkmrk')) {
          // Define the new class name by appending 'R'
          const newClassName = className + 'R';

          // Use the replace() method to atomically swap the old class for the new one
          // e.g., 'bkmrk-icon' is replaced by 'bkmrk-iconR'
          classList.replace(className, newClassName);
        }
      });
    });
  });
}

function scrollToBkmrk01() {
  const firstElement = document.getElementById('bkmrk01');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk01R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk02() {
  const firstElement = document.getElementById('bkmrk02');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk02R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk03() {
  const firstElement = document.getElementById('bkmrk03');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk03R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk04() {
  const firstElement = document.getElementById('bkmrk04');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk04R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk05() {
  const firstElement = document.getElementById('bkmrk05');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk05R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk06() {
  const firstElement = document.getElementById('bkmrk06');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk06R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk07() {
  const firstElement = document.getElementById('bkmrk07');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk07R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk08() {
  const firstElement = document.getElementById('bkmrk08');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk08R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk09() {
  const firstElement = document.getElementById('bkmrk09');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk09R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk10() {
  const firstElement = document.getElementById('bkmrk10');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk10R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk11() {
  const firstElement = document.getElementById('bkmrk11');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk11R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk12() {
  const firstElement = document.getElementById('bkmrk12');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk12R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk13() {
  const firstElement = document.getElementById('bkmrk13');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk13R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk14() {
  const firstElement = document.getElementById('bkmrk14');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk14R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk15() {
  const firstElement = document.getElementById('bkmrk15');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk15R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk16() {
  const firstElement = document.getElementById('bkmrk16');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk16R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk17() {
  const firstElement = document.getElementById('bkmrk17');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk17R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk18() {
  const firstElement = document.getElementById('bkmrk18');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk18R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk19() {
  const firstElement = document.getElementById('bkmrk19');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk19R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function scrollToBkmrk20() {
  const firstElement = document.getElementById('bkmrk20');
  if (firstElement) {
    firstElement.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    const secondElement = document.getElementById('bkmrk20R');
    if (secondElement) {
      secondElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 10);
}

function hideGreekInEnglishOnlyService() {
  // This function is called in insertMatinsOrdinary
  // Search the document for the element with the ID "bkmark02".
  const bookmarkElement = document.getElementById("bkmrk02");

  // Check if the element was NOT found (i.e., bookmarkElement is null).
  if (!bookmarkElement) {
    console.log("✅ Bookmark 'bkmrk02' was NOT found. Proceeding to hide leftCell.");

    // Finds all <td> elements with the class "leftCell" in the main document.
    const leftCells = document.querySelectorAll('td.leftCell');

    // Loops through the found elements and sets their display style to 'none'.
    leftCells.forEach(cell => {
      cell.style.display = 'none';
    });

    console.log("All 'leftCell' elements are now display: none.");

  } else {
    // This runs if the bookmark *was* found.
    console.warn("❌ Bookmark 'bkmrk02' WAS found. No 'leftCell' elements will be hidden.");
  }
}


function hideEnglishInGreekOnlyService() {
  // This function is called in insertMatinsOrdinary
  // Search the document for the element with the ID "bkmark02R".
  const bookmarkElement = document.getElementById("bkmrk02R");

  // Check if the element was NOT found (i.e., bookmarkElement is null).
  if (!bookmarkElement) {
    console.log("✅ Bookmark 'bkmrk02R' was NOT found. Proceeding to hide rightCell.");

    // Finds all <td> elements with the class "rightCell" in the main document.
    const rightCells = document.querySelectorAll('td.rightCell');

    // Loops through the found elements and sets their display style to 'none'.
    rightCells.forEach(cell => {
      cell.style.display = 'none';
    });

    console.log("All 'rightCell' elements are now display: none.");

  } else {
    // This runs if the bookmark *was* found.
    console.warn("❌ Bookmark 'bkmrk02' WAS found. No 'rightCell' elements will be hidden.");
  }
}

// ====================================================================
// PARISH MENU CORE JAVASCRIPT FUNCTIONS
// This file contains all dynamic behavior for the Parish-specific view.
// ====================================================================

// NOTE: This script assumes jQuery is loaded BEFORE this file.

// Global state variable to track the currently selected language view
let activeLanguageView = 'both';

// ----------------------------------------------------
// 1. UTILITY FUNCTIONS (Hiding, Font Sizing, etc.)
// ----------------------------------------------------

function hideClassesForParish() {
  const classesToHide = ["agesMenu", "dayMode", "nightMode", "versionMode", "clockbox", "fa-bars", "media-group", "source", "source0", "source1", "nav-flex-row", "noprintdesig", "servicesourcestitle", "servicesources", "servicesourcessection"];

  classesToHide.forEach(className => {
    const elements = document.getElementsByClassName(className);
    Array.from(elements).forEach(element => {
      element.style.display = "none";
    });
  });
  console.log("Classes hidden by hideClassesForParish.");
}

function hideParishSpaceAsteriskAndBrackets() {
  const body = document.body;
  const regex = new RegExp('\\ \\*|[\\[\\]]', 'g');
  body.innerHTML = body.innerHTML.replace(regex, '');
}

/**
 * Multiplies the current font size of the main content area 
 * by a given factor (e.g., 1.2 for larger, 0.8 for smaller).
 */
function setParishFont(factor) {
  const target = $('body');
  let currentSize = parseFloat(target.css('font-size'));
  let newSize = currentSize * factor;

  // Set limits
  const MIN_SIZE = 10;
  const MAX_SIZE = 32;

  if (newSize < MIN_SIZE) {
    newSize = MIN_SIZE;
  } else if (newSize > MAX_SIZE) {
    newSize = MAX_SIZE;
  }

  target.css('font-size', newSize + 'px');
  console.log(`Font size changed to: ${newSize}px`);
}

/**
 * Toggles the visibility of the Greek/English cells within a single row.
 * This is used for the tap-to-swap feature when only one language is displayed.
 * @param {HTMLElement} rowElement - The table row (<tr>) that was clicked.
 */
function swapParishLang(rowElement) {
  const $row = $(rowElement);
  const $greekCell = $row.find("td:even");
  const $englishCell = $row.find("td:odd");

  if ($greekCell.css('display') !== 'none') {
    // Greek is visible, so hide Greek and show English
    $greekCell.css('display', 'none');
    $englishCell.css('display', '');
  } else if ($englishCell.css('display') !== 'none') {
    // English is visible, so hide English and show Greek
    $englishCell.css('display', 'none');
    $greekCell.css('display', '');
  }
}

// Prevents the row click event (swapParishLang) from firing when clicking media icons/links.
function stopParishSwap(element) {
  $(element).closest('tr').removeAttr("onclick");
}

// Re-enables the row click event after the mouse leaves the media icon/link area.
function resumeParishSwap(element) {
  $(element).closest('tr').attr("onclick", "swapParishLang(this)");
}


// NOTE: These are the core column hiding utilities.
function hideParishAllLeft() {
  // Logic to hide the LEFT (Greek) column, leaving only the RIGHT (English) column visible.

  // 1. Reset all
  $("td").css("display", "");
  $("div.media-group-empty").css("display", "");
  $("div.media-group-empty").addClass("m-g-e");

  // 2. Attach swap handlers for single-language mode
  $("tr:has(p.alttext,p.chant,p.heirmos,p.hymn,p.hymnlinefirst,p.hymnlinemiddle,p.hymnlinelast,p.prayer,p.prayerzero,p.verse,p.versecenter,p.inaudible,p.dialog,p.dialogzero,p.reading,p.readingzero,p.readingcenter,p.readingcenterzero,p.rubric,.media-group,.dialogafteractor,p.iambiccanon1,p.iambiccanon234,p.iambiccanon5)").attr("onclick", "swapParishLang(this)");
  $(".media-icon,i,li").attr("onmousedown", "stopParishSwap(this)");
  $(".media-icon,i,li").attr("onmouseout", "resumeParishSwap(this)");

  // 3. Hide the Greek columns
  //$("td:even").css("background-color", "#FFF7E6");
  $("td:even").css("display", "none");
  $("td").css("border", "0");

  console.log("Hiding all left columns (English only view, tap-to-swap enabled).");
}

function hideParishAllRight() {
  // Logic to hide the RIGHT (English) column, leaving only the LEFT (Greek) column visible.

  // 1. Reset all
  $("td").css("display", "");
  $("div.media-group-empty").css("display", "");
  $("div.media-group-empty").addClass("m-g-e");

  // 2. Attach swap handlers for single-language mode
  $("tr:has(p.alttext,p.chant,p.heirmos,p.hymn,p.hymnlinefirst,p.hymnlinemiddle,p.hymnlinelast,p.prayer,p.prayerzero,p.verse,p.versecenter,p.inaudible,p.dialog,p.dialogzero,p.reading,p.readingzero,p.readingcenter,p.readingcenterzero,p.rubric,.media-group,.dialogafteractor,p.iambiccanon1,p.iambiccanon234,p.iambiccanon5)").attr("onclick", "swapParishLang(this)");
  $(".media-icon,i,li").attr("onmousedown", "stopParishSwap(this)");
  $(".media-icon,i,li").attr("onmouseout", "resumeParishSwap(this)");

  // 3. Hide the English columns
  //$("td:even").css("background-color", "#FFF7E6");
  $("td:odd").css("display", "none");
  $("td").css("border", "0");

  console.log("Hiding all right columns (Greek only view, tap-to-swap enabled).");
}

/**
 * Executes the function to reset the column display to show both.
 * This also removes swap handlers.
 */
function showParishBothColumns() {
  // 1. Reset all display properties
  $("td").css("display", ""); // Show both columns
  //$("td").css("background-color", "#FFF7E6"); // Reapply colors as per your original code
  $("div.media-group-empty").css("display", "");

  // 2. Remove swap handlers for bilingual mode
  $("tr").removeAttr("onclick");
  $(".media-icon,i,li").removeAttr("onmousedown").removeAttr("onmouseout");

  console.log("Both columns are now displayed (default state, tap-to-swap disabled).");
}

/**
 * Scrolls the document smoothly back to the top (0, 0 position).
 */
function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 600);
  console.log("Scrolled document to top.");
}


// ----------------------------------------------------
// 2. MENU CREATION AND CONTROL
// ----------------------------------------------------

/**
 * Creates the menu button element and attaches its click handler.
 */
function createParishMenuButton() {
  if (document.getElementById('menu-button')) {
    return;
  }

  let menuButton = document.createElement('button');
  menuButton.id = 'menu-button';
  // Using 'fa' class as per your specific Font Awesome version
  menuButton.innerHTML = '<i class="fa fa-bars"></i>';
  menuButton.onclick = createParishMenu;
  document.body.appendChild(menuButton);

  console.log("Created menu button.");
}

function createParishMenu() {
  let existingMenu = document.getElementById('parish-menu');

  if (existingMenu) {
    console.log("Menu already exists.");
    return;
  }

  let menuDiv = document.createElement('div');
  menuDiv.className = 'parishMenu';
  menuDiv.id = 'parish-menu';

  // --- Dynamic button state generation ---
  const isBothActive = activeLanguageView === 'both';
  const isGreekActive = activeLanguageView === 'greek';
  const isEnglishActive = activeLanguageView === 'english';

  const bothClass = isBothActive ? 'active-lang' : '';
  const greekClass = isGreekActive ? 'active-lang' : '';
  const englishClass = isEnglishActive ? 'active-lang' : '';

  const bothIcon = isBothActive ? 'fa-check-square' : 'fa-language';
  const greekIcon = isGreekActive ? 'fa-check-square' : 'fa-language';
  const englishIcon = isEnglishActive ? 'fa-check-square' : 'fa-language';

  // Menu content with font controls and language toggles
  menuDiv.innerHTML = `
      <!-- NAVIGATION CONTROLS -->
<!--  <h3>Navigation</h3> -->
      <div class="nav-controls">
          <button class="scroll-top-btn" onclick="scrollToTop(); document.getElementById('parish-menu').remove()">
              <i class="fa fa-arrow-up"></i> Go to Quick Links
          </button>
      </div>

      <hr> 

      <h2>Preferences</h2>
      <hr> <!-- Line break separating Heading from Font Controls -->

      <!-- FONT SIZE CONTROLS -->
      <h3>Text Size</h3>
      <div class="font-controls">
          <button class="enlargeFontBtn">
              <i class="fa fa-plus-circle"></i> Enlarge Text
          </button>
          <br>
          <button class="shrinkFontBtn">
              <i class="fa fa-minus-circle"></i> Shrink Text
          </button>
      </div>
      
      <hr> <!-- Line break separating Font Controls and Language View Group -->
      
      <!-- LANGUAGE CONTROLS: Now using three mutually exclusive buttons -->
      <h3>Language View</h3>
      <div class="lang-btn-group">
          
          <!-- Greek and English (Both) Button: Dynamic state applied -->
          <button id="view-both-btn" class="lang-view-btn ${bothClass}" onclick="setParishLanguageView('both')">
              <i class="fa ${bothIcon}"></i> Greek | English
          </button>
          <br>

          <!-- Greek Only Button: Dynamic state applied -->
          <button id="view-greek-only-btn" class="lang-view-btn ${greekClass}" onclick="setParishLanguageView('greek')">
              <i class="fa ${greekIcon}"></i> Greek
          </button>
          <br>

          <!-- English Only Button: Dynamic state applied -->
          <button id="view-english-only-btn" class="lang-view-btn ${englishClass}" onclick="setParishLanguageView('english')">
              <i class="fa ${englishIcon}"></i> English
          </button>
          <br>
          <h5>When you select one language, Greek or English, you can tap on any paragraph in the service, and it will switch to the other language.</h5>
      </div>

      <hr> <!-- Line break separating Language Controls and Close Button -->
      
      <!-- CLOSE BUTTON -->
      <button class="closeParishMenuBtn" onclick="document.getElementById('parish-menu').remove()">
          <i class="fa fa-times"></i> Close Menu
      </button>
    `;

  document.body.appendChild(menuDiv);
  console.log("Created .parishMenu div.");
}

/**
 * Checks if a click occurred outside the menu or the open button and closes the menu.
 */
function closeParishMenuOnOutsideClick(event) {
  const menu = document.getElementById('parish-menu');
  const button = document.getElementById('menu-button');

  if (!menu) {
    return;
  }

  const clickedOutsideMenu = !menu.contains(event.target);
  const clickedNotOnButton = !button.contains(event.target);

  if (clickedOutsideMenu && clickedNotOnButton) {
    menu.remove();
    console.log("Parish Menu closed by outside click.");
  }
}


/**
 * Sets the main language view (Greek Only, English Only, or Both).
 * This function ensures only one view button is active at a time.
 * @param {string} view - 'greek', 'english', or 'both'.
 */
function setParishLanguageView(view) {
  // 1. Reset all buttons visually to inactive
  $(".lang-view-btn").removeClass('active-lang');
  // Change active icon (check-square) back to inactive icon (language)
  $(".lang-view-btn").find('.fa').removeClass('fa-check-square').addClass('fa-language');

  let targetButton;
  let viewFunction;

  // 2. Determine the target button and the corresponding view function
  if (view === 'greek') {
    targetButton = $("#view-greek-only-btn");
    viewFunction = hideParishAllRight;
  } else if (view === 'english') {
    targetButton = $("#view-english-only-btn");
    viewFunction = hideParishAllLeft;
  } else if (view === 'both') {
    targetButton = $("#view-both-btn");
    viewFunction = showParishBothColumns;
  } else {
    console.error("Invalid language view specified:", view);
    return;
  }

  // 3. Set the target button to active state (for immediate feedback)
  targetButton.addClass('active-lang');
  // Change inactive icon (language) to active icon (check-square)
  targetButton.find('.fa').removeClass('fa-language').addClass('fa-check-square');

  // 4. Update the global state
  activeLanguageView = view;

  // 5. Apply the selected view
  viewFunction();
  console.log(`Switched to ${view} view.`);
}


// ----------------------------------------------------
// 3. INITIALIZATION AND EVENT DELEGATION
// ----------------------------------------------------

$(document).ready(function () {
  // --- Event Delegation for Dynamic Buttons (Font Control) ---
  // Delegation is attached to the document for dynamically created buttons.

  // INCREASE FONT SIZE BUTTON
  $(document).on('click', '.enlargeFontBtn', function (e) {
    e.preventDefault();
    setParishFont(1.2);
  });

  // DECREASE FONT SIZE BUTTON
  $(document).on('click', '.shrinkFontBtn', function (e) {
    e.preventDefault();
    setParishFont(0.8);
  });


  // --- Conditional Initialization ---

  const requiredReferrer = 'https://dcs.goarch.org/goa/dcs/parish.html';
  const currentReferrer = document.referrer;

  if (currentReferrer === requiredReferrer) {
    console.log("Parish referrer matched. Initializing features.");

    // 1. Set default state to show both columns (tap-to-swap disabled by default)
    showParishBothColumns();

    // 2. Run initial hiding and modification functions
    hideClassesForParish();
    hideParishSpaceAsteriskAndBrackets();

    // 3. Create the menu and attach the outside click listener
    createParishMenuButton();
    $(document).on('click', closeParishMenuOnOutsideClick);

  } else {
    console.log("Parish features NOT initialized. Referrer was:", currentReferrer || "[Direct access or no referrer]");
  }
});

// ----------------------------------------------------
// END PARISH FUNCTIONS
// ----------------------------------------------------

/**
 * @function initCollapsibleRows
 * @description Initializes the behavior for a collapsible table structure.
 * It handles showing/hiding blocks of table rows based on clicks
 * on rows containing specific collapse markers (.bmc_collapse and .emc_collapse).
 * The logic implements an accordion-like functionality for table content.
 * @version 1.0.0
 */
function initCollapsibleRows() {
  // --- Initial State Setup ---
  // Hide all rows between a 'bmc_collapse' row and the next 'emc_collapse' row (the content).
  $("tr:has(.bmc_collapse)").nextUntil("tr:has(.emc_collapse)").hide();
  // Hide all 'emc_collapse' rows (the collapse markers/footers).
  $("tr:has(.emc_collapse)").hide();

  // --- Big/Main Collapse (BMC) Click Handler ---
  // When a row with a '.bmc_collapse' marker is clicked:
  $("tr:has(.bmc_collapse)").click(function () {
    // 1. Show all subsequent content rows up until the next 'emc_collapse' row.
    $(this).nextUntil('tr:has(.emc_collapse)').show();
    // 2. Apply a background color to the shown content rows for visual emphasis.
    $(this).nextUntil('tr:has(.emc_collapse)').css("background-color", "#FDF6E7");
    // 3. Hide the clicked 'bmc_collapse' row itself.
    $(this).hide();
    // 4. Show the corresponding 'emc_collapse' row (the collapse marker/footer).
    $(this).nextAll('tr:has(.emc_collapse):first').show();
  });

  // --- End/Exit Collapse (EMC) Click Handler ---
  // When a row with an '.emc_collapse' marker is clicked:
  $("tr:has(.emc_collapse)").click(function () {
    // 1. Hide all preceding content rows down to the previous 'bmc_collapse' row.
    $(this).prevUntil('tr:has(.bmc_collapse)').hide();
    // 2. Hide the clicked 'emc_collapse' row itself.
    $(this).hide();
    // 3. Show the corresponding 'bmc_collapse' row (the main opener).
    $(this).prevAll('tr:has(.bmc_collapse):first').show();

    // 4. Scroll the viewport to the newly shown 'bmc_collapse' row.
    var show_pos = $(this).prevAll('tr:has(.bmc_collapse):first').position();
    window.scrollTo(0, show_pos.top - 50);
  });
}

// --- Execution ---
// Execute the function once the entire document is ready
// as long as document is not /li1/ i.e. customizable liturgy
$(document).ready(function () {
  if (window.location.href.includes('/li1/')) {
    $('.bmc_collapse, .emc_collapse').css('display', 'none');
  } else {
    initCollapsibleRows();
  }
});


// AUDIO PLAYER - Unified Player Logic (DIV-based)
"use strict";

console.log("AUDIO PLAYER: Script loaded.");

// --- Global State Variables ---
let playerDiv = null;
let audioElement = null;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let pendingUpdate = false;
let latestClientX = 0;
let latestClientY = 0;
let initialSearchLogged = false;

// --- 0. Embedded Styles ---
const PLAYER_CSS = `
/* Styles for the Floating Audio Player */

/* 1. Main Container (Wrapper) */
.audio-player-container {
    background-color: white;
    border-radius: 0.5rem; /* rounded-lg */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
    transition: opacity 300ms ease-in-out;
}

/* 2. Header (Drag Handle) */
.audio-player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2563eb; /* blue-600 */
    padding: 0.5rem; /* p-2 */
    border-top-left-radius: 0.5rem; /* rounded-t-lg */
    border-top-right-radius: 0.5rem;
    border-bottom: 1px solid #3b82f6; /* border-b border-blue-500 */
    cursor: move;
}

.header-controls-group {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* space-x-2 */
}

/* 3. Header Text */
.header-drag-text {
    font-size: 0.875rem; /* text-sm */
    font-weight: 600; /* font-semibold */
    color: white; /* text-white */
    padding-left: 0.25rem; /* pl-1 */
}

/* 4. Download Button */
.header-download-btn {
    font-size: 0.75rem; /* text-xs */
    font-weight: 500; /* font-medium */
    transition: all 150ms ease-in-out;
    border-radius: 0.25rem; /* rounded */
    padding: 0.25rem 0.5rem; /* px-2 py-0.5 */
    background-color: #facc15; /* yellow-400 */
    color: #1f2937; /* gray-900 */
    text-decoration: none; /* remove default underline */
}

.header-download-btn:hover {
    background-color: #eab308; /* yellow-500 */
}

/* 5. Close Button */
.header-close-btn {
    color: white; /* text-white (or same as header text) */
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 150ms ease-in-out;
    padding: 0.125rem; /* p-0.5 */
    border-radius: 9999px; /* rounded-full */
}

/* FIX: Ensure the SVG icon inside the button has a defined size */
.header-close-btn svg {
    width: 1rem; /* 16px */
    height: 1rem; /* 16px */
    display: block;
}

.header-close-btn:hover {
    background-color: #1d4ed8; /* blue-700 */
}

.header-close-btn:focus {
    outline: 2px solid transparent;
    box-shadow: 0 0 0 2px #f87171; /* ring-2 focus:ring-red-400 */
}

/* 6. Audio Player Body */
.audio-player-body {
    padding: 0.5rem; /* p-2 */
    background-color: white;
    border-bottom-left-radius: 0.5rem; /* rounded-b-lg */
    border-bottom-right-radius: 0.5rem;
}

/* Ensure the audio element takes full width */
#main-audio-player {
    width: 100%;
}
`;

/**
 * Injects the required player styles into the document's head.
 */
function injectStyles() {
  const style = document.createElement('style');
  // Renamed ID for style element
  style.id = 'ap-player-styles';
  style.textContent = PLAYER_CSS;
  document.head.appendChild(style);
  console.log("AUDIO PLAYER: Styles injected into <head>.");
}


// --- 1. Player HTML Structure (Template for native DIV) ---
const PLAYER_HTML_TEMPLATE = (audioUrl) => `
    <div id="player-drag-handle" class="audio-player-header" 
         style="user-select: none; touch-action: none;">
        <span class="header-drag-text">Drag Player</span>
        
        <div class="header-controls-group">
            <a id="download-link" 
               href="${audioUrl}" 
               download="audio_file.mp3" 
               class="header-download-btn"
               title="Download Audio File">
                Download
            </a>
            <button id="close-button"
                    class="header-close-btn"
                    title="Close and Stop Player">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
    <div class="audio-player-body">
        <audio id="main-audio-player" controls preload="auto" class="w-full" src="${audioUrl}">
            Your browser does not support the audio element.
        </audio>
    </div>
`;

// --- 2. Player Creation and Initialization ---
function createMiniPlayer(audioUrl) {
  if (playerDiv) return;

  // Create the main container DIV
  playerDiv = document.createElement('div');
  playerDiv.id = 'floating-audio-player';

  // Apply REQUIRED fixed position styles
  playerDiv.className = 'audio-player-container';
  playerDiv.style.width = '350px';
  playerDiv.style.height = 'min-content';

  playerDiv.style.position = 'fixed';

  // Initial State and Position (Bottom Left)
  playerDiv.style.opacity = '0';
  playerDiv.style.visibility = 'hidden';
  playerDiv.style.bottom = '20px';
  playerDiv.style.left = '20px';
  playerDiv.style.right = 'auto';
  playerDiv.style.zIndex = '9998';

  // Inject the inner HTML
  playerDiv.innerHTML = PLAYER_HTML_TEMPLATE(audioUrl);
  document.body.appendChild(playerDiv);

  // Get element references and attach listeners
  audioElement = playerDiv.querySelector('#main-audio-player');
  const closeButton = playerDiv.querySelector('#close-button');
  const dragHandle = playerDiv.querySelector('#player-drag-handle');

  // Attach click and drag listeners
  if (closeButton) closeButton.addEventListener('click', window.hidePlayer);

  if (dragHandle) {
    // Attach pointer listeners
    dragHandle.addEventListener('pointerdown', handleDragStart);
  }

  // Set download file name for the link
  const downloadLink = playerDiv.querySelector('#download-link');
  const filename = audioUrl.split('/').pop().split('?')[0];
  if (downloadLink) downloadLink.download = filename || 'audio_file.mp3';
}


// --- 3. Public Show/Hide Functions ---
window.showPlayer = function (audioUrl) {
  console.log(`[SHOW PLAYER]: Called with URL: ${audioUrl}`);

  if (!playerDiv) {
    createMiniPlayer(audioUrl);
  }

  // **START OF FIX**
  const downloadLink = playerDiv.querySelector('#download-link');
  const filename = audioUrl.split('/').pop().split('?')[0];

  if (downloadLink) {
    // FIX 1: Update the download link's HREF to the current audio URL
    downloadLink.href = audioUrl;

    // FIX 2: Update the download link's suggested file name
    downloadLink.download = filename || 'audio_file.mp3';
  }
  // **END OF FIX**

  if (audioElement && audioElement.src !== audioUrl) {
    audioElement.src = audioUrl;
  }

  if (playerDiv) {
    playerDiv.style.opacity = '1';
    playerDiv.style.visibility = 'visible';
  }
  if (audioElement) {
    audioElement.play().catch(e => console.warn("Autoplay prevented:", e));
  }
}

window.hidePlayer = function () {
  console.log("[HIDE PLAYER]: Hiding audio player DIV.");
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  if (playerDiv) {
    playerDiv.style.opacity = '0';
    playerDiv.style.visibility = 'hidden';
  }
}


// --- 4. DRAG LOGIC (Pointer Events Only) ---
function handleDragStart(e) {
  if (!playerDiv) return;

  e.preventDefault();

  if (e.pointerId !== undefined) {
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  const rect = playerDiv.getBoundingClientRect();

  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;

  isDragging = true;
  playerDiv.style.zIndex = '9999';

  document.addEventListener('pointermove', dragMove);
  document.addEventListener('pointerup', dragEnd);
}

function updatePlayerPosition() {
  if (!playerDiv || !isDragging) {
    pendingUpdate = false;
    return;
  }

  let newLeft = latestClientX - dragOffsetX;
  let newTop = latestClientY - dragOffsetY;

  // Boundary check (5px margin from the edge)
  const maxWidth = window.innerWidth - playerDiv.offsetWidth;
  const maxHeight = window.innerHeight - playerDiv.offsetHeight;

  newLeft = Math.max(5, Math.min(newLeft, maxWidth - 5));
  newTop = Math.max(5, Math.min(newTop, maxHeight - 5));

  // Apply new position
  playerDiv.style.left = `${newLeft}px`;
  playerDiv.style.top = `${newTop}px`;

  // Clear initial positioning properties (in case it started bottom/right)
  playerDiv.style.bottom = 'auto';
  playerDiv.style.right = 'auto';

  pendingUpdate = false;
}

function dragMove(e) {
  if (!isDragging || !playerDiv) return;
  e.preventDefault();

  latestClientX = e.clientX;
  latestClientY = e.clientY;

  if (!pendingUpdate) {
    requestAnimationFrame(updatePlayerPosition);
    pendingUpdate = true;
  }
}

function dragEnd() {
  if (isDragging) {
    isDragging = false;
    playerDiv.style.zIndex = '9998';

    document.removeEventListener('pointermove', dragMove);
    document.removeEventListener('pointerup', dragEnd);

    if (pendingUpdate) {
      requestAnimationFrame(updatePlayerPosition);
    }
  }
}


// ----------------------------------------------------------------------------------
// --- 5. The Link Conversion Function ----------------------------------------------
// ----------------------------------------------------------------------------------
/**
 * Finds all MP3 links in the given document and converts them to call the parent's function.
 * @param {Document} doc - The iframe's content document.
 */
function convertLinksToOnclick(doc) {
  const mp3Links = doc.querySelectorAll('a[href$=".mp3"], a[href$=".MP3"]');

  if (mp3Links.length === 0) {
    console.log("  [CONVERSION]: No MP3 links found for conversion.");
    return;
  }

  console.log(`  [CONVERSION]: Found ${mp3Links.length} MP3 links. Converting...`);

  mp3Links.forEach(link => {
    let audioUrl;

    try {
      const urlObject = new URL(link.href);
      audioUrl = urlObject.pathname + urlObject.search + urlObject.hash;

    } catch (e) {
      console.warn("  [CONVERSION]: URL API failed. Falling back to link.pathname.", e);
      audioUrl = link.pathname;
    }

    if (audioUrl && audioUrl.charAt(0) !== '/') {
      audioUrl = '/' + audioUrl;
    }

    if (link.dataset.alwbConverted === 'true') {
      return;
    }

    link.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.showPlayer(audioUrl);
      console.log(`  [CONVERSION]: Playing URL: ${audioUrl}`);
      return false;
    };

    link.href = 'javascript:void(0)';
    // Kept for backward compatibility if other scripts check this data attribute
    link.dataset.alwbConverted = 'true';
  });

  console.log("  [CONVERSION]: All MP3 links successfully converted to custom player calls.");
}

// ----------------------------------------------------------------------------------
// --- 6. The Robust Initialization Function ----------------------------------------
// ----------------------------------------------------------------------------------
/**
 * Initiates the search for the FrameText element and, once found, sets up the load handler.
 */
function initializeAudioInterception() {

  if (!initialSearchLogged) {
    // Updated console message
    console.log("AUDIO PLAYER: Starting element search. Polling every 50ms until found...");
    initialSearchLogged = true;
  }

  const frameText = document.getElementById('FrameText');

  if (!frameText) {
    setTimeout(initializeAudioInterception, 50);
    return;
  }

  // Updated console message
  console.log("AUDIO PLAYER: Element 'FrameText' found. Attaching handler.");

  const handleFrameLoad = function () {
    try {
      if (!frameText.contentWindow || !frameText.contentWindow.document) {
        return;
      }

      const iframeDocument = frameText.contentWindow.document;

      if (iframeDocument.readyState === 'complete') {
        console.log(" [HANDLER]: Frame content is complete. Starting link conversion.");

        convertLinksToOnclick(iframeDocument);

        frameText.onload = handleFrameLoad;

      } else {
        setTimeout(handleFrameLoad, 100);
      }

    } catch (e) {
      console.error(" [ERROR]: Frame access failure or handler error.", e);
    }
  };

  // 1. Attach to the native onload event
  frameText.onload = handleFrameLoad;

  // 2. Execute immediately to catch the initial load
  handleFrameLoad();
}


// --- 7. Start the entire process immediately ---
injectStyles();
initializeAudioInterception();

// ------------------------------------------------------------------
// --- 8. Android Detection Logic  ---
// ------------------------------------------------------------------
/**
 * Generates the correct URL for a score document based on the ONLY condition that requires the viewer: Android.
 * Rules:
 * - IF Android: Use the custom viewer URL (requires full path: /media/scores/...).
 * - ELSE: Use the direct PDF link (scoreMediaRoot).
 */
// --- CORE URL CONSTANTS ---
const rootPrefix = 'https://dcs.goarch.org/';
const scoreViewerBase = rootPrefix + 'goa/dcs/js/viewer/web/viewer.html?file=/';
const scoreMediaRoot = rootPrefix + 'media/scores/';
const audioMediaRoot = rootPrefix + 'media/recordings/';

function getScoreUrlFinalAndSimplest(fullScorePath) {
  const userAgent = navigator.userAgent;

  // Check if the device is Android (the ONLY condition that requires the viewer)
  const isAndroid = /Android/i.test(userAgent);

  if (isAndroid) {
    // Log when Android IS detected
    console.log("[PDF Logic] DETECTED: Android (Viewer ENABLED).");

    // 🚨 ADJUSTMENT: We must manually prepend 'media/scores/' to the file path 
    // because the new scoreViewerBase only ends with '?file=/'
    const fullViewerPath = scoreMediaRoot.replace(rootPrefix, '') + fullScorePath;

    // Optionally, log the final URL being used
    // console.log(`[PDF Logic] Viewer URL: ${scoreViewerBase + fullViewerPath}`);

    return scoreViewerBase + fullViewerPath;
  }

  // All other platforms (iOS/iPadOS, Mac, Windows, etc.) bypass the viewer

  // Log when Android IS NOT detected (covering all other platforms)
  console.log("[PDF Logic] DETECTED: Non-Android (Viewer DISABLED).");

  // Optionally, log the final URL being used
  // console.log(`[PDF Logic] Direct URL: ${scoreMediaRoot + fullScorePath}`);

  return scoreMediaRoot + fullScorePath;
}

/**
 * Function to dynamically find elements, parse their data-keys, and replace 
 * them with a dropdown menu containing links for Scores (PDFs) and Audio (MP3s).
 */
function generateDynamicLinks() {
  console.log('✅ Function generateDynamicLinks() started.');

  // --- CRITICAL CONFIGURATION: DEFINE ALL PERSON CODES HERE ---
  const PERSON_MAP = {
    en: { audio: { default: 'dedes' }, score: { w: 'dedes', b: 'theodoridis' } },
    gr: { audio: { default: 'dedes' }, score: { w: 'dedes', b: 'theodoridis' } }
  };
  // -------------------------------------------------------------


  const dataKeyAttribute = 'data-key';
  let dropdownCounter = 1;

  // NOTE: initializeExistingAudio is no longer needed/used, but we keep the variable for reference
  const initializeExistingAudio = typeof initializeAudioInterception === 'function'
    ? initializeAudioInterception
    : null;

  const targetElements = document.querySelectorAll(`span.melody [${dataKeyAttribute}]`);
  console.log(`🔎 Found ${targetElements.length} element(s) to process.`);

  targetElements.forEach((span, index) => {

    // --- 1. Exclusion Check & Parsing ---
    if (span.classList.contains('dummy')) { console.log(`--- Processing Element ${index + 1} ---`); console.log('   ⚠️ SKIPPING: Element has class "dummy".'); return; }
    const fullKeyValue = span.getAttribute(dataKeyAttribute);
    if (!fullKeyValue) { console.log('   ⚠️ SKIPPING: Data Key was empty.'); return; }
    const originalMelodyName = span.textContent.trim();
    if (originalMelodyName.length === 0) { console.log('   ⚠️ SKIPPING: Original text content is empty.'); return; }

    // --- 2. Language/Context Check ---
    const parentTD = $(span).closest('td');
    let langCode = 'en';
    if (parentTD.hasClass('leftCell')) { langCode = 'gr'; }
    else if (parentTD.hasClass('rightCell')) { langCode = 'en'; }

    const dropdownID = `jqm-dropdown-${Date.now()}-${dropdownCounter++}`;

    // --- 3. Data Key Parsing (omitted for brevity) ---
    const initialParts = fullKeyValue.split('|');
    const prefixPart = initialParts[0];
    let suffixPart = initialParts.pop();

    const prefixSegments = prefixPart.split('.');
    let bookSegment = prefixSegments[0] || 'book_missing';
    let segmentA = prefixSegments[1] || 'seg_missing';
    let modeSegment = (prefixSegments.length >= 3 && prefixSegments[2]) ? prefixSegments[2].split('_')[0] : 'm0';

    const lastDotIndex = suffixPart.lastIndexOf('.');
    let fileNameSegment = suffixPart;
    if (lastDotIndex !== -1) { fileNameSegment = suffixPart.substring(0, lastDotIndex); }
    const prefixToRemove = 'heAU.';
    if (fileNameSegment.startsWith(prefixToRemove)) { fileNameSegment = fileNameSegment.slice(prefixToRemove.length); }

    // --- 4. Construct Path Base Segments (book/section/mode) ---
    const pathSegments = `${bookSegment}/${segmentA}/${modeSegment}/`;

    // ------------------------------------------------------------------
    // --- 5. CREATE DROPDOWN TRIGGER LINK (omitted for brevity) ---
    // ------------------------------------------------------------------
    const melodyLink = document.createElement('a');
    melodyLink.href = '#';
    melodyLink.textContent = originalMelodyName;
    melodyLink.setAttribute('data-jqm-dropdown', `#${dropdownID}`);
    melodyLink.title = 'Select notation score or audio.';

    // ------------------------------------------------------------------
    // --- 6. CREATE DROPDOWN CONTENT (Staff, Byzantine, Audio) ---
    // ------------------------------------------------------------------

    const dropdownDiv = document.createElement('div');
    dropdownDiv.id = dropdownID;
    dropdownDiv.className = 'jqm-dropdown jqm-dropdown-tip alwb-media-dropdown-div';

    const dropdownList = document.createElement('ul');
    dropdownList.className = 'jqm-dropdown-menu jqm-dropdown-relative alwb-media-dropdown-menu';

    const linkOptions = [
      { type: 'score', notation: 'w', label: 'Staff' },
      { type: 'score', notation: 'b', label: 'Byzantine' },
      { type: 'audio', notation: null, label: 'Audio' }
    ];

    linkOptions.forEach(option => {
      let finalUrl = '';
      let targetAttr = '';
      let personCode = '';
      let linkClasses = '';

      if (option.type === 'score') {
        personCode = PERSON_MAP[langCode].score[option.notation];

        // 1. Construct the file path *relative to the /media/scores/ directory*
        const scoreFilePath =
          `${personCode}/` +
          `${langCode}/` +
          pathSegments +
          `${option.notation}/`;

        const fullScorePath = scoreFilePath + fileNameSegment + '.pdf';

        // 2. APPLY THE FIX
        finalUrl = getScoreUrlFinalAndSimplest(fullScorePath);

        targetAttr = 'FrameScore';

      } else { // Audio
        personCode = PERSON_MAP[langCode].audio.default;

        const audioFilePath =
          `${personCode}/` +
          `${langCode}/` +
          pathSegments;

        finalUrl = audioMediaRoot + audioFilePath + fileNameSegment + '.mp3';
        linkClasses = 'audio-link-trigger'; // Class for player interception
      }

      const listItem = document.createElement('li');
      const linkElement = document.createElement('a');

      linkElement.href = finalUrl;
      linkElement.textContent = option.label;

      if (targetAttr) {
        linkElement.target = targetAttr;
      }
      if (linkClasses) {
        linkElement.className = linkClasses;
      }

      listItem.appendChild(linkElement);
      dropdownList.appendChild(listItem);
    });

    // Assemble the dropdown structure
    dropdownDiv.appendChild(dropdownList);

    // --- 7. FINAL REPLACEMENT (omitted for brevity) ---
    span.innerHTML = '';
    span.appendChild(melodyLink);
    span.appendChild(dropdownDiv);
  });

  // -----------------------------------------------------------------------
  // --- POST-PROCESSING: MANUAL CLICK BINDING FOR AUDIO (CORRECTED) ---
  // The core player logic is in window.showPlayer(audioUrl). Call it directly.
  $('body').on('click', '.audio-link-trigger', function (e) {
    e.preventDefault(); // Stop the browser from navigating

    const audioUrl = $(this).attr('href');
    const $link = $(this);

    console.log(`🎤 Click intercepted. DIRECTLY calling window.showPlayer with URL: ${audioUrl}`);

    // **FIX**: Call window.showPlayer, the public function that handles creation/update/playback.
    if (typeof window.showPlayer === 'function') {
      window.showPlayer(audioUrl);
    } else {
      console.warn('⚠️ window.showPlayer() function not found. Audio link may not play.');
    }

    // Hide the dropdown menu (good UX practice)
    $link.closest('.jqm-dropdown').removeClass('jqm-dropdown-open');
  });
  console.log('⚙️ Applied jQuery click handler, calling window.showPlayer for playback.');
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // --- INITIAL ATTACHMENT ---
  // ALWB.JS already calls initializeAudioInterception() globally, so we skip this here.
  // If you run this code after the ALWB.JS code, the function will already be called.
  // We only need to ensure the dynamic links call the right playback function (showPlayer).
  // -----------------------------------------------------------------------

  console.log('✅ Function generateDynamicLinks() finished.');
}

// ------------------------------------------------------------------
// --- jQuery Execution Wrapper ---
// NOTE: Make sure the ALWB.JS code runs BEFORE this wrapper.
$(function () {
  generateDynamicLinks();
});
// ------------------------------------------------------------------


async function performUnifiedExport(format) {
  // Target the document of the current page directly
  const currentDoc = document;
  const liveTable = currentDoc.getElementById('biTable') || currentDoc.querySelector('table');
  if (!liveTable) return;

  const firstRow = liveTable.querySelector('tr');
  const isSingleColumn = firstRow ? (Array.from(firstRow.cells).length === 1) : false;

  let exportContainer = currentDoc.createElement('div');
  exportContainer.className = 'dcs-export-wrapper';

  if (isSingleColumn) {
    const cells = liveTable.querySelectorAll('td');
    cells.forEach(cell => {
      const row = cell.closest('tr');
      const style = window.getComputedStyle(row);
      if (style.display === 'none' || style.visibility === 'hidden') return;

      const block = currentDoc.createElement('div');
      block.className = cell.className + ' dcs-block-unit';
      block.innerHTML = cell.innerHTML;

      cleanElement(block, isSingleColumn);

      const text = block.textContent.replace(/[\s\u00a0\t\n\r]/g, '');
      if (text.length > 0 || block.querySelector('img')) {
        exportContainer.appendChild(block);
      }
    });
  } else {
    const tableClone = liveTable.cloneNode(true);
    const rows = tableClone.querySelectorAll('tr');
    rows.forEach(row => {
      const liveEl = currentDoc.getElementById(row.id);
      if (liveEl) {
        const style = window.getComputedStyle(liveEl);
        if (style.display === 'none' || style.visibility === 'hidden' || liveEl.offsetParent === null) {
          row.remove();
          return;
        }
      }
      row.querySelectorAll('td').forEach(td => cleanElement(td, isSingleColumn));
      const text = row.textContent.replace(/[\s\u00a0\t\n\r]/g, '');
      if (text.length === 0 && !row.querySelector('img')) {
        row.remove();
      }
    });
    exportContainer.appendChild(tableClone);
  }

  function cleanElement(el, singleColMode) {
    const selectorsToRemove = [
      'script', 'style', '.jqm-dropdown', '.key', '.noprintdesig',
      '[style*="display: none"]', '[style*="display:none"]',
      '.nodisplay', '.noprintactor', '.noprintrub', '.noprintprayer',
      '[class^="bcc_"]', '[class*=" bcc_"]', '[class^="ecc_"]', '[class*=" ecc_"]',
      '[class^="bmc_"]', '[class*=" bmc_"]', '[class^="emc_"]', '[class*=" emc_"]',
      '[class^="brc_"]', '[class*=" brc_"]', '[class^="erc_"]', '[class*=" erc_"]',
      '[class^="bkmrk"]', '[class*=" bkmrk"]',
      '[class^="source"]', '[class*=" source"]',
      '.dummy', '.sbparishname'
    ];
    el.querySelectorAll(selectorsToRemove.join(',')).forEach(item => item.remove());

    const classesToUnwrap = [
      '.achoir', '.aclergy', '.adeacon', '.ahierarch',
      '.dchoir', '.dclergy', '.ddeacon', '.dhierarch',
      '.dpeople', '.dpriest', '.dwachoir', '.dwadeacon',
      '.kvp'
    ];
    classesToUnwrap.forEach(s => {
      el.querySelectorAll(s).forEach(item => {
        item.replaceWith(...item.childNodes);
      });
    });

    el.querySelectorAll('*').forEach(child => {
      child.style.float = 'none';
      child.style.position = 'static';
      if (singleColMode) {
        child.style.width = 'auto';
        child.style.maxWidth = '100%';
      }
    });
  }

  const fileName = currentDoc.title || "Service_Export";

  let displayTitle = "Divine Services";
  if (fileName.includes('.li')) displayTitle = "Divine Liturgy";
  else if (fileName.includes('.ma')) displayTitle = "Matins";
  else if (fileName.includes('.ve')) displayTitle = "Vespers";

  if (format === 'word') {
    await generateWordFile(exportContainer, fileName, isSingleColumn, displayTitle);
  } else {
    await generatePDFFile(exportContainer, fileName, isSingleColumn, displayTitle);
  }
}

function generatePDFFile(element, filename, isSingleColumn, displayTitle = "Divine Services") {
  const clone = element.cloneNode(true);

  // 1. Detect if Greek or English is hidden on the live page
  const hideGreek = document.querySelector('.leftCell[style*="display: none"], td.leftCell.nodisplay, .hide-greek') !== null ||
    document.body.classList.contains('english-only');

  const hideEnglish = document.querySelector('.rightCell[style*="display: none"], td.rightCell.nodisplay, .hide-english') !== null ||
    document.body.classList.contains('greek-only');

  // 2. Remove the hidden language table cells directly from the clone
  if (hideGreek) {
    clone.querySelectorAll('td.leftCell, .leftCell').forEach(el => el.remove());
  }
  if (hideEnglish) {
    clone.querySelectorAll('td.rightCell, .rightCell').forEach(el => el.remove());
  }

  // 3. Remove standard hidden elements
  const hiddenSelectors = '.nodisplay, .noprintactor, .noprintrub, .noprintprayer, [style*="display: none"], .sbparishname';
  clone.querySelectorAll(hiddenSelectors).forEach(el => el.remove());

  // 4. Clean up any table rows that are now empty
  clone.querySelectorAll('tr').forEach(tr => {
    if (!tr.textContent.trim()) tr.remove();
  });

  // 5. Strip trailing empty paragraph or div nodes
  const children = clone.querySelectorAll('p, div, br');
  for (let i = children.length - 1; i >= 0; i--) {
    const node = children[i];
    if (!node.textContent.trim() && !node.querySelector('img')) {
      node.remove();
    } else {
      break;
    }
  }

  // 6. Open the print window and write the document
  const printWin = window.open('', '_blank', 'width=900,height=800');
  const rootURL = `https://dcs.goarch.org/goa/dcs/`;

  printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <base href="${rootURL}">
            <title>${filename}</title>
            <link rel="stylesheet" href="css/dcs_word_styles.css">
            <style>
                @page {
                    size: 8.5in 11in;
                    margin-top: 1.1in; 
                    margin-right: 0.75in;
                    margin-bottom: 1.0in;
                    margin-left: 0.75in;

                    @top-center {
                        content: "${displayTitle}";
                        font-family: "Times New Roman", serif;
                        font-size: 11pt;
                        color: #a91827;
                        width: 100%;
                        border-bottom: 0.4pt solid #C0C0C0;
                        vertical-align: bottom;
                        padding-bottom: 5pt; 
                        margin-bottom: 10pt;
                    }
                }

                @page :right {
                    @bottom-left {
                        content: "Powered by Digital Chant Stand: A National Ministry of the Greek Orthodox Archdiocese of America";
                        font-family: serif; font-size: 8pt; font-style: italic; color: #a91827;
                        border-top: 0.1pt solid #a91827;
                        vertical-align: top;
                        padding-top: 10pt;
                    }
                    @bottom-right {
                        content: counter(page);
                        font-family: serif; font-size: 9pt; color: #a91827;
                        border-top: 0.1pt solid #a91827;
                        vertical-align: top;
                        padding-top: 10pt;
                        text-align: right;
                    }
                }

                @page :left {
                    @bottom-left {
                        content: counter(page);
                        font-family: serif; font-size: 9pt; color: #a91827;
                        border-top: 0.1pt solid #a91827;
                        vertical-align: top;
                        padding-top: 10pt;
                        text-align: left;
                    }
                    @bottom-right {
                        content: "Powered by Digital Chant Stand: A National Ministry of the Greek Orthodox Archdiocese of America";
                        font-family: serif; font-size: 8pt; font-style: italic; color: #a91827;
                        border-top: 0.1pt solid #a91827;
                        vertical-align: top;
                        padding-top: 10pt;
                        text-align: right;
                    }
                }

                html, body {
                    height: auto !important;
                    overflow: visible !important;
                    margin: 0; padding: 0;
                }

                .dcs-export-container {
                    display: block !important;
                    width: 100% !important;
                }

                p, td {
                    orphans: 2 !important;
                    widows: 2 !important;
                }

                .newspaper-flow {
                    column-count: ${isSingleColumn ? '2' : '1'} !important;
                    column-gap: 30pt;
                    column-fill: auto !important;
                }

                p.actor, p.designation, p.mixed, p.mode, p.melody, p.name, p.servicesourcestitle {
                    break-after: avoid !important;
                    break-inside: avoid !important;
                    page-break-after: avoid !important;
                }

                table {
                    table-layout: fixed;
                    width: 100% !important;
                    border-collapse: collapse;
                }

                td {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                .dcs-export-container > *:last-child {
                    margin-bottom: 0 !important;
                }
            </style>
            
            <script>
                window.onload = function() { 
                    setTimeout(() => { 
                        window.print(); 
                    }, 1000); 
                };
            <\/script>
        </head>
        <body>
            <div class="${isSingleColumn ? 'newspaper-flow' : ''} dcs-export-container">
                ${clone.innerHTML}
            </div>
        </body>
        </html>
  `);

  printWin.document.close();
}

// Helper for cross-browser safe scrolling
function safeScrollIntoView(element, alignToTop) {
  if (!element) return;
  try {
    element.scrollIntoView({
      behavior: 'auto',
      block: alignToTop ? 'start' : 'center'
    });
  } catch (e) {
    // Fallback for legacy browsers expecting boolean parameter
    element.scrollIntoView(alignToTop);
  }
}

// 1. Convert List Table to Calendar View
function convertServicesIndexToCalendar() {
  var indexContent = document.querySelector('.index-content');
  var originalTable = document.querySelector('.services-index-table');
  if (!indexContent || !originalTable) return;

  // Inject responsive CSS Grid styles & List View Highlight styles
  if (!document.getElementById('calendar-grid-styles')) {
    var style = document.createElement('style');
    style.id = 'calendar-grid-styles';
    style.textContent = 
      "html, body, .index-content {\n" +
      "    width: 100% !important;\n" +
      "    margin: 0 !important;\n" +
      "    padding: 0 !important;\n" +
      "    box-sizing: border-box !important;\n" +
      "}\n" +
      ".calendar-stack {\n" +
      "    width: 100%;\n" +
      "    display: flex;\n" +
      "    flex-direction: column;\n" +
      "    gap: 30px;\n" +
      "}\n" +
      ".calendar-container {\n" +
      "    width: 100%;\n" +
      "    box-sizing: border-box;\n" +
      "    padding: 10px;\n" +
      "    scroll-margin-top: 20px;\n" +
      "}\n" +
      ".calendar-header {\n" +
      "    text-align: center;\n" +
      "    font-size: 1.5rem;\n" + /* Fallback for legacy browsers */
      "    font-size: clamp(1.2rem, 4vw, 2rem);\n" +
      "    font-weight: bold;\n" +
      "    margin-bottom: 12px;\n" +
      "    color: #333;\n" +
      "}\n" +
      ".calendar-grid {\n" +
      "    display: grid;\n" +
      "    grid-template-columns: repeat(7, 1fr);\n" +
      "    width: 100%;\n" +
      "    gap: 1px;\n" +
      "    background-color: #ddd;\n" +
      "    border: 1px solid #ddd;\n" +
      "    box-sizing: border-box;\n" +
      "}\n" +
      ".calendar-day-header {\n" +
      "    background-color: #8b0000;\n" +
      "    color: #ffffff;\n" +
      "    text-align: center;\n" +
      "    padding: 10px 0;\n" +
      "    font-weight: bold;\n" +
      "    font-size: 1rem;\n" + /* Fallback for legacy browsers */
      "    font-size: clamp(0.85rem, 2.5vw, 1.2rem);\n" +
      "}\n" +
      ".calendar-cell {\n" +
      "    background-color: #fff;\n" +
      "    position: relative;\n" + /* Required for aspect-ratio fallback */
      "    box-sizing: border-box;\n" +
      "}\n" +
      "/* 1:1 Aspect Ratio Fallback for Pale Moon & older engines */\n" +
      ".calendar-cell::before {\n" +
      "    content: '';\n" +
      "    display: block;\n" +
      "    padding-top: 100%;\n" +
      "}\n" +
      ".calendar-cell.empty {\n" +
      "    background-color: #f9f9f9;\n" +
      "}\n" +
      ".calendar-cell.today {\n" +
      "    background-color: #fff8e1;\n" +
      "    box-shadow: inset 0 0 0 2px #8b0000;\n" +
      "}\n" +
      ".calendar-cell.today .index-day-link {\n" +
      "    color: #8b0000;\n" +
      "    font-weight: bold;\n" +
      "}\n" +
      ".calendar-cell .index-day-link {\n" +
      "    position: absolute;\n" + /* Fill cell via absolute positioning */
      "    top: 0;\n" +
      "    left: 0;\n" +
      "    right: 0;\n" +
      "    bottom: 0;\n" +
      "    display: flex;\n" +
      "    align-items: flex-start;\n" +
      "    justify-content: flex-end;\n" +
      "    width: 100%;\n" +
      "    height: 100%;\n" +
      "    font-weight: bold;\n" +
      "    font-size: 1.2rem;\n" + /* Fallback for legacy browsers */
      "    font-size: clamp(1rem, 3.5vw, 1.6rem);\n" +
      "    text-decoration: none;\n" +
      "    color: #333;\n" +
      "    padding: 10%;\n" +
      "    box-sizing: border-box;\n" +
      "}\n" +
      ".calendar-cell .index-day-link:hover {\n" +
      "    background-color: #f0f4f8;\n" +
      "    color: #8b0000;\n" +
      "}\n" +
      "/* List View Highlight Rules */\n" +
      ".services-index-table tr.today-row td:first-child,\n" +
      ".services-index-table tr.today-row {\n" +
      "    border-left: 4px solid navy !important;\n" +
      "}\n" +
      ".services-index-table tr.today-row a,\n" +
      ".services-index-table tr.today-row td {\n" +
      "    color: navy !important;\n" +
      "    font-weight: bold;\n" +
      "}\n";
    document.head.appendChild(style);
  }

  // Today's date reference for highlighting in both list and calendar views
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth() + 1;
  var currentDay = now.getDate();

  // Parse the table rows using ES5-compatible slice call instead of Array.from
  var rows = Array.prototype.slice.call(originalTable.querySelectorAll('tr'));
  var monthsMap = {};
  var monthKeysOrder = [];
  var currentMonthTitle = "";

  rows.forEach(function (row) {
    var monthSpan = row.querySelector('.index-month');
    var dayLink = row.querySelector('.index-day-link');

    if (monthSpan) {
      currentMonthTitle = monthSpan.textContent.trim();
    } else if (dayLink) {
      var href = dayLink.getAttribute('href');
      // Match YYYYMMDD from filenames like 'indexes/20260810.html'
      var match = href ? href.match(/(\d{4})(\d{2})(\d{2})/) : null;

      if (match) {
        var year = parseInt(match[1], 10);
        var month = parseInt(match[2], 10); // 1-12
        var day = parseInt(match[3], 10);
        var monthKey = match[1] + match[2]; // e.g. "202608"

        // Mark today's row in original table for list view
        if (year === currentYear && month === currentMonth && day === currentDay) {
          row.classList.add('today-row');
        }

        if (!monthsMap[monthKey]) {
          monthsMap[monthKey] = {
            title: currentMonthTitle || (year + "-" + match[2]),
            year: year,
            month: month,
            days: []
          };
          monthKeysOrder.push(monthKey);
        }

        monthsMap[monthKey].days.push({
          dayNumber: day,
          href: href
        });
      }
    }
  });

  // Build stacked calendar objects
  var dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var calendarStack = document.createElement('div');
  calendarStack.className = 'calendar-stack';

  monthKeysOrder.forEach(function (key) {
    var monthData = monthsMap[key];
    if (!monthData || monthData.days.length === 0) return;

    var container = document.createElement('div');
    container.className = 'calendar-container';

    var header = document.createElement('div');
    header.className = 'calendar-header';
    header.textContent = monthData.title;
    container.appendChild(header);

    var grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Weekday Header Row
    dayHeaders.forEach(function (dayName) {
      var th = document.createElement('div');
      th.className = 'calendar-day-header';
      th.textContent = dayName;
      grid.appendChild(th);
    });

    // Calculate starting weekday using exact (Year, Month - 1, Day 1)
    var firstDayDate = new Date(monthData.year, monthData.month - 1, 1);
    var startDayOfWeek = firstDayDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    // Leading empty cells
    for (var i = 0; i < startDayOfWeek; i++) {
      var emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-cell empty';
      grid.appendChild(emptyCell);
    }

    // Active day cells
    monthData.days.forEach(function (day) {
      var cell = document.createElement('div');
      var isToday = (monthData.year === currentYear && monthData.month === currentMonth && day.dayNumber === currentDay);

      cell.className = 'calendar-cell' + (isToday ? ' today' : '');

      var a = document.createElement('a');
      a.className = 'index-day-link';
      a.setAttribute('href', day.href);
      a.textContent = day.dayNumber;

      cell.appendChild(a);
      grid.appendChild(cell);
    });

    // Trailing padding cells to complete the grid row
    var totalCells = startDayOfWeek + monthData.days.length;
    var trailingCells = (7 - (totalCells % 7)) % 7;
    for (var j = 0; j < trailingCells; j++) {
      var padCell = document.createElement('div');
      padCell.className = 'calendar-cell empty';
      grid.appendChild(padCell);
    }

    container.appendChild(grid);
    calendarStack.appendChild(container);
  });

  // Replace original table
  if (originalTable.parentNode) {
    calendarStack._originalTable = originalTable;
    originalTable.parentNode.replaceChild(calendarStack, originalTable);
  }

  // Scroll current month calendar to top of the frame using safe fallback
  var targetKey = currentYear.toString() + (currentMonth < 10 ? '0' : '') + currentMonth;

  var targetIndex = monthKeysOrder.indexOf(targetKey);
  var targetContainer = null;

  if (targetIndex !== -1 && calendarStack.children[targetIndex]) {
    targetContainer = calendarStack.children[targetIndex];
  } else if (calendarStack.children.length > 0) {
    targetContainer = calendarStack.children[0];
  }

  if (targetContainer) {
    safeScrollIntoView(targetContainer, true);
  }
}

// 2. Restore Original List View & Auto-Scroll to Today
function restoreServicesIndexTable() {
  var calendarStack = document.querySelector('.calendar-stack');
  if (!calendarStack || !calendarStack._originalTable) return;

  if (calendarStack.parentNode) {
    var originalTable = calendarStack._originalTable;
    calendarStack.parentNode.replaceChild(originalTable, calendarStack);

    // Scroll today's row into view in list view using safe fallback
    var todayRow = originalTable.querySelector('.today-row');
    if (todayRow) {
      safeScrollIntoView(todayRow, false);
    }
  }
}

// 3. Dynamic Toggle Button Creator
function createViewToggleButtons() {
  // Use indexOf instead of String.includes for legacy JS engines
  if (window.location.pathname.indexOf('servicesindex.html') === -1) return;

  var menuLink = document.querySelector('.agesMenu > a[data-jqm-dropdown]');
  if (!menuLink || document.getElementById('view-toggle-wrapper')) return;

  var wrapper = document.createElement('span');
  wrapper.id = 'view-toggle-wrapper';
  wrapper.style.marginLeft = '10px';

  var calendarBtn = document.createElement('button');
  calendarBtn.type = 'button';
  calendarBtn.className = 'view-toggle-btn';
  calendarBtn.innerHTML = '<i class="fa fa-calendar"></i> Calendar';
  calendarBtn.addEventListener('click', convertServicesIndexToCalendar);

  var listBtn = document.createElement('button');
  listBtn.type = 'button';
  listBtn.className = 'view-toggle-btn';
  listBtn.innerHTML = '<i class="fa fa-list"></i> List View';
  listBtn.addEventListener('click', restoreServicesIndexTable);

  wrapper.appendChild(calendarBtn);
  wrapper.appendChild(listBtn);
  menuLink.parentNode.insertBefore(wrapper, menuLink.nextSibling);
}

// 4. Page Initialization Execution
function initServicesIndexPage() {
  createViewToggleButtons();
  convertServicesIndexToCalendar();
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initServicesIndexPage();
} else {
  document.addEventListener('DOMContentLoaded', initServicesIndexPage);
}

/**
 * Helper function to perform Word document generation and export from an HTML service page.
 */
async function performWordExport(url, serviceName, lang) {
    const cssPath = "https://dcs.goarch.org/goa/dcs/css/dcs_word_styles.css";
    try {
        const resp = await fetch(url);
        const html = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const target = doc.getElementById('biTable') || doc.querySelector('table');
        if (!target) return;

        // STEP 1: HARD REMOVALS
        target.querySelectorAll(`
            [class^="source"], [class*=" source"], 
            .key, [hidden], .media-group, .media-links, 
            .jqm-dropdown, .noprint, i, script, style,
            [class^="bmc"], [class*=" bmc"], 
            [class^="emc"], [class*=" emc"],
            [class^="brc"], [class*=" brc"], 
            [class^="erc"], [class*=" erc"]
        `).forEach(el => el.remove());

        // STEP 2: CLASS SCRUBBER
        const classesToScrub = [
            'kvp', 'achoir', 'aclergy', 'adeacon', 'ahierarch', 'apeople',
            'apriest', 'areader', 'dchoir', 'dclergy', 'ddeacon',
            'dhierarch', 'dpeople', 'dpriest', 'dreader', 'dwachoir',
            'dwaclergy', 'dwadeacon', 'dwahierarch', 'dwapeople',
            'dwapriest', 'dwareader',
            'achclhi', 'aclhi', 'adebl', 'adepr', 'aprhi',
            'dclhi', 'ddepr', 'ddebl', 'dprhi',
            'dwadebl', 'dwadepr', 'dwaprhi'
        ];

        classesToScrub.forEach(className => {
            target.querySelectorAll('.' + className).forEach(el => {
                el.classList.remove(className);
                if (el.hasAttribute('data-key')) el.removeAttribute('data-key');
                if (el.classList.length === 0) el.removeAttribute('class');
            });
        });

        // STEP 3: BOOKMARK SCRUBBER
        target.querySelectorAll('p[class^="bkmrk"]').forEach(p => {
            if (p.textContent.toLowerCase().includes('bookmark')) {
                const row = p.closest('tr');
                if (row) row.remove();
            }
        });

        // STEP 4: DROP-CAP RESET
        target.querySelectorAll('[class*="dropcap"], [class*="first-letter"]').forEach(el => {
            el.style.float = "none";
            el.style.display = "inline";
        });

        // STEP 5: THE VACUUM
        target.querySelectorAll('tr').forEach(row => {
            const hasText = row.textContent.replace(/\u00a0/g, ' ').trim().length > 0;
            const hasImg = row.querySelector('img') !== null;
            if (!hasText && !hasImg) {
                row.remove();
            }
        });

        // STEP 6: FINAL TABLE ATTRIBUTES
        target.removeAttribute('width');
        target.removeAttribute('cellspacing');
        target.removeAttribute('cellpadding');
        target.style.width = "100%";
        target.style.tableLayout = "auto";

        const rows = target.querySelectorAll('tr');
        let isBilingual = false;

        for (let i = 0; i < Math.min(rows.length, 5); i++) {
            if (rows[i].querySelectorAll('td').length > 1) {
                isBilingual = true;
                break;
            }
        }

        const wordColumnCount = isBilingual ? 1 : 2;
        console.log("Bilingual Detected: " + isBilingual + " | Setting Word Columns to: " + wordColumnCount);

        let cssText = "";
        try {
            const cssResp = await fetch(cssPath + "?v=" + new Date().getTime());
            cssText = await cssResp.text();
        } catch (e) {
            console.error("CSS Fetch failed, using fallback empty styles", e);
        }

        const fileContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <style>
                    @page Section1 {
                        size: 8.5in 11.0in;
                        margin: .75in;
                        mso-columns: ${wordColumnCount};
                        mso-column-sep: .25in;
                    }
                    div.Section1 { 
                        page: Section1; 
                    }
                    ${cssText}
                </style>
            </head>
            <body>
                <div class="Section1">
                    ${target.outerHTML}
                </div>
            </body>
            </html>`;

        const blob = new Blob(['\ufeff' + fileContent], { type: 'application/msword' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = serviceName.replace(/[\/\\?%*:|"<>]/g, '-') + '.doc';
        downloadLink.click();
    } catch (e) {
        console.error("DCS Export Error:", e);
    }
}

/**
 * Transforms legacy service index tables into structured service cards.
 * Executes if the page matches the pattern: .../dcs/indexes/YYYYMMDD.html
 */
function transformIndexLayout() {
    // Verify the URL pattern ends with 'dcs/indexes/YYYYMMDD.html' or contains '/indexes/'
    const pathRegex = /\/dcs\/indexes\/\d{8}\.html$/i;
    if (!pathRegex.test(window.location.pathname) && !window.location.pathname.includes('/indexes/')) {
        return;
    }

    const table = document.querySelector('.index-content table');
    if (!table) return;

    // 1. Inject styling for card layout, rows, language buttons, and flag colors
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .service-group-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
        }
        .service-card {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            padding: 0.85rem 1rem;
            background-color: #f9f9f9;
            border-radius: 4px;
            border-left: 4px solid #8b0000;
        }
        .service-card-title {
            font-weight: bold;
            font-size: 1rem;
            color: #a91827;
            margin-bottom: 0.2rem;
        }
        .service-type-row {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding-left: 1rem;
        }
        .service-type-label {
            font-weight: bold;
            min-width: 105px;
            font-size: 1rem;
            color: #333;
        }
        .service-btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .lang-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.35rem 0.75rem;
            background-color: #ffffff;
            border: 1px solid #ccc;
            border-radius: 4px;
            color: #333;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            font-family: inherit;
            line-height: inherit;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }
        .lang-btn:hover {
            background-color: #f0f0f0;
            border-color: #a91827;
            text-decoration: none;
        }
        /* Color declarations for flag text */
        .text-gr {
            color: #0D5EAF;
        }
        .text-en {
            color: #B22234;
        }
    `;
    document.head.appendChild(styleEl);

    // Helper to generate flag-colored inner HTML for buttons
    function formatLangHTML(rawLangText) {
        const upperLang = rawLangText.toUpperCase();
        if (upperLang === 'GR') {
            return '<span class="text-gr">Greek</span>';
        } else if (upperLang === 'EN') {
            return '<span class="text-en">English</span>';
        } else if (upperLang === 'GR-EN') {
            return '<span class="text-gr">GR</span>–<span class="text-en">EN</span>';
        }
        return rawLangText;
    }

    // Extract page header date string if available
    const fullDateHeader = document.querySelector('.index-title-date')?.innerText || "";
    const dateMatch = fullDateHeader.match(/Services for\s+(.*)/i);
    const dateStr = dateMatch ? dateMatch[1].trim() : "";

    // 2. Parse table rows and categorize options into Web View, Print-PDF, and Word Export
    const services = [];
    let currentService = null;

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.classList.contains('index-service-day-tr')) {
            const titleSpan = row.querySelector('.index-service-day');
            if (titleSpan) {
                currentService = {
                    title: titleSpan.textContent.trim(),
                    categories: {
                        'Web View': [],
                        'Print-PDF': [],
                        'Word Export': []
                    }
                };
                services.push(currentService);
            }
        } else if (row.classList.contains('index-service-language-tr') && currentService) {
            const langSpan = row.querySelector('.index-language');
            const linkAnchor = row.querySelector('a.index-file-link');

            if (langSpan && linkAnchor) {
                const rawLangText = langSpan.textContent.trim();
                const upperLang = rawLangText.toUpperCase();
                const href = linkAnchor.getAttribute('href') || '';
                const linkText = linkAnchor.textContent.trim().toLowerCase();

                const isPdf = href.toLowerCase().endsWith('.pdf') || linkText.includes('pdf') || linkText.includes('print');
                const category = isPdf ? 'Print-PDF' : 'Web View';

                // Clone original anchor and format as a button
                const btnAnchor = linkAnchor.cloneNode(true);
                btnAnchor.className = 'lang-btn';
                btnAnchor.innerHTML = formatLangHTML(rawLangText);
                btnAnchor.dataset.langCode = upperLang;

                currentService.categories[category].push(btnAnchor);

              // For web view HTML links (excluding Matins-Customizable /ma2/ links), generate Word Export button
              if (!isPdf && !href.includes('/ma2/')) {
                    const exportBtn = document.createElement('button');
                    exportBtn.type = 'button';
                    exportBtn.className = 'lang-btn';
                    exportBtn.innerHTML = formatLangHTML(rawLangText);
                    exportBtn.dataset.langCode = upperLang;

                    exportBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const fileName = `${dateStr} ${currentService.title} ${rawLangText}`.trim();
                        performWordExport(linkAnchor.href, fileName, rawLangText);
                    });

                    currentService.categories['Word Export'].push(exportBtn);
                }
            }
        }
    });

    // Priority sequence for language button ordering
    const langOrder = ['GR', 'GR-EN', 'EN'];

    // 3. Construct new DOM layout
    const container = document.createElement('div');
    container.className = 'service-group-container';

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';

        const cardTitle = document.createElement('div');
        cardTitle.className = 'service-card-title index-service-day';
        cardTitle.textContent = service.title;
        card.appendChild(cardTitle);

        ['Web View', 'Print-PDF', 'Word Export'].forEach(category => {
            const buttons = service.categories[category];
            if (buttons && buttons.length > 0) {

                // Sort buttons strictly according to GR -> GR-EN -> EN sequence
                buttons.sort((a, b) => {
                    const codeA = a.dataset.langCode;
                    const codeB = b.dataset.langCode;

                    let idxA = langOrder.indexOf(codeA);
                    let idxB = langOrder.indexOf(codeB);

                    if (idxA === -1) idxA = 99;
                    if (idxB === -1) idxB = 99;

                    return idxA - idxB;
                });

                const typeRow = document.createElement('div');
                typeRow.className = 'service-type-row';

                const label = document.createElement('span');
                label.className = 'service-type-label';
                label.textContent = category + ':';
                typeRow.appendChild(label);

                const btnGroup = document.createElement('div');
                btnGroup.className = 'service-btn-group';

                buttons.forEach(btn => btnGroup.appendChild(btn));
                typeRow.appendChild(btnGroup);

                card.appendChild(typeRow);
            }
        });

        container.appendChild(card);
    });

    // 4. Replace original legacy table
    if (table.parentNode) {
        table.parentNode.replaceChild(container, table);
    }
}

// Auto-run on DOMContentLoaded or immediate execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', transformIndexLayout);
} else {
    transformIndexLayout();
}

/* ********************* NEW MATINS ORDINARY */

async function fetchMatinsHTML() {

  const currentUrl = window.location.href.toLowerCase();
  const referrerUrl = (document.referrer || "").toLowerCase();

  // Exclude sb-matins.html and sb-hmatins.html explicitly
  const isExcludedFile =
    currentUrl.includes('sb-matins.html') ||
    currentUrl.includes('sb-hmatins.html') ||
    referrerUrl.includes('sb-matins.html') ||
    referrerUrl.includes('sb-hmatins.html');

  // Must contain /ma/ or /ma[digit except 2 or 8] in the path
  const maPattern = /\/ma([01345679]|\/)/i;
  const hasAllowedPattern = maPattern.test(currentUrl) || maPattern.test(referrerUrl);

  if (isExcludedFile || !hasAllowedPattern) {
    console.log("insertMatinsOrdinary() blocked via URL pattern check.");
    return; // Exit early
  }
  
  /* ********************************* */

  let fetchedHTMLContentMat = null;
  try {
    const response = await fetch(`https://dcs.goarch.org/goa/dcs/h/b/sb/mat/gr-en/index.html`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Extract raw markup as plain string text
    fetchedHTMLContentMat = await response.text();

  } catch (error) {
    console.error(`Could not fetch "mat":`, error);

    const errorFallbackHTML = `<p style="color:red; font-weight:bold;">Error loading target template asset (mat).</p>`;

    fetchedHTMLContentMat = errorFallbackHTML;

  }
  console.log("Fetch complete!");
  executeContentSwap(swapMapping['matins_ordinary_section1_paschal_yes'], fetchedHTMLContentMat);
  executeContentSwap(swapMapping['matins_ordinary_section1_ascension_yes'], fetchedHTMLContentMat);
  executeContentSwap(swapMapping['matins_ordinary_section1_normal_yes'], fetchedHTMLContentMat);
  executeContentSwap(swapMapping['matins_ordinary_section2_prayers_yes'], fetchedHTMLContentMat);
  executeContentSwap(swapMapping['matins_ordinary_section3_psalms_litany_yes'], fetchedHTMLContentMat);
  hideGreekInEnglishOnlyService();
  hideEnglishInGreekOnlyService();
  convertClassToId();
}

function executeContentSwap(key, fetchedHTMLContentMat) {

  // Parse the global HTML string directly from memory
  const parser = new DOMParser();
  let sourceDocNode = parser.parseFromString(fetchedHTMLContentMat, 'text/html');

  const targetDocNode = window.document;

  // 1. Locate Source Boundaries natively
  const srcStartEl = sourceDocNode.querySelector(`.${key.sourceBegin}`);
  const srcEndEl = sourceDocNode.querySelector(`.${key.sourceEnd}`);
  const srcStart = srcStartEl ? srcStartEl.closest('tr') : null;
  const srcEnd = srcEndEl ? srcEndEl.closest('tr') : null;

  // 2. Locate Target Boundaries natively
  const targetStartEl = targetDocNode.querySelector(`.${key.targetBegin}`);
  const targetEndEl = targetDocNode.querySelector(`.${key.targetEnd}`);
  const targetStart = targetStartEl ? targetStartEl.closest('tr') : null;
  const targetEnd = targetEndEl ? targetEndEl.closest('tr') : null;

  if (!srcStart || !srcEnd || !targetStart || !targetEnd) {
    console.error("One or more boundaries not found. Swap aborted." + key.targetBegin);
    console.log(`srcStart: ${srcStart ? "Found" : "Missing"}`);
    console.log(`srcEnd: ${srcEnd ? "Found" : "Missing"}`);
    console.log(`targetStart: ${targetStart ? "Found" : "Missing"}`);
    console.log(`targetEnd: ${targetEnd ? "Found" : "Missing"}`);
    return;
  }

  // 3. Capture the "Middle" Content
  const contentFromSource = getNextUntilSiblings(srcStart, srcEnd);
  const contentFromTarget = getNextUntilSiblings(targetStart, targetEnd);

  // 4. Perform the Swap in Target Document
  removeNextUntilSiblings(targetStart, targetEnd);
  insertAfter(targetStart, contentFromSource);

  // 5. Perform the Swap in Source Document
  removeNextUntilSiblings(srcStart, srcEnd);
  insertAfter(srcStart, contentFromTarget);
}

/* --- VANILLA HOOK UTILITIES --- */

function getNextUntilSiblings(startNode, endNode) {
  const siblings = [];
  let next = startNode.nextElementSibling;
  while (next && next !== endNode) {
    siblings.push(next.cloneNode(true));
    next = next.nextElementSibling;
  }
  return siblings;
}

function removeNextUntilSiblings(startNode, endNode) {
  let next = startNode.nextElementSibling;
  while (next && next !== endNode) {
    const nodeToRemove = next;
    next = next.nextElementSibling;
    nodeToRemove.remove();
  }
}

function insertAfter(referenceNode, newNodesArray) {
  for (let i = newNodesArray.length - 1; i >= 0; i--) {
    referenceNode.insertAdjacentElement('afterend', newNodesArray[i]);
  }
}

const swapMapping = {
  'matins_ordinary_section1_paschal_yes': {
    targetBegin: 'brc_ma_matins_ordinary_section1_paschal',
    targetEnd: 'erc_ma_matins_ordinary_section1_paschal',
    sourceDoc: 'mat',
    sourceBegin: 'brc_ma_matins_ordinary_section1_paschal',
    sourceEnd: 'erc_ma_matins_ordinary_section1_paschal'
  },

  'matins_ordinary_section1_ascension_yes': {
    targetBegin: 'brc_ma_matins_ordinary_section1_ascension',
    targetEnd: 'erc_ma_matins_ordinary_section1_ascension',
    sourceDoc: 'mat',
    sourceBegin: 'brc_ma_matins_ordinary_section1_ascension',
    sourceEnd: 'erc_ma_matins_ordinary_section1_ascension'
  },

  'matins_ordinary_section1_normal_yes': {
    targetBegin: 'brc_ma_matins_ordinary_section1_normal',
    targetEnd: 'erc_ma_matins_ordinary_section1_normal',
    sourceDoc: 'mat',
    sourceBegin: 'brc_ma_matins_ordinary_section1_normal',
    sourceEnd: 'erc_ma_matins_ordinary_section1_normal'
  },

  'matins_ordinary_section2_prayers_yes': {
    targetBegin: 'brc_ma_matins_ordinary_section2_prayers',
    targetEnd: 'erc_ma_matins_ordinary_section2_prayers',
    sourceDoc: 'mat',
    sourceBegin: 'brc_ma_matins_ordinary_section2_prayers',
    sourceEnd: 'erc_ma_matins_ordinary_section2_prayers'
  },

  'matins_ordinary_section3_psalms_litany_yes': {
    targetBegin: 'brc_ma_matins_ordinary_section3_psalms_litany',
    targetEnd: 'erc_ma_matins_ordinary_section3_psalms_litany',
    sourceDoc: 'mat',
    sourceBegin: 'brc_ma_matins_ordinary_section3_psalms_litany',
    sourceEnd: 'erc_ma_matins_ordinary_section3_psalms_litany'
  }
}


/**
 * Fetches the base Matins asset and executes all insertion swaps.
 */
async function loadAndSwapMatinsOrdinary() {
  let fetchedHTMLContentMat = null;

  try {
    const response = await fetch(`https://dcs.goarch.org/goa/dcs/h/b/sb/mat/gr-en/index.html`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    fetchedHTMLContentMat = await response.text();
  } catch (error) {
    console.error(`Could not fetch "mat":`, error);
    fetchedHTMLContentMat = `<p style="color:red; font-weight:bold;">Error loading target template asset (mat).</p>`;
  }

  console.log("Fetch complete!");

  // Execute insertion swaps using mapping keys
  executeContentSwap(swapMapping['matins_ordinary_section1_paschal_yes'], fetchedHTMLContentMat);
  executeContentSwap(swapMapping['matins_ordinary_section1_ascension_yes'], fetchedHTMLContentMat);
  executeContentSwap(swapMapping['matins_ordinary_section1_normal_yes'], fetchedHTMLContentMat);
  executeContentSwap(swapMapping['matins_ordinary_section2_prayers_yes'], fetchedHTMLContentMat);
  executeContentSwap(swapMapping['matins_ordinary_section3_psalms_litany_yes'], fetchedHTMLContentMat);

  if (typeof hideGreekInEnglishOnlyService === "function") hideGreekInEnglishOnlyService();
  if (typeof hideEnglishInGreekOnlyService === "function") hideEnglishInGreekOnlyService();
//  hideGreekInEnglishOnlyService();
//  hideEnglishInGreekOnlyService();
  convertClassToId();
}

/**
 * Clears rows sitting between target boundary markers without requiring a dummy source doc.
 */
function clearContentBetweenBoundaries(key) {
  const targetDocNode = window.document;

  const targetStartEl = targetDocNode.querySelector(`.${key.targetBegin}`);
  const targetEndEl = targetDocNode.querySelector(`.${key.targetEnd}`);

  const targetStart = targetStartEl ? targetStartEl.closest('tr') : null;
  const targetEnd = targetEndEl ? targetEndEl.closest('tr') : null;

  if (!targetStart || !targetEnd) {
    console.error("Target boundaries missing for clearing: " + key.targetBegin);
    return;
  }

  removeNextUntilSiblings(targetStart, targetEnd);
}

/**
 * Clears all injected Matins Ordinary sections from the DOM.
 */
function removeMatinsOrdinarySections() {
  clearContentBetweenBoundaries(swapMapping['matins_ordinary_section1_paschal_yes']);
  clearContentBetweenBoundaries(swapMapping['matins_ordinary_section1_ascension_yes']);
  clearContentBetweenBoundaries(swapMapping['matins_ordinary_section1_normal_yes']);
  clearContentBetweenBoundaries(swapMapping['matins_ordinary_section2_prayers_yes']);
  clearContentBetweenBoundaries(swapMapping['matins_ordinary_section3_psalms_litany_yes']);

  console.log("Matins Ordinary content cleared.");
}




