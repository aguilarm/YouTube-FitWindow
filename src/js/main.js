//Set up variables
var ytrResizeButtonSm = chrome.extension.getURL('img/resizeButtonSm.png'),
	ytrResizeButtonLg = chrome.extension.getURL('img/resizeButtonLg.png'),
	ytrResizeButtonState = 0,
    ytrSearchBarState = 1,
    resizeButtonState = 0,
    searchBarState = 1,
	winH,
	winW,
	$window;

//---------------------------------------
//Create the button and add click event
function loadResizeButton() {
    
    var ytrResizeButton = '<div class="ytp-button" id="ytrResizeButton" role="button" aria-label="youtubeResize" tabindex="6850"></div>';
    
	$('.ytp-button-fullscreen-enter').after(ytrResizeButton);
	$('#ytrResizeButton').css("background", "no-repeat url(" + ytrResizeButtonLg + ") 0px 1px");
	ytrResizeButtonState = 1;
	$('#ytrResizeButton').click(resizePlayer);
}

function loadSearchBarButton() {
        var exists = document.getElementById('ytrSearchBarButton');
        console.log(exists);
        if (exists) { return }
        console.log('creating searchbarbutton');
        var ytrSearchBarButtonSVG = chrome.extension.getURL('img/searchBarButton.svg');
        var ytrSearchBarButton = '<div id="ytrSearchBarButton"><img src="' + ytrSearchBarButtonSVG + '"></div>';
        $('#masthead-positioner-height-offset').after(ytrSearchBarButton);
        $('#ytrSearchBarButton img').click(function () {
            console.log('clicked!');
            if (ytrSearchBarState === 1) {
                document.getElementById('yt-masthead-container').style.display= "none";
                document.getElementById('masthead-positioner').style.display= "none";
                document.getElementById('masthead-positioner-height-offset').style.height = "0px";
                document.getElementById('player').style.marginTop = "0px";
                $('#ytrSearchBarButton img').addClass('ytrRotate');
                ytrSearchBarState = 0;
            } else {
                $('#yt-masthead-container').css("display", "block");
                $('#masthead-positioner').css('display', 'block');
                $('#masthead-positioner-height-offset').css("height", "50px");
                $('#player').css("marginTop", "10");
                $('#ytrSearchBarButton img').removeClass('ytrRotate');
                ytrSearchBarState = 1;
            }
        });
}

//----------------------------------------
//Add the button if it does not exist
function addResizeButton() {
	if (ytrResizeButtonState === 1) { return; }
    loadResizeButton();
}

//----------------------------------------
//this detects when a url changes without page reload
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	addResizeButton();
    loadSearchBarButton();
	correctRelated();
});

//-------------------------------------	
//Since new videos are loaded without a full page reload, this is to stop the related videos column from breaking
function correctRelated() {
	if ($('#player').css("margin") === '0px') {
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
$(window).resize(updatePlayerSize());

//---------------------------------------
//Function to update player size to adjust for changes
function updatePlayerSize() {
	if (resizeButtonState === 1){
		//update window size
		$window = $(window);
		winH = $window.height();
        
		winW = $window.width();
		$('#player-api').height(winH-50).width(winW);
		$('#movie_player > div.html5-video-container > div.html5-video-content').height(winH - 50).width(winW - 50);
	}
}
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
}

//---------------------------------------
//The actual resize function
function resizePlayer () {
	//update window size
	var progress,
		$window = $(window),
		winH = $window.height(),
		winW = $window.width();
		//adjust for youtube header
        if (ytrSearchBarState === 0) {
		  winHhead = winH - 65;
        } else {
            winHhead = winH -15;
        }
	
	if (resizeButtonState === 0){
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
		//Change ytr-resizeButton button
		$('#ytr-resizeButton').css("background-image", "url(" + ytrResizeButtonSm + ")");
		//Set resizeButtonState
		resizeButtonState = 1;
		//Debug
		//console.log("After button pressed and resizeButtonState is 0 found; " + resizeButtonState);
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
		//Switch the ytr-resizeButton button back
		$('#ytr-resizeButton').css("background", "no-repeat url(" + ytrResizeButtonLg + ") 0px 1px");
		//Remove resizeButtonState
		resizeButtonState=0;
		//Debug
		//console.log("Button press with resizeButtonState=1, now =" + resizeButtonState);
	}
}

