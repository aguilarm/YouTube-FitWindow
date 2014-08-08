//Set up variables
//active is to track if the button has been pressed
var active = 0;
	smallIdle = chrome.extension.getURL('img/smallIdle.png');
	largeIdle = chrome.extension.getURL('img/largeIdle.png');
	button = '<div class="ytp-button" id="ytResize" role="button" aria-label="youtubeResize" tabindex="6850"></div>';
	buttonOn = 0;

//this detects when a url changes without page reload
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	addButton();
	correctRelated();
	console.log('URL CHANGED (WITHOUT RELOAD?): ' + request.data.url);
});

//----------------------------------------
//Add the button if it does not exist
function addButton(){
	//check if the button is added, and if so end
	if (buttonOn == 1) {
		console.log('buttonOn was true, didnt loadButton');
		return;
	}
	//if the button is not added, run loadButton and create it
	if (buttonOn == 0){
		console.log('sending loadButton call');
		loadButton();
	}
}


//---------------------------------------
//Create the button and add click event
function loadButton () {
	console.log('loading button');
	$('.ytp-button-fullscreen-enter').after(button);
	$('#ytResize').css("background", "no-repeat url(" + largeIdle + ") 0px 1px");
	buttonOn=1;
	$('#ytResize').click(resizePlayer);
}
//-------------------------------------	
//Since new videos are loaded without a full page reload, this is to stop the related videos column from breaking
function correctRelated () {
	if ($('#player').css("margin")=='0px'){
		$('#watch7-sidebar').attr("style", "margin:0!important; top:0");
		//Debug
		//console.log("Trying to fix related videos");
	} else {
		//Debug
		//console.log("Found no issue with related videos");
	}
}
	

//If the button has been pressed and the user resizes their window, update video player size
$(window).resize(function(){
	if (active === 1){
		$window = $(window);
		winH = $window.height();
		winW = $window.width();
		$('#player-api').height(winH-50).width(winW);
		$('#movie_player > div.html5-video-container > div.html5-video-content').height(winH - 50).width(winW - 50);
	}
});

//The actual resize function
function resizePlayer () {
	
	$window = $(window);
	winH = $window.height();
	winW = $window.width();
	
	if (active == 0){
		//Edit CSS so player fits screen properly
		$('#player-api').height(winH - 50).width(winW);
		$('#player').height(winH - 50).width(winW);
		//Also resize the video itself, sometimes does not stretch
		$('video.html5-main-video').height(winH-50).width(winW);
		//$('#movie_player > div.html5-video-container > div.html5-video-content').width(winW);
		console.log('WE NEED TO RESIZE BETTER');
		//$('#movie_player').width(winW);
		$('#player-api').css("margin", 0);
		$('#player').css("margin", 0);
		$('#watch7-sidebar').attr("style", "margin:0!important; top:0");
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