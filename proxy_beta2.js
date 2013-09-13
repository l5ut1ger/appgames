// 743

var platform = window.location.pathname.indexOf("android") >= 0 ? 'android' : 'ios';

// define
var missionInterval;
var progressionGuildSpecific = false;
var progressionList=[50113, 53113, 56113];
var skillArray = {"1": "IPA", "4": "IPD", "7": "Heal", "10": "Heal All", "13": "Revive", "16": "Pre-Strike", "17": "DEA", "20": "DED", "24": "Agility", "27": "Critical", "30": "Dodge", "37": "Venom", "47": "HellBlaze", "50": "Artic", "53": "Lightning", "57": "HealthUp", "58": "ImpDown", "59": "CovDown", "60": "PsyDown", "61": "DemonDown", "62": "CreatDown", "63": "UndeadDown", "64": "BeastDown", "65": "MystDown", "66": "WyrmDown", "67": "CrawlDown", "68": "BruteDown","69":"PartyAtk+","70":"PartyDef+","71":"Health+","72":"CypherDown","76":"IPA+","77":"IPD+","78":"DEA+","79":"DED+","80":"HealthUp+","81":"ImpDown+","82":"CovDown+","83":"PsyDown+","84":"CypherDown+","85":"SacDivinity","88":"EffDivinity","91":"AugDivinity"};
var guildDownArray = {"58": "ImpDown", "59": "CovDown", "60": "PsyDown"};
var speciesDownArray = {"61": "DemonDown", "62": "CreatDown", "63": "UndeadDown", "64": "BeastDown", "65": "MystDown", "66": "WyrmDown", "67": "CrawlDown", "68": "BruteDown"};
var sacSkillList=[0,7,10,13,16,24,30,37];
var bpItemList = [3043, 3024, 3019, 3020, 3003, 3011];
var syncCount = 0;
var serverCookieInterval=0;;
/*
if (typeof confirm_id == 'undefined') {
	var confirm_id = 0;
}*/
// Tools

function fnResetSettings() {
	if (!confirm('Are you sure you want to reset the settings?')) {
		return;
	}
	var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=."+location.host;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
    }
}

function fnSyncServer() {
	var ep=0;
	var myEP = 0;
	var my100EP = 0;
	var bp=0;
	var myBP = 0;
	var my100BP = 0;
	var elixir = 0;
	var myElixir = 0;
	var my100Elixir = 0;
	var tradeTicket = 0;
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var items = data.payload.items;
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3022) { 
				my100EP = items[j].amount;
			}
			else if (items[j].item_id == 3018) { 
				myEP = items[j].amount;
			}
			else if (items[j].item_id == 3001) { 
				ep = items[j].amount;
			}
			else if (items[j].item_id == 3024) { 
				my100Elixir = items[j].amount;
			}
			else if (items[j].item_id == 3020) { 
				myElixir = items[j].amount;
			}
			else if (items[j].item_id == 3011) { 
				elixir = items[j].amount;
			}
			else if (items[j].item_id == 3043) { 
				my100BP = items[j].amount;
			}
			else if (items[j].item_id == 3019) { 
				myBP = items[j].amount;
			}
			else if (items[j].item_id == 3003) { 
				bp = items[j].amount;
			}
			else if (items[j].item_id == 3100) { 
				tradeTicket = items[j].amount;
			}
		}
		var str = "http://ds.game.dark"+"summoner.com/ds/sync.php?ID="+player.player_id+"&name="+player.nickname+"&__hash="+(new Date()).getTime()+"&key="+fnGetCookie('darksummoner_en')+"&name="+player.nickname+"&level="+player.lv+"&energy="+player.power_max+"&battlePt="+player.bp_max+"&summon_max="+player.summon_max+"&gold="+player.jewel+"&ep="+ep+"&myEP="+myEP+"&my100EP="+my100EP+"&bp="+bp+"&myBP="+myBP+"&my100BP="+my100BP+"&elixir="+elixir+"&myElixir="+myElixir+"&my100Elixir="+my100Elixir+"&tradeTicket="+tradeTicket;
		loadjscssfile(str, "js");
	});
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// decimal to binary
function fnDecToBin(arg)
{
	res1 = 999;
	args = arg;
	while(args>1)
	{
		arg1 = parseInt(args/2);
		arg2 = args%2;
		args = arg1;
		if(res1 == 999)
		{
			res1 = arg2.toString();
		}
		else
		{
			res1 = arg2.toString()+res1.toString();
		}
	}
	if(args == 1 && res1 != 999)
	{
		res1 = args.toString()+res1.toString();
	}
	else if(args == 0 && res1 == 999)
	{
		res1 = 0;
	}
	else if(res1 == 999)
	{
		res1 = 1;
	}
	var ll = res1.length;
	while(ll%4 != 0)
	{
		res1 = "0"+res1;
		ll = res1.length;
	}	
	return res1;
}

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

function fnSetCookie(c_name,value,upload)
{
	if(upload != 0) { 
		upload = 1;
	}
	if (value == 0) {
		value = 0;
	}
	else if (value === null) {
		value='';
	}
	else if (value == undefined || value == 'undefined') {
		value = '';
	}
	var c_value;
	if (isNaN(value) && value =='') {
		c_value="; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	}
	else {
		var exdays = 9999;
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		c_value=escape(value) + ((exdays===null) ? "" : "; expires="+exdate.toUTCString());
	}
	
	document.cookie=c_name + "=" + c_value+ ";path=/;"+ ((location.host.split(".")[0]=="game")?"domain=."+location.host:"");
	if (upload==1) {
		$.ajax({async: false, url: 'http://ds.game.dark'+'summoner.com/ds/writeCookie.php', type: "post", data: {ID:player.player_id, name:c_name, value:value}, success: function(data) {}, dataType: "json"});
	}
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
			if (y==undefined || y=="undefined") {
				return null;
			}
			return unescape(y);
		}
	}
	return null;
}

// check ally
var autoAllyKey = 'autoAlly';
var autoAllyMsgKey = 'autoAllyMsg';
var checkAllyTimeKey = 'checkAllyTime';
var checkAllyTimeInterval = 1000 * 60 * 2; // if has free ally spot, check ally ever 2 minutes

function fnAutoAlly() {
	if (fnGetCookie(autoAllyKey) === null) {
		fnSetAutoAlly(-1, 0);
	}
	return fnGetCookie(autoAllyKey);
}

function fnSetAutoAlly(value, upload) {
	if(upload != 0) { 
		upload = 1;
	}
	fnSetCookie(autoAllyKey, value, upload);
}

function fnAutoAllyMsg() {
	if (fnGetCookie(autoAllyMsgKey) === null) {
		fnSetAutoAllyMsg("{lv}needs ally, many thanks! :)");
	}
	return fnGetCookie(autoAllyMsgKey);
}

function fnSetAutoAllyMsg(value, upload) {
	if(upload != 0) { 
		upload = 1;
	}
	fnSetCookie(autoAllyMsgKey, value, upload);
}

function fnGetCheckAllyTimer() {
	if (fnGetCookie(checkAllyTimeKey) === null) {
		fnSetCheckAllyTimer(0, 0);
	}
	return fnGetCookie(checkAllyTimeKey);
}

function fnSetCheckAllyTimer(value, upload) {
	if(upload != 0) { 
		upload = 1;
	}
	fnSetCookie(checkAllyTimeKey, value, 0);
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
	$.ajax_ex(false, '/en/'+platform+'/ranking/list?page=0&tribe=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		for (var i=0;i<=2;i++) {
			setTimeout(fnSendAllyMsg, i*1000+3000, data.payload.rankers[i].player_id, data.payload.rankers[i].player.nickname, fnAutoAllyMsg());
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

function fnRemainedAllySpot() {
	if (typeof(player) !== 'undefined' && player != null) {
	}
	else {
		return 0;
	}
	return ((((player.lv-1)*3 + 20 + 80 + Math.floor(10 + player.lv/2)*5) - (parseInt(player.power_max, 10) + parseInt(player.bp_max, 10) + parseInt(player.remain_point, 10)))/5) ;
}

function fnAllyOwnAlt() {
	var divTag2 = document.createElement("div");
	divTag2.id = "checkAllyDiv2";
	divTag2.style.display = "none";
	document.body.appendChild(divTag2); 
	
	var result2= $('#checkAllyDiv2').load('/en/'+platform+'/friends', {}, function(){
		var allyStr = player.player_id;
		for (var i=0;i < result2.find('#list-friendship .pid').length;i++) {
			allyStr += "," + result2.find('#list-friendship .pid').eq(i).html();
		}	
		$.post("http://ds.game.dark" + "summoner.com/ds/allyOwnAlt.php?owner=" + fnOwner() + "&__hash="+(new Date()).getTime(),{allies:allyStr}, function(altArray){
			for (var i=0;i<altArray.length;i++) {
				$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+altArray[i]+'&cmd=apply', {},function(result) {return;});
				fnGrowl("Allying "+altArray[i]);
			}
			alert("Request to ally own alt sent");
		}, "json");	
		
	});
}

function fnHandleAllyRequest() {
	
	var divTag2 = document.createElement("div");
	divTag2.id = "checkAllyDiv2";
	divTag2.style.display = "none";
	document.body.appendChild(divTag2); 
	
	var result2= $('#checkAllyDiv2').load('/en/'+platform+'/friends', {}, function(){
		var allyStr = player.player_id;
		for (var i=0;i < result2.find('#list-friendship .pid').length;i++) {
			allyStr += "," + result2.find('#list-friendship .pid').eq(i).html();
		}	
		$.post("http://ds.game.dark" + "summoner.com/ds/altArray2.php?__hash="+(new Date()).getTime(),{allies:allyStr}, function(altArray){
			var hasAllyApplied = false;
			for (var i=0;i < result2.find('#list-applied .pid').length;i++) {
				if (altArray.indexOf(parseInt(result2.find('#list-applied .pid').eq(i).html(),10)) !== -1) {
					// is alt
					$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+result2.find('#list-applied .pid').eq(i).html()+'&cmd=accept', {},function(result) {return;}) ;
				}
				else if (parseInt(fnAutoAlly(),10) == 3) {
					// reject non alt
					$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+result2.find('#list-applied .pid').eq(i).html()+'&cmd=reject', {},function(result) {return;}) ;
				}
			}
			fnSendAllyAltRequest(altArray);
		}, "json");	
		
	});
}

function fnSendAllyAltRequest(altArray) {
	if (parseInt(fnAutoAlly(),10) > 1 && fnHasAllySpot() && altArray.length>0) {
		$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+altArray[0]+'&cmd=apply', {},function(result) {return;});
	}
	if (parseInt(fnAutoAlly(),10) > 1 && fnHasAllySpot() && altArray.length>12) {
		$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+altArray[Math.floor(Math.random()*10)+1]+'&cmd=apply', {},function(result) {return;});
	}
	if (parseInt(fnAutoAlly(),10) > 1 && fnHasAllySpot() && altArray.length>22) {
		$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+altArray[Math.floor(Math.random()*10)+10]+'&cmd=apply', {},function(result) {return;});
	}
}

function fnAcceptAllAllyRequest() {
	var hasAllyApplied = false;
	
	var divTag = document.createElement("div");
	divTag.id = "checkAllyDiv";
	divTag.style.display = "none";
	document.body.appendChild(divTag); 	
	
	var result= $('#checkAllyDiv').load('/en/'+platform+'/friends #list-applied', {}, function(){
		for (var i=0;i < result.find('.pid').length;i++) {
			$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+result.find('.pid').eq(i).html()+'&cmd=accept', {},function(result) {return;}) ;
		}	
	});
}

function fnCheckAlly() {
	if (parseInt(fnAutoAlly(),10) == -1) {
		return;
	}
	if (!fnHasAllySpot()) {
		return;
	}
	if (window.location.pathname === '/en/'+platform+'/home' || (new Date()).getTime() - fnGetCheckAllyTimer() > checkAllyTimeInterval) {
		fnSetCheckAllyTimer((new Date()).getTime(), 0);
	}
	else {
		return;
	} 
	if (parseInt(fnAutoAlly(),10) == 1) {
		fnSpamAllyMsg();
	}
	if (parseInt(fnAutoAlly(),10) == 1 || parseInt(fnAutoAlly(),10) == 2) {
		fnAcceptAllAllyRequest();
	}
	else {
		fnHandleAllyRequest();
	}

}

// owner

var ownerKey = 'own';

function fnOwner() {
	if (fnGetCookie(ownerKey) === null) {
		fnSetOwner(0, 0);
	}
	return fnGetCookie(ownerKey);
}

function fnSetOwner(value, upload) {
	if(upload != 0) { 
		upload = 1;
	}
	fnSetCookie(ownerKey, value, upload);
}

// grinding speed

var grindingSpeedKey = 'grindingSpeed';

function fnGetGrindingSpeed() {
	if (fnGetCookie(grindingSpeedKey) === null) {
		fnSetGrindingSpeed(-1, 0);
	}
	return fnGetCookie(grindingSpeedKey);
}

function fnSetGrindingSpeed(value, upload) {
	if(upload != 0) { 
		upload = 1;
	}
	fnSetCookie(grindingSpeedKey, value, upload);
}

// Auto redirect

var autoRedirectKey = 'redirect';

function fnAutoRedirect() {
	if(fnGetCookie(autoRedirectKey) === null) {
		fnSetAutoRedirect(".", 0);
	}
	return fnGetCookie(autoRedirectKey);
}

function fnSetAutoRedirect(value, upload) {
	upload = 0;
	if(upload != 0) { upload = 1;}
	fnSetCookie(autoRedirectKey, value, upload);
}


// auto new mission

var autoNewMissionKey = 'autoNewMissionKey';

function fnAutoNewMission() {
	if (fnGetCookie(autoNewMissionKey) === null) {
		fnSetAutoNewMission(1);
	}
	return fnGetCookie(autoNewMissionKey);
}

function fnSetAutoNewMission(value, upload) {
	if(upload != 0) { 
		upload = 1;
	}
	fnSetCookie(autoNewMissionKey, value, upload);
}

// Auto EP Toggle

var autoDrinkKey = 'autoDrink';

function fnAutoDrink() {
	if(fnGetCookie(autoDrinkKey) === null) {
			fnSetAutoDrink(-1, 0);
	}
	return fnGetCookie(autoDrinkKey);
}

function fnSetAutoDrink(value, upload) {
	if(upload != 0) { 
		upload = 1;
	}
	fnSetCookie(autoDrinkKey, value, upload);
}

// Auto Stats Up

var autoStatsUpKey = 'autoStatsUp';

function fnAutoStatsUp() {
	if(fnGetCookie(autoStatsUpKey) === null) {
		fnSetAutoStatsUp(0, 0);
	}
	return fnGetCookie(autoStatsUpKey);
}

function fnSetAutoStatsUp(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(autoStatsUpKey, value, upload);
}

// Auto Fusion

var autoFusionKey = 'autoFusionKey';

function fnAutoFusion() {
	if(fnGetCookie(autoFusionKey) === null) {
		fnSetAutoFusion(0, 0);
	}
	return fnGetCookie(autoFusionKey);
}

function fnSetAutoFusion(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(autoFusionKey, value, upload);
}

// Auto Skill Up

var autoSkillUpKey = 'autoSkillUpKey';

function fnAutoSkillUp() {
	if(fnGetCookie(autoSkillUpKey) === null) {
		fnSetAutoSkillUp(0, 0);
	}
	return fnGetCookie(autoSkillUpKey);
}

function fnSetAutoSkillUp(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(autoSkillUpKey, value, 0);
}

// Auto Stack

var autoStackKey = 'autoStack';

function fnAutoStack() {
	if(fnGetCookie(autoStackKey) === null) {
		fnSetAutoStack(0, 0);
	}
	return fnGetCookie(autoStackKey);
}

function fnSetAutoStack(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(autoStackKey, value, 0);
}

var autoStackBPKey = 'autoStackBP';

function fnAutoStackBP() {
	if(fnGetCookie(autoStackBPKey) === null) {
		fnSetAutoStackBP(10);
	}
	return fnGetCookie(autoStackBPKey);
}

function fnSetAutoStackBP(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(autoStackBPKey, value, upload);
}

// Gift Cookies

var giftCookiesKey = 'giftCookiesKey';

function fnGiftCookies() {
	if(fnGetCookie(giftCookiesKey) === null) {
		fnSetGiftCookies(0, 0);
	}
	return fnGetCookie(giftCookiesKey);
}

function fnSetGiftCookies(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(giftCookiesKey, value, upload);
}

// Tower Event Target

var towerEventTargetKey = 'towerEventTarget';

function fnTowerEventTarget() {
	if(fnGetCookie(towerEventTargetKey) === null) {
		fnSetTowerEventTarget(2501);
	}
	return fnGetCookie(towerEventTargetKey);
}

function fnSetTowerEventTarget(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(towerEventTargetKey, value, upload);
}

// Tower Event McFly Team

var towerMcFlyTeamKey = 'TowerMcFlyTeam';

function fnTowerMcFlyTeam() {
	if(fnGetCookie(towerMcFlyTeamKey) === null) {
		fnSetTowerMcFlyTeam('', 0);
	}
	return fnGetCookie(towerMcFlyTeamKey);
}

function fnSetTowerMcFlyTeam(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(towerMcFlyTeamKey, value, upload);
}

var towerProgTeamKey = 'TowerProgTeam';

function fnTowerProgTeam() {
	if(fnGetCookie(towerProgTeamKey) === null) {
		fnSetTowerProgTeam('', 0);
	}
	return fnGetCookie(towerProgTeamKey);
}

function fnSetTowerProgTeam(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(towerProgTeamKey, value, upload);
}

var towerTrapKey = 'TTK';

function fnTowerTrap() {
	if(fnGetCookie(towerTrapKey) === null) {
		fnSetTowerTrap('0', 0);
	}
	return fnGetCookie(towerTrapKey);
}

function fnSetTowerTrap(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(towerTrapKey, value, upload);
}

// cookies that store whether the player is battling mcfly, so the player will switch back to prog team later

var battlingMcFlyKey = 'battlingMcFly';

function fnIsBattlingMcFly() {
	if(fnGetCookie(battlingMcFlyKey) === null) {
		fnSetIsBattlingMcFly(0, 0);
	}
	return fnGetCookie(battlingMcFlyKey);
}

function fnSetIsBattlingMcFly(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(battlingMcFlyKey, value, 0);
}

// ForkRoad Mission Team

var eventMissionTeamKey = 'frMT';

function fnEventMissionTeam() {
	if(fnGetCookie(eventMissionTeamKey) === null) {
		fnSetEventMissionTeam('', 0);
	}
	return fnGetCookie(eventMissionTeamKey);
}

function fnSetEventMissionTeam(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(eventMissionTeamKey, value, upload);
}

var eventBattleTeamKey = 'frBT';

function fnEventBattleTeam() {
	if(fnGetCookie(eventBattleTeamKey) === null) {
		fnSetEventBattleTeam('', 0);
	}
	return fnGetCookie(eventBattleTeamKey);
}

function fnSetEventBattleTeam(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(eventBattleTeamKey, value, upload);
}

var forkRoadStayKey = 'frStay';

function fnForkRoadStay() {
	if(fnGetCookie(forkRoadStayKey) === null) {
		fnSetForkRoadStay(0, 0);
	}
	return fnGetCookie(forkRoadStayKey);
}

function fnSetForkRoadStay(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(forkRoadStayKey, value, upload);
}

// Dungeon Boss Record

var dungeonBossRecordKey = 'dungeonBossRecordKey';

function fnDungeonBossRecord() {
	if(fnGetCookie(dungeonBossRecordKey) === null) {
		fnSetDungeonBossRecord('', 0);
	}
	return fnGetCookie(dungeonBossRecordKey);
}

function fnSetDungeonBossRecord(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(dungeonBossRecordKey, value, upload);
}

// Dungeon Boss Record

var autoBPKey = 'autoBP';

function fnAutoBP() {
	if(fnGetCookie(autoBPKey) === null) {
		fnSetAutoBP(0, 0);
	}
	return fnGetCookie(autoBPKey);
}

function fnSetAutoBP(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(autoBPKey, value, upload);
}

// Dungeon Extra Exp

var dungeonExtraExpKey = 'dungeonExtraExpKey';

function fnDungeonExtraExp() {
	if(fnGetCookie(dungeonExtraExpKey) === null) {
		fnSetDungeonExtraExp(0, 0);
	}
	return fnGetCookie(dungeonExtraExpKey);
}

function fnSetDungeonExtraExp(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(dungeonExtraExpKey, value, upload);
}

// Dungeon Extra Gold

var dungeonExtraGoldKey = 'dungeonExtraGoldKey';

function fnDungeonExtraGold() {
	if(fnGetCookie(dungeonExtraGoldKey) === null) {
		fnSetDungeonExtraGold(0, 0);
	}
	return fnGetCookie(dungeonExtraGoldKey);
}

function fnSetDungeonExtraGold(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(dungeonExtraGoldKey, value, upload);
}

// Dungeon Travel Level

var dungeonTravelLevelKey = 'dungeonTravelLevelKey';

function fnDungeonTravelLevel() {
	if(fnGetCookie(dungeonTravelLevelKey) === null) {
		fnSetDungeonTravelLevel(0, 0);
	}
	return fnGetCookie(dungeonTravelLevelKey);
}

function fnSetDungeonTravelLevel(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(dungeonTravelLevelKey, value, upload);
}

// Dungeon Impulse Team

var dungeonBossTeamKey = 'dungeonBossTeamKey';

function fnDungeonBossTeam() {
	if(fnGetCookie(dungeonBossTeamKey) === null) {
		fnSetDungeonBossTeam('', 0);
	}
	return fnGetCookie(dungeonBossTeamKey);
}

function fnSetDungeonBossTeam(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(dungeonBossTeamKey, value, upload);
}

// Dungeon Prog Team

var dungeonProgTeamKey = 'dungeonProgTeamKey';

function fnDungeonProgTeam() {
	if(fnGetCookie(dungeonProgTeamKey) === null) {
		fnSetDungeonProgTeam('', 0);
	}
	return fnGetCookie(dungeonProgTeamKey);
}

function fnSetDungeonProgTeam(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(dungeonProgTeamKey, value, upload);
}

// Subjucation missionStayThere

var subjucationMissionStayKey = 'subjuMisStay';

function fnSubjucationMissionStay() {
	if(fnGetCookie(subjucationMissionStayKey) === null) {
		fnSetSubjucationMissionStay(0, 0);
	}
	return fnGetCookie(subjucationMissionStayKey);
}

function fnSetSubjucationMissionStay(value, upload) {
	if(upload != 0) { upload = 1;}
	fnSetCookie(subjucationMissionStayKey, value, upload);
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

function fnSkypeClanSelectorOption(pDefault) {
	if (pDefault == null) {
		pDefault = "0";
	}
	var option = '<option value="1860292579" ' + (pDefault=="1860292579"?"selected":"") + '>about2punt</option>';
	option += '<option value="2171680461" ' + (pDefault=="2171680461"?"selected":"") + '>Byce</option>';
	option += '<option value="2687205744" ' + (pDefault=="2687205744"?"selected":"") + '>Beastly(Josh)</option>';
	option += '<option value="2747200019" ' + (pDefault=="2747200019"?"selected":"") + '>Getr3kt</option>';
	option += '<option value="2578795263" ' + (pDefault=="2578795263"?"selected":"") + '>Joe</option>';
	//option += '<option value="2121751804" ' + (pDefault=="2121751804"?"selected":"") + '>Josh</option>';
	//option += '<option value="2337077116" ' + (pDefault=="2337077116"?"selected":"") + '>devistator(Josh)</option>';
	option += '<option value="2993558878" ' + (pDefault=="2993558878"?"selected":"") + '>mr_saving</option>';
	//option += '<option value="1806070535" ' + (pDefault=="1806070535"?"selected":"") + '>Kissy</option>';
	option += '<option value="2656724949" ' + (pDefault=="2656724949"?"selected":"") + '>Kissy</option>';
	//option += '<option value="1330745254" ' + (pDefault=="1330745254"?"selected":"") + '>Unreality</option>';
	//option += '<option value="1847429107" ' + (pDefault=="1847429107"?"selected":"") + '>Unreality</option>';
	option += '<option value="2150306457" ' + (pDefault=="2150306457"?"selected":"") + '>Unreality</option>';
	option += '<option value="2661557047" ' + (pDefault=="2661557047"?"selected":"") + '>Kelv(Drakkar)</option>';
	return option;
}

function fnProfileAddSkypeClanSelector() {
	var divTag = document.createElement("div"); 

	divTag.id = "skypeClanDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "100px"; 
	divTag.style.top = "100px"; 

	var selectorHTML = '<select name="sel" onchange="fnProfileGotoWallBookmark(this.options[this.options.selectedIndex].value);"><option selected value="0">Skype Clan</option>';
	selectorHTML += fnSkypeClanSelectorOption(null);
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
	/*var divTag = document.createElement("a"); 
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
*/

	var divTag = document.createElement("a"); 
	divTag.id = "btn-bbs-clearAll"; 

	divTag.style["font-size"] = "0.6em"; 
	divTag.style.position = "relative";
	divTag.style.top = "0px";

	divTag.className =("btn __red __WS __HS");
	divTag.href = "#";
	divTag.innerHTML = "X-all";
	document.getElementById('div-bbs-form').appendChild(divTag);

	$('#btn-bbs-clearAll').click(function() { 
		//alert("item length:" + $( "div[id|='div-bbs-item']" ).length);
		for (i=0;i<$( "div[id|='div-bbs-item']" ).length;i++) {
			$.getJSON('/en/'+platform+'/bbs/remove', {
				'target_id': player.player_id,
				'sub_id': $( "div[id|='div-bbs-item']" ).eq(i).attr("id").replace("div-bbs-item-","")
			}, function(result) {
			});
		}
		while ($( "div[id|='div-bbs-item']" ).length) {
			$( "div[id|='div-bbs-item']" ).eq(0).remove();
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
	fnGrowl('Trying to receive compensation gift '+ pID);
	$.ajax_ex(false, '/en/'+platform+'/compensation/receive?compensation_id='+pID, { }, function(data) {
		
	});
}

function fnProfileFillAltOption() {
	$.getJSON('http://ds.game.dark'+'summoner.com/ds/getAlt.php?ownerID='+fnOwner(),{}, function(j){
		var options = '<option value="0">Alt Walls</option>';
		for (var i = 0; i < j.length; i++) {
			options += '<option value="' + j[i].optionValue + '">' + j[i].optionDisplay + '</option>';
		}
		$("#altWall").html(options);
	});
}

function fnProfileFixTabs() {
	document.getElementById('_1').childNodes[7].childNodes[0].innerHTML = "Strategy";
	var divTag = document.createElement("div"); 
	divTag.id = "profile-strategy"; 
	divTag.style.position = "relative"; 
	
	var resetHTML = '<input type="button" value="Reset All Settings" onClick="fnResetSettings()"><br/><br/>';
	
	var ownerHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Account Owner</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	ownerHTML += 'Set Account Owner:<br/><select name="sel" onchange="fnSetOwner(this.options[this.options.selectedIndex].value);fnGrowl(\'Set Owner As \'+this.options[this.options.selectedIndex].text);"><option value="0">Skype Clan</option>';
	ownerHTML += fnSkypeClanSelectorOption(fnOwner());
	ownerHTML+='</select><br/><br/>'; 
	
	var altHTML = 'Alt Walls:<br/><select id="altWall" name="altWall" onchange="fnProfileGotoWallBookmark(this.options[this.options.selectedIndex].value);"><option value="0">Alt Walls</option>';
	altHTML += '</select><br/><br/>';
	
	var allyAllAltHTML = '<input type="button" value="Send Ally Request to all your alts" onClick="fnAllyOwnAlt()"><br/><br/>';
	
	// Compensation gift setting
	var compensationHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Compensation Gifts</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	compensationHTML += 'Collect Individual Missed Compensation Gift:<br/><select name="sel" onchange="fnProfileGetCompensation(this.options[this.options.selectedIndex].value);">';
	compensationHTML += '<option selected value="">Select a gift ID</option>';
	for (var i=40;i<=41;i++) {
		compensationHTML += '<option value="' + i + '">' + i + '</option>';
	}
	compensationHTML += '</select><br/>';
	compensationHTML += 'Collect All Missed Compensation Gifts Up To:<br/><select name="sel" onchange="fnProfileGetAllCompenation(this.options[this.options.selectedIndex].value);">';
	compensationHTML += '<option selected value="">Select a gift ID</option>';
	for (var i=40;i<=41;i++) {
		compensationHTML += '<option value="' + i + '">' + i + '</option>';
	}
	compensationHTML += '</select><br/><br/>'; 	
	
	// auto grind setting
	var grindSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Grinding Speed</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	grindSelectorHTML += '<select name="sel" onchange="fnSetGrindingSpeed(this.options[this.options.selectedIndex].value);fnGrowl(this.options[this.options.selectedIndex].text);">';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == -1 ?'selected':'') + ' value="-1">Thumb</option>'
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 6000 ?'selected':'') + ' value="6000">Legit</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 4000 ?'selected':'') + ' value="4000">Seems Legit</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 3000 ?'selected':'') + ' value="3000">Barely Legal</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 2000 ?'selected':'') + ' value="2000">BoomOnBlow</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 1000 ?'selected':'') + ' value="1000">CC Speed</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 500 ?'selected':'') + ' value="500">Too Fast</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 200 ?'selected':'') + ' value="200">Too Furious</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 100 ?'selected':'') + ' value="100">Light</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 1 ?'selected':'') + ' value="1">Time Travel</option>';
	grindSelectorHTML += '</select><br/><br/>'; 
	
	// auto grind setting
	var grindSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Grinding Speed</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	grindSelectorHTML += '<select name="sel" onchange="fnSetGrindingSpeed(this.options[this.options.selectedIndex].value);fnGrowl(this.options[this.options.selectedIndex].text);">';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == -1 ?'selected':'') + ' value="-1">Thumb</option>'
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 6000 ?'selected':'') + ' value="6000">Legit</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 4000 ?'selected':'') + ' value="4000">Seems Legit</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 3000 ?'selected':'') + ' value="3000">Barely Legal</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 2000 ?'selected':'') + ' value="2000">BoomOnBlow</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 1000 ?'selected':'') + ' value="1000">CC Speed</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 500 ?'selected':'') + ' value="500">Too Fast</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 200 ?'selected':'') + ' value="200">Too Furious</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 100 ?'selected':'') + ' value="100">Light</option>';
	grindSelectorHTML += '<option ' + (fnGetGrindingSpeed() == 1 ?'selected':'') + ' value="1">Time Travel</option>';
	grindSelectorHTML += '</select><br/><br/>'; 
	
	// auto new mission setting
	var autoNewMissionSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Auto New Mission (turn off if you are repeating old missions)</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	autoNewMissionSelectorHTML += '<select name="sel" onchange="fnSetAutoNewMission(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto New Mission \'+this.options[this.options.selectedIndex].text);">';
	autoNewMissionSelectorHTML += '<option ' + (fnAutoNewMission() == 0 ?'selected':'') + ' value="0">Off</option>'
	autoNewMissionSelectorHTML += '<option ' + (fnAutoNewMission() == 1 ?'selected':'') + ' value="1">On</option>';
	autoNewMissionSelectorHTML += '</select><br/><br/>'; 
	
	// auto drink setting
	var autoDrinkSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Auto Drink</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	autoDrinkSelectorHTML += '<select name="sel" onchange="fnSetAutoDrink(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto Drink \'+this.options[this.options.selectedIndex].text);">';
	autoDrinkSelectorHTML += '<option ' + (fnAutoDrink() == -1 ?'selected':'') + ' value="-1">Off</option>'
	autoDrinkSelectorHTML += '<option ' + (fnAutoDrink() == 1 ?'selected':'') + ' value="1">On</option>';
	autoDrinkSelectorHTML += '<option ' + (fnAutoDrink() == 2 ?'selected':'') + ' value="2">Infinity My EP</option>';
	autoDrinkSelectorHTML += '</select><br/><br/>'; 

	var bpSelectorHTML =  'Auto BP<select name="autoBP" onchange="fnSetAutoBP(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto BP:\'+this.options[this.options.selectedIndex].text);"><option ' + (parseInt(fnAutoBP(),10)==0?'selected':'') + ' value="0">Auto Off</option><option ' + (parseInt(fnAutoBP(),10)==3003?'selected':'') + ' value="3003">Real BP</option><option ' + (parseInt(fnAutoBP(),10)==3019?'selected':'') + ' value="3019">My BP</option><option ' + (parseInt(fnAutoBP(),10)==3043?'selected':'') + ' value="3043">My 100 BP</option><option ' + (parseInt(fnAutoBP(),10)==3011?'selected':'') + ' value="3011">Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3020?'selected':'') + ' value="3020">My Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3024?'selected':'') + ' value="3024">My 100 Elixir</option></select><br/>';	
	
	// auto ally setting
	var autoAllySelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Auto Ally (per 3 mins.)</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	autoAllySelectorHTML += '<select name="sel" onchange="fnSetAutoAlly(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto Ally \'+this.options[this.options.selectedIndex].text);">';
	autoAllySelectorHTML += '<option ' + (fnAutoAlly() == -1 ?'selected':'') + ' value="-1">Off</option>';
	autoAllySelectorHTML += '<option ' + (fnAutoAlly() == 1 ?'selected':'') + ' value="1">Auto Ally Everyone</option>';
	autoAllySelectorHTML += '<option ' + (fnAutoAlly() == 2 ?'selected':'') + ' value="2">Auto Ally Alt, Accept Others</option>';
	autoAllySelectorHTML += '<option ' + (fnAutoAlly() == 3 ?'selected':'') + ' value="3">Auto Ally Alt, Reject Others</option>';
	autoAllySelectorHTML += '<option ' + (fnAutoAlly() == 4 ?'selected':'') + ' value="4">Auto Ally Alt, Leave Requests</option>';
	autoAllySelectorHTML += '</select><br/>Ally msg: (Use special keyword {lv} to represent your level)';
	autoAllySelectorHTML += '<div id="divAllyMsgForm"><textarea id="allyMsg">' + fnAutoAllyMsg() + '</textarea><a href="javascript:fnSetAutoAllyMsg(document.getElementById(\'allyMsg\').value);fnGrowl(\'Ally Msg set as \'+document.getElementById(\'allyMsg\').value);" class="btn __red __WS __HS" style="position:relative; top:-8px; font-size:0.8em;">Set</a></div><br/>';
	
	// auto stats up setting
	var autoStatsUpselectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Auto Stats Up</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	autoStatsUpselectorHTML += '<select name="sel" onchange="fnSetAutoStatsUp(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto Stats Up \'+this.options[this.options.selectedIndex].text);">';
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == -1 ?'selected':'') + ' value="-1">Off</option>'
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == 1 ?'selected':'') + ' value="1">On, EP</option>';
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == 2 ?'selected':'') + ' value="2">On, BP</option>';
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == 3 ?'selected':'') + ' value="3">On, 100EP, Rest BP</option>';
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == 4 ?'selected':'') + ' value="4">On, 200BP, Rest EP</option>';
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == 5 ?'selected':'') + ' value="5">On, 150BP, Rest EP</option>';
	autoStatsUpselectorHTML += '<option ' + (fnAutoStatsUp() == 6 ?'selected':'') + ' value="6">On, 100BP, Rest EP</option>';
	autoStatsUpselectorHTML += '</select><br/><br/>'; 
	
	// Auto Stack BP Settings
	var stackSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Auto Stack Rank A max BP</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	stackSelectorHTML += '<select name="sel" onchange="fnSetAutoStackBP(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto Stack Rank A max BP \'+this.options[this.options.selectedIndex].text);">';
	for (var i=1;i<=30;i++) {
		stackSelectorHTML += '<option ' + (fnAutoStackBP() == (i) ?'selected':'') + ' value="' + (i) + '">' + (i) + '</option>';
	}	
	stackSelectorHTML += '</select><br/><br/>';
	
	// Tower Event Target Settings
	var towerSelectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.dark'+'summoner.com/en/s/misc/icons/summon.png" /> Tower Event</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>Target Floor<br/>';
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
	mcFlyTeamSelectorHTML += '<option ' + (fnTowerMcFlyTeam()==null?'selected':'') + ' value="">Nil</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		mcFlyTeamSelectorHTML+='<option ' + (fnTowerMcFlyTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	mcFlyTeamSelectorHTML+='</select><br/><br/>'; 

	var towerTrapSelectorHTML = 'Trap Item<br/>';
	towerTrapSelectorHTML += '<select name="sel" onchange="fnSetTowerTrap(this.options[this.options.selectedIndex].value);fnGrowl(\'Tower Trap \'+this.options[this.options.selectedIndex].text);">';	
	towerTrapSelectorHTML += '<option ' + (fnTowerTrap()==0?'selected':'') + ' value="0">Nil</option>';	
	towerTrapSelectorHTML += '<option ' + (fnTowerTrap()==4002?'selected':'') + ' value="4002">Mission 1-1\'s loot</option>';
	towerTrapSelectorHTML+='</select><br/><br/>'; 
	
 
	divTag.innerHTML = resetHTML + ownerHTML + altHTML + allyAllAltHTML + compensationHTML + grindSelectorHTML + autoNewMissionSelectorHTML + autoDrinkSelectorHTML + bpSelectorHTML+ autoAllySelectorHTML + autoStatsUpselectorHTML + stackSelectorHTML + towerSelectorHTML + progTeamSelectorHTML + mcFlyTeamSelectorHTML+towerTrapSelectorHTML; 
	document.getElementById('profile-current-login').parentNode.appendChild(divTag);
	
	fnProfileFillAltOption();
	
	
	$('#profile-tab > div').click(function(){
		var self = $(this);
		var id   = self.attr('id');

		if (id == _tab_current_selected) { return; }
		if (self.hasClass('tab_disabled')) { return; }

		$('> div', self.parent()).each(function(i, tag) {
			var tab = $(this);

			for (var j = 0 ; j < 3 ; j++) {
				var is_same = (id == tab.attr('id'));
				$('img:eq(' + j + ')', tab).attr('src', _TAB_BG_IMG[is_same ? 'on' : 'off'][j]);
			}
		});

		var enable_phonegap = (typeof PhoneGap !== 'undefined') && (PhoneGap.available); 

		_tag_current_selected = id;

		switch (id) {
			case '_0': onChangeProfileFix('category-level'); 
				if (enable_phonegap) { }  break; 
			case '_1': onChangeProfileFix('category-record'); 
				if (enable_phonegap) { }  break; 
			case '_2': onChangeProfileFix('category-bbs'); 
				if (enable_phonegap) { }  break; 

			default: break;
		}
	});
	
	onChangeProfileFix = function (id) 
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
			'profile-make_account', 
			'profile-lapsed_days', 
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
					'profile-make_account', 
        			'profile-lapsed_days',
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
	onChangeProfileFix('category-level');
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
					if (result.payload[i].location ==0 && result.payload[i].def_location ==0 && (leader == null || leader.lv <  result.payload[i].lv)) {
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
						if (result.payload[i].location ==0 && result.payload[i].def_location ==0) {
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
		var result_array = {"l1":0, "l2":0, "l3":0, "l4":0, "l5":0};
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
						if (totalBP + parseInt(result.payload[i].bp,10) <= parseInt(player.bp_max,10)) { 
							result_array['l'+(j+1)] = result.payload[i].unique_no;
							result_array['l'+(j+1)+'level'] = result.payload[i].lv;
							result_array['l'+(j+1)+'skillLevel'] = result.payload[i].skill_lv;
							result_array['l'+(j+1)+'bp'] = result.payload[i].bp;
							totalBP += parseInt(result.payload[i].bp,10);
						}
					}
					else {
						if (parseInt(result.payload[i].lv,10) > parseInt(result_array['l'+(j+1)+'level'],10) || (parseInt(result.payload[i].lv, 10) == parseInt(result_array['l'+(j+1)+'level'],10) && parseInt(result.payload[i].skill_lv,10) > parseInt(result_array['l'+(j+1)+'skillLevel'], 10)) || (parseInt(result.payload[i].lv, 10) == parseInt(result_array['l'+(j+1)+'level'],10) && parseInt(result.payload[i].skill_lv, 10) == parseInt(result_array['l'+(j+1)+'skillLevel'],10) && parseInt(result.payload[i].bp,10) > parseInt(result_array['l'+(j+1)+'bp'], 10))) {
							if (totalBP - parseInt(result_array['l'+(j+1)+'bp'],10) + parseInt(result.payload[i].bp,10) <= parseInt(player.bp_max,10)) { 
								totalBP -= result_array['l'+(j+1)+'bp'];
								result_array['l'+(j+1)] = parseInt(result.payload[i].unique_no,10);
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
		$.ajax_ex(false, '/en/'+platform+'/deck2/autoOrganize?deck_number=0&l1='+result_array['l1']+'&l2='+result_array['l2']+'&l3='+result_array['l3']+'&l4='+result_array['l4']+'&l5='+result_array['l5'], {}, function(result) {});
		
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
		if (result.find('#summon_bingo').find('.cost_ticket').length) {
			if (parseInt(result.find('#summon_bingo').find('.cost_ticket').html(),10) > 0) {
				items.push('3:5007:'+parseInt(result.find('#summon_bingo').find('.cost_ticket').html(),10));
			}
		}
		if (result.find('#summon_dark_drop').find('.cost_ticket').length) {
			if (parseInt(result.find('#summon_dark_drop').find('.cost_ticket').html(),10) > 0) {
				items.push('3:5030:'+parseInt(result.find('#summon_dark_drop').find('.cost_ticket').html(),10));
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
			if (result.find('#summon_bingo').find('.cost_ticket').length) {
				if (parseInt(result.find('#summon_bingo').find('.cost_ticket').html(),10) > 0) {
					giftList.push('3:5007:'+parseInt(result.find('#summon_bingo').find('.cost_ticket').html(),10));
				}
			}
			if (result.find('#summon_dark_drop').find('.cost_ticket').length) {
				if (parseInt(result.find('#summon_dark_drop').find('.cost_ticket').html(),10) > 0) {
					giftList.push('3:5030:'+parseInt(result.find('#summon_dark_drop').find('.cost_ticket').html(),10));
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

function fnFriendRemoveCall(pPID) {
	$.ajax_ex(false, '/en/'+platform+'/friends/operation?pid='+pPID+'&cmd=break', {}, function(result) {});
	fnGrowl("Removing " + pPID);
}

function fnFriendConfirmRemove() {
	if (confirm('Are you sure you want to remove all ally?')) {
		for (var i=0;i < $('.pid').length;i++) {
			setTimeout(fnFriendRemoveCall, i*1000, $('.pid').eq(i).text());
		}
	}
}

function fnFriend() {
	var divTag = document.createElement("div"); 

	divTag.id = "removeAllDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "100px"; 
	divTag.style.top = "70px"; 

	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="fnFriendConfirmRemove();">Remove All Ally</button>'; 
	document.body.appendChild(divTag); 
	
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
				$.ajax_ex(false, '/en/'+platform+'/deck2/autoOrganize?deck_number=0&l1='+l1+'&l2='+l2+'&l3='+l3+'&l4='+l4+'&l5='+l5, {}, function(result) {});
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
		$.ajax_ex(false, '/en/'+platform+'/deck2/autoOrganize?deck_number=0&l1='+result_array['l1']+'&l2='+result_array['l2']+'&l3='+result_array['l3']+'&l4='+result_array['l4']+'&l5='+result_array['l5'], {}, pFinishFunction);
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
		$.ajax_ex(false, '/en/'+platform+'/tower/process', {'area_id'    : areaMaster.area_id,'mission_id' : mission.last_mission_id, api : 'json','full_power':true, '__hash': ('' + (new Date()).getTime())}, function(result) {
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
						fnRedirect('/en/'+platform+'/tower/friendCage');
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
				clearInterval(missionInterval);
				//fnRedirect('/en/'+platform+'/tower/mission');
				
				if (fnTowerMcFlyTeam() != null && fnTowerProgTeam() != null) {
					fnSetIsBattlingMcFly(1);
					fnDeckChangeAdvance(fnTowerMcFlyTeam(), false, function(){fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');});
					//$.ajax_ex(false, fnTowerMcFlyTeam().split(fnGetConnector())[0], {}, function(data) {});
				}
				//fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003', {}, function(data) {});
				fnRedirect('/en/'+platform+'/tower/bossResult');
				return;
				
				//document.location='/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003';	1068	  
				//setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 1000);		
				//setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);// if failed to redirect, then reload mission screen
				
			}
			if (result.payload.process.clear) {
			  if (!isShadow) EfectMng.push('shadowShow', null);
			  isShadow = true;
			  if (mission.is_boss) {
				clearInterval(missionInterval);
				if (fnTowerMcFlyTeam() != null && fnTowerProgTeam() != null) {
					fnSetIsBattlingMcFly(1);
					fnDeckChangeAdvance(fnTowerMcFlyTeam(), false, function(){fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);});
					//$.ajax_ex(false, fnTowerMcFlyTeam().split(fnGetConnector())[0], {}, function(data) {});
				}
				//fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id, {}, function(data) {});
				fnRedirect('/en/'+platform+'/tower/bossResult');
				
				//fnRedirect('/en/'+platform+'/tower/mission');
				/*setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 1000);
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);
				clearInterval(missionInterval);*/
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
				$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : fnTowerTrap(), 'sample_trap':0, 'challenge_trap' : 5, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {});
				/*$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {});
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 1000);
				setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);*/
				/*EfectMng.push('cageSelect', {
				grade : result.payload.process.cage,
				item : result.payload.event.cage.item,
				sampleTrap: result.payload.sampleTrap,
				player: result.payload.player
				});*/
			}
			if (result.payload.process.fortitude) {
				clearInterval(missionInterval);
				fnRedirect('/en/'+platform+'/tower/fortitudeAppeared');
				return;
			}
			if (isShadow) EfectMng.push('shadowHide', null);
			if (result.payload.process.clear) {
			  if (!mission.is_boss) {

			  }
			  else {
				clearInterval(missionInterval);
				//fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id, {}, function(data) {});
				fnRedirect('/en/'+platform+'/tower/bossResult');				
				
				//setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);}, 1000);
				//setTimeout(function(){$.redirect('/en/'+platform+'/tower/mission');}, 8000);// if failed to redirect, then reload mission screen
				
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
		$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : fnTowerTrap(), 'sample_trap':0, 'challenge_trap' : 5, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {});
		//$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) { 	});
		//EfectMng.push('reload', null);	
	}
}

function fnTowerFortitudeAppeared() {
	if ($("div:contains('It hasn\'t noticed you at all')").length) {
		$.ajax_ex(false, '/en/'+platform+'/tower/ajaxFortitudeChoose', {'choice':1, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {			
			if (result.status == 0 && result.payload.result == 0) {
				$('#tap-area').hide();				
			}
		});
		fnRedirect('/en/'+platform+'/tower/mission');
	}
	else if ($("div:contains('trying to open the Summon gate')").length) {
		$.ajax_ex(false, '/en/'+platform+'/tower/ajaxFortitudeChoose', {'choice':1, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {			
			if (result.status == 0 && result.payload.result == 0) {
				$('#tap-area').hide();				
			}
		});
		fnRedirect('/en/'+platform+'/tower/mission');
	}
	else if ($("div:contains('It is surrounded by an anti')").length) {
		$.ajax_ex(false, '/en/'+platform+'/tower/ajaxFortitudeChoose', {'choice':1, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {			
			if (result.status == 0 && result.payload.result == 0) {
				$('#tap-area').hide();				
			}
		});
		fnRedirect('/en/'+platform+'/tower/mission');
	}	
	else {
		$.ajax_ex(false, '/en/'+platform+'/tower/ajaxFortitudeChoose', {'choice':2, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {			
			if (result.status == 0 && result.payload.result == 0) {
				$('#tap-area').hide();	
				fnRedirect('/en/'+platform+'/tower/mission');
			}
		});
		fnRedirect('/en/'+platform+'/tower/mission');
	}
	fnRedirect('/en/'+platform+'/tower/mission');
}

function fnTowerStory() {
	fnRedirect('/en/'+platform+'/tower/mission?intentional=1');
}

function fnTowerMission() {
	$('#fade').hide();
	$('#tips').hide();
    $('#big_tips').hide();
	fnFixMissionProcess();
	if (document.getElementById('cage-select').style.display != "none") {
		$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : fnTowerTrap(), 'sample_trap':0, 'challenge_trap' : 5, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {});
		//$.ajax_ex(false, '/en/'+platform+'/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {});	
	}

	if (fnGetGrindingSpeed() == -1) {
		// user press by himself, dont automate
		return;
	}
	if (!mission.is_boss) {
		if (typeof mission.boss_battle_rnd && mission.boss_battle_rnd > 0) {
			if (fnTowerMcFlyTeam() != null && fnTowerProgTeam() != null) {
				fnSetIsBattlingMcFly(1);
				fnDeckChangeAdvance(fnTowerMcFlyTeam(), false, function(){fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');});
				//$.ajax_ex(false, fnTowerMcFlyTeam().split(fnGetConnector())[0], {}, function(data) {});
			}
			//setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');}, 1000);
			//setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');}, 8000);
			$.ajax_ex(false, '/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003', {}, function(data) {});
			fnRedirect('/en/'+platform+'/tower/bossResult');
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
		if (fnTowerMcFlyTeam() != null && fnTowerProgTeam() != null) {
			fnSetIsBattlingMcFly(1);
			fnDeckChangeAdvance(fnTowerMcFlyTeam(), false, function(){fnRedirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id+'&bossType=1003');});
			//$.ajax_ex(false, fnTowerMcFlyTeam().split(fnGetConnector())[0], {}, function(data) {});
		}
		//setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);}, 1000);
		//setTimeout(function(){$.redirect('/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id);}, 8000);
		$.ajax_ex(false, '/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id, {}, function(data) {});
		fnRedirect('/en/'+platform+'/tower/bossResult');		
		
		//document.location='/en/'+platform+'/battle/battleact?tower=1&aid='+areaMaster.area_id;
	}
}

function fnTower() {
	if (document.getElementById('div-btn-system') != null) {
		//fnRedirect('/en/'+platform+'/tower/subpoena');
		$.ajax_ex(false, '/en/'+platform+'/tower/ajaxSubpoena', {'__hash': (new Date()).getTime()}, function(data) {});
		fnRedirect('/en/'+platform+'/tower/mission');
		return;
	}
	if (document.referrer.indexOf('/battle/battle') >= 0 || document.referrer.indexOf('/tower/boss') >=0 || document.referrer.indexOf('/tower/subpoena') >=0) {
		fnRedirect('/en/'+platform+'/tower/mission');
	}
}

var red_flower_count = 0;
var red_flower_target = 0;
var red_flower_confirm_id = 0;

function fnTowerCollectRedFlower() {
	if (parseInt(player.power,10) > 0) {
		$.ajax_ex(false, '/en/'+platform+'/mission/process?area_id=1&mission=0&confirm_id='+red_flower_confirm_id, {}, function(result2) {
			red_flower_confirm_id = result2.payload.confirm_id;
			if (result2.payload.event && result2.payload.event.treasure && parseInt(result2.payload.event.treasure.item_id,10)==4002) {
				red_flower_count++;
				if (red_flower_count >= red_flower_target) {
					fnSellAllSellableMonsters();
					fnRedirect('/en/'+platform+'/tower/friendCage');
				}
			}
		})
		player.power = parseInt(player.power,10)-1;
		setTimeout(fnTowerCollectRedFlower,Math.max(500,fnGetGrindingSpeed()));
		fnGrowl('Picking Flower. Energy Left:' + player.power);
	}
	else {
		setTimeout(fnAutoTrade,180000,'/en/'+platform+'/tower/friendCage');
		fnSellAllSellableMonsters();
		if (window.location.pathname === '/en/'+platform+'/home' || (new Date()).getTime() - fnOrganizeGiftBoxTimer() > organizeGiftBoxInterval) {
			fnSetOrganizeGiftBoxTimer((new Date()).getTime(), 0);
			fnPresentBoxOrganize();
		}
		else {
			fnSyncServer();
		}
	}
}

function fnTowerCatchFriendCage(pType, pCount) {
	// using 4002 red flower
	$.ajax_ex(false, '/en/'+platform+'/tower/ajaxUseFriendCage', {api:'json','item_id':4002,'cage_type':pType,'__hash':('' + (new Date()).getTime())}, function(result) {
			if (result.status==130) { // pick red flower
				fnTowerCatchFriendCage = null;//fnRedirect('/en/'+platform+'/tower');
				red_flower_count = 0;
				red_flower_target = pCount;
				$.ajax({
					type: "GET",
					url: '/en/'+platform+'/mission?area=1',
					dataType: "html",
					success: function(html){
						$('#failer').html(html);
						red_flower_confirm_id = confirm_id;
						fnTowerCollectRedFlower();
					}
				});		
			}
		});
	if (pCount > 0) {
		setTimeout(fnTowerCatchFriendCage,Math.max(500,fnGetGrindingSpeed()),pType,pCount-1);
	}
	else {
		fnRedirect('/en/'+platform+'/tower/friendCage');
	}
	fnGrowl('Catching Type:' + pType + ', Index:'+pCount);
}

function fnTowerFriendCage()
{
	if (parseInt($("div[cage_id='5']").eq(0).attr('rest'),10) > 0) {
		fnTowerCatchFriendCage(5, parseInt($("div[cage_id='5']").eq(0).attr('rest'),10));
		return;
	}
	else if (parseInt(player.power,10) >= 20 && fnAutoDrink() == 0) {
		fnRedirect('/en/'+platform+'/tower/mission');
	}
	if (parseInt($("div[cage_id='3']").eq(0).attr('rest'),10) > 0) {
		//fnTowerCatchFriendCage(3, parseInt($("div[cage_id='3']").eq(0).attr('rest'),10));
	}
}

function fnTowerSummon() {
	fnRedirect('/en/'+platform+'/tower/mission');
}

// tower boss result

function fnTowerBossResult() {
	if (fnIsBattlingMcFly() == 1 && fnTowerMcFlyTeam() != null && fnTowerProgTeam() != null) {
		fnSetIsBattlingMcFly(0);
		fnDeckChangeAdvance(fnTowerProgTeam(), false, function(){});
		//$.ajax_ex(false, fnTowerProgTeam().split(fnGetConnector())[0], {}, function(data) {	});
	}
	$.ajax_ex(false, '/en/'+platform+'/tower/bossGetResources', {choice : 1, '__hash' : ('' + (new Date()).getTime()) },function(result) {
		if (result.status == 101) {
			fnRedirect('/en/'+platform+'/tower/mission');
		} else if (result.payload.resources.foundType != null && result.payload.resources.foundType==10 && result.payload.resResult.items[result.payload.itemMaster.item_id].collected_count==6) { 
			fnRedirect('/en/'+platform+'/tower');
			//fnRedirect('/en/'+platform+'/tower/subpoena');// summon directly?
			//$.ajax_ex(false, '/en/ios/tower/ajaxSubpoena', {'__hash': (new Date()).getTime()}, function(data) {});
			//fnRedirect('/en/'+platform+'/tower/mission');
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
		$.ajax_ex(false, '/en/ios/forkroad/ajax_process', {
			'__hash':  (new Date()).getTime(),
			confirm_id: confirmId,
		}, function(result) {
			// pathetic status 6, have to refresh.
			if (result.status == 6) {
				clearInterval(missionInterval);
				fnRedirect('/en/'+platform+'/forkroad/mission');
				return;
			}
			else if (result.status == 4) {
				// switch to battle
				if (fnEventMissionTeam() != null && fnEventBattleTeam() != null && fnEventMissionTeam() != 0 && fnEventBattleTeam() != 0 && parseInt(player.bp, 10) >= 1) {
					clearInterval(missionInterval);
					fnDeckChangeAdvance(fnEventBattleTeam(), false, function(){fnRedirect('/en/'+platform+'/forkroad/list');});
					fnRedirect('/en/'+platform+'/forkroad/list');
					return;
				}
			
				//phase_no_power(result.payload);
				confirmId = result.payload.confirm_id;
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
					clearInterval(missionInterval);
					fnRedirect('/en/'+platform+'/forkroad');					
				}				
				return;
			} else if(result.status != 0) {
				if (result.status < 0) {
					//$.redirect('/en/ios/forkroad');
					return;
				}
				return;
			}
			confirmId = result.payload.confirm_id;


			// é²æã«åãããä½ç½®ã«å¤æ´
			//var m_area = missionAreaMaster[result.payload.mission.unique_id];
			//scrollTemplate.setPosition((320 - m_area.pos_x) - (320 / 2) - 30, (200 - m_area.pos_y) - (200 / 2) - 30);

			player = result.payload.player;
			refreshStatus();
			setFragmentParam(result.payload.mission, result.payload.event.fragment);

			mission = result.payload.mission;
			event   = result.payload.event;
			mini_potion = result.payload.mini_potion;
			//loop_count = result.payload.loop_count ;
			event.phase = new Array();

			//event.phase.push('default_resource');

			if(result.payload.process.fever_start)   event.phase.push('fever_start');
			//if(event.fragment.fragment_plus > 0)     event.phase.push('get_fragment');
			if(event.fragment.fragment_count == 10) {
				if(typeof(result.payload.event.event_info.params) != 'undefined' && 255 == result.payload.event.event_info.params.type) {
					if ((parseInt(fnForkRoadStay(),10) == 1) || (parseInt(fnForkRoadStay(),10) == 2) || (parseInt(fnForkRoadStay(),10) == 3)) {
						all_hide();
						if (parseInt(fnForkRoadStay(),10) == 1) {//just grind lap
							return;
						}
						else if (parseInt(fnForkRoadStay(),10) == 2) {// grind lap and earn set
							//call ajax instead of redirect
							$.ajax_ex(false, '/en/'+platform+'/forkroad/mileStone?__hash=' + (new Date().getTime()), {}, function(data) {});
							return;
						}
						else if (parseInt(fnForkRoadStay(),10) == 3) {// grind lap and pick up lap reward and earn set
							clearInterval(missionInterval);
							$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', {}, function(data) {
								$.ajax_ex(false, '/en/'+platform+'/present/receive?bid='+data.payload.boxes[0].boxed_id, {}, function(data) {
									fnRedirect('/en/'+platform+'/forkroad/mileStone?__hash=' + (new Date().getTime()));		
								});		
							});							
							return;
						}
					}
					else {
						clearInterval(missionInterval);
						fnRedirect('/en/'+platform+'/forkroad/goalReward');						
						return;
					}
				}
				else {
					//clearInterval(missionInterval);
					//call ajax instead of redirect
					$.ajax_ex(false, '/en/'+platform+'/forkroad/mileStone?__hash=' + (new Date().getTime()), {}, function(data) {});
					return;
				}
			}

			//ã¤ãã³ãã®å¤å®
			if(typeof(result.payload.event.event_info.params) != 'undefined') {
				if(255 == result.payload.event.event_info.params.type){
					if ((parseInt(fnForkRoadStay(),10) == 1) || (parseInt(fnForkRoadStay(),10) == 2) || (parseInt(fnForkRoadStay(),10) == 3)) {
						return;
					}
					else {
						clearInterval(missionInterval);
						fnRedirect('/en/'+platform+'/forkroad/goalReward');						
						return;
					}
				}
				if(666 == result.payload.event.event_info.params.type){
					clearInterval(missionInterval);
					fnRedirect('/en/'+platform+'/forkroad/drawACard');	
					return;
				}
			}

			//åå²é¸æã®å¤å®
			if(result.payload.process.fork_flag) {
				clearInterval(missionInterval);
				$.ajax_ex(false, '/en/'+platform+'/forkroad/ajax_area_select?fflag='+((parseInt(player.deck_total_attack,10) < 50000)?1:2), {}, function(result) {
					fnForkRoadAutoGrind();	
				});
				return;
			}

			//åå²çµäºã®å¤å®
			if(result.payload.event.event_info.fork == 64 && result.payload.event.clear) {
				event.phase.push('fork_end');
				//event = eventManager(event);
				//clearInterval(missionInterval);
				//return;
			}

			//ç§»å
			if(event.clear)                          event.phase.push('mission_move');

			//ã«ã«ãã«ã¼ã
			if(typeof(result.payload.event.event_info.params) != 'undefined') {
				if(666 == result.payload.event.event_info.params.type){
					clearInterval(missionInterval);
					fnRedirect('/en/'+platform+'/forkroad/drawACard');					
					return;
				}
			}

			//ã©ã³ãã ãã¹ã¨ã®é­éå¤å®
			if(event.enemy_encount) {
				//clearInterval(missionInterval);
				//fnRedirect('/en/'+platform+'/battle/battleact?event=4&aid='+area_id+'&skip=1');	
				if(typeof(result.payload.event.event_info.params) != 'undefined' && 255 == result.payload.event.event_info.params.type) {
				}
				else {
					//call ajax instead of redirect
					$.ajax_ex(false, '/en/'+platform+'/battle/battleact?event=4&aid='+area_id+'&skip=1', {}, function(data) {});
				}
				return;
			}
			mission_update();

			event = eventManager(event);
		});
	}
}

function fnForkRoadAutoGrind() {
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

function fnForkRoadMission() {
	fnFixForkRoadMissionProcess();
	fnForkRoadAutoGrind();	
}

function fnForkRoad() {
	if ($('#fragments_complete').is(":visible")) {
		fnRedirect('/en/'+platform+'/forkroad/mileStone?__hash=' + (new Date().getTime()));
		return;
	}
	
	if (document.referrer.indexOf('battleResult') >= 0) {
		if ($('#unlock_comment').is(":visible")) {
			fnRedirect('/en/'+platform+'/forkroad/mission?');
		}
	}
	fnForkRoadRedirection();
	var divTag = document.createElement("div");
	divTag.id = "frDiv";
	
	var autoSetFormationHTML = '<br/><input type="button" value="Auto Set Event Team" onClick="fnAutoSetEventFormation();fnRedirect(\'/en/'+platform+'/forkroad\');"><br/><br/>';

	var aFormationArray = fnGetFormationArray();
	var missionTeamSelectorHTML =  'Mission Team:<select name="boss" onchange="fnSetEventMissionTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Mission Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnEventMissionTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		missionTeamSelectorHTML+='<option ' + (fnEventMissionTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	missionTeamSelectorHTML+='</select><br/>'; 

	var battleTeamSelectorHTML =  'Battle Team<select name="prog" onchange="fnSetEventBattleTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Battle Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonProgTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		battleTeamSelectorHTML+='<option ' + (fnEventBattleTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	battleTeamSelectorHTML+='</select><br/>'; 
	
	var bpSelectorHTML =  'Auto BP<select name="autoBP" onchange="fnSetAutoBP(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto BP:\'+this.options[this.options.selectedIndex].text);"><option ' + (parseInt(fnAutoBP(),10)==0?'selected':'') + ' value="0">Auto Off</option><option ' + (parseInt(fnAutoBP(),10)==3003?'selected':'') + ' value="3003">Real BP</option><option ' + (parseInt(fnAutoBP(),10)==3019?'selected':'') + ' value="3019">My BP</option><option ' + (parseInt(fnAutoBP(),10)==3043?'selected':'') + ' value="3043">My 100 BP</option><option ' + (parseInt(fnAutoBP(),10)==3011?'selected':'') + ' value="3011">Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3020?'selected':'') + ' value="3020">My Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3024?'selected':'') + ' value="3024">My 100 Elixir</option></select><br/>';	
	
	divTag.innerHTML = autoSetFormationHTML + missionTeamSelectorHTML + battleTeamSelectorHTML + bpSelectorHTML;
	document.body.appendChild(divTag);
  
  /*
	var divTag = document.createElement("div");
	divTag.id = "frDiv";

	var aFormationArray = fnGetFormationArray();
	var missionTeamSelectorHTML =  'Mission Team:<select name="boss" onchange="fnSetEventMissionTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Mission Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnEventMissionTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		missionTeamSelectorHTML+='<option ' + (fnEventMissionTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	missionTeamSelectorHTML+='</select><br/>'; 

	var battleTeamSelectorHTML =  'Battle Team<select name="prog" onchange="fnSetEventBattleTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Battle Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonProgTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		battleTeamSelectorHTML+='<option ' + (fnEventBattleTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	battleTeamSelectorHTML+='</select><br/>'; 
	
	var bpSelectorHTML =  'Auto BP<select name="autoBP" onchange="fnSetAutoBP(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto BP:\'+this.options[this.options.selectedIndex].text);"><option ' + (parseInt(fnAutoBP(),10)==0?'selected':'') + ' value="0">Auto Off</option><option ' + (parseInt(fnAutoBP(),10)==3003?'selected':'') + ' value="3003">Real BP</option><option ' + (parseInt(fnAutoBP(),10)==3019?'selected':'') + ' value="3019">My BP</option><option ' + (parseInt(fnAutoBP(),10)==3043?'selected':'') + ' value="3043">My 100 BP</option><option ' + (parseInt(fnAutoBP(),10)==3011?'selected':'') + ' value="3011">Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3020?'selected':'') + ' value="3020">My Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3024?'selected':'') + ' value="3024">My 100 Elixir</option></select><br/>';	
	
	divTag.innerHTML = missionTeamSelectorHTML + battleTeamSelectorHTML + bpSelectorHTML;
	document.body.appendChild(divTag);
	
	if (parseInt(player.bp, 10) <= 1) {
		fnPresentBoxReceiveAllItems();
	}
  */
}

function fnForkRoadMileStone() {

}

function fnForkRoadItemComplete() {	
	if (fnEventMissionTeam() != null && fnEventMissionTeam() != 0 && parseInt(player.deck_total_bp,10) == 1) {
		// change to high bp team to look legit, and do mission if have power
		fnDeckChangeAdvance(fnEventMissionTeam(), false, function(){});
	}
	$.ajax_ex(false, '/en/'+platform+'/battle/battleact?event=4&aid=100', {}, function(data) {});
	fnRedirect('/en/'+platform+'/forkroad/bossResult');
	
// commented because we need to grind faster
	//$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', {}, function(data) {
		//$.ajax_ex(false, '/en/'+platform+'/present/receive?bid='+data.payload.boxes[0].boxed_id, {}, function(data) {
			//fnForkRoadRedirection();		
		//});		
	//});
	//setInterval(fnRedirect, 60000, '/en/'+platform+'/forkroad');
}

//var forkRoadBattleList=['2105497160','2376495127','1707996294', '2274393881', '2582019965'];
var forkRoadBattleList=['2274393881', '2582019965'];
function fnForkRoadBattleAttempt() {
	if (parseInt(player.bp,10) >= 1) {
		player.bp = parseInt(player.bp,10)-parseInt(player.deck_total_bp,10);
		fnRedirect('/en/'+platform+'/battle/battleact?pid='+forkRoadBattleList[Math.floor(Math.random()*forkRoadBattleList.length)]+'&skip=1&event=5');
		return true;
	}
	else if (parseInt(fnAutoBP(),10) > 0) {
		$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:fnAutoBP()}, function(data) {
			if (parseInt(data.status,10) >= 0) {
				fnRedirect('/en/'+platform+'/battle/battleact?pid='+forkRoadBattleList[Math.floor(Math.random()*forkRoadBattleList.length)]+'&skip=1&event=5');
			}
			else {
				fnSetAutoBP(0);
				return false;
			}
		});
		return true;
	}
	return false;
}

function fnForkRoadRedirection() {
	if (fnGetGrindingSpeed() == -1) {
		//user grind by himself, dont auto forward
		return;
	}
	if (parseInt(player.deck_total_bp,10) == 1) {
		if (fnForkRoadBattleAttempt()) {	
			return;
		}
	}
	if (fnEventBattleTeam() != null && fnEventBattleTeam() != 0) {
		// if have enough bp, change to battle team to battle;
		if (parseInt(player.deck_total_bp,10) > 1 && parseInt(player.bp,10) >= 10) {
			fnDeckChangeAdvance(fnEventBattleTeam(), false, function(){});
			//fnRedirect('/en/'+platform+'/forkroad');
			for (i=1;i<=5;i++) {
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid='+forkRoadBattleList[Math.floor(Math.random()*forkRoadBattleList.length)]+'&skip=1&event=5', {}, function(data) {});				
			}
			if (!fnForkRoadBattleAttempt()) {
				fnRedirect('/en/'+platform+'/forkroad');
			}
			return;
		}
	}
	if (fnEventMissionTeam() != null && fnEventMissionTeam() != 0 && parseInt(player.deck_total_bp,10) == 1) {
		// change to high bp team to look legit, and do mission if have power
		fnDeckChangeAdvance(fnEventMissionTeam(), false, function(){});
	}
	if (parseInt(player.power, 10) >= 20) {
		fnRedirect('/en/'+platform+'/forkroad/mission');
		return;
	}
	if (window.location.pathname === '/en/'+platform+'/forkroad') {
		setInterval(fnRedirect, 60000, '/en/'+platform+'/forkroad');
	}
	else if (fnAutoDrink() == 1) {
		fnForkRoadAutoDrink('/en/'+platform+'/forkroad');
	}
	else {
		fnRedirect('/en/'+platform+'/forkroad');
	}
}

function fnForkRoadAutoDrink(pRedirect) {
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var items = data.payload.items;
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3022) { // consume my 100 energy
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect(pRedirect);
				return;
			}
		}
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3018) { // consume my energy
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect(pRedirect);
				return;
			}
		}
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3001) { // consum energy
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect(pRedirect);
				return;
			}
		}
		
		/*
		if (fnEventBattleTeam() != null && fnEventBattleTeam() != 0) {
			for (var j=0;j<items.length;j++) {
				if (items[j].item_id == 3024) { // consume my 100 elixir
					$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
					fnRedirect(pRedirect);
					return;
				}
			}
			for (var j=0;j<items.length;j++) {
				if (items[j].item_id == 3020) { // consume my elixir
					$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
					fnRedirect(pRedirect);
					return;
				}
			}
		}
		if (fnEventBattleTeam() != null && fnEventBattleTeam() != 0) {
			for (var j=0;j<items.length;j++) {
				if (items[j].item_id == 3011) { // consum elixir
					$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
					fnRedirect(pRedirect);
					return;
				}
			}
		}*/
		
		fnRedirect(pRedirect);
	});	
}

function fnForkRoadDrawACard() {
	if ($('#messages-area a.use_one_more_button').is(":visible")) {
		$.getJSON('/en/'+platform+'/forkroad/ajaxUseOneMoreChance', null,function(data) {
			if (data.status != 0) {
				fnRedirect('/en/'+platform+'/forkroad');
				return;
			}

			fnRedirect('/en/'+platform+'/forkroad/drawACard');
		});
		return;
	}
	$.ajax_ex(false, '/en/'+platform+'/forkroad/ajaxDrawACard', {}, function(data) {
		/*$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', {}, function(data2) {
			$.ajax_ex(false, '/en/'+platform+'/present/receive?bid='+data2.payload.boxes[0].boxed_id, {}, function(data3) {
			});		
		});*/
	});
	fnRedirect('/en/'+platform+'/forkroad/mission?');
}

function fnForkRoadList() {	
	fnForkRoadBattleAttempt();
}

function fnForkRoadComplete() {
	fnRedirect('/en/'+platform+'/forkroad/subpoena?__hash' + (new Date().getTime()));
}

function fnForkRoadBattleResult() {
	if (document.getElementById('result_collect') != null) { 
		//fnRedirect('/en/'+platform+'/forkroad/mileStone?__hash=' + (new Date().getTime()));
		//call ajax instead of redirect
		//$.ajax_ex(false, '/en/'+platform+'/forkroad/mileStone?__hash=' + (new Date().getTime()), {}, function(data) {});
		fnRedirect('/en/'+platform+'/forkroad/itemComplete');
	}
	else if (document.getElementById('result_summon') != null) {
		fnRedirect('/en/'+platform+'/forkroad/subpoena?__hash' + (new Date().getTime()));
	}
	else {
		if (document.referrer.indexOf('battle/battle') >= 0) {
			fnRedirect('/en/'+platform+'/forkroad/mission?');
		}
		else {
			fnForkRoadRedirection();
		}
	}
}

function fnForkRoadBossResult() {
	if (document.referrer.indexOf('battle/battle') >= 0) {
		fnRedirect('/en/'+platform+'/forkroad/mission?');
	}
	else {
		fnForkRoadRedirection();
	}
}

function fnForkRoadSummon() {
	fnRedirect('/en/'+platform+'/forkroad/list');
}

// cemetery

function fnAutoSetEventFormation() {
	$.ajax_ex(false, '/en/'+platform+'/fusion/list?types=0&sort=14&api=json', {}, function(result) {
		var bp1card = 0;
		var bp1cardMid = 0;
		var bp1cardAttack = 0;
		var aFormationArray = fnGetFormationArray();
		var finalStr = "";
		var result_array = {"l1":0, "l2":0, "l3":0, "l4":0, "l5":0, "l1mid":0, "l2mid":0, "l3mid":0, "l4mid":0, "l5mid":0};
		for (var i=0;i<result.payload.length;i++) {
			if (parseInt(result.payload[i].bp,10) == 1 && parseInt(result.payload[i].attack,10) > bp1cardAttack) {
				bp1card = parseInt(result.payload[i].unique_no,10);
				bp1cardAttack = parseInt(result.payload[i].attack,10);
				bp1cardMid = parseInt(result.payload[i].monster_id,10);
			}
		}
		if (bp1card == 0) {
			alert('No 1 bp card. Failed to auto set.');
			return;
		}
		
		finalStr = '.' + fnGetConnector() + "Battle" + fnGetConnector() + bp1card + ":" + 0 + ":" + 0 + ":" + 0 + ":" + 0 + fnGetConnector() + bp1cardMid + ":" + 0 + ":" + 0 + ":" + 0 + ":" + 0;
		if (!fnArrayHasItem(aFormationArray, finalStr)) {
			aFormationArray.splice(0,0,finalStr);
		}
		fnSetEventBattleTeam(finalStr);
		
		var totalBP = 0;
		// auto formation
		for (var j=0;j<5;j++) {
			for (var i=0;i<result.payload.length;i++) {
				var usedInTeam = false;
				for (var k=0;k<j;k++) {
					if (parseInt(result.payload[i].unique_no,10) == result_array['l'+(k+1)]) {
						usedInTeam = true;
					}
				}
				if (!usedInTeam) {
					if (result_array['l'+(j+1)] == 0) {
						if (totalBP + parseInt(result.payload[i].bp,10) <= parseInt(player.bp_max,10)) { 
							result_array['l'+(j+1)] = parseInt(result.payload[i].unique_no,10);
							result_array['l'+(j+1)+'mid'] = parseInt(result.payload[i].monster_id,10);
							result_array['l'+(j+1)+'attack'] = parseInt(result.payload[i].attack,10);
							result_array['l'+(j+1)+'bp'] = parseInt(result.payload[i].bp,10);
							totalBP += parseInt(result.payload[i].bp,10);
						}
					}
					else {
						if (parseInt(result.payload[i].attack,10) > parseInt(result_array['l'+(j+1)+'attack'],10)) {
							if (totalBP - parseInt(result_array['l'+(j+1)+'bp'],10) + parseInt(result.payload[i].bp,10) <= parseInt(player.bp_max,10)) { 
								totalBP -= result_array['l'+(j+1)+'bp'];
								result_array['l'+(j+1)] = parseInt(result.payload[i].unique_no,10);
								result_array['l'+(j+1)+'mid'] = parseInt(result.payload[i].monster_id,10);
								result_array['l'+(j+1)+'attack'] = parseInt(result.payload[i].attack,10);
								result_array['l'+(j+1)+'bp'] = parseInt(result.payload[i].bp,10);
								totalBP += parseInt(result.payload[i].bp,10);
							}
						}
					}
				}
			}
		}
		
		if (result_array['l1'] == 0) {	
			alert('No replacing monster');
			return;
		}
		
		$.ajax_ex(false, '/en/'+platform+'/deck2/operationNoChange?deck_number=0&operationNo=4&api=json', {}, function(result) {});
		
		
		finalStr = '.' + fnGetConnector() + "Mission" + fnGetConnector() + result_array['l1'] + ":" + result_array['l2'] + ":" + result_array['l3'] + ":" + result_array['l4'] + ":" + result_array['l5'] + fnGetConnector() + result_array['l1mid'] + ":" + result_array['l2mid'] + ":" + result_array['l3mid'] + ":" + result_array['l4mid'] + ":" + result_array['l5mid'];
		if (!fnArrayHasItem(aFormationArray, finalStr)) {
			aFormationArray.splice(0,0,finalStr);
		}
		var aFormationArrayText = aFormationArray.join(fnGetSeparator());
		fnSetCookie(formationString,aFormationArrayText);
		fnSetEventMissionTeam(finalStr);
	});
}

function fnCemetery() {
	var divTag = document.createElement("div");
	divTag.id = "frDiv";
	
	var autoSetFormationHTML = '<br/><input type="button" value="Auto Set Event Team" onClick="fnAutoSetEventFormation();fnRedirect(\'/en/'+platform+'/cemetery\');"><br/><br/>';

	var aFormationArray = fnGetFormationArray();
	var missionTeamSelectorHTML =  'Mission Team:<select name="boss" onchange="fnSetEventMissionTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Mission Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnEventMissionTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		missionTeamSelectorHTML+='<option ' + (fnEventMissionTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	missionTeamSelectorHTML+='</select><br/>'; 

	var battleTeamSelectorHTML =  'Battle Team<select name="prog" onchange="fnSetEventBattleTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Battle Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonProgTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		battleTeamSelectorHTML+='<option ' + (fnEventBattleTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	battleTeamSelectorHTML+='</select><br/>'; 
	
	var bpSelectorHTML =  'Auto BP<select name="autoBP" onchange="fnSetAutoBP(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto BP:\'+this.options[this.options.selectedIndex].text);"><option ' + (parseInt(fnAutoBP(),10)==0?'selected':'') + ' value="0">Auto Off</option><option ' + (parseInt(fnAutoBP(),10)==3003?'selected':'') + ' value="3003">Real BP</option><option ' + (parseInt(fnAutoBP(),10)==3019?'selected':'') + ' value="3019">My BP</option><option ' + (parseInt(fnAutoBP(),10)==3043?'selected':'') + ' value="3043">My 100 BP</option><option ' + (parseInt(fnAutoBP(),10)==3011?'selected':'') + ' value="3011">Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3020?'selected':'') + ' value="3020">My Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3024?'selected':'') + ' value="3024">My 100 Elixir</option></select><br/>';	
	
	divTag.innerHTML = autoSetFormationHTML + missionTeamSelectorHTML + battleTeamSelectorHTML + bpSelectorHTML;
	document.body.appendChild(divTag);
	
	if (parseInt(player.bp, 10) <= 1) {
		fnPresentBoxReceiveAllItems();
	}
}

function fnCemeteryMission() {
	if (parseInt(player.deck_total_bp, 10) > 1 && fnEventMissionTeam() != '' && fnEventBattleTeam() != '' && parseInt(player.bp, 10) >= 10) {
		fnDeckChangeAdvance(fnEventBattleTeam(), false, function(){fnRedirect('/en/'+platform+'/cemetery/mission');});
		fnRedirect('/en/'+platform+'/cemetery/mission');
		return;
	}
	var maxText = false;
	var sinsOrb = parseInt($('.bottle_1').find('.orb_text_value').eq(0).html(),10);
	var rancorOrb = parseInt($('.bottle_2').find('.orb_text_value').eq(0).html(),10);
	var tyrannyOrb = parseInt($('.bottle_3').find('.orb_text_value').eq(0).html(),10);
	if (isNaN(sinsOrb)) {
		sinsOrb = parseInt($('.bottle_1').find('.orb_text_value_max').eq(0).html(),10);
		maxText = true;
	}
	if (isNaN(rancorOrb)) {
		rancorOrb = parseInt($('.bottle_2').find('.orb_text_value_max').eq(0).html(),10);
		maxText = true;
	}
	if (isNaN(tyrannyOrb)) {
		tyrannyOrb = parseInt($('.bottle_3').find('.orb_text_value_max').eq(0).html(),10);
		maxText = true;
	}
	if (parseInt(player.deck_total_bp, 10) == 1 && parseInt(player.bp, 10) >= 1 && fnGetGrindingSpeed() != -1) {		
		// check sins orb
		if ((sinsOrb < parseInt($('.bottle_1').find('.orb_text_base').eq(0).html().substr(2),10)) || (sinsOrb <= rancorOrb && sinsOrb <= tyrannyOrb)) {
			if (parseInt(player.next_exp,10) - parseInt(player.now_exp,10) <= parseInt(player.bp,10)*2) {
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid='+sinsLv3CemeteryBattleList[Math.floor(Math.random()*sinsLv3CemeteryBattleList.length)]+'&skip=1&event=6', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				player.now_exp = parseInt(player.now_exp,10) + 12;
			}
			else {
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid='+sinsCemeteryBattleList[Math.floor(Math.random()*sinsCemeteryBattleList.length)]+'&skip=1&event=6', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				player.now_exp = parseInt(player.now_exp,10) + 2;
			}
			$('.bottle_1').find(maxText?'.orb_text_value_max':'.orb_text_value').eq(0).html(sinsOrb+10);
			//fnRedirect('/en/'+platform+'/cemetery/mission');
		}
		// check rancor orb
		else if ((rancorOrb < parseInt($('.bottle_2').find('.orb_text_base').eq(0).html().substr(2),10)) || rancorOrb <= tyrannyOrb) {
			if (parseInt(player.next_exp,10) - parseInt(player.now_exp,10) <= parseInt(player.bp,10)*2) {
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid='+rancorLv3CemeteryBattleList[Math.floor(Math.random()*rancorLv3CemeteryBattleList.length)]+'&skip=1&event=6', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				player.now_exp = parseInt(player.now_exp,10) + 12;
			}
			else {
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid='+rancorCemeteryBattleList[Math.floor(Math.random()*rancorCemeteryBattleList.length)]+'&skip=1&event=6', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				player.now_exp = parseInt(player.now_exp,10) + 2;
			}
			$('.bottle_2').find(maxText?'.orb_text_value_max':'.orb_text_value').eq(0).html(rancorOrb+10);
			//fnRedirect('/en/'+platform+'/cemetery/mission');
		}
		// check tyranny orb
		else if (true || tyrannyOrb < parseInt($('.bottle_3').find('.orb_text_base').eq(0).html().substr(2),10)) {
			if (parseInt(player.next_exp,10) - parseInt(player.now_exp,10) <= parseInt(player.bp,10)*2) {
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid='+tyrannyLv3CemeteryBattleList[Math.floor(Math.random()*tyrannyLv3CemeteryBattleList.length)]+'&skip=1&event=6', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				player.now_exp = parseInt(player.now_exp,10) + 12;
			}
			else {
				$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid='+tyrannyCemeteryBattleList[Math.floor(Math.random()*tyrannyCemeteryBattleList.length)]+'&skip=1&event=6', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				player.now_exp = parseInt(player.now_exp,10) + 2;
			}
			$('.bottle_3').find(maxText?'.orb_text_value_max':'.orb_text_value').eq(0).html(tyrannyOrb+10);
			//fnRedirect('/en/'+platform+'/cemetery/mission');
		}
		player.bp = parseInt(player.bp, 10)  - 1;
		$('#misc_status_bp').text(player.bp);
		if (parseInt(player.bp, 10) <= 0 || parseInt(player.next_exp,10) <= parseInt(player.now_exp,10)) {
			fnRedirect('/en/'+platform+'/cemetery/mission');
		}
		else {
			setTimeout(fnCemeteryMission, fnGetGrindingSpeed());
		}
		return;
	}
	
	if (parseInt(player.deck_total_bp, 10) == 1 && fnEventMissionTeam() != '') {
		fnDeckChangeAdvance(fnEventMissionTeam(), false, function(){fnRedirect('/en/'+platform+'/cemetery/mission');});
		fnRedirect('/en/'+platform+'/cemetery/mission');
		return;
	}
	
	if (parseInt(missionMaster.is_gate,10)) {
		if (parseInt(missionMaster.area_id,10) <= 50 && (sinsOrb >= parseInt($('.bottle_1').find('.orb_text_base').eq(0).html().substr(2),10) || rancorOrb >= parseInt($('.bottle_2').find('.orb_text_base').eq(0).html().substr(2),10) || tyrannyOrb >= parseInt($('.bottle_3').find('.orb_text_base').eq(0).html().substr(2),10))) {
			fnRedirect('/en/'+platform+'/cemetery/openGate?open_gate=' + mission.current_mission_id);
		}
		else if (parseInt(missionMaster.area_id,10) >= 51 && (sinsOrb >= parseInt($('.bottle_1').find('.orb_text_base').eq(0).html().substr(2),10) && rancorOrb >= parseInt($('.bottle_2').find('.orb_text_base').eq(0).html().substr(2),10) && tyrannyOrb >= parseInt($('.bottle_3').find('.orb_text_base').eq(0).html().substr(2),10))) {
			fnRedirect('/en/'+platform+'/cemetery/openGate?open_gate=' + mission.current_mission_id);
		}
		else if (parseInt(fnAutoBP(),10)) {
			if (parseInt(player.deck_total_bp, 10) > 1 && fnEventMissionTeam() != '' && fnEventBattleTeam() != '' && parseInt(player.bp, 10) >= 1) {
				fnDeckChangeAdvance(fnEventBattleTeam(), false, function(){fnRedirect('/en/'+platform+'/cemetery/mission');});
				fnRedirect('/en/'+platform+'/cemetery/mission');
				return;
			}
			$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:fnAutoBP()}, function(data) {});
			fnRedirect('/en/'+platform+'/cemetery/mission');
		}
		else{
			setInterval(fnRedirect, 60000, '/en/'+platform+'/cemetery/mission');
		}
		return;
	}
	
	missionProcess = function() {

		$.ajax_ex(false, '/en/'+platform+'/cemetery/process', {
			'area_id'    : areaId,
			'mission_id' : mission.last_mission_id,
			api          : 'json', 
			'__hash'     : ('' + (new Date()).getTime())
		}, function(result) {
			if (result.status != 0) {
				if (result.status == 901) {
					clearInterval(missionInterval);
					if (fnAutoDrink() == 1) {
						var useEnergy100 = false;
						for (var i=0;i<result.payload.recoverItems.length;i++) {
							if (parseInt(result.payload.recoverItems[i].item_id,10)==3022) {
								if (parseInt(player.power_max,10) <= 300 && (parseInt(player.next_exp,10) - parseInt(player.now_exp,10) < parseInt(result.payload.recoverItems[i].amount,10)  * 100)) {
									// max energy too low, drink enenrgy100 to level up instead of full ep
									useEnergy100 = true;
									break;
								}
								if (parseInt(player.next_exp,10) - parseInt(player.now_exp,10) > parseInt(player.power_max,10)) {
									// not close to level up, so drink full ep
									break;
								}
								if (parseInt(player.next_exp,10) - parseInt(player.now_exp,10) > 400) {
									// close to level up, but not going to spend five energy100 to level up, so drink full ep anyway
									break;
								}
								if (parseInt(player.next_exp,10) - parseInt(player.now_exp,10) <= parseInt(result.payload.recoverItems[i].amount,10) * 100) {
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
						fnRedirect('/en/'+platform+'/cemetery/mission');
						return;
					}
					else {
						setInterval(fnRedirect, 60000, '/en/'+platform+'/cemetery/mission');
						return;
					}
				} else {
					clearInterval(missionInterval);
					fnRedirect('/en/'+platform+'/cemetery/mission');
					return;
				}
			}

			mission = result.payload.mission;
			$('#mission_progress').progressbar().setValue(result.payload.process.clear ? 100 : ~~mission.progress / 10);

			// progress_text
			$('#progress-value span').html((result.payload.process.clear ? 100 : ~~mission.progress / 10) + '%');

			player = result.payload.player;
			$.refreshStatus(false, null);

			EfectMng.clear();
			var processData = {
				process : result.payload.process,
				crack   : false, 
				pot     : false, 
				stairs  : result.payload.process.clear 
			};

			if (result.payload.process.clear) {
				if (mission.is_gate) {
					clearInterval(missionInterval);
					//fnRedirect('/en/'+platform+'/cemetery/openGate?open_gate=' + mission.current_mission_id);
					fnRedirect('/en/'+platform+'/cemetery/mission');
					return;
				}
			}

			if (result.payload.process.enemy_type) {
				//clearInterval(missionInterval);
				//fnRedirect('/en/'+platform+'/battle/battleact?pid=' + result.payload.process.enemy_type + '&ptribe='+ result.payload.process.enemy_tribe + '&aid='+areaId+'&skip=1&event=7');
				//fnRedirect('/en/'+platform+'/battle/battleact?pid=2&ptribe='+ result.payload.process.enemy_tribe + '&aid='+areaId+'&skip=1&event=7');
				//$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid=2&ptribe='+ result.payload.process.enemy_tribe + '&aid='+areaId+'&skip=1&event=7', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				if (sinsOrb <= rancorOrb && sinsOrb <= tyrannyOrb) {
					$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid=2&ptribe=1&aid='+areaId+'&skip=1&event=7', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				}
				else if (rancorOrb <= tyrannyOrb) {
					$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid=2&ptribe=2&aid='+areaId+'&skip=1&event=7', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				}
				else {
					$.ajax_ex(false, '/en/'+platform+'/battle/battleact?pid=2&ptribe=3&aid='+areaId+'&skip=1&event=7', {}, function(data) {fnRedirect('/en/'+platform+'/cemetery/mission');});
				}
				//fnRedirect('/en/'+platform+'/cemetery/mission');
				return;
			}
		});

		return false; 
	};	
	
	if (fnGetGrindingSpeed() == -1) {
		// user press by himself, dont automate
		return;
	}
	if (fnGetGrindingSpeed() == 1) {
		missionProcess();
	}
	else {
		missionInterval = setInterval(missionProcess,fnGetGrindingSpeed());
	}
}

// fnCemeteryOpenGate

function fnCemeteryOpenGate() {
	fnRedirect('/en/'+platform+'/cemetery/mission');
}

// fnCemeteryBattleResult

function fnCemeteryBattleResult() {
	if (document.referrer.indexOf('/cemetery/mission') >= 0) {
		fnRedirect('/en/'+platform+'/cemetery/mission');
	}
	else if (document.referrer.indexOf('/cemetery/battleList') >= 0) {
		fnRedirect('/en/'+platform+'/cemetery/battleList');
	}
}

// fnCemeteryBattleList
var sinsCemeteryBattleList=['2372158593'];//momma2
var sinsLv3CemeteryBattleList=['2598350157'];//Dummy
var rancorCemeteryBattleList=['2552015020'];//max rebo
var rancorLv3CemeteryBattleList=['2348595327'];//Curt
var tyrannyCemeteryBattleList=['1414640721'];//IG-88
var tyrannyLv3CemeteryBattleList=['2410261971'];//Punching Bag
var cemeteryBattleList = ['2372158593','2598350157','2552015020','2348595327','1414640721','2410261971'];
function fnCemeteryBattleList() {
	if (parseInt(player.deck_total_bp, 10) == 1 && parseInt(player.bp, 10) >= 1) {
		fnRedirect('/en/'+platform+'/battle/battleact?pid='+cemeteryBattleList[Math.floor(Math.random()*cemeteryBattleList.length)]+'&skip=1&event=6');
	}
}

// fnSubjugationMission

function fnSubjugation() {
	var divTag = document.createElement("div");
	divTag.id = "subDiv";

	var missionSelectorHTML =  'Mission:<select name="mission" onchange="fnSetSubjucationMissionStay(this.options[this.options.selectedIndex].value);fnGrowl(\'Mission:\'+this.options[this.options.selectedIndex].text);"><option ' + (parseInt(fnSubjucationMissionStay(),10)==0?'selected':'') + ' value="0">Move on</option><option ' + (parseInt(fnSubjucationMissionStay(),10)==1?'selected':'') + ' value="1">Stay at current mission</option></select><br/>';	

	divTag.innerHTML = missionSelectorHTML;
	document.body.appendChild(divTag);
}

function fnSubjugationRaidDamageDisplay() {
	$('#raid_normal_attack_text').html($('#raid_normal_attack_value').html() + '-'+raid_data.boss_defense+'='+(parseInt($('#raid_normal_attack_value').html(),10)-parseInt(raid_data.boss_defense,10)));
}

function fnSubjucatorRaidAddAttackOption() {
  if (isNaN(parseInt($('#raid_normal_attack_value').html(),10))) {
   fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
			return;
  }
	$('#raid_normal_use_power_text option:eq(0)').attr("selected", "selected");
	var myRate = Math.ceil((parseInt(raid_data.boss_hp,10)+parseInt(raid_data.boss_defense, 10))/(parseInt($('#raid_normal_attack_value').html(),10)/($('#raid_normal_use_power_text').val()>=100?1.2:1)/$('#raid_normal_use_power_text').val()));
   if (isNaN(myRate)) {
   fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
			return;
  }
	$('#raid_normal_use_power_text').append('<option value='+myRate+'>'+ Math.ceil(myRate/100*parseInt(player.deck_total_bp,10))+ ' ('+myRate+'%)optimized</option>');
	$('#raid_normal_use_power_text option:last').attr("selected", "selected");
	if (fnGetGrindingSpeed()>0 && parseInt(raid_data.boss_hp,10)>0) {
		// too heavy bp consume, call for sos help
		if ($('#under_sos').is(":visible") && Math.ceil(myRate/100*parseInt(player.deck_total_bp,10)) > parseInt(player.power_max,10)/10 && parseInt(player.power,10) > parseInt(player.power_max,10)/10 && Math.ceil(myRate/100*parseInt(player.deck_total_bp,10)) > parseInt(player.deck_total_bp,10)) {
			sos_call();
			fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
			return;
		}
		// attack
		else if (parseInt(player.bp,10) >=  Math.min(parseInt(player.deck_total_bp,10), Math.ceil(myRate/100*parseInt(player.deck_total_bp,10)))) {
			attack(false, 0);
		}
		else { // not enough bp
			/*if (fnAutoDrink() == 1) {
				fnSubjugationDrinkBP('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
			}*/
			if (parseInt(fnAutoBP(),10) > 0) {
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:fnAutoBP()}, function(data) {});
				fnTimeOutRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
				return;
			}
			else if (parseInt(fnSubjucationMissionStay(),10)==0) {
				fnRedirect('/en/'+platform+'/subjugation/mission?');
			}
			fnTimeOutRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
			return;
		}
	}
	myRate = Math.floor(parseInt(player.bp,10)/parseInt(player.deck_total_bp,10)*100);
	$('#raid_normal_use_power_text').append('<option value='+myRate+'>'+ Math.ceil(myRate/100*parseInt(player.deck_total_bp,10))+ ' ('+myRate+'%)full</option>');
}

function fnSubjugationDrinkBP(pRedirect) {
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:fnAutoBP()}, function(data) {});
	fnRedirect(pRedirect);
	return;
	/*$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var items = data.payload.items;
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3043) { // consume my 100 bp 
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect(pRedirect);
				return;
			}
		}
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3024 && (parseInt(player.power,10) + 100 <= parseInt(player.power_max,10))) { // consume my 100 elixir
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect(pRedirect);
				return;
			}
		}
		if (parseInt(fnSubjucationMissionStay(),10)==1 || player.bp_max >= 300 && raid_data.boss_id == 17) {
			for (var j=0;j<items.length;j++) {
				if (items[j].item_id == 3019) { // consume my battle potions
					$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
					fnRedirect(pRedirect);
					return;
				}
			}
			for (var j=0;j<items.length;j++) {
				if (items[j].item_id == 3020) { // consume my elixir
					$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
					fnRedirect(pRedirect);
					return;
				}
			}
			for (var j=0;j<items.length;j++) {
				if (items[j].item_id == 3003) { // consum battle points
					$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
					fnRedirect(pRedirect);
					return;
				}
			}
			for (var j=0;j<items.length;j++) {
				if (items[j].item_id == 3011) { // consum elixir
					$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
					fnRedirect(pRedirect);
					return;
				}
			}
		}
		// no bp to drink, do mission to gain bp
		fnRedirect('/en/'+platform+'/subjugation/mission?');
	});	*/
}

function fnSubjugationDrinkEP() {
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var items = data.payload.items;
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3022) { // consume my 100 ep 
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect('/en/'+platform+'/subjugation/mission?');
				return;
			}
		}
		for (var j=0;j<items.length;j++) { // consume my 100 elixir
			if (items[j].item_id == 3024 && (parseInt(player.power,10) + 100 <= parseInt(player.power_max,10))) { 
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect('/en/'+platform+'/subjugation/mission?');
				return;
			}
		}
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3018) { // consume my e potions
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect('/en/'+platform+'/subjugation/mission?');
				return;
			}
		}
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3001) { // consume ep
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect('/en/'+platform+'/subjugation/mission?');
				return;
			}
		}
	});	
}

function fnSubjugationDrinkMyEP() {
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var items = data.payload.items;
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3018) { // consume my e potions
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect('/en/'+platform+'/subjugation/mission?');
				return;
			}
		}
		fnGetFreeMyEP('/en/'+platform+'/subjugation/mission?');
	});	
}

function fnSubjugationFixAttack() {
	attack = function (bonus, debug_attack) {
		//if (timer_stop) return;

		debug_attack = debug_attack || 0;

		var rate = $('#raid_normal_use_power_text').val();
		rate = Math.max(0, Math.min(rate, 100));

		//if (g_use_power && player.power >= g_use_power) {
		//timer_stop = true;
		//}

		/*if (g_use_power === null || player.power < g_use_power) {
		return;
		}*/
		var short_of_bp = false;
		$.ajax_ex(false, '/en/'+platform+'/subjugation/ajax_raid_act', {
			'subjugation_id': raid_data.subjugation_id,
			'pid': player.player_id,
			'da': debug_attack,
			'rate': rate,
			'bonus': bonus && (raid_data.boss_mhp == raid_data.boss_hp),
			'fever_rate': '3',
			'__hash':  (new Date()).getTime(),
		}, function(data) {
			if (data.status == -2) {
				//retry
				if (fnGetGrindingSpeed()>0) {
					setTimeout(fnSubjucatorRaidAddAttackOption, fnGetGrindingSpeed());
				}
				return;
			}
			if (data.status == -6) {
				short_of_bp = true;
				if (fnAutoBP() > 0) {
					fnSubjugationDrinkBP('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
				}
				else if (parseInt(fnSubjucationMissionStay(),10)==0) {
					fnRedirect('/en/'+platform+'/subjugation/mission?');
				}
				return;
			}
			if (data.status == -5 || data.status == 2) {
				fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
				return;
			}
			if (data.status == -7) {
				if (typeof(data.payload) != 'undefined' && typeof(data.payload.end_at_u) != 'undefined') {
					timer_stop = false;
					countdown_timer('raid_normal_time_text', data.payload['end_at_u'], timeout);
					return;
				} else {
					$.reload();
					return;
				}
			}
			if (data.status == -8) {
				fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
				return;
			}
			if (data.status == -9) {alert("status -9");
				//short_of_bp = true;
				//timer_stop = false;
				//return;
				//setTimeout(fnSubjucatorRaidAddAttackOption, fnGetGrindingSpeed());
				if (parseInt(fnAutoBP(),10) > 0) {
					fnSubjugationDrinkBP('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
				}
				else if (parseInt(fnSubjucationMissionStay(),10)==0) {
					fnRedirect('/en/'+platform+'/subjugation/mission?');
				}
				return;
			}
			if (data.status == -10) {
				setTimeout(fnSubjucatorRaidAddAttackOption, fnGetGrindingSpeed());
				return;
			}
			if (data.payload.short_of_bp) {
				if (parseInt(fnAutoBP(),10) > 0) {
					fnSubjugationDrinkBP('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
				}
				else if (parseInt(fnSubjucationMissionStay(),10)==0) {
					fnRedirect('/en/'+platform+'/subjugation/mission?');
				}
				return;
				/*
				timer_stop = false;
				for (var i = 0; i < 10; i++) {
					clearTimeout(timer);
				}
				countdown_timer('raid_normal_time_text', data.payload['end_at_u'], timeout);
				//mission_exec();
				//          msg_box_short_of_power();
				return;*/
			}

			var power = 0;

			if (typeof(data.payload.power) != 'undefined') {
				power = data.payload.power;
			}

			$.refreshStatus(true);

			rate_hp = ~~Math.ceil(((data.payload.hp / data.payload.hp_max) * 100));

			update_hp_gauge = true;
			$('#hp_bar').progressbar().setValue(rate_hp, 0);
			$('#boss_hp_text').text(data.payload.hp);

			//$('#effect_attack_cover').show();

			var tmp_wait = 1;
			/*if (raid_data.cheer_attack && ~~raid_data.cheer_attack > 0 && raid_data.member_count) {
				for (var i = 0; i < raid_data.member_count; i++) {
					tmp_wait += 50;
					var pos_left = Math.floor(Math.random() * 240) - 30;
					var pos_top  = Math.floor(Math.random() * 100) + 80;
					$('.effect_attack_img_sub:eq('+i+')').css({left: pos_left, top: pos_top}).delay(i*50).show(1).fadeOut(500);
				}
			}*/
			//     var result;
			if (data.payload.hp <= 0) {
				fnRedirect('/en/'+platform+'/subjugation/mission?');
				if (data.payload.result == 1) {
					

				} else {
					timeout();
				}

				timer_stop = true;

				reward_id = data.payload.reward_id;
			} else {
				raid_data.boss_hp = parseInt(data.payload.hp,10);
				if (raid_data.cheer_count == "1") {
					fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
					return;
				}
				setTimeout(fnSubjucatorRaidAddAttackOption, fnGetGrindingSpeed());
			
				/*
				var obj = document.getElementById('effect_attack_damage');
				obj.innerHTML = document.getElementById('damage_text').innerHTML + data.payload.damage;

				$('#effect_attack_bonus').hide();
				if (data.payload['bonus']) {
					$('#effect_attack_bonus').show();
					//        obj = document.getElementById('effect_attack_bonus');
					//            obj.innerHTML = "Damage Bonus!";
				} else {
					var type = 1;
					if      (rate_hp >= 75) type = 1;
					else if (rate_hp >= 50) type = 2;
					else if (rate_hp >= 25) type = 3;
					else                    type = 4;

					obj = document.getElementById('effect_attack_text');
					obj.innerHTML = document.getElementById('attack_text_' + type).innerHTML;
				}

				obj = document.getElementById('effect_attack');
				obj.style.display = 'block';

				$('#effect_attack_finish').delay(tmp_wait).show(1);

				$('#effect_attack_cover').css('height', $(document).height() + 'px');

				timer_stop = false;
				countdown_timer('raid_normal_time_text', data.payload['end_at_u'], timeout);
				*/
				//result = document.getElementById('result_attack');
			}
			//result.style.display = 'block';
		});

		if (! short_of_bp) {
			// ææ´ãæ¶ã
			raid_data.cheer_attack = 0;
			raid_data.member_count = 0;

			ClanAttack();

			setAttackText();
		}
	}
	$("#raid_normal_submit_button_attack").unbind('click');
	$("#raid_normal_submit_button_attack").click(function() {
		attack(false, 0);
		$('#raid_free_use_power_label').hide();
	});
}

function fnSubjugationRaid() {
	if (parseInt(fnQueryString('fever_rate'),10) < 3) {
		fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+fnQueryString('subjugation_id')+'&pid='+player.player_id+'&fever_rate=3');
		return;
	}
	raid_defeated = function () {
		fnRedirect('/en/'+platform+'/subjugation/mission?');
	}
	raid_get = function (offset) {
		offset = offset || 1;
		$.getJSON('/en/'+platform+'/subjugation/ajax_raid_get', {'offset': offset - 1, 'subjugation_id': raid_data.subjugation_id, 'pid': raid_data.player_id}, function(data) {
			var payload = data['payload'];

			var raid   = payload.raid;
			var m_raid = payload.m_raid;
			var boss_name = m_raid.boss_name + '&nbsp;Lv' + raid.boss_lv;
			//      g_use_power = m_raid.use_power;
			if (raid.boss_hp <= 0) {
				raid_defeated(true);
			}

			if (! update_hp_gauge) {
				$('#hp_bar').progressbar().setValue(~~Math.ceil((raid.boss_hp / m_raid.boss_hp) * 100), 0);
			}

			raid_data.boss_defense = m_raid.boss_defense;
			raid_data.boss_mhp = m_raid.boss_hp;
			raid_data.cheer_count = raid.cheer_count;
			
			fnSubjugationRaidDamageDisplay();

			countdown_timer('raid_normal_time_text', payload['raid']['end_at_u'], timeout);
			
			if (parseInt(m_raid.boss_hp,10) == parseInt(raid.boss_hp,10)) {
         //alert(m_raid.boss_hp + " - " + m_raid.boss_hp);
				attack(true, 0);
			}
			else {
				setTimeout(fnSubjucatorRaidAddAttackOption, fnGetGrindingSpeed());
			}
		});
	}
	
	onDeviceReady = function() {
		all_hide();

		$('#raid_normal_use_power_text').change(function() {
			setAttackText();
		});

		
		$('#button_skip').bind("click", skip_call);
		
		fnSubjugationFixAttack();
		raid_get();
		
		/*sos_call2 = sos_call;
		sos_call = function () {
			sos_call2();
			fnSubjucatorRaidAddAttackOption();
		}*/
		$('#under_sos').unbind("click");
		$('#under_sos').one("click", sos_call);
		
		/*$("#raid_normal_submit_button_attack").unbind('click');
		$("#raid_normal_submit_button_attack").click(function() {
			attack(false, 0);
			$('#raid_free_use_power_label').hide();
		});*/
	}
	onDeviceReady();
	
	$('#raid_normal_use_power_text').change(function() {
		setAttackText();
		fnSubjugationRaidDamageDisplay();
	});
}

function fnSubjugationResult() {
	fnRedirect('/en/'+platform+'/subjugation?');
}

function fnSubjugationRewardGuild() {
	var divTag = document.createElement("div"); 

	divTag.id = "clanRewardDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "100px"; 
	divTag.style.top = "70px"; 

	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="for (i=1;i<=10;i++) {setTimeout(function(prize){click_reward = false;fnGrowl(\'receive \'+prize);$.ajax_ex(false, \'/en/ios/subjugation/ajaxGuildReceive\', {rewardKey: prize},null);}, (i-1)*2000, i);}">Receive All Gift</button>'; 
	document.body.appendChild(divTag); 
}

function fnSubjugationRaidBoss() {
	fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id=6&pid='+player.player_id+'&fever_rate=3');
}

function fnSubjugationMission() {
	var divTag = document.createElement("div"); 

	divTag.id = "loopDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "280px"; 
	divTag.style.top = "80px"; 

	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="fnSubjugationRaidBoss();">loop</button>'; 
	//document.body.appendChild(divTag); 
	
	
	mission_exec = function(superroll) {
		if ($('#raid_boss').length) {
			if (parseInt(player.bp, 10) >= parseInt(player.deck_total_bp,10)) {
				$('#raid_boss').trigger('click');
				mission_exec = null;
				clearInterval(missionInterval);
				return;
			}
		}
		$.ajax_ex(false, '/en/'+platform+'/subjugation/process', {
			area_id: parseInt(fnSubjucationMissionStay(),10)==1?1:area_id, 
			mission: parseInt(fnSubjucationMissionStay(),10)==1?0:mission.last_mission,
			confirm_id: confirm_id,
			superroll: 3,
			'__hash':  (new Date()).getTime(),
		}, function(result) {
			if (result.status == 4) {
				//phase_no_power(result.payload);
				if (fnAutoDrink() == 1) {
					//$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:result.payload.item_ids[0]}, function(data) {});
					fnSubjugationDrinkEP();
					mission_exec = null;					
				}
				else if (fnAutoDrink() == 2) {
					//$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:result.payload.item_ids[0]}, function(data) {});
					fnSubjugationDrinkMyEP();
					mission_exec = null;					
				}
				clearInterval(missionInterval);
				return;
			}
			//      if (result.status == 5) {
			//        phase_raid_battle();
			//        return;
			//      }

			else if(result.status != 0) {
				if (result.status == -5) {
					//$.redirect('/en/'+platform+'/subjugation?intentional=1');
					return;
				}
				confirm_id = 0;//result.payload.confirm_id;
				return;
			}

			confirm_id = result.payload.confirm_id;

			mission = result.payload.mission;
			event = result.payload.event;
			event.phase = new Array();
			loop_count = result.payload.loop_count ;
			use_item_count = result.payload.use_item_count;
			raid_point = result.payload;
			subjugation_id = event.subjugation_id;
			if (parseInt(event.subjugation_id,10) > 0) {
				mission_exec = null;
				clearInterval(missionInterval);
				fnRedirect('/en/'+platform+'/subjugation/raid?subjugation_id='+ event.subjugation_id + '&pid='+player.player_id+'&fever_rate=3');
			}

			$('#clock_count').html("guild_raid_point"      .replace('%point%',  1));

			draw();
			//      console.log(result.payload);
			//      console.log(event.event_resource.result);
			//      console.log(event.event_resource);
			/*
			if (event.event_resource.result) {
				event.phase.push('event_resource');
			} else {
				event.phase.push('default_resource');
			}
			if (event.event_resource.reward) {
				event.phase.push('get_ex_resource');
			}*/

			if(event.bouns_time_effect)  event.phase.push('happen_bonus_time');
			//if(event.monster)            event.phase.push('get_monster');
			//      if(event.treasure)           event.phase.push('get_treasure');
			//if(event.clear)              event.phase.push('mission_clear');
			//if(event.exp.lvup > 0)       event.phase.push('level_up');
			//if(event.exp.lvup > 0)       event.phase.push('status_up');
			//      if(event.treasure)
			//      if(event.treasure.complete)  event.phase.push('treasure_complete');
			if(event.clear)
			if(mission.last_mission == 5) event.phase.push('time_warp');
			if(event.raid_encount == 1){
				event.phase.push('raid_effect');
				encount_flag = 1;
			} else if(event.raid_encount == 2){
				event.phase.push('raid_effect');
				encount_flag = 2;
			}else if(event.raid_encount == 3){
				event.phase.push('raid_effect');
				encount_flag = 3;
			} 

			event = eventManager(event);
			//$('#act_mission').hide();
			if (fnGetGrindingSpeed() == 1) {
				mission_exec();
			}
		});
	}
	
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

// adventure mission

function fnFixAdventureMission() {
	mission_exec = function() {

		$.ajax_ex(false, '/en/'+platform+'/adventure/process', {
			area_id: area_id,
			mission: mission.current_mission,
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
				return;
			}

			//console.log(result);
			confirm_id = result.payload.confirm_id;

			mission = result.payload.mission;
			event = result.payload.event;
			event.phase = new Array();

			draw();


			//      if(mission.last_mission == 5)event.phase.push('enemy_summoner');
			if(event.clear)
			if(event.next_area) {
				$.ajax_ex(false, '/en/'+platform+'/adventure/nextArea', { area_id: area_id, '__hash': ('' + (new Date()).getTime()) }, function(result) {
					if (result.status != 0) {
						return;
					}
					$.redirect('/en/'+platform+'/adventure/mission');
				});
			}

			event = eventManager(event);
			if (fnGetGrindingSpeed() == 1) {
				mission_exec();
			}

		});
	}
}

function fnAdventureMission() {
	fnFixAdventureMission();
	if (fnGetGrindingSpeed() == 1) {
		mission_exec();
	}
	else {
		missionInterval = setInterval(mission_exec,fnGetGrindingSpeed());
	}
}

// dungeon mission

function fnDungeonMission() {
	if (fnGetGrindingSpeed() == -1) {
		return;
	}
	if (parseInt(fnQueryString('dungeon_tribe'), 10) == 0) {
		if ((fnQueryString('go_next') == 'true' && dm.mission_count >= mMs.length)  || (document.referrer.indexOf('/dungeon/battle') >= 0) || (document.referrer.indexOf('/dungeon/win') >= 0)) {
			if (fnDungeonProgTeam() != null && fnDungeonBossTeam() != null) {
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
      feverTime: 1,
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
			ig.game.decreaseBp = willDoProgress*(Math.max(ig.game.getMissionMaster()['use_bp']-1,1));
			ig.game.addJewel = willDoProgress*ig.game.getMissionMaster()['jewel_max'];
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
			if (parseInt(fnAutoBP(),10) > 0) {
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:fnAutoBP()}, function(data) {});
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
			if (fnDungeonProgTeam() != null && fnDungeonBossTeam() != null) {
				fnDeckChangeAdvance(fnDungeonBossTeam(), false, function(){fnRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);});
				//fnSetDungeonBossRecord(fnDungeonBossRecord()+'<br/>'+Math.round(parseInt(dm.mission_count,10)/44)+' ' + bM.name);
				fnTimeOutRedirect('/en/'+platform+'/dungeon/battle?dungeon_tribe='+dm['dungeon_tribe']+'&area_id='+dm['area_id']);
			}
		}
	}
}

function fnDungeonMissionPreload() {
	if (parseInt(fnQueryString('dungeon_tribe'), 10) == 0) {
		if ((fnQueryString('go_next') == 'true' && dm.mission_count >= mMs.length)  || (document.referrer.indexOf('/dungeon/battle') >= 0) || (document.referrer.indexOf('/dungeon/win') >= 0)) {
			if (fnDungeonProgTeam() != null && fnDungeonBossTeam() != null) {
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
	var levelSelectorHTML = '<select style="position:absolute;top:0px;left:0px" onchange="fnSetDungeonTravelLevel(this.options[this.options.selectedIndex].value);fnGrowl(\'Level:\'+this.options[this.options.selectedIndex].text);location.reload();">';
	levelSelectorHTML += '<option ' + (fnDungeonTravelLevel() == 0 ?'selected':'') + ' value="0">Current Level</option>'
	for (var j=1;j<=10;j++) {
		levelSelectorHTML += '<option ' + (fnDungeonTravelLevel() == j ?'selected':'') + ' value="'+j+'">Level '+j+'</option>';
	}
	levelSelectorHTML += '</select>'; 
	
	var expSelectorHTML = 'Exp:<select onchange="fnSetDungeonExtraExp(this.options[this.options.selectedIndex].value);fnGrowl(\'Extra Exp:\'+this.options[this.options.selectedIndex].text);">';
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
	expSelectorHTML += '</select><br/>'; 
	
	var goldSelectorHTML = 'Gold:<select onchange="fnSetDungeonExtraGold(this.options[this.options.selectedIndex].value);fnGrowl(\'Extra Gold:$\'+this.options[this.options.selectedIndex].text);">';
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
	goldSelectorHTML += '</select><br/>'; 
	
	var divTag = document.createElement("div");
	divTag.id = "dungeonDiv";

	var aFormationArray = fnGetFormationArray();
	var bossTeamSelectorHTML =  'VS Boss:<select name="boss" onchange="fnSetDungeonBossTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Boss Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonBossTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		bossTeamSelectorHTML+='<option ' + (fnDungeonBossTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	bossTeamSelectorHTML+='</select><br/>'; 

	var progTeamSelectorHTML =  'Prog Team<select name="prog" onchange="fnSetDungeonProgTeam(fnGetFormationArray()[this.options[this.options.selectedIndex].value]);fnGrowl(\'Prog Team:\'+this.options[this.options.selectedIndex].text);"><option ' + (fnDungeonProgTeam()==''?'selected':'') + ' value="">Auto Off</option>';	
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		progTeamSelectorHTML+='<option ' + (fnDungeonProgTeam()==aFormationArray[i]?'selected':'') + ' value="' + i + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
	}
	progTeamSelectorHTML+='</select><br/>'; 
	
	var bpSelectorHTML =  'Auto BP<select name="autoBP" onchange="fnSetAutoBP(this.options[this.options.selectedIndex].value);fnGrowl(\'Auto BP:\'+this.options[this.options.selectedIndex].text);"><option ' + (parseInt(fnAutoBP(),10)==0?'selected':'') + ' value="0">Auto Off</option><option ' + (parseInt(fnAutoBP(),10)==3003?'selected':'') + ' value="3003">Real BP</option><option ' + (parseInt(fnAutoBP(),10)==3019?'selected':'') + ' value="3019">My BP</option><option ' + (parseInt(fnAutoBP(),10)==3011?'selected':'') + ' value="3011">Elixir</option><option ' + (parseInt(fnAutoBP(),10)==3020?'selected':'') + ' value="3020">My Elixir</option></select><br/>';	

	divTag.innerHTML = bossTeamSelectorHTML + progTeamSelectorHTML + bpSelectorHTML  + expSelectorHTML + goldSelectorHTML;
	document.body.appendChild(divTag);

	//infinitydocument.getElementById('main_bg').style.height = (parseInt(document.getElementById('main_bg').style.height,10) + 125) + "px";
	
	//var divTag = document.createElement("div");
	//divTag.id = "bossRecordDiv";
	//divTag.innerHTML = fnDungeonBossRecord() + '<br/><a href="javascript:fnSetDungeonBossRecord(\'\');location.reload();">Clear boss battle history</a>';
	//document.body.appendChild(divTag);
	
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

// clan battle event

function fnClanBattle() {
	clanBG = parseInt($('a[href^="/en/'+platform+'/clanbattle/guardianCommandSelect"]').text().substr(3),10);

	//
	if ($('a[href^="/en/'+platform+'/clanbattle/battleSelect"]').length) {
		if (player.power_max >= parseInt(player.bp_max, 10) || parseInt(player.power, 10) > 3) {
			fnRedirect('/en/'+platform+'/clanbattle/mission?');
			return;
		}
		fnTimeOutRedirect($('a[href^="/en/'+platform+'/clanbattle/battleSelect"]').eq(0).attr("href"));
	}
	setInterval(fnRedirect, 60000, '/en/'+platform+'/clanbattle');
}

function fnClanBattleMissionAutoDrink(pRedirect) {
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var items = data.payload.items;
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3022) { // consume my 100 energy
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect(pRedirect);
				return;
			}
		}
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3018) { // consume my energy
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect(pRedirect);
				return;
			}
		}
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3001) { // consum energy
				$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:items[j].item_id}, function(data) {});
				fnRedirect(pRedirect);
				return;
			}
		}
		fnRedirect('/en/'+platform+'/clanbattle/battleSelect');
	});
}

function fnClanBattleMission() {
	missionProcess = function() {
		$.ajax_ex(false, '/en/'+platform+'/clanbattle/ajaxMissionAct', {
			'floor_id' : floor_id,
			api        : 'json',
			'__hash'   : ('' + (new Date()).getTime())
		}, function(result) {
			if (result.status != 0) {
				// ãã¯ã¼ä¸è¶³
				if (result.status == 901) {
					if (parseInt(player.power_max,10) < parseInt(player.bp_max, 10)) {
						fnRedirect('/en/'+platform+'/clanbattle/battleSelect');
						return;
					}
					if (parseInt($('dd.ally').eq(0).html(),10) <= parseInt($('dd.enemy').eq(0).html(),10) * 2) {
						fnClanBattleMissionAutoDrink('/en/'+platform+'/clanbattle/mission?');
					}
					else {
						fnRedirect('/en/'+platform+'/clanbattle/battleSelect');
					}
					return;
					//itemPopup(0);
				} else {
					$.redirect('/en/'+platform+'/clanbattle');
				}
				//$.redirect('/en/ios/clanbattle');
				
				return;
			}


			// ãã¯ã¼ã®æ´æ°
			$('.battle-point .text .bp').html(result.payload.mission.after_power);
			window.setBP(result.payload.mission.after_power);


			// BGãã¤ã¬ã¼ã¸æ©è³ãåå¾ãã
			var mile = result.payload.bgMileageKeys;
			if (mile) {
				EfectMng.push('getMile', mile);
			}

			// ããã·ã§ã³ã¯ãªã¢å¤å®
			if (result.payload.mission.clear) {
				EfectMng.push('reload', null).play();
			} else {
			}
			if (fnGetGrindingSpeed() == 1) {
				missionProcess();
			}
		});


		return false;
	};

	if (parseInt($('.__bg_bar #black_gem_bar .current_black_gem').text()) >= 15000) {
		fnRedirect('/en/'+platform+'/clanbattle/battleSelect');
		return;
	}

	if (fnGetGrindingSpeed() == -1) {
		// user press by himself, dont automate
		return;
	}
	if (fnGetGrindingSpeed() == 1) {
		missionProcess();
	}
	else {
		missionInterval = setInterval(missionProcess,fnGetGrindingSpeed());
	}
}

function fnClanBattleSelect() {
	if (parseInt(player.bp,10) >= parseInt(player.deck_total_bp)) {
		fnRedirect('/en/'+platform+'/clanbattle/battleAct?percent=100&battle_off_flag=true');
	}
	else {
		if (isNaN($('dd.enemy').eq(0).html()) || guardian_command_list[2]['status'] == 1 || guardian_command_list[3]['status'] == 1 || guardian_command_list[5]['status'] == 1 || parseInt($('dd.ally').eq(0).html(),10) <= 50000 || parseInt($('dd.ally').eq(0).html(),10) <= parseInt($('dd.enemy').eq(0).html(),10) * 2) {
			// auto use bp to secure wins
			$.ajax_ex(false, '/en/'+platform+'/misc/ajaxItemPopup', { 'item_type': 1, '__hash': ('' + (new Date()).getTime()) }, function(result) {
				if (result.status == 0) {
					for (var i=0;i<result.payload.item_ids.length;i++) {
						for (var j=0;j<bpItemList.length;j++) {
							if (result.payload.item_ids[i]==bpItemList[j]) {
								$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:bpItemList[j]}, function(data) {});
								fnRedirect('/en/'+platform+'/clanbattle/battleSelect');
								return;
							}
						}
					}
				}
			});
		}
	}
	setInterval(fnRedirect, 60000, '/en/'+platform+'/clanbattle/battleSelect');
}

function fnClanBattleAct() {
}

function fnClanBattleBattle() {
	fnRedirect('/en/'+platform+'/clanbattle/battleResult'+window.location.search);
}
function fnClanBattleBattleResult() {
	fnRedirect('/en/'+platform+'/clanbattle/executionSelect');
}

function fnClanBattleExecutionSelect() {
	var choice = 1;
	var bonus = 5;
	for (var i=0;i<executions.length;i++) {
		if (executions[i].enable && parseInt(executions[i].execution_bonus,10) > bonus) {
			bonus = parseInt(executions[i].execution_bonus,10);
			choice = executions[i].id;
		}
	}
	fnRedirect('/en/'+platform+'/clanbattle/execution?choice=' + choice + '&execution_off_flag=true');
}
function fnClanBattleExecution() {
	
}
function fnClanBattleExecutionAnimationCreateJS() {
	fnRedirect('/en/'+platform+'/clanbattle/executionResult?');
}
function fnClanBattleExecutionResult() {
	fnRedirect('/en/'+platform+'/clanbattle/battleSelect');
}

// battle

function fnBattleBattle() {
	// skip to result
	if (document.referrer.indexOf('/tower/mission') >= 0) {
		fnRedirect('/en/'+platform+'/tower/bossResult');
	}
	else if (document.referrer.indexOf('/forkroad/mission') >= 0) {
		fnRedirect('/en/'+platform+'/forkroad/battleResult');
	}
	else if (document.referrer.indexOf('/forkroad/itemComplete') >= 0) {
		fnRedirect('/en/'+platform+'/forkroad/bossResult');
	}
	else if (document.referrer.indexOf('/cemetery/mission') >= 0) {
		fnRedirect('/en/'+platform+'/cemetery/battleResult');
	}
	else if (document.referrer.indexOf('/cemetery/battleList') >= 0) {
		fnRedirect('/en/'+platform+'/cemetery/battleResult');
	}
	else if (document.referrer.indexOf('/mission') >= 0) {
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
				else if (fnAutoDrink() == 2) {
					for (var i=0;i<result.payload.item_ids.length;i++) {
						if (result.payload.item_ids[i]==3018) {
							if (result.payload.amount[i] > 0) {
								$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:3018}, function(data) {});
								return;
								break;
							}
						}
					}
					// no my ep, so get some!
					fnGetFreeMyEP('');
					return;
				}
				else {
					phase_no_power(result.payload);
					clearInterval(missionInterval);
					fnSellAllSellableMonsters();
					fnPresentBoxSellAll();
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

function fnMissionAreaChange() {
	fnRedirect("/en/ios/mission?area_change=true");
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
		frame.html('<a href="/en/'+platform+'/achievement/monsterInformation?mid='+monsterID+'&amp;attr=0&amp;offset=4"><img src="http://res.dark'+'summoner.com/en/s/cards/'+monsterID+'_small.png" width="55" height="55" alt="'+monsterID+'" />'+monsterID+'</a>');
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
  $('#status-text-area').html($('#status-text-area').html()+'<span id="status-agility" style="position:absolute; right:5px; top:-16px;width:200px;text-align:right; color:#c0c1ff;">agility</span><div style="position:absolute; left:25px; top:-16px;">AGILITY</div><div style="position:absolute; left:25px; top:126px;">' + (fnDecToBin(monsterMaster['combo_flag']).substr(0,1)==1?"*special* ":"") + (fnDecToBin(monsterMaster['combo_flag']).substr(1,1)==1?"*winged* ":"") + (fnDecToBin(monsterMaster['combo_flag']).substr(2,1)==1?"*special* ":"") + (fnDecToBin(monsterMaster['combo_flag']).substr(3,1)==1?"*lord* ":"") + (monsterMaster['is_ng_grade']?"*ng grade* ":"") + '</div>');
	$('#status-agility').html(addFigure(paramMaster['agility']));
	$('#status-attack').html(addFigure(paramMaster['attack'])+' ('+ addFigure(paramMaster['i_attack']) +'-'+ addFigure(paramMaster['m_attack']) +')');
	$('#status-defense').html(addFigure(paramMaster['defense'])+' ('+ addFigure(paramMaster['i_defense']) +'-'+ addFigure(paramMaster['m_defense']) +')');
	$('#status-hp').html(addFigure(paramMaster['hp'])+' ('+ addFigure(paramMaster['i_hp']) +'-'+ addFigure(paramMaster['m_hp']) +')');
	$('.status-text').css('width', '1000px');
	$('#prev').html('<a href="monsterInformation?mid='+ (parseInt(monsterMaster['monster_id'],10)-1)+'"><img src="http://res.dark'+'summoner.com/en/s/misc/pager/button_pager_prev_s.png" /></a><a href="monsterInformation?mid='+ (parseInt(monsterMaster['monster_id'],10)+1) +'"><img src="http://res.dark'+'summoner.com/en/s/misc/pager/button_pager_next_s.png" /></a>');
	if (parseInt(monsterMaster['grade'], 10) >= 6) {
		$('#button-back-img').html($('#button-back-img').html() + '<br/><img src="http://res.dark'+'summoner.com/en/s/misc/table/decoration_left.png" /> <a style="position:relative; " class="__WM __HM btn __red" href="javascript:fnMonsterInfoSearchAuctionAA(paramMaster[\'monster_id\']);">Auction</a> <img src="http://res.dark'+'summoner.com/en/s/misc/table/decoration_right.png" /> ');
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

function fnPresentBoxReceiveAllGoodiesPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 3) {
				onReceive(null, boxes[i]);
			}
			if (boxes[i].permanent_type == 2 && boxes[i].monster_grade > 5) {
				onReceive(null, boxes[i]);
				fnGrowl("Receiving " + boxes[i].monster_name);
			}
			if (boxes[i].permanent_type == 2 && boxes[i].monster_grade > 3 && boxes[i].monster_bp ==1) {
				onReceive(null, boxes[i]);
				fnGrowl("Receiving " + boxes[i].monster_name);
			}
			if (boxes[i].permanent_type == 2 && boxes[i].monster_grade > 3 && boxes[i].monster_bp >= 100) {
				onReceive(null, boxes[i]);
				fnGrowl("Receiving " + boxes[i].monster_name);
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllGoodiesPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllGoodies() {
	fnGrowl("Receiving...");
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAllGoodiesPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

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
	//alert('It will hang a bit if you have many pages');
	fnGrowl("Receiving...");
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
				fnGrowl("Receiving " + boxes[i].monster_name);
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllAAsPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllAAs() {
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAllAAsPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAll_1bp_APerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 2 && boxes[i].monster_grade > 3 && boxes[i].monster_bp ==1) {
				onReceive(null, boxes[i]);
				fnGrowl("Receiving " + boxes[i].monster_name);
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAll_1bp_APerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAll_1bp_A() {
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAll_1bp_APerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAllSacsPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 2) {
				if (sacSkillList.indexOf(parseInt(boxes[i].skill_id,10)) !== -1 && parseInt(boxes[i].monster_grade,10) <= 4) {
					onReceive(null, boxes[i]);
					fnGrowl("Receiving " + boxes[i].monster_name);
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllSacsPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllSacs() {
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAllSacsPerPage,0,parseInt(metaData.payload.pages,10)-1);
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
					fnGrowl("Receiving " + boxes[i].monster_name);
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
					fnGrowl("Receiving " + boxes[i].monster_name);
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
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAll25sPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxReceiveAll100sPerPage(pPage) {
	fnGrowl('Receiving Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 2 && boxes[i].monster_bp >= 100) {
				onReceive(null, boxes[i]);
				if (boxes[i].monster_grade > 5) {
					fnGrowl("Receiving " + boxes[i].monster_name);
				}
				else {
					fnGrowl("Receiving " + boxes[i].monster_name);
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAll100sPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAll100s() {
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAll100sPerPage,0,parseInt(metaData.payload.pages,10)-1);
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
							fnGrowl("Receiving " + boxes[i].monster_name);
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
							fnGrowl("Receiving " + boxes[i].monster_name);
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
					fnGrowl("Receiving " + boxes[i].monster_name);
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllSkillPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAllSkill() {
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
					fnGrowl("Receiving " + boxes[i].monster_name);
				}
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveSkillPerPage,500,pPage-1, pSkill);
		}
	});
}

function fnPresentBoxReceiveSkill(pSkill) {
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
				fnGrowl("Receiving $" + boxes[i].jewel);
			}
		}
		if (pPage > 0) {
			setTimeout(fnPresentBoxReceiveAllAAsPerPage,500,pPage-1);
		}
	});
}

function fnPresentBoxReceiveAll100kGold() {
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxReceiveAll100kGoldPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxSellAllPerPage(pPage) {
	fnGrowl('Selling Page ' + pPage);
	$.ajax_ex(false, '/en/ios/shop/ajax_sale_monsters_from_present?page='+pPage+'&mode=1', {}, function(){});
	if (pPage > 0) {
		setTimeout(fnPresentBoxSellAllPerPage,500,pPage-1);
	}
}

function fnPresentBoxSellAll() {
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxSellAllPerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}


function fnPresentBoxOrganizePerPage(pPage) {
	fnGrowl('Receiving & Selling Page ' + pPage);
	$.ajax_ex(false, '/en/'+platform+'/shop/ajax_sale_monsters_from_present?page='+pPage+'&mode=1', {}, function(){});
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page='+pPage, { }, function(data) {
		if (pPage > 0) {
			setTimeout(fnPresentBoxOrganizePerPage,500,pPage-1);
		}
		var boxes = data.payload.boxes;
		for (var i=0;i < boxes.length;i++) {
			if (boxes[i].permanent_type == 3) {
				$.ajax_ex(false, '/en/'+platform+'/present/receive', { bid: boxes[i].boxed_id }, function(data) {});
			}
			if (boxes[i].permanent_type == 2 && boxes[i].monster_grade > 5) {
				$.ajax_ex(false, '/en/'+platform+'/present/receive', { bid: boxes[i].boxed_id }, function(data) {});
				fnGrowl("Receiving " + boxes[i].monster_name);
			}
			if (boxes[i].permanent_type == 2 && boxes[i].monster_grade > 3 && boxes[i].monster_bp ==1) {
				$.ajax_ex(false, '/en/'+platform+'/present/receive', { bid: boxes[i].boxed_id }, function(data) {});
				fnGrowl("Receiving " + boxes[i].monster_name);
			}
			if (boxes[i].permanent_type == 2 && boxes[i].monster_grade > 3 && boxes[i].monster_bp >= 100) {
				$.ajax_ex(false, '/en/'+platform+'/present/receive', { bid: boxes[i].boxed_id }, function(data) {});
				fnGrowl("Receiving " + boxes[i].monster_name);
			}
		}		
	});
}

function fnPresentBoxOrganize() {
	fnGrowl("Receiving Goodies and sell all sellables");
	$.ajax_ex(false, '/en/'+platform+'/present/itemAll?page=0&mode=2&check=0', { }, function(data) {});
	$.ajax_ex(false, '/en/'+platform+'/present/itemAll?page=0&mode=3&check=4%2C7%2C1', { }, function(data) {});
	fnPresentBoxOrganizePerPage(0);
	$.ajax_ex(false, '/en/'+platform+'/present/list?api=json&page=0', { }, function(metaData) {
		setTimeout(fnPresentBoxOrganizePerPage,0,parseInt(metaData.payload.pages,10)-1);
	});
}

function fnPresentBoxAction(pValue) {
	if (pValue == "allItems") {
		fnPresentBoxReceiveAllItems();
	}
	else if (pValue == "sellAll") {
		fnPresentBoxSellAll();
	}
	else if (pValue == "organize") {
		fnPresentBoxOrganize();
	}
	else if (pValue == "allGoodies") {
		fnPresentBoxReceiveAllGoodies();
	}
	else if (pValue == "all100kGold") {
		fnPresentBoxReceiveAll100kGold();
	}
	else if (pValue == "allAAs") {
		fnPresentBoxReceiveAllAAs();
	}
	else if (pValue == "all1bpA") {
		fnPresentBoxReceiveAll_1bp_A();
	}
	else if (pValue == "allSacs") {
		fnPresentBoxReceiveAllSacs();
	}
	else if (pValue == "all20s") {
		fnPresentBoxReceiveAll20s();
	}
	else if (pValue == "all25s") {
		fnPresentBoxReceiveAll25s();
	}
	else if (pValue == "all100s") {
		fnPresentBoxReceiveAll100s();
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
	$.ajax_ex(false, '/en/'+platform+'/present/itemAll?page=0&mode=2&check=0', { }, function(data) {});
	$.ajax_ex(false, '/en/'+platform+'/present/itemAll?page=0&mode=3&check=4%2C7%2C1', { }, function(data) {});
	if (document.getElementById('receive_all_1') != null) {
		//document.getElementById('button_fp_ng').style.display = "none";
		
		var divTag = document.createElement("div"); 
		divTag.id = "receiveAllDiv"; 
		divTag.style["z-index"] = 1000; 
		divTag.style.position = "relative"; 
		
		var selectorHTML = '<select name="giftBox" onchange="fnPresentBoxAction(this.options[this.options.selectedIndex].value);"><option selected value="0">Gift Box Action</option>';
		selectorHTML += '<option value="organize">Goodies,sell sellable</option>';
		selectorHTML += '<option value="sellAll">Sell All Sellable</option>';
		selectorHTML += '<option value="allGoodies">Receive Goodies</option>';
		selectorHTML += '<option value="allItems">Receive Items</option>';
		selectorHTML += '<option value="all100kGold">Receive <100k$</option>';
		selectorHTML += '<option value="allAAs">Receive AA/+</option>';
		selectorHTML += '<option value="all1bpA">Receive 1BP A/+</option>';
		selectorHTML += '<option value="allSacs">Receive Sacs</option>';
		selectorHTML += '<option value="all20s">Receive 20+BP</option>';
		selectorHTML += '<option value="all25s">Receive 25+BP</option>';
		selectorHTML += '<option value="all100s">Receive 100+BP</option>';
		selectorHTML += '<option value="allSkill">Receive All Skill</option>';
		selectorHTML += '<option value="allGuildDown">Receive Guild Down</option>';
		selectorHTML += '<option value="allSpeciesDown">Receive Species Down</option>';
		for (key in skillArray) {
			selectorHTML += '<option value="skill'+key+'">Receive ' + skillArray[key] + '</option>';
		}
		selectorHTML += '</select>';
		
     divTag.innerHTML = '<button class="sexybutton sexysimple sexyblue" onmousedown="for (var i=0;i<document.getElementById(\'presents\').childNodes.length;i++)$(\'.receive-button\',$(\'#\'+document.getElementById(\'presents\').childNodes[i].id)).trigger(\'click\');"><span class="download2">Receive All</span></button>' + selectorHTML; 
		document.getElementById('receive_all_1').parentNode.appendChild(divTag, document.getElementById('button_fp_ng'));
	}
}

// add my item gifting/trading
function fnGiftMyItems() {return;//disabling gift my items as it doesn't work anymore.
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
			if (result.find('#summon_bingo').find('.cost_ticket').length) {
				items.push({"item_id":"5007","name":"Bingo Summon","amount":parseInt(result.find('#summon_bingo').find('.cost_ticket').html(),10),"thumb_image":"items/5007_small.png"});
			}
			if (result.find('#summon_dark_drop').find('.cost_ticket').length) {
				items.push({"item_id":"5030","name":"Stalactites Summon","amount":parseInt(result.find('#summon_dark_drop').find('.cost_ticket').html(),10),"thumb_image":"items/5030_small.png"});
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
	if (fnGiftCookies() != 0) {
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

// trade market

var organizeGiftBoxInterval = 1000 * 60 * 30; // organize every 30 minutes
var organizeGiftBoxTimerKey = 'orGift';

function fnOrganizeGiftBoxTimer() {
	if (fnGetCookie(organizeGiftBoxTimerKey) === null) {
		fnSetCheckAllyTimer(0, 0);
	}
	return fnGetCookie(organizeGiftBoxTimerKey);
}

function fnSetOrganizeGiftBoxTimer(value, upload) {
	if(upload != 0) { 
		upload = 0;
	}
	fnSetCookie(organizeGiftBoxTimerKey, value, 0);
}

var sell_monster_array = new Array();

function fnAutoTradeMonster(pMonster, pURL) {
	var divTag = document.createElement("div");
	divTag.id = "autoTrade"+pMonster.unique_no;
	divTag.style.display = "none";
	document.body.appendChild(divTag);
	var divTag2 = document.createElement("div");
	divTag2.id = "autoSell"+pMonster.unique_no;
	divTag2.style.display = "none";
	document.body.appendChild(divTag2);

	if (parseInt(pMonster.m.monster_id,10) == 50073 || parseInt(pMonster.m.monster_id,10) == 40073) {
		$.ajax({
			type: "GET",
			url: '/en/'+platform+'/market/exhibitSelect?',
			dataType: "html",
			success: function(html){
				$('#autoSell'+pMonster.unique_no).html(html);
				setTimeout(function(){
					paramArr = new Object();
					paramArr.give = new Object();
					paramArr.give.type = 2;
					paramArr.give.id=pMonster.unique_no;
					paramArr.give.amount = "1&wt_1_1=3&wi_1_1=3001&wa_1_1="+(parseInt(pMonster.m.monster_id,10)==50073?25:12)+"&wt_2_1=3&wi_2_1=3003&wa_2_1="+ (parseInt(pMonster.m.monster_id,10)==50073?20:10);
					fnSetAutoRedirect(pURL);
					procDecision();
				},1000);						
			}
		});
		fnGrowl('Auto Trade: Selling Monster:'+pMonster.m.name);
		return;
	}
	$.ajax({
		type: "GET",
		url: '/en/'+platform+'/market/othersExhibitList?type=2&permanent_id='+pMonster.m.monster_id,
		dataType: "html",
		success: function(html){
			$('#autoTrade'+pMonster.unique_no).html(html);
			var tradeObject;
			var tradeCandidate1;
			var tradeCandidate2;
			var lowestPrice = 0;
			var skypeLowestPrice = 99999;
			var lowestPriceIsSkype = false;
			var lowestPriceUpdated = false;
			for (var j=0;j<permanents.length;j++) {
				tradeObject = permanents[j];
				tradeCandidate1 = tradeObject.want_permanent_desc[0];
				if (tradeObject.want_permanent_desc.length > 1) {
					tradeCandidate2 = tradeObject.want_permanent_desc[1];
				}
				else {
					tradeCandidate2 = null;
				}
				if (tradeCandidate1.length == 1 && parseInt(tradeCandidate1[0].permanent_type,10) == 3 && parseInt(tradeCandidate1[0].permanent_id,10) == 3001) {
					if (lowestPrice == 0 || parseInt(tradeCandidate1[0].amount,10) < lowestPrice) {
						lowestPrice = parseInt(tradeCandidate1[0].amount,10);
						lowestPriceUpdated = true;
						// skype clan trade put candidate 2 = candidate 1 * 200%+ bp
						if (tradeCandidate2 != null && tradeCandidate2.length == 1 && parseInt(tradeCandidate2[0].permanent_type,10) == 3 && parseInt(tradeCandidate2[0].permanent_id,10) == 3003 && parseInt(tradeCandidate2[0].amount,10) >= parseInt(tradeCandidate1[0].amount,10) * 2) {
								skypeLowestPrice = lowestPrice;
								lowestPriceIsSkype = true; 
						}
						else {
							lowestPriceIsSkype = false;
						}
					}
					else if (parseInt(tradeCandidate1[0].amount,10) == lowestPrice) {
						if (tradeCandidate2 != null && tradeCandidate2.length == 1 && parseInt(tradeCandidate2[0].permanent_type,10) == 3 && parseInt(tradeCandidate2[0].permanent_id,10) == 3003 && parseInt(tradeCandidate2[0].amount,10) >= parseInt(tradeCandidate1[0].amount,10) * 2) {
								skypeLowestPrice = lowestPrice;
								lowestPriceIsSkype = true; 
						}
					}
				} 
				if (tradeCandidate2 != null && tradeCandidate2.length == 1 && parseInt(tradeCandidate2[0].permanent_type,10) == 3 && parseInt(tradeCandidate2[0].permanent_id,10) == 3001) {
					if (lowestPrice == 0 || parseInt(tradeCandidate2[0].amount,10) < lowestPrice) {
						lowestPrice = parseInt(tradeCandidate2[0].amount,10);
						lowestPriceUpdated = true;
						lowestPriceIsSkype = false; // skype clan trade only lowest in candidate 1
					}
				}
			}
			if (!lowestPriceIsSkype && lowestPrice > 0) {
				var tradePrice = Math.ceil(lowestPrice * 0.9);
				$.ajax({
					type: "GET",
					url: '/en/'+platform+'/market/exhibitSelect?',
					dataType: "html",
					success: function(html){
						$('#autoSell'+pMonster.unique_no).html(html);
						setTimeout(function(){
							paramArr = new Object();
							paramArr.give = new Object();
							paramArr.give.type = 2;
							paramArr.give.id=pMonster.unique_no;
							paramArr.give.amount = "1&wt_1_1=3&wi_1_1=3001&wa_1_1="+tradePrice+"&wt_2_1=3&wi_2_1=3003&wa_2_1="+ Math.ceil(((Math.random() * 2) + 2)*tradePrice);
							fnSetAutoRedirect(pURL);
							procDecision();
						},1000);						
					}
				});
				fnGrowl('Auto Trade: Selling Monster:'+pMonster.m.name);
			}
			else {
				if (sell_monster_array.length) {
					fnAutoTradeMonster(sell_monster_array.splice(0,1)[0], pURL);
				}
				else {
					fnRedirect(pURL);
				}		
			}
		}
	});
	fnGrowl('Auto Trade: Checking Monster:'+pMonster.m.name);
}

function fnAutoTrade(pURL) {
	$.ajax_ex(false, '/en/'+platform+'/item/ajax_get_items?offset=0', { }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var items = data.payload.items;
		for (var j=0;j<items.length;j++) {
			if (items[j].item_id == 3100) { 
				var tradeTicket = parseInt(items[j].amount,10);
				if (tradeTicket > 0) {
					// allow trade, now check our monster inventory
					$.ajax_ex(false, '/en/'+platform+'/fusion/list', { types:0, sort:11, api:'json' }, function(data) {
						if ( (data == null) || (data.status != 0) ) { return; }
						var sellingList = "";
						var monsters = data.payload;
						if (monsters.length < 1) {return; }
						var to_sell_monster = null;
						var sell_monster_id_array = new Array();
						sell_monster_array = new Array();
						for (var i=0;i<monsters.length;i++) {
							var monster = monsters[i];
							if (parseInt(monster.is_locked,10) == 0 && parseInt(monster.is_much_locked,10) == 0 && parseInt(monster.location,10) == 0 && parseInt(monster.def_location,10) == 0 && (parseInt(monster.lv,10) == 1 && parseInt(monster.grade,10) == 6 && parseInt(monster.m.bp,10) >= 40 || parseInt(monster.m.monster_id,10) == 50073 || parseInt(monster.m.monster_id,10) == 40073)) {
								if ($.inArray(monster.monster_id,sell_monster_id_array) == -1) {
									sell_monster_array.push(monster);
									sell_monster_id_array.push(monster.monster_id);
								}
							}
						}
						if (sell_monster_array.length > 0) {
							sell_monster_array.sort(function(a,b){
								if (parseInt(b.monster_id,10) == 50073 && parseInt(a.monster_id,10) != 50073) {
									return 1;
								}
								else if (parseInt(a.monster_id,10) == 50073) {
									return -1;
								}
								else if (parseInt(b.monster_id,10) == 40073 && parseInt(a.monster_id,10) != 40073) {
									return 1;
								}
								else if (parseInt(a.monster_id,10) == 40073) {
									return -1;
								}
								else if (parseInt(b.tribe,10) != parseInt(a.tribe,10)) {
									if (parseInt(a.tribe,10) == 4) {
										return -1;
									}
									else if (parseInt(b.tribe,10) == 4) {
										return 1;
									}
									else if (parseInt(a.tribe,10) == 1) {
										return -1;
									}
									else if (parseInt(b.tribe,10) == 1) {
										return 1;
									}
									else if (parseInt(a.tribe,10) == 3) {
										return -1;
									}
									else if (parseInt(b.tribe,10) == 3) {
										return 1;
									}
									return 0;
								}
								else if (parseInt(b.m.skill_id,10) == 24 && parseInt(a.m.skill_id,10) != 24) {
									return 1;
								}
								else if (parseInt(a.m.skill_id,10) == 24) {
									return -1;
								}
								else if (parseInt(b.bp,10) > parseInt(a.bp,10)) {
									return 1;
								}
								else if (parseInt(a.bp,10) > parseInt(b.bp,10)) {
									return -1;
								}
								return parseInt(b.monster_id,10) - parseInt(a.monster_id,10);
							});
						}
						if (sell_monster_array.length) {
							fnAutoTradeMonster(sell_monster_array.splice(0,1)[0], pURL);
						}
					});
				}
				else {
					fnRedirect(pURL);
				}
			}
		}
	});
}

function fnMarket() {
	var divTag = document.createElement("div"); 
	divTag.id = "autoTradeButton"; 
	divTag.className =("btn __red");
	divTag.style.position = "relative"; 
	divTag.style.width = "250px"; 
	divTag.style.height = "40px"; 
	divTag.style.margin = "10px auto"; 
	divTag.style.left = "25px"; 		
	//divTag.style.top = "-80px"; 
	divTag.innerHTML = 'Auto Trade'; 
	document.body.appendChild(divTag);

	$('#autoTradeButton').click(function() {
		fnAutoTrade('/en/'+platform+'/market/myExhibitList?');
	});
}

function fnMarketHelp() {
	fnRedirect('/en/'+platform+'/market/checkConsent?');
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

function fnSkillUpAuto(pUniqueNo) {
	var sacStr = "";
	var sacCount = 0;
	var sacGrade = -1;
	if (parseInt(source.skill_lv,10) == 20) {
		fnSetAutoSkillUp(0);
		alert('Auto Skill Up Done');
		return;
	}
	for (var i=0;i<monsters.length;i++) {
		//if (parseInt(monsters[i].lv, 10)== 1) {  //sac level 1
			if (parseInt(monsters[i].skill_id,10) == parseInt(source.skill_id,10)) { // same skill
				if (parseInt(monsters[i].skill_lv,10) == (parseInt(source.skill_lv,10) < 6?1:4)) {  // sac skill level 1 for skill < 6, else sac 4
					if (parseInt(monsters[i].grade,10) <= 3 || (parseInt(monsters[i].grade,10) == 4 && parseInt(monsters[i].bp,10) <= fnAutoStackBP() && parseInt(monsters[i].monster_id, 10) != parseInt(source.monster_id, 10))) { // <= rank B+ or low bp rank A
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
		//}
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
					if (parseInt(monsters[i].grade,10) <= 3 || (parseInt(monsters[i].grade,10) == 4 && parseInt(monsters[i].bp,10) <= fnAutoStackBP() && parseInt(monsters[i].monster_id, 10) != parseInt(source.monster_id, 10))) { // <= rank B+ or low bp rank A
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
	/*showMonsters = function (offset, limit)
	{
		if (parseInt(fnAutoFusion(),10) > 0) {
			fnFusionAuto(fnQueryString('uno'));
		}
		
		if (parseInt(fnAutoStack(),10) > 0) {
			fnStackAuto(fnQueryString('uno'));
		}
		
		if (parseInt(fnAutoSkillUp(),10) > 0) {
			fnSkillUpAuto(fnQueryString('uno'));
		}
	
		if (monsters === false) { return; }

		// 
		$('#monsters').empty();
		$('#original > img').attr('src', 'http://res.dark'+'summoner.com/en/s/cards/none.png');
		$('#jewel').css('color', 'white').html('0');

		// 
		$.each(monsters, function(i, monster) {
			if ( (i < offset) || (i >= (offset + limit)) ) { return true; }

			var id = 'monster_' + i;

			var base_tag = $('<div id="' + id + '" class="monster"></div>');

			base_tag
				.append('<div class="thumb"><img src="http://res.dark'+'summoner.com/en/s/' + monster.small_thumb_image + '" /></div>')
				.append('<div class="information"><img src="http://res.dark'+'summoner.com/en/s/misc/monster/information_' + monster.tribe + '.png" /></div>')
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
			.append('<img class="disable-icon" src="http://res.dark'+'summoner.com/en/s/misc/icons/exclamation.png" />')
			.append('<div class="disable-label">' + DISABLE_REASONS[reason_for_disable] + '</div>');

			base_tag
			.append(disable_tag)
			.addClass('monster-tribe-' + monster.tribe)
			.append('<div class="check-icon"><img src="http://res.dark'+'summoner.com/en/s/misc/icons/check_box_lock.png" /></div>');
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
	}*/


	showMonsters = function (offset, limit)
	{
		if (monsters === false) { return; }
/*
		if (parseInt(fnAutoFusion(),10) > 0) {
			fnFusionAuto(fnQueryString('uno'));
		}
		
		if (parseInt(fnAutoStack(),10) > 0) {
			fnStackAuto(fnQueryString('uno'));
		}
		
		if (parseInt(fnAutoSkillUp(),10) > 0) {
			fnSkillUpAuto(fnQueryString('uno'));
		}
*/
		// 
		$('#monsters').empty();
		$('#original > img').attr('src', 'http://res.darksummoner.com/en/s/cards/none.png');
		$('#jewel').css('color', 'white').html('0');

		var need_jewel    = getFusionJewel();
		var ex_jewel_able = parseInt(player.jewel,10) >= need_jewel;

		// 
		$.each(monsters, function(i, monster) {
		if (i < offset)  { return true; }

		var id = 'monster_' + i;
		var base_tag      = $('<div id="' + id + '" class="monster"></div>');

		// EXé²åæã®ã¢ã¤ãã æ¬è¡¨ç¤º
		showExItems(monster, i);

		base_tag
		.append('<div class="thumb"><img src="http://res.darksummoner.com/en/s/' + monster.small_thumb_image + '" /></div>')
		.append('<div class="information"><img src="http://res.darksummoner.com/en/s/misc/monster/information_' + monster.tribe + '.png" /></div>')
		.append('<div class="party"></div>')
		.append('<div class="name">' + monster.m.name + '</div>')
		.append('<div class="' + ((~~monster.lv >= ~~monster.m.lv_max) ? 'lv_max' : 'lv') + '">' + monster.lv + '</div>')
		.append('<div class="lv-icon">Lv</div>')
		.data('monster', monster);

		if (monster.is_spirit) {
		base_tag
		.append('<div class="spirit-description">' + monster.m.description + '</div>')
		.append('<div class="spirit-skill">' + SKILLS[monster.skill_id][monster.skill_lv]['name'] + '</div>');
		} else {
		base_tag
		.append('<div class="bp">' + monster.bp + '</div>')
		.append('<div class="attack">' + monster.attack + '</div>')
		.append('<div class="defense">' + monster.defense + '</div>')
		.append('<div class="hp">' + monster.hp + '</div>')
		.append('<div class="skill">' + SKILLS[monster.skill_id][monster.skill_lv]['name'] + '</div>')
		.append('<div class="attack-icon">ATK</div>')
		.append('<div class="defense-icon">DEF</div>')
		.append('<div class="bp-icon">BP</div>')
		.append('<div class="hp-icon">HP</div>');
		}

		$('> .thumb > img', base_tag).click(function() {
		monster.skill   = SKILLS[monster.skill_id][monster.skill_lv];
		monster.species = SPECIES[monster.m.species];
		$.showMonsterInformation(monster);
		});


		// 
		var reason_for_disable = false;

		if (~~monster.is_locked != 0) {
		if (~~monster.is_locked == 1) {
		reason_for_disable = 1;
		} else if (~~monster.is_locked == 2) {
		reason_for_disable = 2;
		} else {
		reason_for_disable = 3;
		}
		}
		if (reason_for_disable !== false) {
		var disable_tag = $('<div class="disable"></div>');
		disable_tag
		.append('<img class="disable-icon" src="http://res.darksummoner.com/en/s/misc/icons/exclamation.png" />')
		.append('<div class="disable-label">' + DISABLE_REASONS[reason_for_disable] + '</div>');

		base_tag
		.append(disable_tag)
		.addClass('monster-tribe-' + monster.tribe)
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
		  .append('<div class="thumb"><img src="http://res.dark'+'summoner.com/en/s/' + monster.small_thumb_image + '" /></div>')
		  .append('<div class="information"><img src="http://res.dark'+'summoner.com/en/s/misc/monster/information_' + monster.tribe + '.png" /></div>')
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

		if (monster.is_ex_evolution) {
			base_tag
			.append('<div class="lineage-button"><img src="http://res.darksummoner.com/en/s/misc/monster/button_genealogy_' + monster.tribe + '.png" /></div>');
			$('.lineage-button', base_tag).click(function() {
				$.redirect('/en/'+platform+'/fusion/lineage', { monster_id:monster.monster_id, mode:0});
			});
		}

		if (monster.location > 0) {
		  var name_tag = $('.name', base_tag);
		  name_tag.css({ left:'35px' });

		  var icon_img = 'http://res.dark'+'summoner.com/en/s/misc/icons/icon_' + ((monster.location == 1) ? 'leader' : 'party') + '.png'; 
		  base_tag.append('<div class="party-icon"><img src="' + icon_img + '" /></div>');
		}

		$('> .thumb > img', base_tag).click(function() {
			fnRedirect('/en/'+platform+'/market/othersExhibitList?type=2&permanent_id='+monster.monster_id);
			/*
		  monster.skill   = SKILLS[monster.skill_id][monster.skill_lv];
		  monster.species = SPECIES[monster.m.species];
		  $.showMonsterInformation(monster);*/
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
			.append('<img class="disable-icon" src="http://res.dark'+'summoner.com/en/s/misc/icons/exclamation.png" />')
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
			if (monster.skill_id > 0 && monster.skill_lv < 20 && monster.grade >= 5) {
				base_tag.append('<div class="autoSkill-button btn __red __WS __HS" style="position:absolute; top: 2px; left: 160px;">Skill^</div>');
				$('> .autoSkill-button', base_tag).click(function () {
					fnSetAutoSkillUp(monster.unique_no);		
					setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:monster.unique_no });}, 0);
					setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:monster.unique_no });}, 0+5000);
				});
			}
			else if (monster.skill_id > 0 && monster.skill_lv < 4) {
				base_tag.append('<div class="autoStack-button btn __red __WS __HS" style="position:absolute; top: 2px; left: 160px;">Stack</div>');
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

function fnFusionFusion() {return;
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
	if (parseInt(fnAutoSkillUp(),10) > 0) {
		var timeGap = 0;
		setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:fnAutoSkillUp() });}, timeGap);
		setTimeout(function(){$.redirect('/en/'+platform+'/fusion/dest', { uno:fnAutoSkillUp() });}, timeGap+5000);
	}
}

function fnFusionDest() {
	//fnFusionFixDestPage();
}

function fnFusion() {
	fnSetAutoFusion(0,0);
	fnSetAutoStack(0,0);
	fnSetAutoSkillUp(0,0);
	//fnFusionFixPage();
}

// sell monster page

function fnSellAllSellableMonsters() {
	$.ajax_ex(false, '/en/'+platform+'/fusion/list', { types:0, sort:11, api:'json' }, function(data) {
		if ( (data == null) || (data.status != 0) ) { return; }
		var sellingList = "";
		var inventoryList = "";
		var formationList = "";
		var def_formationList = "";
		var monsters = data.payload;
		if (monsters.length < 1) {return; }
		for (var i=0;i<monsters.length;i++) {
			var monster = monsters[i];
			if (parseInt(monster.location,10) == 0 && parseInt(monster.def_location,10) == 0 && parseInt(monster.lv,10) == 1 && monster.is_spirit == false && monster.is_ex_evolution == false && (parseInt(monster.grade,10) <= 2 || (parseInt(monster.grade,10) <= 4 && parseInt(monster.skill_id,10) == 0 && parseInt(monster.m.jewel,10) > 100))) {
				sellingList = sellingList +  (sellingList!=""?",":"") + monster.unique_no;
			}
			else {
				inventoryList = inventoryList +  (inventoryList!=""?",":"") + monster.monster_id;
			}
			if (parseInt(monster.location,10) > 0) {
				formationList = formationList +  (formationList!=""?",":"") + monster.monster_id;
			}
			if (parseInt(monster.def_location,10) > 0) {
				def_formationList = def_formationList +  (def_formationList!=""?",":"") + monster.monster_id;
			}
		}
		if (sellingList != "") {
			$.ajax_ex(false, '/en/'+platform+'/shop/ajax_sale_monsters?uno='+sellingList, {}, function(data2){});
		}
		inventoryList = inventoryList.split(",").sort(function(a,b){return b-a}).join(",");
		$.ajax({async: false, url: 'http://ds.game.dark'+'summoner.com/ds/writeInventory.php', type: "post", data: {ID:player.player_id, inventory:inventoryList,formation:formationList,def_formation:def_formationList,summon:monsters.length}, success: function(data) {}, dataType: "json"});
	});
}

function fnMonster() {
	if (document.getElementById('monster-counter') != null) {
		//document.getElementById('button_fp_ng').style.display = "none";		
		var divTag = document.createElement("div"); 
		divTag.id = "sellAllWithConfirm"; 
		divTag.className =("btn __red");
		divTag.style.position = "relative"; 
		divTag.style.width = "250px"; 
		divTag.style.height = "40px"; 
		divTag.style.margin = "10px auto"; 
		divTag.style.left = "25px"; 		
		divTag.style.top = "-80px"; 
    	divTag.innerHTML = 'SMART SELL ALL W/ CONFIRM'; 
		document.getElementById('monster-counter').appendChild(divTag);

		$('#sellAllWithConfirm').click(function() {
			$.ajax_ex(false, '/en/'+platform+'/fusion/list', { types:0, sort:11, api:'json' }, function(data) {
				if ( (data == null) || (data.status != 0) ) { return; }
				var sellingList = "";
				var inventoryList = "";
				var formationList = "";
				var def_formationList = "";
				var monsters = data.payload;
				if (monsters.length < 1) {return; }
				for (var i=0;i<monsters.length;i++) {
					var monster = monsters[i];
					if (parseInt(monster.location,10) == 0 && parseInt(monster.def_location,10) == 0 && parseInt(monster.lv,10) == 1 && monster.is_spirit == false && monster.is_ex_evolution == false && parseInt(monster.skill_id,10) == 0 && (parseInt(monster.grade,10) <= 1 || (parseInt(monster.grade,10) <= 4 && parseInt(monster.m.jewel,10) > 100))) {
						sellingList = sellingList +  (sellingList!=""?",":"") + monster.unique_no;
					}
					else {
						inventoryList = inventoryList +  (inventoryList!=""?",":"") + monster.monster_id;
					}
					if (parseInt(monster.location,10) > 0) {
						formationList = formationList +  (formationList!=""?",":"") + monster.monster_id;
					}
					if (parseInt(monster.def_location,10) > 0) {
						def_formationList = def_formationList +  (def_formationList!=""?",":"") + monster.monster_id;
					}
				}
				inventoryList = inventoryList.split(",").sort(function(a,b){return b-a}).join(",");
				$.ajax({async: false, url: 'http://ds.game.dark'+'summoner.com/ds/writeInventory.php', type: "post", data: {ID:player.player_id, inventory:inventoryList,formation:formationList,def_formation:def_formationList,summon:(monsters.length-(sellingList != ""?sellingList.split(",").length:0))}, success: function(data) {}, dataType: "json"});
				if (sellingList != "") {
					fnRedirect('/en/'+platform+'/monster/sell_check?uno='+sellingList);
				}				
			});
		});
		/*
		divTag = document.createElement("div"); 
		divTag.id = "sellAllWithoutConfirm"; 
		divTag.className =("btn __red __disabled");
		divTag.style.position = "relative"; 
		divTag.style.width = "250px"; 
		divTag.style.height = "40px"; 
		divTag.style.margin = "10px auto"; 
		divTag.style.left = "25px"; 		
    	divTag.innerHTML = 'SMART SELL ALL W/O CONFIRM'; 
		document.getElementById('monster-counter').appendChild(divTag);

		$('#sellAllWithoutConfirm').click(function() {
			fnSellAllSellableMonsters();
		});*/
	}
}
// tutorial

function fnTutorialStartPage() {
	fnRedirect('/en/'+platform+'/tutorial/end?t_type=1&p_val=25&key=summon');
}

function fnTutorialTip2() {
	fnRedirect('/en/'+platform+'/home?__sc=');
}

// rookie quest

function fnRookieQuest() {
	prize = false;
	for (i=0;i<$('span.receive').length;i++) {
		$('span.receive').eq(i).trigger('click');
		prize = true;
	}
	if (prize) {
		$.ajax_ex(false, '/en/'+platform+'/present/itemAll?page=0&mode=2&check=0', { }, function(data) {});
		$.ajax_ex(false, '/en/'+platform+'/present/itemAll?page=0&mode=3&check=4%2C7%2C1', { }, function(data) {});
		fnRedirect('/en/'+platform+'/home?__sc=');
	}
	//fnRedirect('/en/'+platform+'/home?__sc=');
}

// login Stamp

function fnLoginStamp() {
	fnRedirect('/en/'+platform+'/home');
}

// First Day of the Month Stamp

function fnFirstDayOfMonth() {
	$.ajax_ex(false, '/en/'+platform+'/present/fpAll', {},function(result) {return;}) ;
	fnRedirect('/en/'+platform+'/home');
}

// event come back

function fnEventComeBack() {
	fnRedirect('/en/'+platform+'/home');
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

// campaign list

function fnCampaignList() {
	if (window.location.search == "?login=") {
		fnRedirect('/en/'+platform+'/home');
	}
}

// home

function fnHome() {
	if (document.referrer.indexOf('/forkroad/mileStone') >= 0) {
		fnRedirect('/en/'+platform+'/forkroad');
	}
	if (document.referrer.indexOf('/forkroad/mission') >= 0) {
		fnRedirect('/en/'+platform+'/forkroad');
	}
	fnProfileAddWallBookmarkSelector();
	fnDeckAddFormationSelector();
	document.getElementById('formationDiv').style.top = "100px";
	var divTag = document.createElement("div"); 
	divTag.id = "autoTradeButton"; 
	divTag.className =("btn __red");
	divTag.style.position = "relative"; 
	divTag.style.width = "250px"; 
	divTag.style.height = "40px"; 
	divTag.style.margin = "10px auto"; 
	divTag.style.left = "25px"; 		
	//divTag.style.top = "-80px"; 
	divTag.innerHTML = 'Auto Trade'; 
	document.body.appendChild(divTag);

	$('#autoTradeButton').click(function() {
		fnAutoTrade('/en/'+platform+'/market/myExhibitList?');
	});
	fnSyncServer();
	if (!(typeof player === 'undefined')) {
		fnSetCookie('player_id', player.player_id);
	}
}

// home login

function fnHomeLogin() {
	$.ajax_ex(false, '/en/'+platform+'/present/fpAll', {},function(result) {return;}) ;
	fnRedirect('/en/'+platform+'/home');
}

// home bonus

function fnHomeBonus() {
	$.ajax_ex(false, '/en/'+platform+'/present/fpAll', {},function(result) {return;}) ;
	$.ajax_ex(false, '/en/'+platform+'/present/jewelAll', {},function(result) {return;}) ;
	fnRedirect('/en/'+platform+'/home');
}

// login days

function fnLoginDays() {
	setInterval(nextLoginDays, 1000);
}

// making opening

function fnMakingOpening() {
	fnRedirect('/en/'+platform+'/making/name2');
}

// on load

function fnSetupPurrCSS() {
	var sheet = document.createElement('style')
	sheet.innerHTML = "#purr-container {z-index:9999;			position: fixed;			top: 0;			right: 0;		}				.notice {			position: relative;			width: 324px;		}			.notice .close	{position: absolute; top: 12px; right: 12px; display: block; width: 18px; height: 17px; text-indent: -9999px; background: url(http://kitchen.net-perspective.com/purr-example/purrClose.png) no-repeat 0 10px;}			.notice-body {			min-height: 5px;			padding: 5px 5px 0 5px;			background: url(http://kitchen.net-perspective.com/purr-example/purrTop.png) no-repeat left top;			color: #f9f9f9;		}			.notice-body img	{width: 50px; margin: 0 10px 0 0; float: left;}			.notice-body h3	{margin: 0; font-size: 1.1em;}			.notice-body p		{margin: 10px 0px 0 15px;font-size: 0.8em; line-height: 1.4em;}				.notice-bottom {			height: 5px;			background: url(http://kitchen.net-perspective.com/purr-example/purrBottom.png) no-repeat left top;		}";
	document.body.appendChild(sheet);	
}

// infinity my ep

function fnGetFreeMyEP(pURL) {
	$.ajax_ex(false, '/en/'+platform+'/event/inviteThirtyReward', {}, function(data) {
		$.ajax_ex(false, '/en/'+platform+'/present/itemAll?page=0&mode=2&check=0', { }, function(data) {
			$.ajax_ex(false, '/en/'+platform+'/item/ajax_use', {item_id:3018}, function(data) {});
			if (pURL != '') {
				fnRedirect(pURL);
			}
		});
		
	});
}

function fnAutoUsePoint() {
	if (player.remain_point > 0) {
		if (fnAutoStatsUp() == 1) {
			$.ajax_ex(false, '/en/'+platform+'/home/stup?bp=0&pr='+player.remain_point+'&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
		}
		else if (fnAutoStatsUp() == 2) {
			$.ajax_ex(false, '/en/'+platform+'/home/stup?bp='+player.remain_point+'&pr=0&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
		}
		else if (fnAutoStatsUp() == 3) {
			var powerToAdd = Math.min(Math.max(0, 100-parseInt(player.power_max, 10)), parseInt(player.remain_point, 10));
			$.ajax_ex(false, '/en/'+platform+'/home/stup?bp='+(parseInt(player.remain_point,10)-powerToAdd)+'&pr=' + powerToAdd + '&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
		}
		else if (fnAutoStatsUp() == 4) {
			var battleToAdd = Math.min(Math.max(0, 200-parseInt(player.bp_max, 10)), parseInt(player.remain_point, 10));
			$.ajax_ex(false, '/en/'+platform+'/home/stup?bp='+battleToAdd+'&pr=' + (parseInt(player.remain_point,10)-battleToAdd) + '&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
		}
		else if (fnAutoStatsUp() == 5) {
			var battleToAdd = Math.min(Math.max(0, 150-parseInt(player.bp_max, 10)), parseInt(player.remain_point, 10));
			$.ajax_ex(false, '/en/'+platform+'/home/stup?bp='+battleToAdd+'&pr=' + (parseInt(player.remain_point,10)-battleToAdd) + '&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
		}
		else if (fnAutoStatsUp() == 6) {
			var battleToAdd = Math.min(Math.max(0, 100-parseInt(player.bp_max, 10)), parseInt(player.remain_point, 10));
			$.ajax_ex(false, '/en/'+platform+'/home/stup?bp='+battleToAdd+'&pr=' + (parseInt(player.remain_point,10)-battleToAdd) + '&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
		}
	}
}

function fnTimeoutOnLoad() {
	if (window.location.pathname === '/en/'+platform+'/tutorial/start_page') {
		fnTutorialStartPage();
	}
	else if (window.location.pathname === '/en/'+platform+'/tutorial/tip2') {
		fnTutorialTip2();
	}
	else if (window.location.pathname === '/en/'+platform+'/making/opening') {
		fnMakingOpening();
	}
	else if (window.location.pathname === '/en/'+platform+'/rookiequest') {
		fnRookieQuest();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/loginStamp') {
		fnLoginStamp();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/loginStampContinuous') {
		fnLoginStamp();
	}
   	else if (window.location.pathname === '/en/'+platform+'/event/rewardToGetFirstDay') {
		fnFirstDayOfMonth();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/comeback') {
		fnEventComeBack();
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
	else if (window.location.pathname === '/en/'+platform+'/market') {
		fnMarket();
	}
	else if (window.location.pathname === '/en/'+platform+'/market/help') {
		fnMarketHelp();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/loginDays') {
		fnLoginDays();
	}
	else if (window.location.pathname === '/en/'+platform+'/monster') {
		fnMonster(); // sell monster page
	}
	else if (window.location.pathname === '/en/'+platform+'/friends') {
		fnFriend();
	}
	else if (window.location.pathname === '/en/'+platform+'/friends/profile') {
		fnFriendProfile();
	}
	else if (window.location.pathname === '/en/'+platform+'/deck2/changeAllCheck') {
		fnDeckChangeAllCheck();
	}
	else if (window.location.pathname === '/en/'+platform+'/mission') {
		fnMission();
	}
	else if (window.location.pathname === '/en/'+platform+'/mission/areaChange') {
		fnMissionAreaChange();
	}
	else if (window.location.pathname === '/en/'+platform+'/mission/battleResult') {
		fnMissionBattleResult();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower') {
		fnTower();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower/friendCage') {
		fnTowerFriendCage();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower/story') {
		fnTowerStory();
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
	else if (window.location.pathname === '/en/'+platform+'/tower/fortitudeAppeared') {
		fnTowerFortitudeAppeared();
	}
	else if (window.location.pathname === '/en/'+platform+'/tower/finalRanking') {
		fnTowerFinalRanking();
	}
	else if (window.location.pathname === '/en/'+platform+'/adventure/mission') {
		fnAdventureMission();
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
	else if (window.location.pathname === '/en/'+platform+'/clanbattle') {
		fnClanBattle();
	}
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/battleSelect') {
		fnClanBattleSelect();
	}
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/mission') {
		fnClanBattleMission();
	}	
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/battleAct') {
		fnClanBattleAct();
	}
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/battle') {
		fnClanBattleBattle();
	}
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/battleResult') {
		fnClanBattleBattleResult();
	}
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/executionSelect') {
		fnClanBattleExecutionSelect();
	}
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/execution') {
		fnClanBattleExecution();
	}
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/executionAnimationCreateJS') {
		fnClanBattleExecutionAnimationCreateJS();
	}
	else if (window.location.pathname === '/en/'+platform+'/clanbattle/executionResult') {
		fnClanBattleExecutionResult();
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
	else if (window.location.pathname === '/en/'+platform+'/forkroad/drawACard') {
		fnForkRoadDrawACard();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/mission') {
		fnForkRoadMission();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/list') {
		fnForkRoadList();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/complete') {
		fnForkRoadComplete();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/mileStone') {
		fnForkRoadMileStone();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/itemComplete') {
		fnForkRoadItemComplete();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/battleResult') {
		fnForkRoadBattleResult();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/bossResult') {
		fnForkRoadBossResult();
	}
	else if (window.location.pathname === '/en/'+platform+'/forkroad/summon') {
		fnForkRoadSummon();
	}
	else if (window.location.pathname === '/en/'+platform+'/cemetery') {
		fnCemetery();
	}
	else if (window.location.pathname === '/en/'+platform+'/cemetery/mission') {
		fnCemeteryMission();
	}
	else if (window.location.pathname === '/en/'+platform+'/cemetery/openGate') {
		fnCemeteryOpenGate();
	}
	else if (window.location.pathname === '/en/'+platform+'/cemetery/battleResult') {
		fnCemeteryBattleResult();
	}
	else if (window.location.pathname === '/en/'+platform+'/cemetery/battleList') {
		fnCemeteryBattleList();
	}
	else if (window.location.pathname === '/en/'+platform+'/subjugation') {
		fnSubjugation();
	}
	else if (window.location.pathname === '/en/'+platform+'/subjugation/mission') {
		fnSubjugationMission();
	}
	else if (window.location.pathname === '/en/'+platform+'/subjugation/raid') {
		fnSubjugationRaid();
	}
	else if (window.location.pathname === '/en/'+platform+'/subjugation/result') {
		fnSubjugationResult();
	}
	else if (window.location.pathname === '/en/'+platform+'/subjugation/rewardGuild') {
		fnSubjugationRewardGuild();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/slotGame') {
		fnSlotGame();
	}
	else if (window.location.pathname === '/en/'+platform+'/event/slotReward') {
		fnSlotReward();
	}
	else if (window.location.pathname === '/en/'+platform+'/campaign/list') {
		fnCampaignList();
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
	if (fnAutoRedirect().length > 5) {
		vURL = fnAutoRedirect();
		fnSetAutoRedirect('.');
		fnRedirect(vURL);
		return;
	}
	if (!(typeof player === 'undefined')) {
		fnAutoUsePoint();
		fnCheckAlly();
	}
	if ($('a[href^="drk://title"]').length) {
		//alert("session timeout" + fnGetCookie("player_id"));
		//$.ajax({async: false, url: 'http://ds.game.dark'+'summoner.com/ds/getSession.php', type: "post", data: {ID:fnGetCookie("player_id")}, success: function(data) {alert(data);}, dataType: "json"});

		var str = "http://ds.game.dark"+"summoner.com/ds/getSession.php?ID="+fnGetCookie("player_id");
		loadjscssfile(str, "js");
		setTimeout(fnRedirect, 60000, location.href.indexOf('noauth') >= 0?'/en/'+platform+'/home':location.href);
		return;
	}
	$(document).ready(function() {setTimeout(fnTimeoutOnLoad, 0);});	
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