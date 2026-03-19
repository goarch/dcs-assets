$(function () {
    // This selector targets any <ul> whose ID starts with "dcs_tree_"
    var $allTrees = $("ul[id^='dcs_tree_']");

    // 1. Process all list items in all trees
    $allTrees.find("li").each(function() {
        if ($(this).children('ul').length > 0) {
            $(this).addClass('treeparent');
        } else {
            var na_patt = /NA.pdf$/i;
            if (na_patt.test($(this).attr('dcslink'))) {
                $(this).addClass('notavailable');
            }

            var dcs_link = ($(this).attr('dcslink')) ? $(this).attr('dcslink') : "#";
            var dcs_html = $(this).html(); 

            var pdf_patt = /.pdf/i;
            var mp3_patt = /.mp3/i;
            var m4a_patt = /.m4a/i;
            var html_patt = /.html/i;
            var p_patt = /p\//i;

            var dcs_target;
            if (mp3_patt.test($(this).attr('dcslink')) || m4a_patt.test($(this).attr('dcslink'))) {
                dcs_target = "FrameAudio";
            } else if (p_patt.test($(this).attr('dcslink')) || pdf_patt.test($(this).attr('dcslink'))) {
                dcs_target = "FrameScore";
            } else if (html_patt.test($(this).attr('dcslink'))) {
                dcs_target = "FrameText";
            } else {
                dcs_target = "_blank";
            }

            $(this).html("<a href='"+dcs_link+"' target='"+dcs_target+"'>" + dcs_html + "</a>");
            
            $(this).click(function(event) {
                event.stopPropagation();
            });
        }
    });

    // 2. Handle the click event for expanding/collapsing
    $allTrees.on('click', '.treeparent', function(event) {
        event.stopPropagation();
        $(this).children('ul').toggle();
    });

    // 3. Initial state: hide all nested children (collapsed by default)
    $allTrees.find(".treeparent").children('ul').hide();
});