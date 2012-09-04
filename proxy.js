function fnOnLoad() {
	//alert(window.location.pathname);
	fnCreateBackButton();
	
	if (window.location.pathname == "/en/ios/home/profile") {
		fnProfile();
	}
	if (window.location.pathname == "/en/ios/friends/profile") {
		fnFriendProfile();
	}
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

function fnProfile() {
	fnProfileAddWallBookmarkSelector();
}

function fnProfileAddWallBookmarkSelector() {
	var divTag = document.createElement("div"); 

	divTag.id = "wallBookmarkDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "200px"; 
	divTag.style.top = "100px"; 

	var selectorHTML = '<select name="sel" onchange="window.location=\'/en/ios/friends/profile?pid=\'+this.options[this.options.selectedIndex].value;"><option selected value="0">Wall Bookmark</option>';
	selectorHTML+='<option value="2398072562">abc</option>';
	selectorHTML+='<option value="1563407917">cde</option>';
	selectorHTML+='</select>'; 

	divTag.innerHTML = selectorHTML;
	document.body.appendChild(divTag);
}

// Friend section /en/ios/friends/profile

function fnFriendProfile() {
	fnProfileAddFriendWallBookmarkSelector();
	fnProfileAddFriendWallBookmarkButtons();
}

function fnProfileAddFriendWallBookmarkSelector() {
	fnProfileAddWallBookmarkSelector();
	document.getElementById('wallBookmarkDiv').style.top = "210px";
}

function fnProfileAddFriendWallBookmarkButtons() {
	var divTag = document.createElement("div"); 
	divTag.id = "wallBookmarkAddDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "100px"; 
	divTag.style.top = "250px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="alert(\"hi\");">Add</button>'; 
	document.body.appendChild(divTag);
	
	divTag = document.createElement("div"); 
	divTag.id = "wallBookmarkRemoveDiv"; 
	divTag.style["z-index"] = 1000; 
	divTag.style.position = "absolute"; 
	divTag.style.left = "150px"; 
	divTag.style.top = "210px"; 
	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onmousedown="alert(\"ha\");">Del</button>'; 
	document.body.appendChild(divTag);
}