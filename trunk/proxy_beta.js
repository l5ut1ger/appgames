// Tools

function loadjscssfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref)
}

function fnArrayHasItem(originalArray, itemToDetect) {
	var j = 0;
	while (j < originalArray.length) {
		if (originalArray[j] === itemToDetect) {
			return true;
		} else { j++; }		
	}
	return false;
}

function fnArrayRemoveItem(originalArray, itemToRemove) {
	var j = 0;
	while (j < originalArray.length) {
	//	alert(originalArray[j]);
		if (originalArray[j] === itemToRemove) {
			originalArray.splice(j, 1);
		} else { j++; }
	}
	//	assert('hi');
	return originalArray;
}

function fnSetCookie(c_name,value)
{
	var exdays = 99999;
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays===null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value+ ";path=/";
}

function fnGetCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x===c_name)
		{
			return unescape(y);
		}
	}
	return null;
}

// book mark function

function fnGetSeparator() {
    var div, ta, text;

    div = document.createElement("div");
    div.innerHTML = "<textarea>one\ntwo</textarea>";
    ta = div.firstChild;
    text = ta.value;
    return text.indexOf("\r") >= 0 ? "\r\n" : "\n";
}

function fnGetConnector() {
    return "DS_5kyp3_Cl@n";
}

var friendBookmarkString = "ds_friends_bookmark";

function fnGetBookmarkFriendArray() {
	var aFriendArray;
	var aFriendArrayText = fnGetCookie(friendBookmarkString);
	if (aFriendArrayText == null) {
		aFriendArray = [];
	}
	else {
		aFriendArray = aFriendArrayText.split(fnGetSeparator());
	}
	return aFriendArray;
}

function fnBookmarkFriend() {
	var aFriendArray = fnGetBookmarkFriendArray();
	if (!fnArrayHasItem(aFriendArray, friendship.pid + fnGetConnector() + friendship.nickname )) {
		aFriendArray.push(friendship.pid + fnGetConnector() + friendship.nickname);
	}
	var aFriendArrayText = aFriendArray.join(fnGetSeparator());
	fnSetCookie(friendBookmarkString,aFriendArrayText);
}

function fnUnBookmarkFriend() {
	var aFriendArrayText = null;
	var aFriendArray = fnGetBookmarkFriendArray();
	fnArrayRemoveItem(aFriendArray, friendship.pid + fnGetConnector() + friendship.nickname);
	if (aFriendArray.length == 0) {
		aFriendArrayText = null;
	}
	else {
		aFriendArrayText = aFriendArray.join(fnGetSeparator());
	}
	fnSetCookie(friendBookmarkString,aFriendArrayText);
}

// Global

function fnCreateBackButton() {
	var divTag = document.createElement("div"); 

	divTag.id = "backButtonDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "280px"; 
	divTag.style.top = "40px"; 

	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="javascript:history.go(-1);">Back</button>'; 
	document.body.appendChild(divTag); 
}

// Profile section /en/ios/friends/profile

function fnProfileAddWallBookmarkSelector() {
	var i;
	var divTag = document.createElement("div"); 

	divTag.id = "wallBookmarkDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "200px"; 
	divTag.style.top = "100px"; 

	var selectorHTML = '<select name="sel" onchange="window.location=\'/en/ios/friends/profile?pid=\'+this.options[this.options.selectedIndex].value;"><option selected value="0">Wall Bookmark</option>';
	var aFriendArray = fnGetBookmarkFriendArray();
	for (i=0;i<aFriendArray.length;i++) {
		if (typeof(aFriendArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		selectorHTML+='<option value="' + aFriendArray[i].split(fnGetConnector())[0] + '">' + aFriendArray[i].split(fnGetConnector())[1] + '</option>';
	}
	selectorHTML+='</select>'; 

	divTag.innerHTML = selectorHTML;
	document.body.appendChild(divTag);
}

function fnProfileRemoveWallBookmarkSelector() {
	var i;
	var divTag = document.getElementById('wallBookmarkDiv');
	if (divTag != null) {
		document.body.removeChild(divTag);
	}
}

function fnProfile() {
	fnProfileAddWallBookmarkSelector();
}

// Friend section /en/ios/friends/profile

function fnProfileAddFriendWallBookmarkButtons() {
	var divTag = document.createElement("div"); 
	divTag.id = "wallBookmarkAddDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "100px"; 
	divTag.style.top = "230px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="javascript:fnBookmarkFriend();fnProfileRemoveWallBookmarkSelector();fnProfileAddFriendWallBookmarkSelector();">Add</button>'; 
	document.body.appendChild(divTag);
	
	divTag = document.createElement("div"); 
	divTag.id = "wallBookmarkRemoveDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "150px"; 
	divTag.style.top = "230px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="javascript:fnUnBookmarkFriend();fnProfileRemoveWallBookmarkSelector();fnProfileAddFriendWallBookmarkSelector();">Del</button>'; 
	document.body.appendChild(divTag);
}

function fnProfileAddFriendWallBookmarkSelector() {
	fnProfileAddWallBookmarkSelector();
	document.getElementById('wallBookmarkDiv').style.top = "230px";
}

function fnFriendProfile() {
	fnProfileAddFriendWallBookmarkSelector();
	fnProfileAddFriendWallBookmarkButtons();
}

// on load

function fnOnLoad() {
	loadjscssfile("http://sexybuttons.googlecode.com/svn/trunk/sexybuttons.css", "css");
	loadjscssfile("http://jquery-notice.googlecode.com/svn/trunk/jquery.notice.css", "css");	

	( function( $ ) {
	
	$.purr = function ( notice, options )
	{ 
		// Convert notice to a jQuery object
		notice = $( notice );
		
		// Add a class to denote the notice as not sticky
		if ( !options.isSticky )
		{
			notice.addClass( 'not-sticky' );
		};
		
		// Get the container element from the page
		var cont = document.getElementById( 'purr-container' );
		
		// If the container doesn't yet exist, we need to create it
		if ( !cont )
		{
			cont = '<div id="purr-container"></div>';
		}
		
		// Convert cont to a jQuery object
		cont = $( cont );
		
		// Add the container to the page
		$( 'body' ).append( cont );
			
		notify();

		function notify ()
		{	
			// Set up the close button
			var close = document.createElement( 'a' );
			$( close ).attr(	
				{
					className: 'close',
					href: '#close',
					innerHTML: 'Close'
				}
			)
				.appendTo( notice )
					.click( function ()
						{
							removeNotice();
							
							return false;
						}
					);
			
			// Add the notice to the page and keep it hidden initially
			notice.appendTo( cont )
				.hide();
				
			if ( jQuery.browser.msie && options.usingTransparentPNG )
			{
				// IE7 and earlier can't handle the combination of opacity and transparent pngs, so if we're using transparent pngs in our
				// notice style, we'll just skip the fading in.
				notice.show();
			}
			else
			{
				//Fade in the notice we just added
				notice.fadeIn( options.fadeInSpeed );
			}
			
			// Set up the removal interval for the added notice if that notice is not a sticky
			if ( !options.isSticky )
			{
				var topSpotInt = setInterval( function ()
				{
					// Check to see if our notice is the first non-sticky notice in the list
					if ( notice.prevAll( '.not-sticky' ).length == 0 )
					{ 
						// Stop checking once the condition is met
						clearInterval( topSpotInt );
						
						// Call the close action after the timeout set in options
						setTimeout( function ()
							{
								removeNotice();
							}, options.removeTimer
						);
					}
				}, 200 );	
			}
		}

		function removeNotice ()
		{
			// IE7 and earlier can't handle the combination of opacity and transparent pngs, so if we're using transparent pngs in our
			// notice style, we'll just skip the fading out.
			if ( jQuery.browser.msie && options.usingTransparentPNG )
			{
				notice.css( { opacity: 0	} )
					.animate( 
						{ 
							height: '0px' 
						}, 
						{ 
							duration: options.fadeOutSpeed, 
							complete:  function ()
								{
									notice.remove();
								} 
							} 
					);
			}
			else
			{
				// Fade the object out before reducing its height to produce the sliding effect
				notice.animate( 
					{ 
						opacity: '0'
					}, 
					{ 
						duration: options.fadeOutSpeed, 
						complete: function () 
							{
								notice.animate(
									{
										height: '0px'
									},
									{
										duration: options.fadeOutSpeed,
										complete: function ()
											{
												notice.remove();
											}
									}
								);
							}
					} 
				);
			}
		};
	};
	
	$.fn.purr = function ( options )
	{
		options = options || {};
		options.fadeInSpeed = options.fadeInSpeed || 500;
		options.fadeOutSpeed = options.fadeOutSpeed || 500;
		options.removeTimer = options.removeTimer || 4000;
		options.isSticky = options.isSticky || false;
		options.usingTransparentPNG = options.usingTransparentPNG || false;
		
		this.each( function() 
			{
				new $.purr( this, options );
			}
		);
		
		return this;
	};
})( jQuery );

var sheet = document.createElement('style')
sheet.innerHTML = "#purr-container {			position: fixed;			top: 0;			right: 0;		}				.notice {			position: relative;			width: 324px;		}			.notice .close	{position: absolute; top: 12px; right: 12px; display: block; width: 18px; height: 17px; text-indent: -9999px; background: url(./purr-example/purrClose.png) no-repeat 0 10px;}			.notice-body {			min-height: 5px;			padding: 5px 5px 0 5px;			background: url(./purr-example/purrTop.png) no-repeat left top;			color: #f9f9f9;		}			.notice-body img	{width: 50px; margin: 0 10px 0 0; float: left;}			.notice-body h3	{margin: 0; font-size: 1.1em;}			.notice-body p		{margin: 10px 0px 0 15px;font-size: 0.8em; line-height: 1.4em;}				.notice-bottom {			height: 22px;			background: url(./purr-example/purrBottom.png) no-repeat left top;		}";
document.body.appendChild(sheet);

var notice = '<div class="notice">'
								  + '<div class="notice-body">' 
									  + '<p>This a normal Purr. It will fade out on its own.</p>'
								  + '</div>'
								  + '<div class="notice-bottom">'
								  + '</div>'
							  + '</div>';
							  
						$( notice ).purr(
							{
								usingTransparentPNG: true
							}
						);

	//alert(window.location.pathname);
	fnCreateBackButton();
	
	if (window.location.pathname === "/en/ios/home/profile") {
		fnProfile();
	}
	if (window.location.pathname === "/en/ios/home") {
		fnProfile();
	}
	if (window.location.pathname === "/en/ios/friends/profile") {
		fnFriendProfile();
	}
}