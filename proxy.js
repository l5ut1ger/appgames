function fnOnLoad() {
	//alert(window.location.pathname);
	createBackButton();
}

function createBackButton() { 
	var divTag = document.createElement("div"); 

	divTag.id = "backButtonID"; 

	divTag.style["z-index"] = 1000; 

	divTag.style.position = "absolute"; 

	divTag.style.left = "280px"; 
	divTag.style.top = "40px"; 

	divTag.innerHTML = '<button class="sexybutton sexysmall sexysimple sexyblue" onClick="javascript:history.go(-1);">Back</button>'; 
	document.body.appendChild(divTag); 
}