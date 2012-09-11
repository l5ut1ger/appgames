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

function fnGrowl(msg) {
	var notice = '<div class="notice"><div class="notice-body"><p>' + msg + '</p></div><div class="notice-bottom"></div></div>';							  
	$( notice ).purr({usingTransparentPNG: true, fadeInSpeed: 200,  fadeOutSpeed: 200,      removeTimer: 1000});
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
	fnGrowl("Bookmarked " + friendship.nickname );
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
	fnGrowl("Removed " + friendship.nickname );
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

function fnProfileGotoWallBookmark(pWall) {
	if (pWall === "weekly1") {
		$.ajax_ex(false, '/en/ios/ranking/weeklyList?page=0&tribe=0', { }, function(data) {
			if ( (data == null) || (data.status != 0) ) { return; }
			window.location='/en/ios/friends/profile?pid='+data.payload.rankers[0].player_id;
		});
	}
	else if (pWall === "overall1") {
		$.ajax_ex(false, '/en/ios/ranking/list?page=0&tribe=0', { }, function(data) {
			if ( (data == null) || (data.status != 0) ) { return; }
			window.location='/en/ios/friends/profile?pid='+data.payload.rankers[0].player_id;
		});
	}
	else {
		window.location='/en/ios/friends/profile?pid='+pWall;
	}
}

function fnProfileAddWallBookmarkSelector() {
	var i;
	var divTag = document.createElement("div"); 

	divTag.id = "wallBookmarkDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "200px"; 
	divTag.style.top = "100px"; 

	var selectorHTML = '<select name="sel" onchange="fnProfileGotoWallBookmark(this.options[this.options.selectedIndex].value);"><option selected value="0">Wall Bookmark</option>';
	selectorHTML += '<option value="weekly1">Weekly Rank1</option>'
	selectorHTML += '<option value="overall1">Overall Rank1</option>'
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
/*
var _st = window.setTimeout;
 
window.setTimeout = function(fRef, mDelay) { 
    if(typeof fRef == "function") {  
        var argu = Array.prototype.slice.call(arguments,2); 
        var f = (function(){ fRef.apply(null, argu); }); 
        return _st(f, mDelay); 
    } 
    return _st(fRef,mDelay);
}

function fnSpam(pID, pName, pMsg) {
	$.getJSON('/en/ios/bbs/write', {
	'target_id': pID,
	'body': pMsg
	}, function(result) {
	});
	fnGrowl("Spammed " + pName );
}
*/
function fnProfileAddSpamButton() {
	document.getElementById('div-bbs-form').innerHTML += '<a href="#"  class="btn __red __WS __HS" style="position:relative; top:0px; font-size:0.8em;">SPAM</a>';
	/*$('#btn-bbs-spam').click(function() { id="btn-bbs-spam"
		var spamMsg = bbsBodyChanged ? $('#txt-bbs-body').val() : '';
		var len = spamMsg.mblength();
		if (len <= 0) {
		  return false;
		} else if (len > 140) {
		  $('<div>' + BBS_TEXT_SYSTEM.warning_1 + '</div>').msgbox({'closeText':'OK'}).open();
		  return false;
		} else {
			$.ajax_ex(false, '/en/ios/ranking/list?page=0&tribe=0', { }, function(data) {
				if ( (data == null) || (data.status != 0) ) { return; }
				for (var i=0;i<=3;i++) {
					setTimeout(fnSpam, i*1000, data.payload.rankers[i].player_id, data.payload.rankers[i].player.nickname, spamMsg);
				}
			});
		}
	}*/
}

function fnProfile() {
	fnProfileAddWallBookmarkSelector();
	fnProfileAddSpamButton();
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

// friend actions

function fnFriendActionGiftC() {
	fnGrowl("fnFriendActionGiftC ver 15" );
	$.ajax_ex(false, '/en/ios/fusion/list', { types:0, sort:11, api:'json' }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }

		var monsters = data.payload;
		if (monsters.length < 1) {return; }
		for (var i=0;i<monsters.length;i++) {
			var monster = monsters[i];
			if (monster.grade <= 1) {				
				$.ajax({url: '/en/ios/present/suggest', cache: false, type:"GET", data:{'pid' : friendship.pid },dataType: "html"});
				$.ajax({url: '/en/ios/present/confirm', cache: false, type:"GET", data:{'ctg':2, 'amt':1, 'pid' : monster.unique_no}, dataType: "html"});
				$.ajax({url: '/en/ios/present/request', cache: false, type:"GET", data:{'msg' : '' }, dataType: "html"});
				fnGrowl("Gifted " + monster.m.name);
				return;
			}
		}
		fnGrowl("No C/C+");
	});
}

function fnFriendActionSelect(pAction) {
	if (pAction == "GiftC") {
		fnFriendActionGiftC();
	}
}

function fnProfileAddFriendActionSelector() {
	var i;
	var divTag = document.createElement("div"); 

	divTag.id = "friendActionDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "200px"; 
	divTag.style.top = "350px"; 

	var selectorHTML = '<select name="sel" onchange="javascript:fnFriendActionSelect(this.options[this.options.selectedIndex].value);"><option selected value="0">Friend Action</option>';
	//selectorHTML += '<option value="GiftC">Gift a C/C+</option>'
	selectorHTML+='</select>'; 

	divTag.innerHTML = selectorHTML;
	document.body.appendChild(divTag);
}

function fnFriendProfile() {
	fnProfileAddFriendWallBookmarkSelector();
	fnProfileAddFriendWallBookmarkButtons();
	fnProfileAddFriendActionSelector();
}

// on load

function fnSetupPurrCSS() {
	var sheet = document.createElement('style')
	sheet.innerHTML = "#purr-container {z-index:9999;			position: fixed;			top: 0;			right: 0;		}				.notice {			position: relative;			width: 324px;		}			.notice .close	{position: absolute; top: 12px; right: 12px; display: block; width: 18px; height: 17px; text-indent: -9999px; background: url(http://kitchen.net-perspective.com/purr-example/purrClose.png) no-repeat 0 10px;}			.notice-body {			min-height: 5px;			padding: 5px 5px 0 5px;			background: url(http://kitchen.net-perspective.com/purr-example/purrTop.png) no-repeat left top;			color: #f9f9f9;		}			.notice-body img	{width: 50px; margin: 0 10px 0 0; float: left;}			.notice-body h3	{margin: 0; font-size: 1.1em;}			.notice-body p		{margin: 10px 0px 0 15px;font-size: 0.8em; line-height: 1.4em;}				.notice-bottom {			height: 5px;			background: url(http://kitchen.net-perspective.com/purr-example/purrBottom.png) no-repeat left top;		}";
	document.body.appendChild(sheet);	
}



function fnOnLoad() {
	loadjscssfile("http://sexybuttons.googlecode.com/svn/trunk/sexybuttons.css", "css");

	loadjscssfile("http://kitchen.net-perspective.com/purr-example/jquery.purr.js", "js");	
	fnSetupPurrCSS();

	fnCreateBackButton();
	
	if (window.location.pathname === "/en/ios/home/profile") {
		fnProfile();
	}
	if (window.location.pathname === "/en/ios/home") {
		fnProfileAddWallBookmarkSelector();
	}
	if (window.location.pathname === "/en/ios/friends/profile") {
		fnFriendProfile();
	}
}