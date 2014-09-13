//Set up variables
//active is to track if the button has been pressed
var active = 0;
	smallIdle = chrome.extension.getURL('img/smallIdle.png');
	largeIdle = chrome.extension.getURL('img/largeIdle.png');
	button = '<div class="ytp-button" id="ytResize" role="button" aria-label="youtubeResize" tabindex="6850"></div>';
	buttonOn = 0;

//----------------------------------------
//this detects when a url changes without page reload
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	addButton();
	correctRelated();
});

//----------------------------------------
//Add the button if it does not exist
function addButton(){
	//check if the button is added, and if so end
	if (buttonOn == 1) {
		return;
	}
	//if the button is not added, run loadButton and create it
	if (buttonOn == 0){
		loadButton();
	}
}

//---------------------------------------
//Create the button and add click event
function loadButton () {
	$('.ytp-button-fullscreen-enter').after(button);
	$('#ytResize').css("background", "no-repeat url(" + largeIdle + ") 0px 1px");
	buttonOn=1;
	$('#ytResize').click(resizePlayer);
}
//-------------------------------------	
//Since new videos are loaded without a full page reload, this is to stop the related videos column from breaking
function correctRelated () {
	if ($('#player').css("margin")=='0px'){
		$('#watch7-sidebar').attr("style", "margin-top:10px; top:0;position:absolute");
		//Debug
		//console.log("Trying to fix related videos");
	} else {
		//Debug
		//console.log("Found no issue with related videos");
	}
}
//--------------------------------------
//If the button has been pressed and the user resizes their window, update video player size
//TODO Not working too well after youtube update
$(window).resize(function(){
	if (active === 1){
		//update window size
		$window = $(window);
		winH = $window.height();
		winW = $window.width();
		$('#player-api').height(winH-50).width(winW);
		$('#movie_player > div.html5-video-container > div.html5-video-content').height(winH - 50).width(winW - 50);
	}
});
//---------------------------------------
//This code adds css to the head so I can manipulate CSS classes reasonably well, rather than using inline styles
//more discussion and original snippet at http://stackoverflow.com/questions/7125453/modifying-css-class-property-values-on-the-fly-with-javascript-jquery
function setStyle(cssText) {
    var sheet = document.createElement('style');
    sheet.type = 'text/css';
    /* Optional */ window.customSheet = sheet;
    (document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
    return (setStyle = function(cssText, node) {
        if(!node || node.parentNode !== sheet)
            return sheet.appendChild(document.createTextNode(cssText));
        node.nodeValue = cssText;
        return node;
    })(cssText);
};

//---------------------------------------
//The actual resize function
function resizePlayer () {
	//update window size
	var progress, pH, pW;
	$window = $(window);
	winH = $window.height();
	winW = $window.width();
	//adjust for youtube header
	winHhead = winH - 50;
	
	if (active == 0){
		//Make the progress bar stuff centered, a good enough way to solve the inabilty to scale the whole bar
		//TODO Scale the whole bar, haha.  Problem is that it's being set with inline styles from a function and I can't
		//quite navigate youtube's rather cryptic variables quite well enough to find where they grab the width value
		setStyle('.ytp-progress-bar-container { width:854px;margin:auto;}',progress);
		//Edit CSS so player fits screen properly
		$('#player-api').height(winHhead).width(winW);
		$('#player').height(winHhead).width(winW);
		//Also resize the video itself, sometimes does not stretch
		$('video.html5-main-video').height(winH-50).width(winW);
		$('#player-api').css("margin", 0);
		$('#player').css("margin", 0);
		$('#watch7-sidebar').attr("style", "margin-top:10px; top:0;position:absolute");
		//Hide the Theatre Mode button
		$('.ytp-size-toggle-small').hide();
		$('.ytp-size-toggle-large').hide();
		//Change ytResize button
		$('#ytResize').css("background-image", "url(" + smallIdle + ")");
		//Set active
		active = 1;
		//Debug
		//console.log("After button pressed and active is 0 found; " + active);
	} else {
		//clear the setStyle styles
		setStyle('', progress);
		//Remove the edits
		$('#player').removeAttr("style");
		$('#player-api').removeAttr("style");
		$('video.html5-main-video').removeAttr("style");
		$('#player').removeAttr("style");
		$('#watch7-sidebar').removeAttr("style");
		//Show the Theatre Mode button again
		$('.ytp-size-toggle-small').show();
		$('.ytp-size-toggle-large').show().delay(300);
		//Switch the ytResize button back
		$('#ytResize').css("background", "no-repeat url(" + largeIdle + ") 0px 1px");
		//Remove active
		active=0;
		//Debug
		//console.log("Button press with active=1, now =" + active);
	}
};