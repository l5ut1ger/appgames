// 149

var platform = window.location.pathname.indexOf("android") >= 0 ? 'android' : 'ios';

// define
var missionInterval;
var progressionGuildSpecific = false;
var progressionList=[50081, 53081, 56081];
var skillArray = {"1": "IPA", "4": "IPD", "7": "Heal", "10": "Heal All", "13": "Revive", "16": "Pre-Strike", "17": "DEA", "20": "DED", "24": "Agility", "27": "Critical", "30": "Dodge", "37": "Venom", "47": "HellBlaze", "50": "Artic", "53": "Lightning", "57": "Health", "58": "ImpDown", "59": "CovDown", "60": "PsyDown", "61": "DemonDown", "62": "CreatDown", "63": "UndeadDown", "64": "BeastDown", "65": "MystDown", "66": "WyrmDown", "67": "CrawlDown", "68": "BruteDown"};
var guildDownArray = {"58": "ImpDown", "59": "CovDown", "60": "PsyDown"};
var speciesDownArray = {"61": "DemonDown", "62": "CreatDown", "63": "UndeadDown", "64": "BeastDown", "65": "MystDown", "66": "WyrmDown", "67": "CrawlDown", "68": "BruteDown"};
// Tools

function fnRedirect(pURL) {
	var meta = document.createElement('meta');meta.httpEquiv='refresh';meta.content='0;url='+pURL;document.getElementsByTagName('head')[0].appendChild(meta);
	setTimeout(function(){$.redirect(pURL);}, 6000);
	setInterval(function(){$.redirect(pURL);}, 60000);
}

function fnTimeOutRedirect(pURL) {
	if (fnGetGrindingSpeed() == -1) return;
	setTimeout(function(){$.redirect(pURL);}, fnGetGrindingSpeed());
	setTimeout(function(){$.redirect(pURL);}, fnGetGrindingSpeed()+5000);
	setTimeout(function(){$.redirect(pURL);}, fnGetGrindingSpeed()+10000);
	setTimeout(function(){$.redirect(pURL);}, fnGetGrindingSpeed()+15000);
	setInterval(function(){$.redirect(pURL);}, 60000);
}

function fnQueryString(name) {
	var AllVars = window.location.search.substring(1);
	var Vars = AllVars.split('&');
	for (i = 0; i < Vars.length; i++){
		var Var = Vars[i].split('=');
		if (Var[0] == name) return Var[1];
	}
	return '';
}

function fnReferrerQueryString(name) {	
	var AllVars = document.referrer.substring(document.referrer.indexOf("?")+1);
	var Vars = AllVars.split('&');
	for (i = 0; i < Vars.length; i++){
		var Var = Vars[i].split('=');
		if (Var[0] == name) return Var[1];
	}
	return '';
}

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
	$( notice ).purr({usingTransparentPNG: true, fadeInSpeed: 1,  fadeOutSpeed: 1,      removeTimer: 400});
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

// check ally
var autoAllyKey = 'autoAlly';
var autoAllyMsgKey = 'autoAllyMsg';
var checkAllyTimeKey = 'checkAllyTime';
var checkAllyTimeInterval = 1000 * 60 * 3; // if has free ally spot, check ally ever 3 minutes

function fnAutoAlly() {
	if (fnGetCookie(autoAllyKey) === null) {
		fnSetAutoAlly(-1);
	}
	return fnGetCookie(autoAllyKey);
}

function fnSetAutoAlly(value) {
	fnSetCookie(autoAllyKey, value);
}

function fnAutoAllyMsg() {
	if (fnGetCookie(autoAllyMsgKey) === null) {
		fnSetAutoAllyMsg("{lv}needs ally, many thanks! :)");
	}
	return fnGetCookie(autoAllyMsgKey);
}

function fnSetAutoAllyMsg(value) {
	fnSetCookie(autoAllyMsgKey, value);
}

function fnGetCheckAllyTimer() {
	if (fnGetCookie(checkAllyTimeKey) === null) {
		fnSetCheckAllyTimer(0);
	}
	return fnGetCookie(checkAllyTimeKey);
}

function fnSetCheckAllyTimer(value) {
	fnSetCookie(checkAllyTimeKey, value);
}

function fnSendAllyMsg(pID, pName, pMsg) {
	$.getJSON('/en/'+platform+'/bbs/write', {
	'target_id': pID,
	'body': pMsg.replace("{lv}",(player.lv>=80?"Lv "+ player.lv + " ":""))
	}, function(result) {
	});
	fnGrowl("Posted @ " + pName + " for ally request");
}

function fnSpamAllyMsg() {
	$.ajax_ex(false, '/en/'+platform+'/ranking/weeklyList?page=0&tribe=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		for (var i=0;i<=2;i++) {
			setTimeout(fnSendAllyMsg, i*1000, data.payload.rankers[i].player_id, data.payload.rankers[i].player.nickname, fnAutoAllyMsg());
		}
	});
}

function fnHasAllySpot() {
	if (typeof(player) !== 'undefined' && player != null) {
	}
	else {
		return false;
	}
	if ((parseInt(player.power_max, 10) + parseInt(player.bp_max, 10) + parseInt(player.remain_point, 10)) < ((player.lv-1)*3 + 20 + 80 + Math.floor(10 + player.lv/2)*5)) {
		return true;
	}
	return false;
}

function fnHasAllyApplied() {
	var hasAllyApplied = false;
	
	var divTag = document.createElement("div");
	divTag.id = "checkAllyDiv";
	divTag.style.display = "none";
	document.body.appendChild(divTag); 	
	
	var result= $('#checkAllyDiv').load('/en/'+platform+'/friends #list-applied', {}, function(){
		for (var i=0;i < result.find('.pid').length;i++) {
			hasAllyApplied = true;
			$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+result.find('.pid').eq(i).html()+'&cmd=accept', {},function(result) {return;}) ;
		}	
	});
	return hasAllyApplied;
}

function fnCheckAlly() {
	if (fnAutoAlly() == -1) {
		return;
	}
	if (!fnHasAllySpot()) {
		return;
	}
	if ((new Date()).getTime() - fnGetCheckAllyTimer() > checkAllyTimeInterval) {
		fnSetCheckAllyTimer((new Date()).getTime());
		if (!fnHasAllyApplied()) { //bugged.. forgot ajax is asynchronus, so it will always return false, thus always spam
			fnSpamAllyMsg();
		}
	}
}

// grinding speed

var grindingSpeedKey = 'grindingSpeed';

function fnGetGrindingSpeed() {
	if (fnGetCookie(grindingSpeedKey) === null) {
		fnSetGrindingSpeed(-1);
	}
	return fnGetCookie(grindingSpeedKey);
}

function fnSetGrindingSpeed(value) {
	fnSetCookie(grindingSpeedKey, value);
}

// auto new mission

var autoNewMissionKey = 'autoNewMissionKey';

function fnAutoNewMission() {
	if (fnGetCookie(autoNewMissionKey) === null) {
		fnSetAutoNewMission(1);
	}
	return fnGetCookie(autoNewMissionKey);
}

function fnSetAutoNewMission(value) {
	fnSetCookie(autoNewMissionKey, value);
}

// Auto EP Toggle

var autoDrinkKey = 'autoDrink';

function fnAutoDrink() {
	if(fnGetCookie(autoDrinkKey) === null) {
			fnSetAutoDrink(-1);
	}
	return fnGetCookie(autoDrinkKey);
}

function fnSetAutoDrink(value) {
	fnSetCookie(autoDrinkKey, value);
}

// Auto Stats Up

var autoStatsUpKey = 'autoStatsUp';

function fnAutoStatsUp() {
	if(fnGetCookie(autoStatsUpKey) === null) {
		fnSetAutoStatsUp(0);
	}
	return fnGetCookie(autoStatsUpKey);
}

function fnSetAutoStatsUp(value) {
	fnSetCookie(autoStatsUpKey, value);
}

// Auto Fusion

var autoFusionKey = 'autoFusionKey';

function fnAutoFusion() {
	if(fnGetCookie(autoFusionKey) === null) {
		fnSetAutoFusion(0);
	}
	return fnGetCookie(autoFusionKey);
}

function fnSetAutoFusion(value) {
	fnSetCookie(autoFusionKey, value);
}

// Auto Stack

var autoStackKey = 'autoStack';

function fnAutoStack() {
	if(fnGetCookie(autoStackKey) === null) {
		fnSetAutoStack(0);
	}
	return fnGetCookie(autoStackKey);
}

function fnSetAutoStack(value) {
	fnSetCookie(autoStackKey, value);
}

var autoStackBPKey = 'autoStackBP';

function fnAutoStackBP() {
	if(fnGetCookie(autoStackBPKey) === null) {
		fnSetAutoStackBP(10);
	}
	return fnGetCookie(autoStackBPKey);
}

function fnSetAutoStackBP(value) {
	fnSetCookie(autoStackBPKey, value);
}

// Gift Cookies

var giftCookiesKey = 'giftCookiesKey';

function fnGiftCookies() {
	if(fnGetCookie(giftCookiesKey) === null) {
		fnSetGiftCookies('');
	}
	return fnGetCookie(giftCookiesKey);
}

function fnSetGiftCookies(value) {
	fnSetCookie(giftCookiesKey, value);
}

// Tower Event Target

var towerEventTargetKey = 'towerEventTarget';

function fnTowerEventTarget() {
	if(fnGetCookie(towerEventTargetKey) === null) {
		fnSetTowerEventTarget(2501);
	}
	return fnGetCookie(towerEventTargetKey);
}

function fnSetTowerEventTarget(value) {
	fnSetCookie(towerEventTargetKey, value);
}

// Tower Event McFly Team

var towerMcFlyTeamKey = 'TowerMcFlyTeam';

function fnTowerMcFlyTeam() {
	if(fnGetCookie(towerMcFlyTeamKey) === null) {
		fnSetTowerMcFlyTeam('');
	}
	return fnGetCookie(towerMcFlyTeamKey);
}

function fnSetTowerMcFlyTeam(value) {
	fnSetCookie(towerMcFlyTeamKey, value);
}

var towerProgTeamKey = 'TowerProgTeam';

function fnTowerProgTeam() {
	if(fnGetCookie(towerProgTeamKey) === null) {
		fnSetTowerProgTeam('');
	}
	return fnGetCookie(towerProgTeamKey);
}

function fnSetTowerProgTeam(value) {
	fnSetCookie(towerProgTeamKey, value);
}

// cookies that store whether the player is battling mcfly, so the player will switch back to prog team later

var battlingMcFlyKey = 'battlingMcFly';

function fnIsBattlingMcFly() {
	if(fnGetCookie(battlingMcFlyKey) === null) {
		fnSetIsBattlingMcFly(0);
	}
	return fnGetCookie(battlingMcFlyKey);
}

function fnSetIsBattlingMcFly(value) {
	fnSetCookie(battlingMcFlyKey, value);
}

// Dungeon Boss Record

var dungeonBossRecordKey = 'dungeonBossRecordKey';

function fnDungeonBossRecord() {
	if(fnGetCookie(dungeonBossRecordKey) === null) {
		fnSetDungeonBossRecord('');
	}
	return fnGetCookie(dungeonBossRecordKey);
}

function fnSetDungeonBossRecord(value) {
	fnSetCookie(dungeonBossRecordKey, value);
}

// Dungeon Boss Record

var dungeonAutoBPKey = 'dungeonAutoBPKey';

function fnDungeonAutoBP() {
	if(fnGetCookie(dungeonAutoBPKey) === null) {
		fnSetDungeonAutoBP(0);
	}
	return fnGetCookie(dungeonAutoBPKey);
}

function fnSetDungeonAutoBP(value) {
	fnSetCookie(dungeonAutoBPKey, value);
}

// Dungeon Extra Exp

var dungeonExtraExpKey = 'dungeonExtraExpKey';

function fnDungeonExtraExp() {
	if(fnGetCookie(dungeonExtraExpKey) === null) {
		fnSetDungeonExtraExp(0);
	}
	return fnGetCookie(dungeonExtraExpKey);
}

function fnSetDungeonExtraExp(value) {
	fnSetCookie(dungeonExtraExpKey, value);
}

// Dungeon Extra Gold

var dungeonExtraGoldKey = 'dungeonExtraGoldKey';

function fnDungeonExtraGold() {
	if(fnGetCookie(dungeonExtraGoldKey) === null) {
		fnSetDungeonExtraGold(0);
	}
	return fnGetCookie(dungeonExtraGoldKey);
}

function fnSetDungeonExtraGold(value) {
	fnSetCookie(dungeonExtraGoldKey, value);
}

// Dungeon Travel Level

var dungeonTravelLevelKey = 'dungeonTravelLevelKey';

function fnDungeonTravelLevel() {
	if(fnGetCookie(dungeonTravelLevelKey) === null) {
		fnSetDungeonTravelLevel(0);
	}
	return fnGetCookie(dungeonTravelLevelKey);
}

function fnSetDungeonTravelLevel(value) {
	fnSetCookie(dungeonTravelLevelKey, value);
}

// Dungeon Impulse Team

var dungeonImpulseTeamKey = 'dungeonImpulseTeamKey';

function fnDungeonImpulseTeam() {
	if(fnGetCookie(dungeonImpulseTeamKey) === null) {
		fnSetDungeonImpulseTeam('');
	}
	return fnGetCookie(dungeonImpulseTeamKey);
}

function fnSetDungeonImpulseTeam(value) {
	fnSetCookie(dungeonImpulseTeamKey, value);
}

// Dungeon Covert Team

var dungeonCovertTeamKey = 'dungeonCovertTeamKey';

function fnDungeonCovertTeam() {
	if(fnGetCookie(dungeonCovertTeamKey) === null) {
		fnSetDungeonCovertTeam('');
	}
	return fnGetCookie(dungeonCovertTeamKey);
}

function fnSetDungeonCovertTeam(value) {
	fnSetCookie(dungeonCovertTeamKey, value);
}

// Dungeon Psycho Team

var dungeonPsychoTeamKey = 'dungeonPsychoTeamKey';

function fnDungeonPsychoTeam() {
	if(fnGetCookie(dungeonPsychoTeamKey) === null) {
		fnSetDungeonPsychoTeam('');
	}
	return fnGetCookie(dungeonPsychoTeamKey);
}

function fnSetDungeonPsychoTeam(value) {
	fnSetCookie(dungeonPsychoTeamKey, value);
}

// Dungeon Prog Team

var dungeonProgTeamKey = 'dungeonProgTeamKey';

function fnDungeonProgTeam() {
	if(fnGetCookie(dungeonProgTeamKey) === null) {
		fnSetDungeonProgTeam('');
	}
	return fnGetCookie(dungeonProgTeamKey);
}

function fnSetDungeonProgTeam(value) {
	fnSetCookie(dungeonProgTeamKey, value);
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

// Profile section /en/'+platform+'/friends/profile

function fnProfileGotoWallBookmark(pWall) {
	if (pWall === "weekly1") {
		$.ajax_ex(false, '/en/'+platform+'/ranking/weeklyList?page=0&tribe=0', { }, function(data) {
			if ( (data == null) || (data.status != 0) ) { return; }
			window.location='/en/'+platform+'/friends/profile?pid='+data.payload.rankers[0].player_id;
		});
	}
	else if (pWall === "overall1") {
		$.ajax_ex(false, '/en/'+platform+'/ranking/list?page=0&tribe=0', { }, function(data) {
			if ( (data == null) || (data.status != 0) ) { return; }
			window.location='/en/'+platform+'/friends/profile?pid='+data.payload.rankers[0].player_id;
		});
	}
	else {
		window.location='/en/'+platform+'/friends/profile?pid='+pWall;
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

function fnProfileAddSkypeClanSelector() {
	var divTag = document.createElement("div"); 

	divTag.id = "skypeClanDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "100px"; 
	divTag.style.top = "100px"; 

	var selectorHTML = '<select name="sel" onchange="fnProfileGotoWallBookmark(this.options[this.options.selectedIndex].value);"><option selected value="0">Skype Clan</option>';
	selectorHTML += '<option value="1860292579">about2punt</option>'
	selectorHTML += '<option value="2171680461">Byce</option>';
	selectorHTML += '<option value="2271156591">caos5522</option>';
	selectorHTML += '<option value="2747200019">Getr3kt</option>';
	selectorHTML += '<option value="2578795263">Joe</option>';
	selectorHTML += '<option value="2121751804">Josh</option>';
	selectorHTML += '<option value="2993558878">mr_saving</option>';
	selectorHTML += '<option value="1806070535">Kissy</option>';
	selectorHTML += '<option value="2656724949">Kissy2</option>';
	selectorHTML += '<option value="1330745254">Unreality</option>';
	selectorHTML += '<option value="2320103292">Drakkar</option>';
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

function fnSpam(pID, pName, pMsg) {
	var excludeList=["1408766097", "1833667105"];
	if (excludeList.indexOf(pID) != -1) return;	
	$.getJSON('/en/'+platform+'/bbs/write', {
	'target_id': pID,
	'body': pMsg
	}, function(result) {
	});
	fnGrowl("Spammed " + pName );
}

function fnProfileAddSpamButton() {
	var divTag = document.createElement("a"); 
	divTag.id = "btn-bbs-spam-overall"; 

	divTag.style["font-size"] = "0.6em"; 
	divTag.style.position = "relative";
	divTag.style.top = "0px";

	divTag.className =("btn __red __WS __HS");
	divTag.href = "#";
	divTag.innerHTML = "SpamTop100";
	document.getElementById('div-bbs-form').appendChild(divTag);

	$('#btn-bbs-spam-overall').click(function() { 
		var spamMsg = bbsBodyChanged ? $('#txt-bbs-body').val() : '';
		var len = spamMsg.mblength();
		if (len <= 0) {
		  return false;
		} else if (len > 140) {
		  $('<div>' + BBS_TEXT_SYSTEM.warning_1 + '</div>').msgbox({'closeText':'OK'}).open();
		  return false;
		} else {
			$.ajax_ex(false, '/en/'+platform+'/ranking/list?page=0&tribe=0', { }, function(data) {
				if ( (data == null) || (data.status != 0) ) { return; }
				for (var i=0;i<=data.payload.rankers.length;i++) {
					setTimeout(fnSpam, i*1000, data.payload.rankers[i].player_id, data.payload.rankers[i].player.nickname, spamMsg);
				}
			});
		}
	});
	
	divTag = document.createElement("a"); 
	divTag.id = "btn-bbs-spam-week"; 

	divTag.style["font-size"] = "0.6em"; 
	divTag.style.position = "relative";
	divTag.style.top = "0px";

	divTag.className =("btn __red __WS __HS");
	divTag.href = "#";
	divTag.innerHTML = "SpamWeekly3";
	document.getElementById('div-bbs-form').appendChild(divTag);

	$('#btn-bbs-spam-week').click(function() { 
		var spamMsg = bbsBodyChanged ? $('#txt-bbs-body').val() : '';
		var len = spamMsg.mblength();
		if (len <= 0) {
		  return false;
		} else if (len > 140) {
		  $('<div>' + BBS_TEXT_SYSTEM.warning_1 + '</div>').msgbox({'closeText':'OK'}).open();
		  return false;
		} else {
			$.ajax_ex(false, '/en/'+platform+'/ranking/weeklyList?page=0&tribe=0', { }, function(data) {
				if ( (data == null) || (data.status != 0) ) { return; }
				for (var i=0;i<=2;i++) {
					setTimeout(fnSpam, i*1000, data.payload.rankers[i].player_id, data.payload.rankers[i].player.nickname, spamMsg);
				}
			});
		}
	});
	
	divTag = document.createElement("a"); 
	divTag.id = "btn-bbs-spam-overall1000"; 

	divTag.style["font-size"] = "0.6em"; 
	divTag.style.position = "relative";
	divTag.style.top = "0px";

	divTag.className =("btn __red __WS __HS");
	divTag.href = "#";
	divTag.innerHTML = "SpamTop1000";
	document.getElementById('div-bbs-form').appendChild(divTag);

	$('#btn-bbs-spam-overall1000').click(function() { 
		var spamMsg = bbsBodyChanged ? $('#txt-bbs-body').val() : '';
		var len = spamMsg.mblength();
		if (len <= 0) {
		  return false;
		} else if (len > 140) {
		  $('<div>' + BBS_TEXT_SYSTEM.warning_1 + '</div>').msgbox({'closeText':'OK'}).open();
		  return false;
		} else {
			for (var j=0;j<10;j++) {
				$.ajax_ex(false, '/en/'+platform+'/ranking/list?page='+j+'&tribe=0', { }, function(data) {
					if ( (data == null) || (data.status != 0) ) { return; }
					for (var i=0;i<=data.payload.rankers.length;i++) {
						setTimeout(fnSpam, (j*100+i)*1000, data.payload.rankers[i].player_id, data.payload.rankers[i].player.nickname, spamMsg);
					}
				});
			}
		}
	});
}

function fnProfileGetAllCompenation(pID) {
	if (pID == "") return;
	for (var i=18;i<=pID;i++) {
		setTimeout(fnProfileGetCompensation, (i-18)*1000, i);
	}
}

function fnProfileGetCompensation(pID) {
	if (pID == "") return;
	$.ajax_ex(false, '/en/'+platform+'/compensation/receive?compensation_id='+pID, { }, function(data) {
		fnGrowl('Tried compensation gift '+ pID);
	});
}

function fnProfileFixTabs() {
	document.getElementById('_1').childNodes[7].childNodes[0].innerHTML = "Strategy";
	var divTag = document.createElement("div"); 
	divTag.id = "profile-strategy"; 
	divTag.style.position = "relative"; 
	
	// Compensation gift setting
	var compensationHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Compensation Gifts</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	compensationHTML += 'Collect Individual Missed Compensation Gift:<br/><select name="sel" onchange="fnProfileGetCompensation(this.options[this.options.selectedIndex].value);">';
	compensationHTML += '<option selected value="">Select a gift ID</option>';
	for (var i=18;i<=25;i++) {
		compensationHTML += '<option value="' + i + '">' + i + '</option>';
	}
	compensationHTML += '</select><br/>';
	compensationHTML += 'Collect All Missed Compensation Gifts Up To:<br/><select name="sel" onchange="fnProfileGetAllCompenation(this.options[this.options.selectedIndex].value);">';
	compensationHTML += '<option selected value="">Select a gift ID</option>';
	for (var i=18;i<=25;i++) {
		compensationHTML += '<option value="' + i + '">' + i + '</option>';
	}
	compensationHTML += '</select><br/><br/>'; 	
	
	// auto grind setting
	var grindSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Grinding Speed</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	grindSelectorHTML += '<select name="sel" onchange="fnSetGrindingSpeed(this.options[this.options.selectedIndex].value);fnGrowl(this.options[this.options.selectedIndex].text);">';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == -1 ?'selected':'') + ' value="-1">Thumb</option>'
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 6000 ?'selected':'') + ' value="6000">Legit</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 4000 ?'selected':'') + ' value="4000">Seems Legit</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 3000 ?'selected':'') + ' value="2000">Barely Legal</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 2000 ?'selected':'') + ' value="2000">Ferrari</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 1000 ?'selected':'') + ' value="1000">CC Speed</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 500 ?'selected':'') + ' value="500">Too Fast</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 200 ?'selected':'') + ' value="200">Too Furious</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 100 ?'selected':'') + ' value="100">Light</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 1 ?'selected':'') + ' value="1">Time Travel</option>';
	grindSelectorHTML += '</select><br/><br/>'; 
	
	// auto grind setting
	var grindSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Grinding Speed</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	grindSelectorHTML += '<select name="sel" onchange="fnSetGrindingSpeed(this.options[this.options.selectedIndex].value);fnGrowl(this.options[this.options.selectedIndex].text);">';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == -1 ?'selected':'') + ' value="-1">Thumb</option>'
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 6000 ?'selected':'') + ' value="6000">Legit</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 4000 ?'selected':'') + ' value="4000">Seems Legit</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 3000 ?'selected':'') + ' value="2000">Barely Legal</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 2000 ?'selected':'') + ' value="2000">Ferrari</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 1000 ?'selected':'') + ' value="1000">CC Speed</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 500 ?'selected':'') + ' value="500">Too Fast</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 200 ?'selected':'') + ' value="200">Too Furious</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 100 ?'selected':'') + ' value="100">Light</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 1 ?'selected':'') + ' value="1">Time Travel</option>';
	grindSelectorHTML += '</select><br/><br/>'; 
	
	// auto new mission setting
	var autoNewMissionSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Auto New Mission (turn off if you are repeating old missions)</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	autoNewMissionSelectorHTML += '<select name="sel" onchange="fnSetAutoNewMission(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto New Mission \'+this.options[this.options.selectedIndex].text);">';
	autoNewMissionSelectorHTML += '<option ' + (fnAutoNewMission() == 0 ?'selected':'') + ' value="0">Off</option>'
	autoNewMissionSelectorHTML += '<option ' + (fnAutoNewMission() == 1 ?'selected':'') + ' value="1">On</option>';
	autoNewMissionSelectorHTML += '</select><br/><br/>'; 
	
	// auto drink setting
	var autoDrinkSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Auto Drink</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	autoDrinkSelectorHTML += '<select name="sel" onchange="fnSetAutoDrink(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto Drink \'+this.options[this.options.selectedIndex].text);">';
	autoDrinkSelectorHTML += '<option ' + (fnAutoDrink() == -1 ?'selected':'') + ' value="-1">Off</option>'
	autoDrinkSelectorHTML += '<option ' + (fnAutoDrink() == 1 ?'selected':'') + ' value="1">On</option>';
	autoDrinkSelectorHTML += '</select><br/><br/>'; 
	
	// auto ally setting
	var autoAllySelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Auto Ally (per 3 mins.)</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	autoAllySelectorHTML += '<select name="sel" onchange="fnSetAutoAlly(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto Ally \'+this.options[this.options.selectedIndex].text);">';
	autoAllySelectorHTML += '<option ' + (fnAutoAlly() == -1 ?'selected':'') + ' value="-1">Off</option>';
	autoAllySelectorHTML += '<option ' + (fnAutoAlly() == 1 ?'selected':'') + ' value="1">On</option>';
	autoAllySelectorHTML += '</select><br/>Ally msg: (Use special keyword {lv} to represent your level)';
	autoAllySelectorHTML += '<div id="divAllyMsgForm"><textarea id="allyMsg">' + fnAutoAllyMsg() + '</textarea><a href="javascript:fnSetAutoAllyMsg(document.getElementById(\'allyMsg\').value);fnGrowl(\'Ally Msg set as \'+document.getElementById(\'allyMsg\').value);" class="btn __red __WS __HS" style="position:relative; top:-8px; font-size:0.8em;">Set</a></div><br/>';
	
	// auto stats up setting
	var autoStatsUpselectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Auto Stats Up</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	autoStatsUpselectorHTML += '<select name="sel" onchange="fnSetAutoStatsUp(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto Stats Up \'+this.options[this.options.selectedIndex].text);">';
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == -1 ?'selected':'') + ' value="-1">Off</option>'
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == 1 ?'selected':'') + ' value="1">On, EP</option>';
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == 2 ?'selected':'') + ' value="2">On, BP</option>';
	autoStatsUpselectorHTML += '</select><br/><br/>'; 
	
	// Auto Stack BP Settings
	var stackSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Auto Stack Rank A max BP</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	stackSelectorHTML += '<select name="sel" onchange="fnSetAutoStackBP(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto Stack Rank A max BP \'+this.options[this.options.selectedIndex].text);">';
	for (var i=1;i<=30;i++) {
		stackSelectorHTML += '<option ' + (fnAutoStackBP() == (i) ?'selected':'') + ' value="' + (i) + '">' + (i) + '</option>';
	}	
	stackSelectorHTML += '</select><br/><br/>';
	
	// Tower Event Target Settings
	var towerSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Tower Event</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>Target Floor<br/>';
	towerSelectorHTML += '<select name="sel" onchange="fnSetTowerEventTarget(this.options[this.options.selectedIndex].value);fnGrowl(\'Tower Event Target \'+this.options[this.options.selectedIndex].text);">';
	for (var i=1;i<=100;i++) {
		towerSelectorHTML += '<option ' + (fnTowerEventTarget() == (i*100+1) ?'selected':'') + ' value="' + (i*100+1) + '">' + (i*100+1) + '</option>';
	}	
	towerSelectorHTML += '</select><br/><br/>';
	
	// Tower Prog & McFly Team Settings
	
	var i;
	
	var aFormationArray = fnGetFormationArray();
	
	var progTeamSelectorHTML =  'Progression Team<br/>';
	progTeamSelectorHTML += '<select name="prog" onchange="fnSetTowerProgTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Tower Event Prog Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnTowerProgTeam()==''?'selected':'') + ' value="">Nil</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		progTeamSelectorHTML+='<option ' + (fnTowerProgTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	progTeamSelectorHTML+='</select><br/><br/>'; 

	var mcFlyTeamSelectorHTML = 'VS McFly Team<br/>';
	mcFlyTeamSelectorHTML += '<select name="sel" onchange="fnSetTowerMcFlyTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Tower Event VS McFly Team \'+this.options[this.options.selectedIndex].text);">';	
	mcFlyTeamSelectorHTML += '<option ' + (fnTowerMcFlyTeam()==''?'selected':'') + ' value="">Nil</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		mcFlyTeamSelectorHTML+='<option ' + (fnTowerMcFlyTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	mcFlyTeamSelectorHTML+='</select><br/><br/>'; 
	
	var loginSessionHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Login Session</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>Login Key<br/><textarea rows="10" cols="50">' + document.cookie + ' ' + fnGetCookie('darksummoner_en') + '</textarea><br/><br/>';
   
	divTag.innerHTML = compensationHTML + grindSelectorHTML + autoNewMissionSelectorHTML + autoDrinkSelectorHTML + autoAllySelectorHTML + autoStatsUpselectorHTML + stackSelectorHTML + towerSelectorHTML + progTeamSelectorHTML + mcFlyTeamSelectorHTML + loginSessionHTML; 
	document.getElementById('profile-current-login').parentNode.appendChild(divTag);

	onChangeProfile = function (id) 
	{
		var PROFILE_BLOCKS = [
			'profile-status', 
			'profile-statusup', 
			'profile-level', 
			'profile-deck', 
			'profile-record', 
			'profile-ranking', 
			'profile-invite', 
			'profile-summon', 
			'profile-present', 
			'profile-best-login', 
			'profile-current-login', 
			'profile-wishlist', 
			'profile-bbs', 
			'profile-bbs-body',
			'profile-strategy'
		];

		var visible_block = false;

		switch (id) {
		case 'category-level':
			visible_block = [
				'profile-status', 
				'profile-statusup', 
				'profile-level', 
				'profile-deck', 
				'profile-record', 
				'profile-ranking', 
				'profile-invite', 
				'profile-summon', 
				'profile-present', 
				'profile-best-login', 
				'profile-current-login', 
			];
			break;
		case 'category-record': 
			visible_block = [
				'profile-strategy',
			];
			break;

		case 'category-wishlist':
			visible_block = ['profile-wishlist'];
			break;

		case 'category-bbs':
			visible_block = ['profile-bbs', 'profile-bbs-body'];
			break; 
		}

		$.each(PROFILE_BLOCKS, function(i, tag){
			if ($.inArray(tag, visible_block) == -1) {
				$('#' + tag).css('display', 'none');
			}
			else {
				$('#' + tag).css('display', 'block');
			}
		});
	}
	onChangeProfile('category-level');
}

function fnProfile() {
	fnProfileFixTabs();
	fnProfileAddWallBookmarkSelector();
	fnProfileAddSkypeClanSelector();
	fnProfileAddSpamButton();
}

// Friend section /en/'+platform+'/friends/profile

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
	$.ajax_ex(false, '/en/'+platform+'/fusion/list', { types:0, sort:11, api:'json' }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }

		var monsters = data.payload;
		if (monsters.length < 1) {return; }
		for (var i=0;i<monsters.length;i++) {
			var monster = monsters[i];
			if (monster.grade <= 1) {				
				$.ajax({url: '/en/'+platform+'/present/suggest', cache: false, type:"GET", data:{'pid' : friendship.pid },dataType: "html"});
				$.ajax({url: '/en/'+platform+'/present/confirm', cache: false, type:"GET", data:{'ctg':2, 'amt':1, 'pid' : monster.unique_no}, dataType: "html"});
				$.ajax({url: '/en/'+platform+'/present/request', cache: false, type:"GET", data:{'msg' : '' }, dataType: "html"});
				fnGrowl("Gifted " + monster.m.name);
				return;
			}
		}
		fnGrowl("No C/C+");
	});
}

function fnFriendActionGiftProg() {
	if (!confirm('Are you sure you want to gift your prog+ to ' + friendship.nickname + '?')) {
		return;
	}
	if (progressionGuildSpecific) {
		var tribe;
		if ($('.label-tribe-1').length) {
			tribe = 1;
		}
		if ($('.label-tribe-2').length) {
			tribe = 2;
		}
		if ($('.label-tribe-3').length) {
			tribe = 3;
		}
		$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
			var leader=null;
			var l1=0;
			
			for (var i=0;i<result.payload.length;i++) {
				if (result.payload[i].monster_id == progressionList[tribe-1]) {
					if (result.payload[i].location ==0 && (leader == null || leader.lv <  result.payload[i].lv)) {
						leader = result.payload[i];
						l1=result.payload[i].unique_no;
					}					
				}
			}
			if (leader !=null) {
				setTimeout(function(){$.redirect('/en/'+platform+'/present/suggest?pid='+ friendship.pid + '&mid='+ l1 +"&name="+encodeURIComponent(friendship.nickname));}, 1);
			}
			else {
				alert('you dont have available prog+');
			}
		});
	}
	else {
		$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
			giftList = [];
			for (var i=0;i<result.payload.length;i++) {
				for (var j=0;j<progressionList.length;j++) {
					if (parseInt(result.payload[i].monster_id,10) == progressionList[j]) {
						if (result.payload[i].location ==0) {
							giftList.push('2:'+result.payload[i].unique_no+':1');				
						}
					}					
				}				
			}
			if (giftList.length > 0) {
				fnSetGiftCookies(giftList.join(fnGetSeparator()));	
				setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 1000);
				setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 6000);
			}
			else {
				alert("You have no prog left.");
			}
		});
	}
	return;
}

function fnFriendActionGiftFormation() {
	if (!confirm('Are you sure you want to gift your current formation to ' + friendship.nickname + '?')) {
		return;
	}
	if (!confirm('Are you REALLY sure you want to gift your current formation to ' + friendship.nickname + '?')) {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
		giftList = [];
		var result_array = {"l1":"0", "l2":"0", "l3":"0", "l4":"0", "l5":"0"};
		for (var i=0;i<result.payload.length;i++) {
			if (result.payload[i].location > 0) {
				giftList.push('2:'+result.payload[i].unique_no+':1');				
			}			
		}
		var totalBP = 0;
		// auto formation
		for (var j=0;j<5;j++) {
			for (var i=0;i<result.payload.length;i++) {
				if (result.payload[i].location > 0) {
					continue;
				}
				var usedInTeam = false;
				for (var k=0;k<j;k++) {
					if (result.payload[i].unique_no == result_array['l'+(k+1)]) {
						usedInTeam = true;
					}
				}
				if (!usedInTeam) {
					if (result_array['l'+(j+1)] == 0) {
						if (totalBP + result.payload[i].bp <= player.bp_max) { 
							result_array['l'+(j+1)] = result.payload[i].unique_no;
							result_array['l'+(j+1)+'level'] = result.payload[i].lv;
							result_array['l'+(j+1)+'skillLevel'] = result.payload[i].skill_lv;
							result_array['l'+(j+1)+'bp'] = result.payload[i].bp;
							totalBP += result.payload[i].bp;
						}
					}
					else {
						if (parseInt(result.payload[i].lv,10) > parseInt(result_array['l'+(j+1)+'level'],10) || (parseInt(result.payload[i].lv, 10) == parseInt(result_array['l'+(j+1)+'level'],10) && parseInt(result.payload[i].skill_lv,10) > parseInt(result_array['l'+(j+1)+'skillLevel'], 10)) || (parseInt(result.payload[i].lv, 10) == parseInt(result_array['l'+(j+1)+'level'],10) && parseInt(result.payload[i].skill_lv, 10) == parseInt(result_array['l'+(j+1)+'skillLevel'],10) && parseInt(result.payload[i].bp,10) > parseInt(result_array['l'+(j+1)+'bp'], 10))) {
							if (totalBP - result_array['l'+(j+1)+'bp'] + result.payload[i].bp <= player.bp_max) { 
								totalBP -= result_array['l'+(j+1)+'bp'];
								result_array['l'+(j+1)] = result.payload[i].unique_no;
								result_array['l'+(j+1)+'level'] = result.payload[i].lv;
								result_array['l'+(j+1)+'skillLevel'] = result.payload[i].skill_lv;
								result_array['l'+(j+1)+'bp'] = result.payload[i].bp;
								totalBP += result.payload[i].bp;
							}
						}
					}
					missed = false;
				}
			}
		}
		
		if (result_array['l1'] == 0) {	
			alert('No replacing monster');
			return;
		}
		$.ajax_ex(false, '/en/'+platform+'/deck/autoOrganize?l1='+result_array['l1']+'&l2='+result_array['l2']+'&l3='+result_array['l3']+'&l4='+result_array['l4']+'&l5='+result_array['l5'], {}, function(result) {});
		
		if (giftList.length > 0) {
			fnSetGiftCookies(giftList.join(fnGetSeparator()));	
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 1000);
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 6000);
		}
	});
}

function fnFriendActionGiftSoul() {
	if (!confirm('Are you sure you want to gift all your Soul to ' + friendship.nickname + '?')) {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
		giftList = [];
		for (var i=0;i<result.payload.length;i++) {
			if (parseInt(result.payload[i].bp,10) >= 100) {
				if (result.payload[i].location ==0) {
					giftList.push('2:'+result.payload[i].unique_no+':1');
				}
			}
		}
		if (giftList.length > 0) {
			fnSetGiftCookies(giftList.join(fnGetSeparator()));	
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 1000);
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 6000);
		}
		else {
			alert("You have no soul left. LOL.");
		}
	});
	return;
}

function fnFriendActionGiftStacked() {
	if (!confirm('Are you sure you want to gift all your stacked(4) to ' + friendship.nickname + '?')) {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
		var leader=null;
		var l1=0;
		giftList = [];
		for (var i=0;i<result.payload.length;i++) {
			if (parseInt(result.payload[i].skill_lv,10) == 4) {
				if ((parseInt(result.payload[i].grade,10) <= 4) || (parseInt(result.payload[i].grade,10) == 5 && (parseInt(result.payload[i].lv,10) < parseInt(result.payload[i].m.lv_max,10)))) { // rank C/C+/B/B+/A, or (A+ but not maxed lvl)
					if (result.payload[i].location ==0) {
						giftList.push('2:'+result.payload[i].unique_no+':1');	
					}
				}					
			}
		}
		if (giftList.length > 0) {
			fnSetGiftCookies(giftList.join(fnGetSeparator()));	
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 1000);
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 6000);
		}
		else {
			alert("You have no stacked(4) B/B+/A/A+");
		}
	});
	return;
}

function fnFriendActionGiftGuildDown() {
	if (!confirm('Are you sure you want to gift all your guild down to ' + friendship.nickname + '?')) {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
		var leader=null;
		var l1=0;
		var key;
		giftList = [];
		for (var i=0;i<result.payload.length;i++) {
			for (key in guildDownArray) {
				if (parseInt(result.payload[i].skill_id,10) == key) {
					if ((parseInt(result.payload[i].grade,10) <= 4) || (parseInt(result.payload[i].grade,10) == 5 && (parseInt(result.payload[i].lv,10) < parseInt(result.payload[i].m.lv_max,10)))) { // rank C/C+/B/B+/A, or (A+ but not maxed lvl)
						if (result.payload[i].location ==0) {
							giftList.push('2:'+result.payload[i].unique_no+':1');	
						}
					}
				}
			}
		}
		if (giftList.length > 0) {
			fnSetGiftCookies(giftList.join(fnGetSeparator()));	
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 1000);
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 6000);
		}
		else {
			alert("You have no " + skillArray[pSkillID] + " B/B+/A/A+");
		}
	});
	return;
}

function fnFriendActionGiftSpeciesDown() {
	if (!confirm('Are you sure you want to gift all your species down to ' + friendship.nickname + '?')) {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
		var leader=null;
		var l1=0;
		var key;
		giftList = [];
		for (var i=0;i<result.payload.length;i++) {
			for (key in speciesDownArray) {
				if (parseInt(result.payload[i].skill_id,10) == key) {
					if ((parseInt(result.payload[i].grade,10) <= 4) || (parseInt(result.payload[i].grade,10) == 5 && (parseInt(result.payload[i].lv,10) < parseInt(result.payload[i].m.lv_max,10)))) { // rank C/C+/B/B+/A, or (A+ but not maxed lvl)
						if (result.payload[i].location ==0) {
							giftList.push('2:'+result.payload[i].unique_no+':1');	
						}
					}
				}
			}
		}
		if (giftList.length > 0) {
			fnSetGiftCookies(giftList.join(fnGetSeparator()));	
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 1000);
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 6000);
		}
		else {
			alert("You have no " + skillArray[pSkillID] + " B/B+/A/A+");
		}
	});
	return;
}

function fnFriendActionGiftSkill(pSkillID) {
	if (!confirm('Are you sure you want to gift all your ' + skillArray[pSkillID] + ' to ' + friendship.nickname + '?')) {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
		var leader=null;
		var l1=0;
		giftList = [];
		for (var i=0;i<result.payload.length;i++) {
			if (parseInt(result.payload[i].skill_id,10) == pSkillID) {
				if ((parseInt(result.payload[i].grade,10) <= 4) || (parseInt(result.payload[i].grade,10) == 5 && (parseInt(result.payload[i].lv,10) < parseInt(result.payload[i].m.lv_max,10)))) { // rank C/C+/B/B+/A, or (A+ but not maxed lvl)
					if (result.payload[i].location ==0) {
						giftList.push('2:'+result.payload[i].unique_no+':1');	
					}
				}
			}
		}
		if (giftList.length > 0) {
			fnSetGiftCookies(giftList.join(fnGetSeparator()));	
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 1000);
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href'));}, 6000);
		}
		else {
			alert("You have no " + skillArray[pSkillID] + " B/B+/A");
		}
	});
	return;
}

function fnFriendActionGiftAllItems() {
	if (!confirm('Are you sure you want to gift all your items to ' + friendship.nickname + '?')) {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var items = [];
		for (var i=0;i<data.payload.items.length;i++) {				
			items.push('3:'+data.payload.items[i].item_id+':'+data.payload.items[i].amount);			
		}
		if (items.length > 0) {
			fnSetGiftCookies(items.join(fnGetSeparator()));
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));}, 1000);
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));}, 6000);
		}
		else {
			alert("You have no items left");
		}
	});
	
}

function fnFriendActionGiftSummons() {
	if (!confirm('Are you sure you want to gift your major summons to ' + friendship.nickname + '?')) {
		return;
	}
	var divTag = document.createElement("div");
	divTag.id = "checkSummonDiv";
	divTag.style.display = "none";
	document.body.appendChild(divTag); 	
	
	var result= $('#checkSummonDiv').load('/en/'+platform+'/summon #summon_group', {}, function(){
		var items = [];
		if (result.find('#summon_b_grade').find('.cost_ticket').length) {
			items.push('3:5000:'+parseInt(result.find('#summon_b_grade').find('.cost_ticket').html(),10));
		}
		if (result.find('#summon_a_grade').find('.cost_ticket').length) {
			items.push('3:5005:'+parseInt(result.find('#summon_a_grade').find('.cost_ticket').html(),10));
		}
		if (result.find('#summon_special_ticket').find('.cost_ticket').length) {
			if (parseInt(result.find('#summon_special_ticket').find('.cost_ticket').html(),10) > 0) {
				items.push('3:5200:'+parseInt(result.find('#summon_special_ticket').find('.cost_ticket').html(),10));
			}
		}
		if (result.find('#summon_super_special').find('.cost_ticket').length) {
			if (parseInt(result.find('#summon_super_special').find('.cost_ticket').html(),10) > 0) {
				items.push('3:5026:'+parseInt(result.find('#summon_super_special').find('.cost_ticket').html(),10));
			}
		}
		if (items.length > 0) {
			fnSetGiftCookies(items.join(fnGetSeparator()));	
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));}, 1000);
			setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));}, 6000);
		}
		else {
			alert("You have no major summons left");
		}
	});	
}

var giftList = [];

function fnFriendActionGiftItemsAndSummons() {
	if (!confirm('Are you sure you want to gift all your items and major summons to ' + friendship.nickname + '?')) {
		return;
	}
	giftList = [];
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }		
		for (var i=0;i<data.payload.items.length;i++) {				
			giftList.push('3:'+data.payload.items[i].item_id+':'+data.payload.items[i].amount);			
		}
		
		var divTag = document.createElement("div");
		divTag.id = "checkSummonDiv";
		divTag.style.display = "none";
		document.body.appendChild(divTag); 	
		
		var result= $('#checkSummonDiv').load('/en/'+platform+'/summon #summon_group', {}, function(){
			if (result.find('#summon_b_grade').find('.cost_ticket').length) {
				giftList.push('3:5000:'+parseInt(result.find('#summon_b_grade').find('.cost_ticket').html(),10));
			}
			if (result.find('#summon_a_grade').find('.cost_ticket').length) {
				giftList.push('3:5005:'+parseInt(result.find('#summon_a_grade').find('.cost_ticket').html(),10));
			}
			if (result.find('#summon_special_ticket').find('.cost_ticket').length) {
				if (parseInt(result.find('#summon_special_ticket').find('.cost_ticket').html(),10) > 0) {
					giftList.push('3:5200:'+parseInt(result.find('#summon_special_ticket').find('.cost_ticket').html(),10));
				}
			}
			if (result.find('#summon_super_special').find('.cost_ticket').length) {
				if (parseInt(result.find('#summon_super_special').find('.cost_ticket').html(),10) > 0) {
					giftList.push('3:5026:'+parseInt(result.find('#summon_super_special').find('.cost_ticket').html(),10));
				}
			}
			if (giftList.length > 0) {
				fnSetGiftCookies(giftList.join(fnGetSeparator()));	
				setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));}, 1000);
				setTimeout(function(){$.redirect(document.getElementById('do_present').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));}, 6000);
			}
			else {
				alert("You have no items & major summons left");
			}
		});
		
	});
}

function fnFriendActionSelect(pAction) {
	if (pAction == "GiftC") {
		fnFriendActionGiftC();
	}
	else if (pAction == "GiftP") {
		fnFriendActionGiftProg();
	}
	else if (pAction == "GiftItems") {
		fnFriendActionGiftAllItems();
	}
	else if (pAction == "GiftSummons") {
		fnFriendActionGiftSummons();
	}
	else if (pAction == "GiftItemSummons") {
		fnFriendActionGiftItemsAndSummons();
	}
	else if (pAction == "GiftSoul") {
		fnFriendActionGiftSoul();
	}
	else if (pAction == "GiftStacked") {
		fnFriendActionGiftStacked();
	}
	else if (pAction == "GiftGuildDown") {
		fnFriendActionGiftGuildDown();
	}
	else if (pAction == "GiftSpeciesDown") {
		fnFriendActionGiftSpeciesDown();
	}
	else if (pAction.startsWith("GiftSkill")) {
		fnFriendActionGiftSkill(pAction.substr(9));
	}
	else if (pAction == "GiftFormation") {
		fnFriendActionGiftFormation();
	}
}

function fnProfileAddFriendActionSelector() {
	var i;
	var key;
	var divTag = document.createElement("div"); 

	divTag.id = "friendActionDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "200px"; 
	divTag.style.top = "350px"; 

	var selectorHTML = '<select name="sel" onchange="javascript:fnFriendActionSelect(this.options[this.options.selectedIndex].value);"><option selected value="0">Friend Action</option>';
	selectorHTML += '<option value="GiftP">Gift Prog+</option>';
	selectorHTML += '<option value="GiftItems">Gift All Items</option>';
	selectorHTML += '<option value="GiftSummons">Gift Summons</option>';
	selectorHTML += '<option value="GiftItemSummons">Gift Item&Sum</option>';
	selectorHTML += '<option value="GiftSoul">Gift All Soul</option>';
	selectorHTML += '<option value="GiftStacked">Gift Stacked(4)</option>';
	selectorHTML += '<option value="GiftGuildDown">Gift Guild Down</option>';
	selectorHTML += '<option value="GiftSpeciesDown">Gift Species Down</option>';
	for (key in skillArray) {
		selectorHTML += '<option value="GiftSkill'+key+'">Gift ' + skillArray[key] + '</option>';
	}
	selectorHTML += '<option value="GiftFormation">Gift Formation</option>';
	selectorHTML+='</select>'; 

	divTag.innerHTML = selectorHTML;
	document.body.appendChild(divTag);
}

function fnProfileFixTradeGiftButton() {
	document.getElementById('do_trade').setAttribute('href', document.getElementById('do_trade').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));
	document.getElementById('do_present').setAttribute('href', document.getElementById('do_present').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));
}

function fnResetGiftCookies() {
	fnSetGiftCookies('');
}

function fnFriendProfile() {
	fnProfileAddFriendWallBookmarkSelector();
	fnProfileAddFriendWallBookmarkButtons();
	fnProfileAddFriendActionSelector();
	fnProfileFixTradeGiftButton();
	fnResetGiftCookies();
}

// deck
var formationString = "ds_formation";

function fnGetFormationArray() {
	var aFormationArray;
	var aFormationArrayText = fnGetCookie(formationString);
	if (aFormationArrayText == null) {
		aFormationArray = [];
	}
	else {
		aFormationArray = aFormationArrayText.split(fnGetSeparator());
	}
	return aFormationArray;
}

function fnDeckChange(pURL) {
	if (pURL == 0) return;
	if (pURL == "prog") {
		$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
			var leader=null;
			var l1=0;
			var l2=0;
			var l3=0;
			var l4=0;
			var l5=0;			
			for (var i=0;i<result.payload.length;i++) {
				if (result.payload[i].monster_id == progressionList[player.tribe-1]) {
					if (result.payload[i].location ==0 && (leader == null || leader.lv <  result.payload[i].lv)) {
						leader = result.payload[i];
						l1=result.payload[i].unique_no;
					}					
				}
				if (result.payload[i].location=="2") {
					l2=result.payload[i].unique_no;
				}
				if (result.payload[i].location=="3") {
					l3=result.payload[i].unique_no;
				}
				if (result.payload[i].location=="4") {
					l4=result.payload[i].unique_no;
				}
				if (result.payload[i].location=="5") {
					l5=result.payload[i].unique_no;
				}
			}
			if (leader !=null) {
				$.ajax_ex(false, '/en/'+platform+'/deck/autoOrganize?l1='+l1+'&l2='+l2+'&l3='+l3+'&l4='+l4+'&l5='+l5, {}, function(result) {});
				setTimeout(function(){$.redirect('/en/'+platform+'/home');}, 1);
			}
			else {
				alert('you dont have available prog+');
			}
		});
		return;
	}
	$.ajax_ex(false, pURL, {}, function(data) {
	});	
	document.location='/en/'+platform+'/home';
}

function fnDeckChangeAdvance(pFormation, pHome, pFinishFunction) {
	if (pFormation=='') {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
		var unique_no_array = pFormation.split(fnGetConnector())[2].split(':');
		var monster_id_array = pFormation.split(fnGetConnector())[3].split(':');
		var result_array = {"l1":"0", "l2":"0", "l3":"0", "l4":"0", "l5":"0"};

		for (var i=0;i<result.payload.length;i++) {
			for (var j=0;j<5;j++) {
				if (result.payload[i].unique_no == unique_no_array[j]) {
					result_array['l'+(j+1)] = result.payload[i].unique_no;
				}
			}
		}
		for (var j=0;j<5;j++) {
			if (result_array['l'+(j+1)] == 0 && unique_no_array[j] != 0) {
				var missed = true;
				for (var i=0;i<result.payload.length;i++) {
					if (result.payload[i].monster_id == monster_id_array[j]) {
						var usedInTeam = false;
						for (var k=0;k<j;k++) {
							if (result.payload[i].unique_no == result_array['l'+(k+1)]) {
								usedInTeam = true;
							}
						}
						if (!usedInTeam) {
							if (result_array['l'+(j+1)] == 0) {
								result_array['l'+(j+1)] = result.payload[i].unique_no;
								result_array['l'+(j+1)+'level'] = result.payload[i].lv;
								result_array['l'+(j+1)+'skillLevel'] = result.payload[i].skill_lv;
							}
							else {
								if (result.payload[i].lv > result_array['l'+(j+1)+'level'] || (result.payload[i].lv == result_array['l'+(j+1)+'level'] && result.payload[i].skill_lv > result_array['l'+(j+1)+'skillLevel'])) {
									result_array['l'+(j+1)] = result.payload[i].unique_no;
									result_array['l'+(j+1)+'level'] = result.payload[i].lv;
									result_array['l'+(j+1)+'skillLevel'] = result.payload[i].skill_lv;
								}
							}
							missed = false;
						}
					}
				}
				if (missed) {
					alert('Missing ' + monster_id_array[j]);
				}
			}
		}
		if (result_array['l1'] == "0") {
			alert("Missing Leader");
			return;
		}
		$.ajax_ex(false, '/en/'+platform+'/deck/autoOrganize?l1='+result_array['l1']+'&l2='+result_array['l2']+'&l3='+result_array['l3']+'&l4='+result_array['l4']+'&l5='+result_array['l5'], {}, pFinishFunction);
		if (pHome) {
			setTimeout(function(){$.redirect('/en/'+platform+'/home');}, 1);
		}
	});
	return;
}

function fnDeckAddFormationSelector() {
	var i;
	var divTag = document.createElement("div"); 

	divTag.id = "formationDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "0px"; 
	divTag.style.top = "120px"; 

	var selectorHTML = '<select name="sel" onchange="fnDeckChangeAdvance(fnGetFormationArray()[this.options[this.options.selectedIndex].value], true);"><option selected value="0">Formation</option><option value="prog">Progression On</option>';
	var aFormationArray = fnGetFormationArray();
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		selectorHTML+='<option value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	selectorHTML+='</select>'; 

	divTag.innerHTML = selectorHTML;
	document.body.appendChild(divTag);
}

function fnDeckRemoveFormationSelector() {
	var divTag = document.getElementById('formationDiv');
	if (divTag != null) {
		document.body.removeChild(divTag);
	}
}

function fnDeckRecordFormation() {
	var team = '.';//document.getElementById('a-btn-ok').getAttribute('href');
	var aFormationArray = fnGetFormationArray();
	var teamName = prompt("Please input a team name");
	var monster_id_array = [];
	var patt1=/[0-9]{1,5}/g;
	for (var i=0;i<5;i++) {
		if (fnQueryString('unos').split('_')[i] == 0) {
			monster_id_array.push("0");
		}
		else {
			monster_id_array.push($('#div-new-deck').find('.__l'+(i+1)).attr('src').match(patt1));
		}
	}
	var finalStr = team + fnGetConnector() + teamName + fnGetConnector() + fnQueryString('unos').split('_').join(':') + fnGetConnector() + monster_id_array.join(":");
	if (!fnArrayHasItem(aFormationArray, finalStr)) {
		aFormationArray.splice(0,0,finalStr);
	}
	else {
		return;
	}
	var aFormationArrayText = aFormationArray.join(fnGetSeparator());
	fnSetCookie(formationString,aFormationArrayText);
	fnGrowl("Saved " + teamName);
}

function fnDeckUnRecordFormation() {
	var team = document.getElementById('a-btn-ok').getAttribute('href');
	var aFormationArrayText = null;
	var aFormationArray = fnGetFormationArray();
	fnArrayRemoveItem(aFormationArray, team + fnGetConnector() + "BP " + document.getElementById('div-deck-status').childNodes[7].childNodes[1].innerHTML + " Team");
	if (aFormationArray.length == 0) {
		aFormationArrayText = null;
	}
	else {
		aFormationArrayText = aFormationArray.join(fnGetSeparator());
	}
	fnSetCookie(formationString,aFormationArrayText);
	fnGrowl("Removed " + "BP " + document.getElementById('div-deck-status').childNodes[7].childNodes[1].innerHTML + " Team");
}

function fnDeckClearFormation() {
	fnSetCookie(formationString,"");
	fnGrowl("Cleared All Formations.");
}

function fnDeckAddFormationButtons() {
	var divTag = document.createElement("div"); 
	divTag.id = "formationAddDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "20px"; 
	divTag.style.top = "190px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="javascript:fnDeckRecordFormation();fnDeckRemoveFormationSelector();fnDeckAddFormationSelector();">Add</button>'; 
	document.body.appendChild(divTag);
	
	/*divTag = document.createElement("div"); 
	divTag.id = "formationRemoveDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "100px"; 
	divTag.style.top = "190px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="javascript:fnDeckUnRecordFormation();fnDeckRemoveFormationSelector();fnDeckAddFormationSelector();">Del</button>'; 
	document.body.appendChild(divTag);*/
	
	divTag = document.createElement("div"); 
	divTag.id = "formationClearDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "200px"; 
	divTag.style.top = "190px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="javascript:fnDeckClearFormation();fnDeckRemoveFormationSelector();fnDeckAddFormationSelector();">Clear All</button>'; 
	document.body.appendChild(divTag);
}

function fnDeckChangeAllCheck() {
	fnDeckAddFormationSelector();
	fnDeckAddFormationButtons();
}

// tower mission

function fnFixMissionProcess() {
	missionProcess = function() {
		$.ajax_ex(false, '/en/'+platform+'/tower/process', {'area_id'    : areaMaster.area_id,'mission_id' : mission.last_mission_id, api : 'json', '__hash': ('' + (new Date()).getTime())}, function(result) {
			if (result.status != 0) {
				if (result.status == 901) {
					if (fnAutoDrink() == 1 && parseInt(areaMaster.area_id,10)*5 <= parseInt(fnTowerEventTarget(), 10)) {
						var useEnergy100 = false;
						for (var i=0;i<result.payload.recoverItems.length;i++) {
							if (result.payload.recoverItems[i].item_id==3022) {
								if (player.power_max <= 400 && (player.next_exp - player.now_exp < result.payload.recoverItems[i].amount * 100)) {
									// max energy too low, drink enenrgy100 to level up instead of full ep
									useEnergy100 = true;
									break;
								}
								if (player.next_exp - player.now_exp > player.power_max) {
									// not close to level up, so drink full ep
									break;
								}
								if (player.next_exp - player.now_exp > 400) {
									// close to level up, but not going to spend five energy100 to level up, so drink full ep anyway
									break;
								}
								if (player.next_exp - player.now_exp <= result.payload.recoverItems[i].amount * 100) {
									// close to level up, and player has enough my energy 100 potion, drink enenrgy100 to level up instead of full ep
									useEnergy100 = true;
									break;
								}
								break;
							}
						}
						if (useEnergy100) {
							$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:3022}, function(data) {});
						}
						else {
							$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:result.payload.recoverItems[0].item_id}, function(data) {});
						}
					}
					else {
						clearInterval(missionInterval);
						EfectMng.clear()
						.push('hideSystemBtns', null)
						.push('shadowShow', null)
						.push('recoverItems', result.payload.recoverItems)
						.push('shadowHide', null)
						.push('showSystemBtns', null)
						.play();						
						return;
					}
				}
				clearInterval(missionInterval);
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 1000);
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);
				return;
			}
			mission = result.payload.mission;
			$('#mission_progress').progressbar().setValue(
				result.payload.process.clear ? 100 : ~~mission.progress / 10
			  );
			// progress_text
			$('#progress-value span').html((result.payload.process.clear ? 100 : ~~mission.progress / 10) + '%');

			player = result.payload.player;
			$.refreshStatus(false, null);
			
			var isShadow = false;
			EfectMng.clear();
				//.push('hideSystemBtns', null);
			var processData = {
			  process : result.payload.process,
			  crack   : false,
			  pot     : false,
			  stairs  : result.payload.process.clear 
			};

			result.payload.process.foundType = 0;

			EfectMng.push('process', processData);

			if (result.payload.process.rndBoss) {
				//document.location='/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003';	1068	  
					setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 1000);		
					setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);// if failed to redirect, then reload mission screen
				clearInterval(missionInterval);
			}
			if (result.payload.process.clear) {
			  if (!isShadow) EfectMng.push('shadowShow', null);
			  isShadow = true;
			  if (mission.is_boss) {
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 1000);
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);
				clearInterval(missionInterval);
				return true;
			  }
			}
			if (result.payload.process.warp) {
			  if (!isShadow) EfectMng.push('shadowShow', null);
			  isShadow = false;
			  EfectMng.push('warp', {floor : result.payload.process.floor});
			  EfectMng.push('shadowHide', null);
			  EfectMng.push('getMonster', null);
			  EfectMng.push('reload', null);
			  clearInterval(missionInterval);
			  return true;
			}
			if (result.payload.process.cage) {
				if (!isShadow) EfectMng.push('shadowShow', null);
				isShadow = true;
				clearInterval(missionInterval);
				$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {});
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 1000);
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);
				return true;
				/*EfectMng.push('cageSelect', {
				grade : result.payload.process.cage,
				item : result.payload.event.cage.item,
				sampleTrap: result.payload.sampleTrap,
				player: result.payload.player
				});*/
			}
			if (isShadow) EfectMng.push('shadowHide', null);
			if (result.payload.process.clear) {
			  if (!mission.is_boss) {

			  }
			  else {
				setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);}, 1000);
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);// if failed to redirect, then reload mission screen
				clearInterval(missionInterval);
				return true;
			  }
			}
			EfectMng.push('showSystemBtns', null).play();
			if (fnGetGrindingSpeed() == 1) {
				missionProcess();
			}
		});		
		return false;
	};
	EfectMng.efectList.process = __effect_process = function(data) {};
	EfectMng.efectList.cageSelect = __effect_cageSelect = function(data) {
		$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) { 	});
		EfectMng.push('reload', null);
		clearInterval(missionInterval);
	}
}

function fnTowerMission() {
	fnFixMissionProcess();
	if (document.getElementById('cage-select').style.display != "none") {
		$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {  			
		});	
	}

	if (fnGetGrindingSpeed() == -1) {
		// user press by himself, dont automate
		return;
	}
	if (!mission.is_boss) {
		if (typeof mission.boss_battle_rnd && mission.boss_battle_rnd > 0) {
			if (fnTowerMcFlyTeam() != '' && fnTowerProgTeam() != '') {
				fnSetIsBattlingMcFly(1);
				fnDeckChangeAdvance(fnTowerMcFlyTeam(), false, function(){fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');});
				//$.ajax_ex(false, fnTowerMcFlyTeam().split(fnGetConnector())[0], {}, function(data) {});
			}
			setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');}, 1000);
			setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');}, 8000);
		}
		else {
			if (fnGetGrindingSpeed() == 1) {
				missionProcess();
			}
			else {
				missionInterval = setInterval(missionProcess,fnGetGrindingSpeed());
			}
		}
	}
	else {	
		if (fnTowerMcFlyTeam() != '' && fnTowerProgTeam() != '') {
			fnSetIsBattlingMcFly(1);
			fnDeckChangeAdvance(fnTowerMcFlyTeam(), false, function(){fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');});
			//$.ajax_ex(false, fnTowerMcFlyTeam().split(fnGetConnector())[0], {}, function(data) {});
		}
		setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);}, 1000);
		setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);}, 8000);
		//document.location='/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id;
	}
}

function fnTower() {
	if (document.getElementById('div-btn-system') != null) {
		fnRedirect('/en/'+platform+'/tower/subpoena');
		return;
	}
	if (document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/battle/battle') || document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/tower/boss') || document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/tower/subpoena')) {
		fnRedirect('/en/'+platform+'/tower/mission');
	}
}

function fnTowerSummon() {
	fnRedirect('/en/'+platform+'/tower/mission');
}

// tower boss result

function fnTowerBossResult() {
	if (fnIsBattlingMcFly() == 1 && fnTowerMcFlyTeam() != '' && fnTowerProgTeam() != '') {
		fnSetIsBattlingMcFly(0);
		fnDeckChangeAdvance(fnTowerProgTeam(), false, function(){});
		//$.ajax_ex(false, fnTowerProgTeam().split(fnGetConnector())[0], {}, function(data) {	});
	}
	$.ajax_ex(false, '/en/'+platform+'/tower/bossGetResources', {choice : 1, '__hash' : ('' + (new Date()).getTime()) },function(result) {
		if (result.status == 101) {
			fnRedirect('/en/'+platform+'/tower/mission');
		} else if (result.payload.resources.foundType != null && result.payload.resources.foundType==10 && result.payload.resResult.items[result.payload.itemMaster.item_id].collected_count==6) { 
			fnRedirect('/en/'+platform+'/tower');
		} else  {
			fnRedirect('/en/'+platform+'/tower/mission');
		}
	});
}

// tower final ranking

function fnTowerFinalRanking() {
	// receiving multiple event rewards wont work haha
	//$('.__receive_info').html($('.__receive_info').html() + ' <a class="__btn_receive btn __stone_red __HS" href="javascript:$.ajax_ex(false, \'/en/'+platform+'/tower/ReceiveReward\', { }, function(data) {});$.ajax_ex(false, \'/en/'+platform+'/tower/ReceiveReward\', { }, function(data) {});$.ajax_ex(false, \'/en/'+platform+'/tower/ReceiveReward\', { }, function(data) {});">Receive Reward</a>');
}

// Fork road

function fnFixForkRoadMissionProcess() {
	mission_exec = function() {
		$.ajax_ex(false, '/en/'+platform+'/forkroad/ajax_process', {
			area_id: area_id,
			mission: mission.current_mission,
			'__hash':  (new Date()).getTime(),
		}, function(result) {
			if (result.status == 4) {
				if (fnAutoDrink() == 1) {
					var useEnergy100 = false;
					for (var i=0;i<result.payload.item_ids.length;i++) {
						if (result.payload.item_ids[i]==3022) {
							if (player.power_max <= 300 && (player.next_exp - player.now_exp < result.payload.amount[i] * 100)) {
								// max energy too low, drink enenrgy100 to level up instead of full ep
								useEnergy100 = true;
								break;
							}
							if (player.next_exp - player.now_exp > player.power_max) {
								// not close to level up, so drink full ep
								break;
							}
							if (player.next_exp - player.now_exp > 400) {
								// close to level up, but not going to spend five energy100 to level up, so drink full ep anyway
								break;
							}
							if (player.next_exp - player.now_exp <= result.payload.amount[i] * 100) {
								// close to level up, and player has enough my energy 100 potion, drink enenrgy100 to level up instead of full ep
								useEnergy100 = true;
								break;
							}
							break;
						}
					}
					if (useEnergy100) {
						$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:3022}, function(data) {});
					}
					else {
						$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:result.payload.item_ids[0]}, function(data) {});
					}
					if (fnGetGrindingSpeed() == 1) {
						mission_exec();
					}
					return;
				}
				else {
					phase_no_power(result.payload);
					clearInterval(missionInterval);
				}
				return;
			} else if(result.status != 0) {
				if (result.status == -5) {
					$.redirect('/en/'+platform+'/guildraid?intentional=1');
					return;
				}
			//        confirm_id = 0;//result.payload.confirm_id;
				return;
			}

			// é²æã«åãããä½ç½®ã«å¤æ´
			var m_area = missionAreaMaster[result.payload.mission.unique_id];
			scrollTemplate.setPosition((320 - m_area.pos_x) - (320 / 2) - 30, (200 - m_area.pos_y) - (200 / 2) - 30);

			player = result.payload.player;
			refreshStatus();
			setFragmentParam(result.payload.mission, result.payload.event.fragment);

			mission = result.payload.mission;
			event   = result.payload.event;
			mini_potion = result.payload.mini_potion;
			//      loop_count = result.payload.loop_count ;
			event.phase = new Array();

			//event.phase.push('default_resource');

			/*if(mini_potion.flag != 0)                event.phase.push('herb');
			if(event.monster)                        event.phase.push('get_monster');
			if(event.clear)                          event.phase.push('mission_clear');
			if(event.exp.lvup > 0)                   event.phase.push('level_up');
			if(event.exp.lvup > 0)                   event.phase.push('status_up');
			if(event.fragment.fragment_plus > 0)     event.phase.push('get_fragment');*/
			if(event.fragment.fragment_count == 10)  {				
				setTimeout(function(){$.redirect('/en/'+platform+'/forkroad/subpoena', {'__hash': new Date().getTime()});}, 1000);
				setTimeout(function(){$.redirect('/en/'+platform+'/forkroad/subpoena', {'__hash': new Date().getTime()});}, 6000);
				return;
			}//event.phase.push('fragment_complete');

			//ã¤ãã³ãã®å¤å®
			if(typeof(result.payload.event.event_info.params) != 'undefined') {
				if(255 == result.payload.event.event_info.params.type){
					event.phase.push('goal_effect');
				}
				event.phase.push('fork_event_' + result.payload.event.event_info.params.type);
			}

			//åå²é¸æã®å¤å®
			if(result.payload.process.fork_flag > 0) {
				event.phase.push('fork_select');
			}

			//åå²çµäºã®å¤å®
			if(result.payload.event.event_info.fork == 64 && result.payload.event.clear) {
				event.phase.push('fork_end');
			}

			//ã©ã³ãã ãã¹ã¨ã®é­éå¤å®
			if(event.enemy_encount) {
				setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?event=4&aid='+area_id);}, 1000);
				setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?event=4&aid='+area_id);}, 6000);
				return;
			}

			event = eventManager(event);
		});
	}
	
}

function fnForkRoadMission() {
	fnFixForkRoadMissionProcess();

	if (fnGetGrindingSpeed() == -1) {
		// user press by himself, dont automate
		return;
	}
	if (fnGetGrindingSpeed() == 1) {
		mission_exec();
	}
	else {
		missionInterval = setInterval(mission_exec,fnGetGrindingSpeed());
	}
}

function fnForkRoad() {
	if (parseInt(player.deck_total_bp,10) == 1) {
		setInterval(function(){$.redirect('/en/'+platform+'/forkroad/list');}, 60000);
	}
}

// dungeon mission

function fnDungeonMission() {
	if (fnGetGrindingSpeed() == -1) {
		return;
	}
	if (parseInt(fnQueryString('dungeon_tribe'), 10) == 0) {
		if ((fnQueryString('go_next') == 'true' && dm.mission_count >= mMs.length)  || (document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/dungeon/battle')) || (document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/dungeon/win'))) {
			if (fnDungeonProgTeam() != '' && fnDungeonImpulseTeam() != '' && fnDungeonCovertTeam() != '' && fnDungeonPsychoTeam() != '') {
				fnDeckChangeAdvance(fnDungeonProgTeam(), false, function(){fnRedirect('/en/'+platform+'/dungeon/mission?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);});
				fnRedirect('/en/'+platform+'/dungeon/mission?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);
				return;
			}
			fnTimeOutRedirect('/en/'+platform+'/dungeon');
			fnDungeonMission = function(){};
			return;
		}
	}
	if (ig.game == null) {
		setTimeout(fnDungeonMission, 100);
		return;
	}
	ig.game.save = function(next) {
		var result_data = null;
		$.ajax_ex(false, js_gen_url+'dungeon/ajaxSaveMission' , {
			area_id: dm['area_id'],
			dungeon_tribe: dm['dungeon_tribe'],
			addJewel: (parseInt(ig.game.addJewel,10) + parseInt(fnDungeonExtraGold(),10)),
			decreaseBp: ig.game.decreaseBp,
			addExp: (parseInt(ig.game.addExp,10) + parseInt(fnDungeonExtraExp()=="Smart"?0:fnDungeonExtraExp(),10)),
			cfmId: cfm_id,
			__hash: ('' + (new Date()).getTime())
		}, function(result) {
			if (! result.status) {
				$.redirect(js_gen_url + "dungeon/index");
				return;
			}
			result_data = result.status;
			cfm_id = result_data['cfm_id'];
		});

		if (result_data) {
			ig.game.reward = result_data['reward'];
			ig.game.reward_monster = result_data['monster'];
			ig.game.level_up = result_data['lvup'];
		}

		ig.game.decreaseBp = 0;
		ig.game.addJewel = 0;
		ig.game.addExp = 0;		
		fnTimeOutRedirect('/en/'+platform+'/dungeon/mission?area_id='+dm['area_id']+'&dungeon_tribe='+dm['dungeon_tribe']);
    }
	if (ig.game.mission_type != ig.game.MISSION_TYPE.BOSS) {
		var willDoProgress = player.bp >= (ig.game.getMissionMaster()['use_bp'] * (parseInt(ig.game.getMissionMaster()['progress_max'],10)-parseInt(dm['progress'],10)))?(parseInt(ig.game.getMissionMaster()['progress_max'],10)-parseInt(dm['progress'],10)):Math.floor(player.bp/ig.game.getMissionMaster()['use_bp']);
		if (willDoProgress >= 1) {
			ig.game.decreaseBp = willDoProgress*ig.game.getMissionMaster()['use_bp'];
			ig.game.addJewel = willDoProgress*ig.game.getMissionMaster()['use_bp'];
			ig.game.addExp = (willDoProgress == (parseInt(ig.game.getMissionMaster()['progress_max'],10)-parseInt(dm['progress'],10)))? ig.game.getMissionMaster()['exp_max']:0;
			if (fnDungeonExtraExp() == "Smart") {
				if (player.bp-ig.game.decreaseBp < ig.game.getMissionMaster()['use_bp']) {
					if (ig.game.addExp < parseInt(player.next_exp,10) - parseInt(player.now_exp, 10)) {
						ig.game.addExp = parseInt(player.next_exp,10) - parseInt(player.now_exp, 10);
					}
				}
			}
			ig.game.save(null);
		}
		else {
			if (parseInt(fnDungeonAutoBP(),10) > 0) {
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:fnDungeonAutoBP()}, function(data) {});
				fnTimeOutRedirect('/en/'+platform+'/dungeon/mission?area_id='+dm['area_id']+'&dungeon_tribe='+dm['dungeon_tribe']);
				return;
			}
			setTimeout(function(){$.redirect('/en/'+platform+'/dungeon/mission?area_id='+dm['area_id']+'&dungeon_tribe='+dm['dungeon_tribe']);}, 60000);
		}
	}
	else {
		if (dm['dungeon_tribe'] > 0) {
			fnTimeOutRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);
		}
		if (dm['dungeon_tribe'] == 0) {
			if (fnDungeonProgTeam() != '' && fnDungeonImpulseTeam() != '' && fnDungeonCovertTeam() != '' && fnDungeonPsychoTeam() != '') {
				if ((bM.monster_id+'').startsWith('40') || (bM.monster_id+'').startsWith('60')) {
					fnDeckChangeAdvance(fnDungeonImpulseTeam(), false, function(){fnRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);});
				}
				else if ((bM.monster_id+'').startsWith('43') || (bM.monster_id+'').startsWith('63')) {
					fnDeckChangeAdvance(fnDungeonCovertTeam(), false, function(){fnRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);});
				}
				else if ((bM.monster_id+'').startsWith('46') || (bM.monster_id+'').startsWith('66')) {
					fnDeckChangeAdvance(fnDungeonPsychoTeam(), false, function(){fnRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);});
				}
				//fnSetDungeonBossRecord(fnDungeonBossRecord()+'<br/>'+Math.round(parseInt(dm.mission_count,10)/44)+' ' + bM.name);
				fnTimeOutRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);
			}
		}
	}
}

function fnDungeonMissionPreload() {
	if (parseInt(fnQueryString('dungeon_tribe'), 10) == 0) {
		if ((fnQueryString('go_next') == 'true' && dm.mission_count >= mMs.length)  || (document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/dungeon/battle')) || (document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/dungeon/win'))) {
			if (fnDungeonProgTeam() != '' && fnDungeonImpulseTeam() != '' && fnDungeonCovertTeam() != '' && fnDungeonPsychoTeam() != '') {
				fnDeckChangeAdvance(fnDungeonProgTeam(), false, function(){fnRedirect('/en/'+platform+'/dungeon/mission?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);});
				fnRedirect('/en/'+platform+'/dungeon/mission?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);
				return;
			}
			fnTimeOutRedirect('/en/'+platform+'/dungeon');
			fnDungeonMission = function(){};
			return;
		}
	}
}

// dungeon battle

function fnDungeonBattle() {
	frames = [];
	fnTimeOutRedirect('/en/'+platform+'/dungeon/win?area_id='+fnQueryString('area_id')+'&tribe='+fnQueryString('dungeon_tribe'));
}

function fnDungeonBattlePreload() {
	/*if (fnGetGrindingSpeed() == -1) {
		return;
	}*/
	frames = [];
	fnRedirect('/en/'+platform+'/dungeon/win?area_id='+fnQueryString('area_id')+'&tribe='+fnQueryString('dungeon_tribe'));
}

// Dungeon Win

function fnDungeonWin() {
	if (fnGetGrindingSpeed() == -1) {
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/dungeon/ajaxSaveMissionBoss', {
		area_id: area_id,
		dungeon_tribe: dungeon_tribe,
		cfmId: cfm_id,
		__hash: ('' + (new Date()).getTime())
	}, function(result) {
		if (! result.status) {
			$.redirect('/en/'+platform+'/dungeon');
			return;
		}
		cfm_id = result.status['cfm_id'];
		if ("") {
			$.redirect('/en/'+platform+'/dungeon/complete');
		} else {
			//fnTimeOutRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dungeon_tribe+'&area_id='+area_id);
			//$.redirect('/en/'+platform+'/dungeon/mission?go_next=true&area_id='+area_id+"&dungeon_tribe="+dungeon_tribe);
		}
	});
	if (dungeon_tribe == 0) {
		fnTimeOutRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dungeon_tribe+'&area_id='+area_id);
	}
	else {
		fnTimeOutRedirect('/en/'+platform+'/dungeon/mission?dungeon_tribe='+dungeon_tribe+'&area_id='+area_id);
	}
	
	var divTag = document.createElement("div"); 
	divTag.id = "battleButtonDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "240px"; 
	divTag.style.top = "140px"; 
	divTag.innerHTML = '<a href="/en/'+platform+'/dungeon/battle?dungeon_tribe='+dungeon_tribe+'&area_id='+area_id + '" class="btn __red __WS __HL" id="button_boss">Boss</a>'; 
	document.body.appendChild(divTag); 
	
	//fnTimeOutRedirect('/en/'+platform+'/dungeon/ajaxSaveMissionBoss?area_id='+fnQueryString('area_id')+'&dungeon_tribe='+fnQueryString('tribe'));
}

function fnDungeonWinPreload() {
	
}

// dungeon

function fnDungeon() {
	
	// level select setting
	var levelSelectorHTML = '<select style="position:absolute;top:100px;left:0px" onchange="fnSetDungeonTravelLevel(this.options[this.options.selectedIndex].value);fnGrowl(\'Level:\'+this.options[this.options.selectedIndex].text);location.reload();">';
	levelSelectorHTML += '<option ' + (fnDungeonTravelLevel() == 0 ?'selected':'') + ' value="0">Current Level</option>'
	for (var j=1;j<=10;j++) {
		levelSelectorHTML += '<option ' + (fnDungeonTravelLevel() == j ?'selected':'') + ' value="'+j+'">Level '+j+'</option>';
	}
	levelSelectorHTML += '</select>'; 
	
	var expSelectorHTML = '<select style="position:absolute;top:100px;left:110px" onchange="fnSetDungeonExtraExp(this.options[this.options.selectedIndex].value);fnGrowl(\'Extra Exp:\'+this.options[this.options.selectedIndex].text);">';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == "Smart" ?'selected':'') + ' value="Smart">Smart Exp</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 0 ?'selected':'') + ' value="0">Extra Exp:0</option>'
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 10 ?'selected':'') + ' value="10">10</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 50 ?'selected':'') + ' value="50">50</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 100 ?'selected':'') + ' value="100">100</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 500 ?'selected':'') + ' value="500">500</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 1000 ?'selected':'') + ' value="1000">1000</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 5000 ?'selected':'') + ' value="5000">5000</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 10000 ?'selected':'') + ' value="10000">10000</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 50000 ?'selected':'') + ' value="50000">50000</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 100000 ?'selected':'') + ' value="100000">100000</option>';
	expSelectorHTML += '<option ' + (fnDungeonExtraExp() == 500000 ?'selected':'') + ' value="500000">500000</option>';	
	expSelectorHTML += '</select>'; 
	
	var goldSelectorHTML = '<select style="position:absolute;top:100px;left:210px"  onchange="fnSetDungeonExtraGold(this.options[this.options.selectedIndex].value);fnGrowl(\'Extra Gold:$\'+this.options[this.options.selectedIndex].text);">';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 0 ?'selected':'') + ' value="0">Extra Gold:$0</option>'
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 10 ?'selected':'') + ' value="10">$10</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 50 ?'selected':'') + ' value="50">$50</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 100 ?'selected':'') + ' value="100">$100</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 500 ?'selected':'') + ' value="500">$500</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 1000 ?'selected':'') + ' value="1000">$1000</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 5000 ?'selected':'') + ' value="5000">$5000</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 10000 ?'selected':'') + ' value="10000">$10000</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 50000 ?'selected':'') + ' value="50000">$50000</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 100000 ?'selected':'') + ' value="100000">$100000</option>';
	goldSelectorHTML += '<option ' + (fnDungeonExtraGold() == 500000 ?'selected':'') + ' value="500000">$500000</option>';
	goldSelectorHTML += '</select>'; 
	
	document.getElementById('deck_bg').innerHTML += levelSelectorHTML + expSelectorHTML + goldSelectorHTML ;	
	
	var aFormationArray = fnGetFormationArray();
	var impulseTeamSelectorHTML =  'VS Impulse Boss:<select name="impulse" onchange="fnSetDungeonImpulseTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Impulse Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonImpulseTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		impulseTeamSelectorHTML+='<option ' + (fnDungeonImpulseTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	impulseTeamSelectorHTML+='</select><br/>'; 
	
	var covertTeamSelectorHTML =  'VS Covert Boss:<select name="convert" onchange="fnSetDungeonCovertTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Covert Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonCovertTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		covertTeamSelectorHTML+='<option ' + (fnDungeonCovertTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	covertTeamSelectorHTML+='</select><br/>'; 
	
	var psychoTeamSelectorHTML =  'VS Psycho Boss:<select name="psycho" onchange="fnSetDungeonPsychoTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Psycho Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonPsychoTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		psychoTeamSelectorHTML+='<option ' + (fnDungeonPsychoTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	psychoTeamSelectorHTML+='</select><br/>'; 
	
	var progTeamSelectorHTML =  'Prog Team<select name="prog" onchange="fnSetDungeonProgTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Prog Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonProgTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		progTeamSelectorHTML+='<option ' + (fnDungeonProgTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	progTeamSelectorHTML+='</select><br/>'; 
	
	var bpSelectorHTML =  'Auto BP<select name="autoBP" onchange="fnSetDungeonAutoBP(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto BP:\'+this.options[this.options.selectedIndex].text);"><option ' + (parseInt(fnDungeonAutoBP(),10)==0?'selected':'') + ' value="0">Auto Off</option><option ' + (parseInt(fnDungeonAutoBP(),10)==3003?'selected':'') + ' value="3003">Real BP</option><option ' + (parseInt(fnDungeonAutoBP(),10)==3019?'selected':'') + ' value="3019">My BP</option></select>';	

	document.getElementById('infinity').innerHTML += impulseTeamSelectorHTML + covertTeamSelectorHTML + psychoTeamSelectorHTML + progTeamSelectorHTML + bpSelectorHTML;
	
	document.getElementById('main_bg').style.height = (parseInt(document.getElementById('main_bg').style.height,10) + 125) + "px";
	
	var divTag = document.createElement("div");
	divTag.id = "bossRecordDiv";
	divTag.innerHTML = fnDungeonBossRecord() + '<br/><a href="javascript:fnSetDungeonBossRecord(\'\');location.reload();">Clear boss battle history</a>';
	document.body.appendChild(divTag);
	
	popup_window = function () {

		$('#fade').css({
		  width: $(document).width(),
		  height:$(document).height(),
		}).show();

		id = ~~$(this).attr("id").split("_")[1];

		string = 'Use %img_tag% to decrease BP consumption!';
		string = string.replace('%img_tag%', '<img src="'+srcBase+'misc/icons/tribe_'+id+'.png" />');

		challenge = 'Challenge %amount%?';
		challenge = challenge.replace('%amount%', area_master[id]['area_name']);

		$('#dungeon_name').html(area_master[id]['area_name']);
		$('#down_bp').html(string);
		$('#show_bp').html("BP Use " + mission_name[id]['use_bp']);
		$('#show_jewel').html('Gold'+' '+mission_name[id]['jewel_min']+' - '+mission_name[id]['jewel_max']);
		$('#show_challenge').html(challenge);
		$('#button_ok').attr('href',urlBase+'dungeon/mission?area_id='+(fnDungeonTravelLevel()==0?dungeon_lv:fnDungeonTravelLevel())+
															'&dungeon_tribe='+id);
		$('#popup_top').children('img').attr('src', srcBase+'dungeon/mission/area_base'+id+'.png');

		$('#popup').show();
	}
	
	if (fnDungeonTravelLevel() != 0) {
		for (var i=0;i<$('a[href^="/en/'+platform+'/dungeon/mission?area_id"]').length;i++){
			$('a[href^="/en/'+platform+'/dungeon/mission?area_id"]').eq(i).attr("href", '/en/'+platform+'/dungeon/mission?area_id='+fnDungeonTravelLevel()+"&dungeon_tribe=" + $('a[href^="/en/'+platform+'/dungeon/mission?area_id"]').eq(i).attr("href").substr(-1));
		}
	}
	if (fnDungeonTravelLevel() != 0) {
		for (var i=1;i<=3;i++) {
			if ($('img[src$="enter_'+i+'_d.png"]').length) {
				$('img[src$="enter_'+i+'_d.png"]').attr('link', '/en/'+platform+'/dungeon/mission?area_id='+fnDungeonTravelLevel()+'&dungeon_tribe=' + i);
				$('img[src$="enter_'+i+'_d.png"]').click(function(){
					$.redirect($(this).attr('link'));
				});
			}
		}
	}
}

// battle

function fnBattleBattle() {
	// skip to result
	if (document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/tower/mission')) {
		fnRedirect('/en/'+platform+'/tower/bossResult');
	}
	if (document.referrer.startsWith('http://game.darksummoner.com/en/'+platform+'/mission')) {
		fnRedirect('/en/'+platform+'/mission/battleResult');
	}
	//setTimeout(function(){$.redirect(document.getElementById('canvas').parentNode.parentNode.childNodes[3].childNodes[3].getAttribute('href'));}, 1000);
}

// normal mission

function fnFixMissionExec() {
	mission_exec = function() {
		if(mission.last_mission == 5) {
			setTimeout(function(){$.redirect('battle/battleact?aid='+area_id);}, 1000);
			setTimeout(function(){$.redirect('battle/battleact?aid='+area_id);}, 6000);
			clearInterval(missionInterval);
			return;
		}
		$.ajax_ex(false, '/en/'+platform+'/mission/process', {
			area_id: area_id,
			mission: (fnAutoNewMission()==0?mission.current_mission:mission.last_mission),
			confirm_id: confirm_id
		}, function(result) {
			if (result.status == 4) {
				if (fnAutoDrink() == 1) {
					var useEnergy100 = false;
					for (var i=0;i<result.payload.item_ids.length;i++) {
						if (result.payload.item_ids[i]==3022) {
							if (player.power_max <= 300 && (player.next_exp - player.now_exp < result.payload.amount[i] * 100)) {
								// max energy too low, drink enenrgy100 to level up instead of full ep
								useEnergy100 = true;
								break;
							}
							if (player.next_exp - player.now_exp > player.power_max) {
								// not close to level up, so drink full ep
								break;
							}
							if (player.next_exp - player.now_exp > 400) {
								// close to level up, but not going to spend five energy100 to level up, so drink full ep anyway
								break;
							}
							if (player.next_exp - player.now_exp <= result.payload.amount[i] * 100) {
								// close to level up, and player has enough my energy 100 potion, drink enenrgy100 to level up instead of full ep
								useEnergy100 = true;
								break;
							}
							break;
						}
					}
					if (useEnergy100) {
						$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:3022}, function(data) {});
					}
					else {
						$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:result.payload.item_ids[0]}, function(data) {});
					}
					if (fnGetGrindingSpeed() == 1) {
						mission_exec();
					}
					return;
				}
				else {
					phase_no_power(result.payload);
					clearInterval(missionInterval);
				}
			} else if(result.status != 0) {
				confirm_id = result.payload.confirm_id;
				//clearInterval(missionInterval);
				if (fnGetGrindingSpeed() == 1) {
					setTimeout(function(){mission_exec();}, 3000);
				}
				return;
			}

			// console.log(result);
			confirm_id = result.payload.confirm_id;

			mission = result.payload.mission;
			event = result.payload.event;
			event.phase = new Array();

			draw();

			if (event.event_resource.result) {
				//event.phase.push('event_resource');
			} else {
				//event.phase.push('default_resource');
			}
			if (event.event_resource.reward) {
				//event.phase.push('get_ex_resource');
			}
			//if(event.monster)            event.phase.push('get_monster');
			//if(event.treasure)           event.phase.push('get_treasure');
			(event.clear) ? mission_update('next') : mission_update();
			//if(event.exp.lvup > 0)       event.phase.push('level_up');
			//if(event.exp.lvup > 0)       event.phase.push('status_up');
			//if(event.treasure)	if(event.treasure.complete)  event.phase.push('treasure_complete');
			if(event.clear) {
				if(mission.last_mission == 5) {
					clearInterval(missionInterval);
					$.ajax_ex(false, '/en/'+platform+'/mission/battle', { area_id: area_id, '__hash': ('' + (new Date()).getTime()) }, function(result) {
						if (result.status != 0) {
						//              console.log('error-code:'+result.status);
						return;
						}
						setTimeout(function(){$.redirect('battle/battleact?aid='+area_id);}, 1000);
						setTimeout(function(){$.redirect('battle/battleact?aid='+area_id);}, 6000);
					});
				}
			}
			if (fnGetGrindingSpeed() == 1) {
				mission_exec();
			}
			//event = eventManager(event);
		});
	}
}

function fnMission() {
	fnFixMissionExec();
	if (fnGetGrindingSpeed() == -1) {
		// user press by himself, dont automate
		return;
	}
	if (fnGetGrindingSpeed() == 1) {
		mission_exec();
	}
	else {
		missionInterval = setInterval(mission_exec,fnGetGrindingSpeed());
	}
}

// mission battle result

function fnMissionBattleResult() {
	setTimeout(function(){$.redirect('/en/'+platform+'/mission');}, 1000);
	setTimeout(function(){$.redirect('/en/'+platform+'/mission');}, 8000);
}

// monster collection

function fnMonsterCollection() {
	var monsterImgList = $('.monster_img > img');
	for (var i=0;i<monsterImgList.length;i++) {
		var box = monsterImgList.eq(i);
		var frame = box.parent();
		var monsterID = $('div', frame).html();
		frame.html('<a href="/en/'+platform+'/achievement/monsterInformation?mid='+monsterID+'&amp;attr=0&amp;offset=4"><img src="http://res.darksummoner.com/en/s/cards/'+monsterID+'_small.png" width="55" height="55" alt="'+monsterID+'" />'+monsterID+'</a>');
	}
}

// monster info

function fnMonsterInfoSearchAuctionAAPerPage(pPage,pMonsterID) {
	fnGrowl('Search AA Auction Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/auction/ajaxExhibitList?api=json&page='+pPage+'&search=grade_aa', { '__hash': ('' + (new Date()).getTime()) }, function(data) {
		var exhibits = data.payload.exhibits;
		for (var i=0;i < exhibits.length;i++) {
			for (var j=0;j<parseInt(exhibits[i].permanent_count,10);j++) {
				if (exhibits[i]['permanent_type_'+j] == 2 && parseInt(exhibits[i]['permanent_desc_'+j].monster_id,10) == parseInt(pMonsterID,10)) {
					fnGrowl('Found.');
					$('#button-back-img').html($('#button-back-img').html() + '<br/><a href="/en/'+platform+'/auction/detail?no='+exhibits[i].exhibit_id+'&reason=0&page=0&search=0">page:'+ (parseInt(pPage,10)+1)+' exhibit_id:'+exhibits[i].exhibit_id+'</a> by <a href="/en/'+platform+'/friends/profile?pid='+exhibits[i].player_id+'"><font color="#00FF00">'+exhibits[i].player_nickname+'</font></a>');
				}
			}			
		}
		if (pPage > 0) {
			setTimeout(fnMonsterInfoSearchAuctionAAPerPage,500,pPage-1,pMonsterID);
		}
	});
}

function fnMonsterInfoSearchAuctionAA(pMonsterID) {
	alert('Start searching auctions of this monster...');
	$.ajax_ex(false, '/en/'+platform+'/auction/ajaxExhibitList?api=json&page=0&search=grade_aa', { '__hash': ('' + (new Date()).getTime()) }, function(metaData) {
		setTimeout(fnMonsterInfoSearchAuctionAAPerPage,0,parseInt(metaData.payload.pages,10)-1,pMonsterID);
	});
}

function fnMonsterInfo() {
	$('#status-text-area').html($('#status-text-area').html()+'<span id="status-agility" style="position:absolute; right:5px; top:-16px;width:200px;text-align:right; color:#c0c1ff;">agility</span><div style="position:absolute; left:25px; top:-16px;">AGILITY</div>');
	$('#status-agility').html(addFigure(paramMaster['agility']));
	$('#status-attack').html(addFigure(paramMaster['attack'])+' ('+ addFigure(paramMaster['i_attack']) +'-'+ addFigure(paramMaster['m_attack']) +')');
	$('#status-defense').html(addFigure(paramMaster['defense'])+' ('+ addFigure(paramMaster['i_defense']) +'-'+ addFigure(paramMaster['m_defense']) +')');
	$('#status-hp').html(addFigure(paramMaster['hp'])+' ('+ addFigure(paramMaster['i_hp']) +'-'+ addFigure(paramMaster['m_hp']) +')');
	$('.status-text').css('width', '1000px');
	if (parseInt(monsterMaster['grade'], 10) >= 6) {
		$('a[href^="/en/'+platform+'/achievement/monster"]').eq(0).attr("href", 'javascript:history.go(-1);');
		$('#button-back-img').html($('#button-back-img').html() + '<br/><img src="http://res.darksummoner.com/en/s/misc/table/decoration_left.png" /><a style="position:relative; " class="__WM __HM btn __red" href="javascript:fnMonsterInfoSearchAuctionAA(paramMaster[\'monster_id\']);">Auction</a><img src="http://res.darksummoner.com/en/s/misc/table/decoration_right.png" /> ');
	}
}

// auction

function fnAuctionDisplayCommission() {
	setAuctions = function (base_tag, entry, flg)
	{
		$('.item-name' , base_tag).text(entry.permanent_name_0);

		if (entry.permanent_type_0 == 2 ) {
			$('.item-lv' , base_tag).text('Lv ' + entry.permanent_desc_0.lv);
			$('.atk' , base_tag).text(entry.permanent_desc_0.attack);
			$('.def' , base_tag).text(entry.permanent_desc_0.defense);
			$('.hp' , base_tag).text(entry.permanent_desc_0.hp);
			$('.bp' , base_tag).text(entry.permanent_desc_0.bp);
			$('.skill' , base_tag).text(SKILLS[entry.permanent_desc_0.skill_id][entry.permanent_desc_0.skill_lv]['name']);
			$('.monster_st', base_tag).show();
		} else if (entry.permanent_type_0 == 3 ) {
			$('.item-lv' , base_tag).text('x ' + entry.permanent_amount_0);
			$('.item_info' , base_tag).text(entry.permanent_m_0.description);
			$('.item_st', base_tag).show();
		} else if (entry.permanent_type_0 == 1 ) {
			var jewel = entry.permanent_amount_0;
			jewel = jewel.toString().replace(/([0-9]+?)(?=(?:[0-9]{3})+$)/g , '$1,');
			$('.item-lv' , base_tag).text(jewel + 'Gold').addClass('__jewel');
			$('.item_info', base_tag).text('Currency used to do a Sacrifice.');
			$('.item_st', base_tag).show();
		}

		if (flg != 1) {
			$('.limit-time' , base_tag).text($.after(entry.auction_end_at));
			var str = '%bid_count%';
			str = str.replace("%bid_count%", (entry.limited_bid_count - entry.bid_count));
			$('.bid-count' , base_tag).text(str);
		}

		$('.nickname', base_tag).append('<a href="/en/'+platform+'/friends/profile?pid='+entry.player_id+'"><font color="#00FF00">'+entry.player_nickname+'</font></a>' + (entry.commission!=undefined?('<br/>$ '+entry.commission):''));
		
		if (entry.comment != "") {
			$('.comment', base_tag).append('<div class="box-blood"></div>');
			$('.comment > div', base_tag).text(entry.comment);
		} else {
			$('.img_auction_comment', base_tag).hide();
		}

		// a-?a?¡Lc¢Foea?a??a??a??
		if(entry.permanent_thumb_image_0){
			$('.item_0', base_tag).attr('src', IMG_BASE + entry.permanent_thumb_image_0);
		}
		if(entry.permanent_thumb_image_1){
			$('.item_1', base_tag).attr('src', IMG_BASE + entry.permanent_thumb_image_1);
		}
		if(entry.permanent_thumb_image_2){
			$('.item_2', base_tag).attr('src', IMG_BASE + entry.permanent_thumb_image_2);
		}
		if(entry.permanent_thumb_image_3){
			$('.item_3', base_tag).attr('src', IMG_BASE + entry.permanent_thumb_image_3);
		}
		if(entry.permanent_thumb_image_4){
			$('.item_4', base_tag).attr('src', IMG_BASE + entry.permanent_thumb_image_4);
		}
		
		$('.exhibit-offer', base_tag).click(function() {$.redirect('/en/'+platform+'/auction?tb=2&no='+entry.exhibit_id);});if (entry.bid_id != null) {$('.exhibit-offer', base_tag).hide();}
	}
}

function fnAuctionShowOfferButton() {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.exhibit-offer { position:absolute; left:200px; top:170px; }';
	document.getElementsByTagName('head')[0].appendChild(style);
	$('.exhibit-check').css('left','100px');
	$('.exhibit-check').parent().append('<div class="exhibit-offer btn __red __WS __HS" style="font-size:0.8em;">Offers</div>');
}

function fnAuctionPeek() {
	showPendings = function (page)
	{
		if (fnQueryString('no')=='' && enableExhibit === false) {
			return;
		}
		var base_tag = $('#exhibit-templ').clone();
		base_tag.attr('id', 'exhibit-templ-main');
		if (fnQueryString('no')=='' || fnQueryString('tb')!=2) {setAuctions(base_tag, enableExhibit);} 
		base_tag.show();

		if ((enableExhibit.status == 1) || (false == true)) {
			$('.text-info', base_tag).html('This Auction was cancelled because the deadline was up.').show();
			$('.exhibit-btn3', base_tag).show();
			$('.limit-time' , base_tag).remove();
			$('.bid-count' , base_tag).remove();
			$('.limit-icon' , base_tag).remove();
			$('.bid-icon' , base_tag).remove();
			$('.nickname-index' , base_tag).remove();
			$('.nickname' , base_tag).remove();
			$('.comment' , base_tag).remove();

			$('.exhibit-timeout', base_tag).show().click(function() {
				$('#popup-text').text('Retrieve Items?');
				$('#popup_window').show();
				$('#popup').css('top', $(window).scrollTop() + 40);
				$('#auction-tab').hide();
				$('.btn-yes').unbind();
				$('.btn-yes').click(timeoutExhibit);
			});
		} else {
			$('.exhibit-btn2', base_tag).show();
			$('.exhibit-detail', base_tag).click(function() {
				var params = { no:enableExhibit.exhibit_id, reason:'1' };
				$.redirect('/en/'+platform+'/auction/detail', params);
			});
			$('.exhibit-cancel', base_tag).html('Cancel Auction').click(function() {
				$('#popup-text').text('Cancel This Auction?');
				$('#popup_window').show();
				$('#popup').css('top', $(window).scrollTop() + 40);
				$('#auction-tab').hide();
				$('.btn-yes').unbind();
				$('.btn-yes').click(cancelExhibit);
			});
		}

		$('#auction-exhibit').append(base_tag);
		if (enableExhibit.comment != "") {
			$('#auction-exhibit').append('<div id="exhibit-templ-main-comment" class="box-blood"></div>');
			$('#exhibit-templ-main-comment').text(enableExhibit.comment);
		}

		$.ajax_ex(false, '/en/'+platform+'/auction/ajaxPendingList', { api: 'json', page: page,no:fnQueryString('no')==''?enableExhibit.exhibit_id:fnQueryString('no'), '__hash': ('' + (new Date()).getTime()) }, function(data) {
			// update pager
			var pages = ~~data.payload.pages;
			var page  = $.clamp(~~data.payload.page + 1, 1, pages);
			set_page(page, true, pages);
			if ( (data == null) || (data.status != 0) ) {
				return;
			}

			$.each(data.payload.bids, function(i, entry) {
				var base_tag = $('#exhibit-templ').clone();
				base_tag.attr('id', 'bid-templ-' + i);
				setAuctions(base_tag, entry, 1);

				$('.limit-time' , base_tag).remove();
				$('.bid-count' , base_tag).remove();
				$('.limit-icon' , base_tag).remove();
				$('.bid-icon' , base_tag).remove();
				$('.nickname-index' , base_tag).html('Offer Player');
				$('.exhibit-btn1', base_tag).show();
				$('.exhibit-btn2', base_tag).hide();
				$('.exhibit-btn3', base_tag).hide();

				base_tag.show();

				$('.exhibit-check', base_tag).click(function() {
					var params = { no:entry.bid_id, reason:'2' };
					$.redirect('/en/'+platform+'/auction/detail', params);
				});
				$('#auction-entries').append(base_tag);
			});
		});
	}
	if (tag==1) {
		onChangeAuction(0);
	}
}

function fnAuction() {
	fnAuctionShowOfferButton();
	fnAuctionDisplayCommission();
	fnAuctionPeek();
	if (window.location.search=='') {
		onChangeAuction(0);
	}
}

function fnAuctionDetail() {
}

// present box

function fnPresentBoxReceiveAllItemsPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 3) {
				onReceive(null, boxes[i]);
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllItemsPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllItems() {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAllItemsPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAllAAsPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 2 && boxes[i].monster_grade > 5) {
				onReceive(null, boxes[i]);
				alert("Receiving " + boxes[i].monster_name);
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllAAsPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllAAs() {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAllAAsPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAll20sPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 2 && boxes[i].monster_bp >= 20) {
				onReceive(null, boxes[i]);
				if (boxes[i].monster_grade > 5) {
					alert("Receiving " + boxes[i].monster_name);
				}
				else {
					fnGrowl("Receiving " + boxes[i].monster_name);
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAll20sPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAll20s() {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAll20sPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAll25sPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 2 && boxes[i].monster_bp >= 25) {
				onReceive(null, boxes[i]);
				if (boxes[i].monster_grade > 5) {
					alert("Receiving " + boxes[i].monster_name);
				}
				else {
					fnGrowl("Receiving " + boxes[i].monster_name);
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAll25sPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAll25s() {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAll25sPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAllGuildDownPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {			
			if (boxes[i].permanent_type == 2) {
				for (key in guildDownArray) {
					if (parseInt(boxes[i].skill_id,10) == key) {
						onReceive(null, boxes[i]);
						if (boxes[i].monster_grade > 5) {
							alert("Receiving " + boxes[i].monster_name);
						}
						else {
							fnGrowl("Receiving " + boxes[i].monster_name);
						}
					}
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllGuildDownPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllGuildDown() {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAllGuildDownPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAllSpeciesDownPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {			
			if (boxes[i].permanent_type == 2) {
				for (key in speciesDownArray) {
					if (parseInt(boxes[i].skill_id,10) == key) {
						onReceive(null, boxes[i]);
						if (boxes[i].monster_grade > 5) {
							alert("Receiving " + boxes[i].monster_name);
						}
						else {
							fnGrowl("Receiving " + boxes[i].monster_name);
						}
					}
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllSpeciesDownPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllSpeciesDown() {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAllSpeciesDownPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAllSkillPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {			
			if (boxes[i].permanent_type == 2) {
				if (parseInt(boxes[i].skill_id,10) > 0) {
					onReceive(null, boxes[i]);
					if (boxes[i].monster_grade > 5) {
						alert("Receiving " + boxes[i].monster_name);
					}
					else {
						fnGrowl("Receiving " + boxes[i].monster_name);
					}
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllSkillPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllSkill() {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAllSkillPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveSkillPerPage(pPage, pSkill) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {			
			if (boxes[i].permanent_type == 2) {
				if (parseInt(boxes[i].skill_id,10) == parseInt(pSkill,10)) {
					onReceive(null, boxes[i]);
					if (boxes[i].monster_grade > 5) {
						alert("Receiving " + boxes[i].monster_name);
					}
					else {
						fnGrowl("Receiving " + boxes[i].monster_name);
					}
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveSkillPerPage,500,pPage-1, pSkill);
		}
	});
}

function fnPresentBoxReceiveSkill(pSkill) {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveSkillPerPage,0,parseInt(metaData.payload.pages,10)-1, pSkill);
	});
}

function fnPresentBoxReceiveAll100kGoldPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 1 && boxes[i].jewel <= 100000) {
				onReceive(null, boxes[i]);
				alert("Receiving $" + boxes[i].jewel);
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllAAsPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAll100kGold() {
	alert('It will hang a bit if you have many pages');
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAll100kGoldPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxAction(pValue) {
	if (pValue == "allItems") {
		fnPresentBoxReceiveAllItems();
	}
	else if (pValue == "all100kGold") {
		fnPresentBoxReceiveAll100kGold();
	}
	else if (pValue == "allAAs") {
		fnPresentBoxReceiveAllAAs();
	}
	else if (pValue == "all20s") {
		fnPresentBoxReceiveAll20s();
	}
	else if (pValue == "all25s") {
		fnPresentBoxReceiveAll25s();
	}
	else if (pValue == "allSkill") {
		fnPresentBoxReceiveAllSkill();
	}
	else if (pValue == "allGuildDown") {
		fnPresentBoxReceiveAllGuildDown();
	}
	else if (pValue == "allSpeciesDown") {
		fnPresentBoxReceiveAllSpeciesDown();
	}
	else if (pValue.startsWith("skill")) {
		fnPresentBoxReceiveSkill(pValue.substr(5));
	}
}

function fnPresentBox() {
	if (document.getElementById('button_fp_all') != null) {
		setTimeout(function(){$.redirect('/en/'+platform+'/present/fpAll');}, 1000);
		return;
	}
	if (document.getElementById('button_fp_ng') != null) {
		//document.getElementById('button_fp_ng').style.display = "none";
		
		var divTag = document.createElement("div"); 
		divTag.id = "receiveAllDiv"; 
		divTag.style["z-index"] = 1000; 
		divTag.style.position = "relative"; 
		
		var selectorHTML = '<select name="giftBox" onchange="fnPresentBoxAction(this.options[this.options.selectedIndex].value);"><option selected value="0">Gift Box Action</option>';
		selectorHTML += '<option value="allItems">Receive Items</option>';
		selectorHTML += '<option value="all100kGold">Receive <100k$</option>';
		selectorHTML += '<option value="allAAs">Receive AA/+</option>';
		selectorHTML += '<option value="all20s">Receive 20+BP</option>';
		selectorHTML += '<option value="all25s">Receive 25+BP</option>';
		selectorHTML += '<option value="allSkill">Receive All Skill</option>';
		selectorHTML += '<option value="allGuildDown">Receive Guild Down</option>';
		selectorHTML += '<option value="allSpeciesDown">Receive Species Down</option>';
		for (key in skillArray) {
			selectorHTML += '<option value="skill'+key+'">Receive ' + skillArray[key] + '</option>';
		}
		selectorHTML += '</select>';
		
     divTag.innerHTML = '<button class="sexybutton sexysimple sexyblue" onmousedown="for (var i=0;i<document.getElementById(\'presents\').childNodes.length;i++)$(\'.receive-button\',$(\'#\'+document.getElementById(\'presents\').childNodes[i].id)).trigger(\'click\');"><span class="download2">Receive All</span></button>' + selectorHTML; 
		document.getElementById('button_fp_ng').parentNode.replaceChild(divTag, document.getElementById('button_fp_ng'));
	}
}

// add my item gifting/trading
function fnGiftMyItems() {
	if (typeof(items) !== 'undefined' && items != null) {
		$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
			if ( (data == null) || (data.status != 0) ) { return; }
			var hasItemInList;
			for (var i=0;i<data.payload.items.length;i++) {
				hasItemInList = false;
				for (var j=0;j<items.length;j++) {
					if (items[j].item_id == data.payload.items[i].item_id) {
						hasItemInList = true;
						break;
					}
				}
				if (!hasItemInList) {					
					items.push({"item_id":data.payload.items[i].item_id,"name":data.payload.items[i].m.name,"amount":data.payload.items[i].amount,"thumb_image":"items/"+data.payload.items[i].item_id+"_small.png"});
				}				
			}
		});	
		
		var divTag = document.createElement("div");
		divTag.id = "checkSummonDiv";
		divTag.style.display = "none";
		document.body.appendChild(divTag); 	
		
		var result= $('#checkSummonDiv').load('/en/'+platform+'/summon #summon_group', {}, function(){
			if (result.find('#summon_b_grade').find('.cost_ticket').length) {
				items.push({"item_id":"5000","name":"Rank B Summon","amount":parseInt(result.find('#summon_b_grade').find('.cost_ticket').html(),10),"thumb_image":"items/5000_small.png"});
			}
			if (result.find('#summon_a_grade').find('.cost_ticket').length) {
				items.push({"item_id":"5005","name":"Rank A Summon","amount":parseInt(result.find('#summon_a_grade').find('.cost_ticket').html(),10),"thumb_image":"items/5005_small.png"});
			}
			if (result.find('#summon_special_ticket').find('.cost_ticket').length) {
				items.push({"item_id":"5200","name":"Dark Summon","amount":parseInt(result.find('#summon_special_ticket').find('.cost_ticket').html(),10),"thumb_image":"items/5200_small.png"});
			}
			if (result.find('#summon_super_special').find('.cost_ticket').length) {
				items.push({"item_id":"5026","name":"EPIC Dark Summon","amount":parseInt(result.find('#summon_super_special').find('.cost_ticket').html(),10),"thumb_image":"items/5026_small.png"});
			}			
		});		
	}
}

// present suggest

function fnPresentSuggest() {
	if (fnQueryString('mid')!='') {
		$.redirect('/en/'+platform+'/present/confirm?ctg=2&amt=1&pid='+fnQueryString('mid'));
		setTimeout(function(){$.redirect('/en/'+platform+'/present/confirm?ctg=2&amt=1&pid='+fnQueryString('mid'));}, 1000);
		setTimeout(function(){$.redirect('/en/'+platform+'/present/confirm?ctg=2&amt=1&pid='+fnQueryString('mid'));}, 5000);
		return;
	}
	if (fnGiftCookies() != '') {
		var itemArray = fnGiftCookies().split(fnGetSeparator());
		var itemResultArray = itemArray.splice(0,1);
		fnSetGiftCookies(itemArray.join(fnGetSeparator()));
		var link = '/en/'+platform+'/present/confirm?ctg='+itemResultArray[0].split(":")[0]+"&pid="+itemResultArray[0].split(":")[1] + (itemResultArray[0].split(":").length>2?("&amt=" + itemResultArray[0].split(":")[2]):"");
		setTimeout(function(){$.redirect(link);}, 1000);
		setTimeout(function(){$.redirect(link);}, 5000);
	}
	fnGiftMyItems();
}

// present confirm

function fnPresentConfirm() {
	$('#present-cancel').unbind('click');
	$('#present-cancel').click(function(){
		$('#present-cancel').unbind('click');
		$.redirect('/en/'+platform+'/present/suggest?&name='+fnReferrerQueryString('name'));
	});
	$('#present-commit').unbind('click');
	$('#present-commit').click(function(){
		$('#present-commit').unbind('click');
		$.ajax_ex(false, '/en/'+platform+'/present/request', { msg:$('#present-comment').val() },function(result) {return;}) ;
		$.redirect('/en/'+platform+'/present/suggest?&name='+fnReferrerQueryString('name'));
	});

	if (fnReferrerQueryString('name') != '') {
		document.getElementById('present-commit').innerHTML = "To:"+decodeURIComponent(fnReferrerQueryString('name'));
	}
}

// trade suggest

function fnTradeSuggest() {
	fnGiftMyItems();
}

// trade

function fnFixTradeFunctions() {
	showSuggests = function ()
	{
	  $.each(suggest_entry, function(i, entry){
		var base_tag = $('#trade-templ').clone();
		base_tag.attr('id', 'trade-suggest-' + i).css('display', 'block');

		var shared_tag = $('> .trade-shared', base_tag);
		$('> .trade-nickname', shared_tag).append('<a href="/en/'+platform+'/friends/profile?pid=' + entry.target_id + '">'+entry.target_nickname+'</a>');
		$('> .trade-ago', shared_tag).text($.ago(entry.updated_at));
		$('> .trade-thumb > img', shared_tag).attr('src', IMG_BASE + entry.target_thumb_image);
		$('> .trade-comment-tag > .trade-comment', shared_tag).text(entry.player_comment);
		
		$('> .trade-check', shared_tag).click(function() {
		  var params = { pid:entry.player_id, no:entry.trade_no, st:1 };
		  $.redirect('/en/'+platform+'/trade/check', params);
		});

		$('#trade-entries').append(base_tag);
	  });
	}

	showPendings = function ()
	{
	  $.each(pending_entry, function(i, entry){
		var base_tag = $('#trade-templ').clone();
		base_tag.attr('id', 'trade-suggest-' + i).css('display', 'block');

		var shared_tag = $('> .trade-shared', base_tag);
		$('> .trade-nickname', shared_tag).append('<a href="/en/'+platform+'/friends/profile?pid=' + entry.player_id + '">'+entry.player_nickname+'</a>');
		$('> .trade-ago', shared_tag).text($.ago(entry.updated_at));
		$('> .trade-thumb > img', shared_tag).attr('src', IMG_BASE + entry.player_thumb_image);
		$('> .trade-comment-tag > .trade-comment', shared_tag).text(entry.player_comment);
		
		$('> .trade-check', shared_tag).click(function() {
		  var params = { pid:entry.player_id, no:entry.trade_no, st:2 };
		  $.redirect('/en/'+platform+'/trade/check', params);
		});
		
		$('#trade-entries').append(base_tag);
	  });
	}

	showCommits = function ()
	{
	  $.each(commit_entry, function(i, entry){
		var base_tag = $('#trade-templ').clone();
		base_tag.attr('id', 'trade-suggest-' + i).css('display', 'block');

		var shared_tag = $('> .trade-shared', base_tag);
		if (entry.player_id == player.player_id) {
		  $('> .trade-nickname', shared_tag).append('<a href="/en/'+platform+'/friends/profile?pid=' + entry.target_id + '">'+entry.target_nickname+'</a>');
		  $('> .trade-ago', shared_tag).text($.ago(entry.updated_at));
		  $('> .trade-thumb > img', shared_tag).attr('src', IMG_BASE + entry.target_thumb_image);
		  $('> .trade-comment-tag > .trade-comment', shared_tag).text(entry.target_comment);
		}
		else {
		  $('> .trade-nickname', shared_tag).append('<a href="/en/'+platform+'/friends/profile?pid=' + entry.player_id + '">'+entry.player_nickname+'</a>');
		  $('> .trade-ago', shared_tag).text($.ago(entry.updated_at));
		  $('> .trade-thumb > img', shared_tag).attr('src', IMG_BASE + entry.player_thumb_image);
		  $('> .trade-comment-tag > .trade-comment', shared_tag).text(entry.player_comment);
		}
		
		$('> .trade-check', shared_tag).click(function() {
		  var params = { pid:entry.player_id, no:entry.trade_no, st:3 };
		  $.redirect('/en/'+platform+'/trade/check', params);
		});
		
		$('#trade-entries').append(base_tag);
	  });
	}
	onChangeTrade('category-state1');
}

function fnTrade() {
	fnFixTradeFunctions();
}

// fusion

function fnFusionGenerateMonsterFromAllySummon() {
	var divTag = document.createElement("div");
	divTag.id = "summon";
	divTag.style.display = "none";
	document.body.appendChild(divTag); 	
	
	var result= $('#summon').load('/en/'+platform+'/summon/act?type=0', {}, function(){});
	//$.ajax_ex(false, '/en/'+platform+'/summon/act', {"type":0}, function(data) {});	
}

function fnFusionAuto(pUniqueNo) {
	var sacStr = "";
	var sacCount = 0;
	if (parseInt(source.lv_max,10) - parseInt(source.lv,10) == 0) {
		fnSetAutoFusion(0);
		alert('Auto Level Up Done');
		return;
	}
	for (var i=0;i<monsters.length;i++) {
		if (parseInt(monsters[i].lv, 10)== 1) {  //sac level 1
			if (parseInt(monsters[i].skill_id,10) == 0) { // no skill
				if (parseInt(monsters[i].grade,10) <= 3) { // <= rank B+
					if (parseInt(monsters[i].bp,10) < 100) { // no soul
						if (monsters[i].unique_no != pUniqueNo) {
							if (monsters[i].location ==0) { // not in formation
								sacStr += '&uno_' + sacCount + '=' + monsters[i].unique_no;
								sacCount++;
								if (parseInt(source.lv_max,10) - parseInt(source.lv,10) == 1) {
									if (sacCount >= 5) {
										break;
									}
								}
								if (sacCount >= 10) {
									break;
								}
							}
						}
					}
				}
			}
		}
	}
	if (sacCount > 0) {
		
		var link = '/en/'+platform+'/fusion/confirm?len=' + sacCount + sacStr + '&evolve=false';
		//location = '/en/'+platform+'/fusion/confirm?len=' + sacCount + sacStr + '&evolve=false';
		setTimeout(function(){$.redirect(link);}, 1000);
		setTimeout(function(){$.redirect(link);}, 6000);
	}
	else {
		alert("You have no monsters to sacrifice.");
	}
	return;
}

function fnStackAuto(pUniqueNo) {
	var sacStr = "";
	var sacCount = 0;
	var sacGrade = -1;
	if (parseInt(source.skill_lv,10) == 4) {
		fnSetAutoStack(0);
		alert('Auto Stack Done');
		return;
	}
	for (var i=0;i<monsters.length;i++) {
		if (parseInt(monsters[i].lv, 10)== 1) {  //sac level 1
			if (parseInt(monsters[i].skill_id,10) == parseInt(source.skill_id,10)) { // same skill
				if (parseInt(monsters[i].skill_lv,10) == 1) {  // skill 1
					if (parseInt(monsters[i].grade,10) <= 3 || (parseInt(monsters[i].grade,10) == 4 && parseInt(monsters[i].bp,10) <= fnAutoStackBP())) { // <= rank B+ or low bp rank A
						if (parseInt(monsters[i].grade,10) > parseInt(sacGrade, 10)) { // prefer sac higher grade
							if (parseInt(monsters[i].bp,10) > 1) { // dont sac spirit!
								if (monsters[i].unique_no != pUniqueNo) {
									if (monsters[i].location ==0) { // not in formation
										sacStr = '&uno_0=' + monsters[i].unique_no;
										sacCount=1;
										sacGrade = monsters[i].grade;
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if (sacCount > 0) {		
		var link = '/en/'+platform+'/fusion/confirm?len=' + sacCount + sacStr + '&evolve=false';
		//location = '/en/'+platform+'/fusion/confirm?len=' + sacCount + sacStr + '&evolve=false';
		setTimeout(function(){$.redirect(link);}, 1000);
		setTimeout(function(){$.redirect(link);}, 6000);
	}
	else {
		alert("You have no same skill monsters to sacrifice.");
	}
	return;
}

function fnFusionFixDestPage() {
	showMonsters = function (offset, limit)
	{
		if (parseInt(fnAutoFusion(),10) > 0) {
			fnFusionAuto(fnQueryString('uno'));
		}
		
		if (parseInt(fnAutoStack(),10) > 0) {
			fnStackAuto(fnQueryString('uno'));
		}
	
		if (monsters === false) { return; }

		// 
		$('#monsters').empty();
		$('#original > img').attr('src', 'http://res.darksummoner.com/en/s/cards/none.png');
		$('#jewel').css('color', 'white').html('0');

		// 
		$.each(monsters, function(i, monster) {
			if ( (i < offset) || (i >= (offset + limit)) ) { return true; }

			var id = 'monster_' + i;

			var base_tag = $('<div id="' + id + '" class="monster"></div>');

			base_tag
				.append('<div class="thumb"><img src="http://res.darksummoner.com/en/s/' + monster.small_thumb_image + '" /></div>')
				.append('<div class="information"><img src="http://res.darksummoner.com/en/s/misc/monster/information_' + monster.tribe + '.png" /></div>')
				.append('<div class="party"></div>')
				.append('<div class="name">' + monster.m.name + '</div>')
				.append('<div class="' + ((~~monster.lv >= ~~monster.m.lv_max) ? 'lv_max' : 'lv') + '">' + monster.lv + '</div>')
				.append('<div class="bp">' + monster.bp + '</div>')
				.append('<div class="attack">' + monster.attack + '</div>')
				.append('<div class="defense">' + monster.defense + '</div>')
				.append('<div class="hp">' + monster.hp + '</div>')
				.append('<div class="skill">' + SKILLS[monster.skill_id][monster.skill_lv]['name'] + '</div>')
				.append('<div class="lv-icon">Lv</div>')
				.append('<div class="attack-icon">ATK</div>')
				.append('<div class="defense-icon">DEF</div>')
				.append('<div class="bp-icon">BP</div>')
				.append('<div class="hp-icon">HP</div>')
				.data('monster', monster);

			$('> .thumb > img', base_tag).click(function() {
				monster.skill   = SKILLS[monster.skill_id][monster.skill_lv];
				monster.species = SPECIES[monster.m.species];
				$.showMonsterInformation(monster);
			});

			// 
			var reason_for_disable = false;

			if (~~monster.is_locked != 0) {
			reason_for_disable = 1;
			}

			if (reason_for_disable !== false) {
			var disable_tag = $('<div class="disable"></div>');
			disable_tag
			.append('<img class="disable-icon" src="http://res.darksummoner.com/en/s/misc/icons/exclamation.png" />')
			.append('<div class="disable-label">' + DISABLE_REASONS[reason_for_disable] + '</div>');

			base_tag
			.append(disable_tag)
			.addClass('monster-tribe-' + monster.tribe)
			.append('<div class="check-icon"><img src="http://res.darksummoner.com/en/s/misc/icons/check_box_lock.png" /></div>');
			}
			else {
			var index = findIndex(monster);

			if (index === false) {
			base_tag
			.append('<div class="check-icon"><img src="' + check_off + '" /></div>')
			.addClass('monster-tribe-' + monster.tribe);

			}
			else {
			base_tag
			.append('<div class="check-icon"><img src="' + check_on + '" /></div>')
			.addClass('monster-tribe-' + monster.tribe + '-selected');
			}

			// 
			var select_tag = $('<div class="selection"></div>');
			base_tag.append(select_tag);

			select_tag.click(function() {
			onEntry(base_tag, monster);
			});
			}

			$('#monsters').append(base_tag);
		});

		updateSeletecionState();
	}
}

function fnFusionFixPage() {
	showMonsters = function (offset, limit)
	{
	  if (monsters === false) { return; }

	  // 
	  $('#monsters').empty();

	  // 
	  $.each(monsters, function(i, monster) {
		if ( (i < offset) || (i >= (offset + limit)) ) { return true; }  
		
		var id = 'monster_' + i;
		var base_tag = $('<div id="' + id + '" class="monster monster-tribe-' + monster.tribe + '"></div>');

		base_tag
		  .append('<div class="thumb"><img src="http://res.darksummoner.com/en/s/' + monster.small_thumb_image + '" /></div>')
		  .append('<div class="information"><img src="http://res.darksummoner.com/en/s/misc/monster/information_' + monster.tribe + '.png" /></div>')
		  .append('<div class="party"></div>')
		  .append('<div class="name">' + monster.m.name + '</div>')
		  .append('<div class="lv">' + monster.lv + '</div>')
		  .append('<div class="bp">' + monster.bp + '</div>')
		  .append('<div class="attack">' + monster.attack + '</div>')
		  .append('<div class="defense">' + monster.defense + '</div>')
		  .append('<div class="hp">' + monster.hp + '</div>')
		  .append('<div class="skill">' + SKILLS[monster.skill_id][monster.skill_lv]['name'] + '</div>')
		  .append('<div class="lv-icon">Lv </div>')
		  .append('<div class="attack-icon">ATK</div>')
		  .append('<div class="defense-icon">DEF</div>')
		  .append('<div class="bp-icon">BP</div>')
		  .append('<div class="hp-icon">HP</div>');

		if (monster.location > 0) {
		  var name_tag = $('.name', base_tag);
		  name_tag.css({ left:'35px' });

		  var icon_img = 'http://res.darksummoner.com/en/s/misc/icons/icon_' + ((monster.location == 1) ? 'leader' : 'party') + '.png'; 
		  base_tag.append('<div class="party-icon"><img src="' + icon_img + '" /></div>');
		}

		$('> .thumb > img', base_tag).click(function() {
		  monster.skill   = SKILLS[monster.skill_id][monster.skill_lv];
		  monster.species = SPECIES[monster.m.species];
		  $.showMonsterInformation(monster);
	//      $.showMonserInformationWithAjax(monster.unique_no);
		});

		// 
		var reason_for_disable = false;
		
		if (~~monster.is_locked != 0) {
		  reason_for_disable = 1;
		}
		else if (~~monster.lv >= ~~monster.m.lv_max) {
	//      reason_for_disable = 2;
		  $('.lv', base_tag).addClass('lv_max');
		}

		if (reason_for_disable !== false) {
		  var disable_tag = $('<div class="disable"></div>');
		  disable_tag
			.append('<img class="disable-icon" src="http://res.darksummoner.com/en/s/misc/icons/exclamation.png" />')
			.append('<div class="disable-label">' + DISABLE_REASONS[reason_for_disable] + '</div>');

		  base_tag.append(disable_tag);
		}
		else {
			base_tag.append('<div class="autodecide-button btn __red __WS __HS" style="position:absolute; top: 83px; left: 100px;">Auto</div>');
			$('> .autodecide-button', base_tag).click(function () {
				fnSetAutoFusion(monster.unique_no);
				
				fnGrowl('Please wait, using Ally Summon...');
				var timeGap = 0;
				var minGap = 500;
				for (var j=0;j<10 && parseInt(monsters.length,10)+j < parseInt(player.summon_max,10);j++) {
					timeGap+=minGap;
					fnFusionGenerateMonsterFromAllySummon();
					//setTimeout(fnFusionGenerateMonsterFromAllySummon, timeGap);
				}				
				setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:monster.unique_no });}, timeGap);
				setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:monster.unique_no });}, timeGap+5000);
			});
			if (monster.skill_id > 0 && monster.grade <= 3) {
				base_tag.append('<div class="autoStack-button btn __red __WS __HS" style="position:absolute; top: 2px; left: 150px;">Stack</div>');
				$('> .autoStack-button', base_tag).click(function () {
					fnSetAutoStack(monster.unique_no);		
					setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:monster.unique_no });}, 0);
					setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:monster.unique_no });}, 0+5000);
				});
			}
			base_tag.append('<div class="decide-button btn __red __WS __HS">OK</div>');
			$('> .decide-button', base_tag).click(function () {
				$.redirect('/en/'+platform+'/fusion/dest', { uno:monster.unique_no });
			});
		}
		
		
		$('#monsters').append(base_tag);
	  });
	}

}

function fnFusionFusion() {
	if (parseInt(fnAutoFusion(),10) > 0) {
		var timeGap = 0;
		var minGap = 500;
		for (var j=0;j<10;j++) {
			timeGap+=minGap;
			fnFusionGenerateMonsterFromAllySummon();
			//setTimeout(fnFusionGenerateMonsterFromAllySummon, timeGap);
		}
		timeGap+=minGap;
	
		setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:fnAutoFusion() });}, timeGap);
		setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:fnAutoFusion() });}, timeGap+5000);
	}
	if (parseInt(fnAutoStack(),10) > 0) {
		var timeGap = 0;
		setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:fnAutoStack() });}, timeGap);
		setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:fnAutoStack() });}, timeGap+5000);
	}
}

function fnFusionDest() {
	fnFusionFixDestPage();
}

function fnFusion() {
	fnSetAutoFusion(0);
	fnSetAutoStack(0);
	fnFusionFixPage();
}

// login Stamp

function fnLoginStamp() {
	setTimeout(function(){$.redirect('/en/'+platform+'/home');}, 1);
}

// slot stamp

function fnSlotInformationPreload() {
	fnRedirect('/en/'+platform+'/event/slotGame');
}

function fnSlotGame() {
	setTimeout(fnSlotGame, 1000);
	$('div.button_game').trigger('click');
	$('div.end_click_ok').trigger('click');
}

function fnSlotReward() {
	if ($('a[href^="/en/'+platform+'/event/slotPresent?now="]').length) {
		fnTimeOutRedirect($('a[href^="/en/'+platform+'/event/slotPresent?now="]').eq(0).attr("href"));
	}
}

function fnSlotGamePreload() {
}

// event bingo

function fnEventBingo() {

	launchRewards = function (rewards, is_continue)
	{
		window.location=(is_continue > 0) ?'/en/'+platform+'/event/bingo':'/en/'+platform+'/home';
		fnRedirect((is_continue > 0) ?'/en/'+platform+'/event/bingo':'/en/'+platform+'/home');
	}

	onScratchTap = function ()
	{
		var self    = $(this);
		var rex_pos = /pos_(\d+)/;
		var pos     = rex_pos.exec(self.attr('class'));

		if (pos.length < 1) { return; }

		$('div.scratch').unbind('click');
		onScratch(self, pos[1]);
	}

	var tList=[12,8,4,16,20,0,6,18,24,7,5,9,10,15,14,19,17,11,13,1,21,2,3,22,23];
	for (i=0;i<tList.length;i++){
		if ($('div.pos_'+tList[i]).hasClass('scratch')) {
			onScratch($('div.pos_'+tList[i]),tList[i]);
			break;
		}
	}
}

// event number ticket

function fnEventNumberTicketInformationPreload() {
	window.location = '/en/'+platform+'/home';
}

// home

function fnHome() {
	fnProfileAddWallBookmarkSelector();
	fnDeckAddFormationSelector();
	document.getElementById('formationDiv').style.top = "100px";
}

// home login

function fnHomeLogin() {
	$.ajax_ex(false, '/en/'+platform+'/present/fpAll', {},function(result) {return;}) ;
	setTimeout(function(){$.redirect('/en/'+platform+'/home');}, 1);
}

// home bonus

function fnHomeBonus() {
	$.ajax_ex(false, '/en/'+platform+'/present/fpAll', {},function(result) {return;}) ;
	setTimeout(function(){$.redirect('/en/'+platform+'/home');}, 1);
}

// on load

function fnSetupPurrCSS() {
	var sheet = document.createElement('style')
	sheet.innerHTML = "#purr-container {z-index:9999;			position: fixed;			top: 0;			right: 0;		}				.notice {			position: relative;			width: 324px;		}			.notice .close	{position: absolute; top: 12px; right: 12px; display: block; width: 18px; height: 17px; text-indent: -9999px; background: url(http://kitchen.net-perspective.com/purr-example/purrClose.png) no-repeat 0 10px;}			.notice-body {			min-height: 5px;			padding: 5px 5px 0 5px;			background: url(http://kitchen.net-perspective.com/purr-example/purrTop.png) no-repeat left top;			color: #f9f9f9;		}			.notice-body img	{width: 50px; margin: 0 10px 0 0; float: left;}			.notice-body h3	{margin: 0; font-size: 1.1em;}			.notice-body p		{margin: 10px 0px 0 15px;font-size: 0.8em; line-height: 1.4em;}				.notice-bottom {			height: 5px;			background: url(http://kitchen.net-perspective.com/purr-example/purrBottom.png) no-repeat left top;		}";
	document.body.appendChild(sheet);	
}

function fnAutoUsePoint() {
	if (player.remain_point > 0) {
		if (fnAutoStatsUp() == 1) {
			$.ajax_ex(false, '/en/'+platform+'/home/stup?bp=0&pr='+player.remain_point+'&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
		}
		else if (fnAutoStatsUp() == 2) {
			$.ajax_ex(false, '/en/'+platform+'/home/stup?bp='+player.remain_point+'&pr=0&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
		}
	}
}

function fnTimeoutOnLoad() {
	if (window.location.pathname === '/en/'+platform+'/event/loginStamp') {
		fnLoginStamp();
	}
	else if (window.location.pathname === '/en/'+platform+'/home/profile') {
		fnProfile();
	}
	else if (window.location.pathname === '/en/'+platform+'/home') {
		fnHome();
	}
	else if (window.location.pathname === '/en/'+platform+'/home/login') {
		fnHomeLogin();
	}
	else if (window.location.pathname === '/en/'+platform+'/home/bonus') {
		fnHomeBonus();
	}
	else if (window.location.pathname === '/en/'+platform+'/friends/profile') {
		fnFriendProfile();
	}
	else if (window.location.pathname === '/en/'+platform+'/deck/changeAllCheck') {
		fnDeckChangeAllCheck();
	}
	else if (window.location.pathname === '/en/'+platform+'/mission') {
		fnMission();
	}
	else if (window.location.pathname === '/en/'+platform+'/mission/battleResult') {
		fnMissionBattleResult();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower') {
		fnTower();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower/summon') {
		fnTowerSummon();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower/mission') {
		fnTowerMission();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower/bossResult') {
		fnTowerBossResult();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower/finalRanking') {
		fnTowerFinalRanking();
	}
	else if (window.location.pathname === '/en/'+platform+'/dungeon' || window.location.pathname === '/en/'+platform+'/dungeon/index') {
		fnDungeon();
	}
	else if (window.location.pathname === '/en/'+platform+'/dungeon/mission') {
		fnDungeonMission();
	}
	else if (window.location.pathname === '/en/'+platform+'/dungeon/battle') {
		fnDungeonBattle();
	}
	else if (window.location.pathname === '/en/'+platform+'/dungeon/win') {
		fnDungeonWin();
	}
	else if (window.location.pathname === '/en/'+platform+'/battle/battle') {
		fnBattleBattle();
	}
	else if (window.location.pathname === '/en/'+platform+'/present/box') {
		fnPresentBox();
	}
	else if (window.location.pathname === '/en/'+platform+'/present/suggest') {
		fnPresentSuggest();
	}
	else if (window.location.pathname === '/en/'+platform+'/present/confirm') {
		fnPresentConfirm();
	}
	else if (window.location.pathname === '/en/'+platform+'/trade/suggest1') {
		fnTradeSuggest();
	}
	else if (window.location.pathname === '/en/'+platform+'/achievement/monster') {
		fnMonsterCollection();
	}
	else if (window.location.pathname === '/en/'+platform+'/achievement/monsterInformation') {
		fnMonsterInfo();
	}
	else if (window.location.pathname === '/en/'+platform+'/auction') {
		fnAuction();
	}
	else if (window.location.pathname === '/en/'+platform+'/auction/detail') {
		fnAuctionDetail();
	}
	else if (window.location.pathname === '/en/'+platform+'/trade') {
		fnTrade();
	}
	else if (window.location.pathname === '/en/'+platform+'/fusion') {
		fnFusion();
	}
	else if (window.location.pathname === '/en/'+platform+'/fusion/dest') {
		fnFusionDest();
	}
	else if (window.location.pathname === '/en/'+platform+'/fusion/fusion') {
		fnFusionFusion();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad') {
		fnForkRoad();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/mission') {
		fnForkRoadMission();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/slotGame') {
		fnSlotGame();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/slotReward') {
		fnSlotReward();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/bingo') {
		//fnEventBingo();
	}
	// /en/'+platform+'/dungeon/recovery
	// /en/'+platform+'/dungeon/recoveryproc
}

function fnOnLoad() {
	loadjscssfile("http://jquery-notice.googlecode.com/svn/trunk/jquery.notice.css?", "css");
	loadjscssfile("http://sexybuttons.googlecode.com/svn/trunk/sexybuttons.css", "css");

	loadjscssfile("http://kitchen.net-perspective.com/purr-example/jquery.purr.js", "js");	
	fnSetupPurrCSS();

	fnCreateBackButton();
	
	fnAutoUsePoint();
	
	fnCheckAlly();
	
	$(document).ready(function() {  setTimeout(fnTimeoutOnLoad, 0);});	
}

function fnPreLoad() {
	if (window.location.pathname === '/en/'+platform+'/dungeon/mission') {
		fnDungeonMissionPreload();
	}
	else if (window.location.pathname === '/en/'+platform+'/dungeon/battle') {
		fnDungeonBattlePreload();
	}
	else if (window.location.pathname === '/en/'+platform+'/dungeon/win') {
		fnDungeonWinPreload();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/slotInformation') {
		fnSlotInformationPreload();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/slotGame') {
		fnSlotGamePreload();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/numberTicketInformation') {
		fnEventNumberTicketInformationPreload();
	}	
}

fnPreLoad();