//Set up variables
active = 0;
smallIdle = chrome.extension.getURL('img/smallIdle.png');
largeIdle = chrome.extension.getURL('img/largeIdle.png');

//Load the button, add some style to it and create click event listener	
$(function() {
	
	var button = '<div class="ytp-button" id="ytResize" role="button" aria-label="youtubeResize" tabindex="6850"></div>';
	$('.ytp-button-fullscreen-enter').after(button);
	$('#ytResize').css({
		"float": "right",
		"background": "no-repeat url(" + largeIdle + ") 0px 1px",
		"background-size": "auto",
		"width": "30px",
		"height": "27px",
	});
	
	//Debug
	//console.log("Button made, active = " + active);
	
	$('#ytResize').click(resizePlayer);
	
	//Trying to solve the problem of user running resizePlayer so it's large, then clicking a related video without running resizePlayer again
	//This causes the player to reload large without running this onload, I think, but does not properly move the related videos section, so its
	//stuck under the video.  Does not work yet, I'm guessing the problem is because the next page content is mostly loaded with ajax or something,
	//so I've got a bit of reading to do to figure out how to handle this.
	//if ($('#player').css("margin")=='0px'){
	//	$('#watch7-sidebar').attr("style", "margin:0!important; top:0");
	//	console.log("Trying to fix related videos");
	//}
});

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