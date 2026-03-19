function ParishHideAllLeft () {
  $("td").css("display","");
  $("div.media-group-empty").css("display","");
  $("div.media-group-empty").addClass("m-g-e");
  $("tr:has(p.alttext,p.chant,p.heirmos,p.hymn,p.hymnlinefirst,p.hymnlinemiddle,p.hymnlinelast,p.prayer,p.prayerzero,p.verse,p.versecenter,p.inaudible,p.dialog,p.dialogzero,p.reading,p.readingzero,p.readingcenter,p.readingcenterzero,p.rubric,.media-group,.dialogafteractor,p.iambiccanon1,p.iambiccanon234,p.iambiccanon5)").attr("onclick","swapLang(this)");
  $(".media-icon,i,li").attr("onmousedown","stopSwap(this)");
  $(".media-icon,i,li").attr("onmouseout","resumeSwap(this)");
  $("td:even").css("background-color","#FFF7E6");
  $("td:even").css("display","none");
  $("td").css("border","0");

  // Added
  $('.fa-columns.ages-col-picker').show();
  $('.fa-caret-square-o-right.ages-col-picker').hide();
  $('.fa-caret-square-o-left.ages-col-picker').show();

  displayingBilingual = false;
}

function ParishHideAllMedia (){
	$("div.media-group").css("display","none");
}

document.addEventListener('DOMContentLoaded', function() {
	  const urlParams = new URLSearchParams(window.location.search);
	  const runScript = urlParams.get('run_script');

	  if (runScript !== null) { // Check if the parameter exists (any value will trigger the function)
	    const script = document.createElement('script');
	    script.src = 'parish.js'; // Path to your parish.js file

	    script.onload = function() {
	    	ParishHideAllLeft();  // Call the function after the script is loaded.
	    	ParishHideAllMedia ();	    	
	    }

	    document.head.appendChild(script); // Add the script to the head of the document.
	  }
	});
