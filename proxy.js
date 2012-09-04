function fnOnLoad() {
	//alert(window.location.pathname);
	fnCreateBackButton();
	
	if (window.location.pathname == "/en/ios/home/profile") {
		fnProfile();
	}
}

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

function fnProfile() {
	fnProfileAddWallBookmarkSelector();
}

function fnProfileAddWallBookmarkSelector() {
	var divTag = document.createElement("div"); 

	divTag.id = "wallBookmarkDiv"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "280px"; 
	divTag.style.top = "80px"; 

	var selectorHTML = '<select name=sel onchange="if (this.options[this.options.selectedIndex].value>0) window.location=""/en/ios/friends/profile?pid=""+(this.options[this.options.selectedIndex].value);"><option value="0">---';
	selectorHTML+='<option value="2398072562">aafds';
	selectorHTML+='<option value="1563407917">Item 1';
	selectorHTML+='</select>'; 

	divTag.innerHTML = selectorHTML;
	document.body.appendChild(divTag); 
}