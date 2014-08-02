//Set up variables
active = 0;
smallIdle = chrome.extension.getURL('img/smallIdle.png');
largeIdle = chrome.extension.getURL('img/largeIdle.png');


//Load the button, and to overcome the xhr/ajax loads of youtube check for the button periodically
var button = '<div class="ytp-button" id="ytResize" role="button" aria-label="youtubeResize" tabindex="6850"></div>';
var buttonOn = 0;
var loadButton = setInterval(function(){
	if (buttonOn == 0){
		$('.ytp-button-fullscreen-enter').after(button);
		$('#ytResize').css({
			"float": "right",
			"background": "no-repeat url(" + largeIdle + ") 0px 1px",
			"background-size": "auto",
			"width": "30px",
			"height": "27px",
		});
		//Add event listener to the button
		$('#ytResize').click(resizePlayer);
		buttonOn=1;
		//Debug
		//console.log("buttonOn = " + buttonOn);
		}
	}, 1000);
	

	
//Since new videos are loaded without a full page reload, this is to stop the related videos column from breaking
var correctRelated = setInterval(function(){
	if ($('#player').css("margin")=='0px'){
		$('#watch7-sidebar').attr("style", "margin:0!important; top:0");
		//Debug
		//console.log("Trying to fix related videos");
	} else {
		//Debug
		//console.log("Found no issue with related videos");
	}
}, 1000);
	
//If the button has been pressed and the user resizes their window, update video player size
$(window).resize(function(){
	if (active === 1){
		$window = $(window);
		winH = $window.height();
		winW = $window.width();
		$('#player-api').height(winH-50).width(winW);
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
		$('#player-api').css("margin", 0);
		$('#player').css("margin", 0);
		//Had to use 'attr' instead of 'css' for !important to work
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
		$('#player-api').removeAttr("style");
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