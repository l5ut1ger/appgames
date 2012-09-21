// 149

// define
var missionInterval;
var progressionList=[50063, 53064, 56064];
// Tools

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
	selectorHTML += '<option value="2121751804">Josh</option>'
	selectorHTML += '<option value="2993558878">mr_saving</option>'
	selectorHTML += '<option value="1806070535">Kissy</option>'
	selectorHTML += '<option value="1330745254">Unreality</option>'	
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
	$.getJSON('/en/ios/bbs/write', {
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
			$.ajax_ex(false, '/en/ios/ranking/list?page=0&tribe=0', { }, function(data) {
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
			$.ajax_ex(false, '/en/ios/ranking/weeklyList?page=0&tribe=0', { }, function(data) {
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
				$.ajax_ex(false, '/en/ios/ranking/list?page='+j+'&tribe=0', { }, function(data) {
					if ( (data == null) || (data.status != 0) ) { return; }
					for (var i=0;i<=data.payload.rankers.length;i++) {
						setTimeout(fnSpam, (j*100+i)*1000, data.payload.rankers[i].player_id, data.payload.rankers[i].player.nickname, spamMsg);
					}
				});
			}
		}
	});
}

function fnProfileFixTabs() {
	document.getElementById('_1').childNodes[7].childNodes[0].innerHTML = "Strategy";
	var divTag = document.createElement("div"); 
	divTag.id = "profile-strategy"; 
	divTag.style.position = "relative"; 
	
	var selectorHTML = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Grinding Speed</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
	selectorHTML += '<select name="sel" onchange="fnSetGrindingSpeed(this.options[this.options.selectedIndex].value);fnGrowl(this.options[this.options.selectedIndex].text);">';
	selectorHTML += '<option ' + (fnGetGrindingSpeed() == -1 ?'selected':'') + ' value="-1">Thumb</option>'
	selectorHTML += '<option ' + (fnGetGrindingSpeed() == 6000 ?'selected':'') + ' value="6000">Legit</option>';
	selectorHTML += '<option ' + (fnGetGrindingSpeed() == 4000 ?'selected':'') + ' value="4000">Seems Legit</option>';
	selectorHTML += '<option ' + (fnGetGrindingSpeed() == 2000 ?'selected':'') + ' value="2000">Ferrari</option>';
	selectorHTML += '<option ' + (fnGetGrindingSpeed() == 1000 ?'selected':'') + ' value="1000">CC Speed</option>';
	selectorHTML += '<option ' + (fnGetGrindingSpeed() == 500 ?'selected':'') + ' value="500">Too Fast</option>';
	selectorHTML += '<option ' + (fnGetGrindingSpeed() == 200 ?'selected':'') + ' value="200">Too Furious</option>'
	selectorHTML += '<option ' + (fnGetGrindingSpeed() == 100 ?'selected':'') + ' value="100">Light</option>'
	selectorHTML += '</select><br/><br/>'; 
	
  var selectorHTML2 = '<div style="position:relative;color:#ae0000;"><img style="position:relative;" src="http://res.darksummoner.com/en/s/misc/icons/summon.png" /> Auto Drink</div><div style="position:relative; width:285px; height:1px;" class="separator-item"></div><br/>';
  selectorHTML2 += '<select name="sel" onchange="fnSetAutoDrink(this.options[this.options.selectedIndex].value);fnGrowl(this.options[this.options.selectedIndex].text);">';
  selectorHTML2 += '<option ' + (fnAutoDrink() == -1 ?'selected':'') + ' value="-1">Off</option>'
  selectorHTML2 += '<option ' + (fnAutoDrink() == 1 ?'selected':'') + ' value="1">On</option>';
  selectorHTML2 += '</select><br/><br/>'; 
   
   
	divTag.innerHTML = selectorHTML; 
  divTag.innerHTML = selectorHTML2; 
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

function fnFriendActionGiftProg() {
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
	$.ajax_ex(false, '/en/ios/fusion/list?types=0&sort=14&api=json', {}, function(result) {
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
			setTimeout(function(){$.redirect('/en/ios/present/suggest?pid='+ friendship.pid + '&mid='+ l1 +"&name="+encodeURIComponent(friendship.nickname));}, 1);
		}
		else {
			alert('you dont have available prog+');
		}
	});
	return;
}

function fnFriendActionSelect(pAction) {
	if (pAction == "GiftC") {
		fnFriendActionGiftC();
	}
	else if (pAction == "GiftP") {
		fnFriendActionGiftProg();
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
	selectorHTML += '<option value="GiftP">Gift Prog+</option>';
	//selectorHTML += '<option value="GiftC">Gift a C/C+</option>'
	selectorHTML+='</select>'; 

	divTag.innerHTML = selectorHTML;
	document.body.appendChild(divTag);
}

function fnProfileFixTradeGiftButton() {
	document.getElementById('do_trade').setAttribute('href', document.getElementById('do_trade').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));
	document.getElementById('do_present').setAttribute('href', document.getElementById('do_present').getAttribute('href')+"&name="+encodeURIComponent(friendship.nickname));
}

function fnFriendProfile() {
	fnProfileAddFriendWallBookmarkSelector();
	fnProfileAddFriendWallBookmarkButtons();
	fnProfileAddFriendActionSelector();
	fnProfileFixTradeGiftButton();
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
		$.ajax_ex(false, '/en/ios/fusion/list?types=0&sort=14&api=json', {}, function(result) {
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
				$.ajax_ex(false, '/en/ios/deck/autoOrganize?l1='+l1+'&l2='+l2+'&l3='+l3+'&l4='+l4+'&l5='+l5, {}, function(result) {});
				setTimeout(function(){$.redirect("/en/ios/home");}, 1);
			}
			else {
				alert('you dont have available prog+');
			}
		});
		return;
	}
	$.ajax_ex(false, pURL, {}, function(data) {
	});	
	document.location='/en/ios/home';
}

function fnDeckAddFormationSelector() {
	var i;
	var divTag = document.createElement("div"); 

	divTag.id = "formationDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "0px"; 
	divTag.style.top = "120px"; 

	var selectorHTML = '<select name="sel" onchange="fnDeckChange(this.options[this.options.selectedIndex].value);"><option selected value="0">Formation</option><option value="prog">Progression On</option>';
	var aFormationArray = fnGetFormationArray();
	for (i=0;i<aFormationArray.length;i++) {
		if (typeof(aFormationArray[i].split(fnGetConnector())[1]) == 'undefined') continue;
		selectorHTML+='<option value="' + aFormationArray[i].split(fnGetConnector())[0] + '">' + aFormationArray[i].split(fnGetConnector())[1] + '</option>';
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
	var team = document.getElementById('a-btn-ok').getAttribute('href');
	var aFormationArray = fnGetFormationArray();
	if (!fnArrayHasItem(aFormationArray, team + fnGetConnector() + "BP " + document.getElementById('div-deck-status').childNodes[7].childNodes[1].innerHTML + " Team")) {
		aFormationArray.splice(0,0,team + fnGetConnector() + "BP " + document.getElementById('div-deck-status').childNodes[7].childNodes[1].innerHTML + " Team");
	}
	else {
		return;
	}
	var aFormationArrayText = aFormationArray.join(fnGetSeparator());
	fnSetCookie(formationString,aFormationArrayText);
	fnGrowl("Saved BP " + document.getElementById('div-deck-status').childNodes[7].childNodes[1].innerHTML + " Team");
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
	
	divTag = document.createElement("div"); 
	divTag.id = "formationRemoveDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "100px"; 
	divTag.style.top = "190px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="javascript:fnDeckUnRecordFormation();fnDeckRemoveFormationSelector();fnDeckAddFormationSelector();">Del</button>'; 
	document.body.appendChild(divTag);
	
	divTag = document.createElement("div"); 
	divTag.id = "formationClearDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "200px"; 
	divTag.style.top = "190px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="javascript:fnDeckClearFormation();fnDeckRemoveFormationSelector();fnDeckAddFormationSelector();">Clear</button>'; 
	document.body.appendChild(divTag);
}

function fnDeckChangeAllCheck() {
	fnDeckAddFormationSelector();
	fnDeckAddFormationButtons();
}

// home

function fnHome() {
	fnProfileAddWallBookmarkSelector();
	fnDeckAddFormationSelector();
	document.getElementById('formationDiv').style.top = "100px";
}

// home login

function fnHomeLogin() {
	$.ajax_ex(false, '/en/ios/present/fpAll', {},function(result) {return;}) ;
	setTimeout(function(){$.redirect("/en/ios/home");}, 1);
}

// home bonus

function fnHomeBonus() {
	$.ajax_ex(false, '/en/ios/present/fpAll', {},function(result) {return;}) ;
	setTimeout(function(){$.redirect("/en/ios/home");}, 1);
}

// tower mission

function fnFixMissionProcess() {
	missionProcess = function() {
		$.ajax_ex(false, '/en/ios/tower/process', {'area_id'    : areaMaster.area_id,'mission_id' : mission.last_mission_id, api : 'json', '__hash': ('' + (new Date()).getTime())}, function(result) {
			if (result.status != 0) {
				if (result.status == 901 && fnAutoDrink() == 1) {
					$.ajax_ex(false, '/en/ios/item/ajax_use', {item_id:result.payload.recoverItems[0].item_id}, function(data) {});
				}
				clearInterval(missionInterval);
				setTimeout(function(){$.redirect("/en/ios/tower/mission");}, 1000);
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
			  if (!isShadow) EfectMng.push('shadowShow', null);
			  isShadow = true;
			  EfectMng.push('reload', null);
			  clearInterval(missionInterval);
			}
			if (result.payload.process.clear) {
			  if (!isShadow) EfectMng.push('shadowShow', null);
			  isShadow = true;
			  if (mission.is_boss) {
				EfectMng.push('reload', null);
				clearInterval(missionInterval);
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
			}
			if (result.payload.process.cage) {
			  if (!isShadow) EfectMng.push('shadowShow', null);
			  isShadow = true;
			  clearInterval(missionInterval);
			  $.ajax_ex(false, '/en/ios/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {  $.redirect("/en/ios/tower/mission"); return;});
			  setTimeout(function(){$.redirect('/en/ios/tower/mission');}, 1000);
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
				document.location='/en/ios/battle/battleact?tower=1&aid='+areaMaster.area_id;
			  }
			}
			EfectMng.push('showSystemBtns', null).play();
		});

		return false;
	};
	EfectMng.efectList.process = __effect_process = function(data) {};
	EfectMng.efectList.cageSelect = __effect_cageSelect = function(data) {
		$.ajax_ex(false, '/en/ios/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {  $.redirect("/en/ios/tower/mission"); return;});
	}
}

function fnTowerMission() {
	fnFixMissionProcess();
	if (document.getElementById('cage-select').style.display != "none") {
		$.ajax_ex(false, '/en/ios/tower/cageUse', {'item_id' : 0, api : 'json',  '__hash' : ('' + (new Date()).getTime()) },function(result) {  			
		});	
	}

	if (fnGetGrindingSpeed() == -1) {
		// user press by himself, dont automate
		return;
	}
	if (!mission.is_boss) {
		missionInterval = setInterval(missionProcess,fnGetGrindingSpeed());
	}
	else {
		setTimeout(function(){$.redirect('/en/ios/battle/battleact?tower=1&aid='+areaMaster.area_id);}, 1000);
		//document.location='/en/ios/battle/battleact?tower=1&aid='+areaMaster.area_id;
	}
}

function fnTower() {
	if (document.getElementById('div-btn-system') != null) {
		setTimeout(function(){$.redirect('/en/ios/tower/subpoena');}, 1000);
	}
}

function fnTowerSummon() {
	setTimeout(function(){$.redirect('/en/ios/tower/mission');}, 1000);
}

// tower boss result

function fnTowerBossResult() {
	$.ajax_ex(false, '/en/ios/tower/bossGetResources', {choice : 1, '__hash' : ('' + (new Date()).getTime()) },function(result) {
		if (result.payload.resources.foundType != null && result.payload.resources.foundType==10 && result.payload.resResult.items[result.payload.itemMaster.item_id].collected_count==6) { 
			setTimeout(function(){$.redirect("/en/ios/tower");}, 1000);
		} else  {
			setTimeout(function(){$.redirect("/en/ios/tower/mission");}, 1000);
		}
	});
}

// battle

function fnBattleBattle() {
	// skip to result
	if (document.referrer.startsWith("http://game.darksummoner.com/en/ios/tower/mission")) {
		setTimeout(function(){$.redirect("/en/ios/tower/bossResult");}, 1000);
		setTimeout(function(){$.redirect("/en/ios/tower/bossResult");}, 5000);
	}
	//setTimeout(function(){$.redirect(document.getElementById('canvas').parentNode.parentNode.childNodes[3].childNodes[3].getAttribute('href'));}, 1000);
}

// present box

function fnPresentBox() {
	if (document.getElementById('button_fp_all') != null) {
		setTimeout(function(){$.redirect("/en/ios/present/fpAll");}, 1000);
		return;
	}
	if (document.getElementById('button_fp_ng') != null) {
		//document.getElementById('button_fp_ng').style.display = "none";
		
		var divTag = document.createElement("div"); 
		divTag.id = "receiveAllDiv"; 
		divTag.style["z-index"] = 1000; 
		divTag.style.position = "relative"; 
     divTag.innerHTML = '<button class="sexybutton sexysimple sexyblue" onmousedown="for (var i=0;i<document.getElementById(\'presents\').childNodes.length;i++)$(\'.receive-button\',$(\'#\'+document.getElementById(\'presents\').childNodes[i].id)).trigger(\'click\');"><span class="download2">Receive All</span></button>'; 
		document.getElementById('button_fp_ng').parentNode.replaceChild(divTag, document.getElementById('button_fp_ng'));
	}
}

// add my item gifting/trading
function fnGiftMyItems() {
	if (typeof(items) !== 'undefined' && items != null) {items.push({"item_id":"3018","name":"My Energy Potion","amount":100,"thumb_image":"items/3018_small.png"});items.push({"item_id":"3020","name":"My Elixer Potion","amount":100,"thumb_image":"items/3020_small.png"});items.push({"item_id":"3022","name":"My 100 Energy Potion","amount":100,"thumb_image":"items/3022_small.png"});items.push({"item_id":"3019","name":"My Battle Point Potion","amount":100,"thumb_image":"items/3019_small.png"});items.push({"item_id":"5005","name":"FREE Rank A Summon","amount":100,"thumb_image":"items/5005_small.png"});items.push({"item_id":"5200","name":"FREE Dark Summon","amount":100,"thumb_image":"items/5200_small.png"});items.push({"item_id":"5026","name":"EPIC Dark Summon","amount":100,"thumb_image":"items/5026_small.png"});}
}

// present suggest

function fnPresentSuggest() {
	if (fnQueryString('mid')!='') {
		$.redirect("/en/ios/present/confirm?ctg=2&amt=1&pid="+fnQueryString('mid'));
		setTimeout(function(){$.redirect("/en/ios/present/confirm?ctg=2&amt=1&pid="+fnQueryString('mid'));}, 1000);
		setTimeout(function(){$.redirect("/en/ios/present/confirm?ctg=2&amt=1&pid="+fnQueryString('mid'));}, 5000);
		return;
	}
	fnGiftMyItems();
}

// present confirm

function fnPresentConfirm() {
	if (fnReferrerQueryString('name') != '') {
		document.getElementById('present-commit').innerHTML = "To:"+decodeURIComponent(fnReferrerQueryString('name'));
	}
}

// trade suggest

function fnTradeSuggest() {
	fnGiftMyItems();
}

// on load

function fnSetupPurrCSS() {
	var sheet = document.createElement('style')
	sheet.innerHTML = "#purr-container {z-index:9999;			position: fixed;			top: 0;			right: 0;		}				.notice {			position: relative;			width: 324px;		}			.notice .close	{position: absolute; top: 12px; right: 12px; display: block; width: 18px; height: 17px; text-indent: -9999px; background: url(http://kitchen.net-perspective.com/purr-example/purrClose.png) no-repeat 0 10px;}			.notice-body {			min-height: 5px;			padding: 5px 5px 0 5px;			background: url(http://kitchen.net-perspective.com/purr-example/purrTop.png) no-repeat left top;			color: #f9f9f9;		}			.notice-body img	{width: 50px; margin: 0 10px 0 0; float: left;}			.notice-body h3	{margin: 0; font-size: 1.1em;}			.notice-body p		{margin: 10px 0px 0 15px;font-size: 0.8em; line-height: 1.4em;}				.notice-bottom {			height: 5px;			background: url(http://kitchen.net-perspective.com/purr-example/purrBottom.png) no-repeat left top;		}";
	document.body.appendChild(sheet);	
}

function fnAutoUsePoint() {
	if (player.remain_point > 0) {
		$.ajax_ex(false, '/en/ios/home/stup?bp=0&pr='+player.remain_point+'&api=json', { '__hash' : ('' + (new Date()).getTime()) },function(result) {return;}) ;
	}
}

function fnOnLoad() {
	loadjscssfile("http://jquery-notice.googlecode.com/svn/trunk/jquery.notice.css?", "css");
	loadjscssfile("http://sexybuttons.googlecode.com/svn/trunk/sexybuttons.css", "css");

	loadjscssfile("http://kitchen.net-perspective.com/purr-example/jquery.purr.js", "js");	
	fnSetupPurrCSS();

	fnCreateBackButton();
	
	fnAutoUsePoint();
	
	if (window.location.pathname === "/en/ios/home/profile") {
		fnProfile();
	}
	if (window.location.pathname === "/en/ios/home") {
		fnHome();
	}
	if (window.location.pathname === "/en/ios/home/login") {
		fnHomeLogin();
	}
	if (window.location.pathname === "/en/ios/home/bonus") {
		fnHomeBonus();
	}
	if (window.location.pathname === "/en/ios/friends/profile") {
		fnFriendProfile();
	}
	if (window.location.pathname === "/en/ios/deck/changeAllCheck") {
		fnDeckChangeAllCheck();
	}
	if (window.location.pathname === "/en/ios/tower") {
		fnTower();
	}
	if (window.location.pathname === "/en/ios/tower/summon") {
		fnTowerSummon();
	}
	if (window.location.pathname === "/en/ios/tower/mission") {
		fnTowerMission();
	}
	if (window.location.pathname === "/en/ios/tower/bossResult") {
		fnTowerBossResult();
	}
	if (window.location.pathname === "/en/ios/battle/battle") {
		fnBattleBattle();
	}
	if (window.location.pathname === "/en/ios/present/box") {
		fnPresentBox();
	}
	if (window.location.pathname === "/en/ios/present/suggest") {
		fnPresentSuggest();
	}
	if (window.location.pathname === "/en/ios/present/confirm") {
		fnPresentConfirm();
	}
	if (window.location.pathname === "/en/ios/trade/suggest1") {
		fnTradeSuggest();
	}
}