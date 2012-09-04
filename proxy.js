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

	divTag.style.left = "180px"; 
	divTag.style.top = "100px"; 

	var selectorHTML = '<select name="sel" onchange="alert(this.options[this.options.selectedIndex].value);"><option selected value="0">---</option>';
	selectorHTML+='<option value="/en/ios/friends/profile?pid=2398072562">aafds</option>';
	selectorHTML+='<option value="/en/ios/friends/profile?pid=1563407917">Item 1</option>';
	selectorHTML+='</select>'; 

	divTag.innerHTML = selectorHTML;
	document.body.appendChild(divTag);
}