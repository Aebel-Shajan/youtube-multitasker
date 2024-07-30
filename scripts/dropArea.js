import * as utils from "./utils.js";

function addLogicToDropArea(dropArea) {
	// Prevent default behaviour
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, utils.preventDefaultEvents, false)
	});
	// Highlight and unhighlight
	['dragenter', 'dragover'].forEach(eventName => {
		dropArea.addEventListener(eventName, () => highlight(dropArea), false);
	});
	['dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, () => unhighlight(dropArea), false);
	});
	// Event listener when a link is dropped in
	dropArea.addEventListener('drop', (event) => {
		handleDrop(dropArea, event.dataTransfer.getData('text/uri-list'));
	}, false);
}


// Drop area functions
function highlight(dropArea) {
	dropArea.style.borderColor = 'green';
	dropArea.style.backgroundColor = "#cccccccc"
}
function unhighlight(dropArea) {
	dropArea.style.borderColor = '';
	dropArea.style.backgroundColor = "transparent"
}
function handleDrop(dropArea, url) {
	switch (utils.getBaseUrl(url)) {
		case "www.youtube.com":
		case "youtu.be":
			if (utils.generateEmbeddedYoutubeUrl(url)) {
				fillDropArea(dropArea, utils.generateEmbeddedYoutubeUrl(url))
			}
			break;
		default:
			break;
	}
}
function fillDropArea(dropArea, iframeSrc) {
	// iframe
	let iframe = document.createElement("iframe");
	iframe.src = iframeSrc;
	iframe.referrerpolicy = "no-referrer-when-downgrade";
	// options
	let optionsContainer = utils.cloneFromTemplate(".options-container")
	// remover
	let remover = optionsContainer.querySelector(".remover");
	remover.addEventListener("click", () => {
		emptyDropArea(dropArea);
	})
	// expander
	let expander = optionsContainer.querySelector(".expander");
	expander.addEventListener("click", () => {
		let fullHeight = 2*utils.getBorderWidth(dropArea);
		const dropAreas = document.querySelectorAll(".drop-area");
		for (let i = 0; i < dropAreas.length; i++) {
			fullHeight += dropAreas[i].getBoundingClientRect().height - 2*utils.getBorderWidth(dropAreas[i]);
			utils.resizeDiv(dropAreas[i], 0);
		}
		utils.resizeDiv(dropArea, fullHeight);
	})
	// modifying drop area;
	dropArea.classList.toggle("filled");
	dropArea.innerHTML = "";
	dropArea.appendChild(iframe);
	dropArea.appendChild(optionsContainer)
}
function emptyDropArea(dropArea) {
	dropArea.classList.toggle("filled");
	dropArea.innerHTML = "Drag link here";
}


export  {addLogicToDropArea, handleDrop};