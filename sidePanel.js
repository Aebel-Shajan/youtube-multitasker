import {addLogicToDropArea, handleDrop} from "./scripts/dropArea.js";
import addLogicToResizer from "./scripts/resizer.js";
import * as utils from "./scripts/utils.js";


let storage = await chrome.storage.local.get(["panelConfigs"]);
console.log(storage)
const mainDiv = document.querySelector("main");
const videoAmount = 3;
let customResize = false;
for (let i = 0; i < videoAmount; i++) {
	// Clone drop area and resizer from template in sidePanel.html
	let dropArea = utils.cloneFromTemplate(".drop-area");
	let resizer = utils.cloneFromTemplate(".resizer");
	
	// Reload vids that were present before side panel close
	if (storage["panelConfigs"]) {
		if (storage["panelConfigs"].length > i) {
			const panelConfig = storage["panelConfigs"][i];
			handleDrop(dropArea, panelConfig.src);
			if (panelConfig.totalPanels === videoAmount) {
				customResize = true;
				utils.resizeDiv(dropArea, panelConfig.height);
			}
		}}
		mainDiv.appendChild(dropArea);
		if (i < videoAmount - 1) {
			mainDiv.appendChild(resizer);
		}
	
	// Set drop area height based on video amount and resizer thickness (1rem)
	if (!customResize) {
		dropArea.style.height = `calc(${100/(videoAmount)}% - ${utils.getElementHeight(resizer)}px)`
	}
}

// Add the event listeners and internal logic
let dropAreas = document.querySelectorAll(".drop-area")
dropAreas.forEach((dropArea)=> {
	addLogicToDropArea(dropArea);
});
document.querySelectorAll(".resizer").forEach((resizer)=> {
	addLogicToResizer(resizer);
})
document.querySelector(".reset-sizes").addEventListener("click", ()=> {
	dropAreas.forEach((dropArea)=> {
		let resizer = dropArea.nextElementSibling;
		if (resizer) {
			dropArea.style.height = `calc(${100/(videoAmount)}% - ${utils.getElementHeight(resizer)}px)`
		} else {
			dropArea.style.height = `calc(${100/(videoAmount)}%`
		}
	})
})

// Send messages to service-worker.js to save vids on side panel close
let port = chrome.runtime.connect({ name: "sidePanel" });
setInterval(() => {
	const dropAreas = document.querySelectorAll(".drop-area");
	let panelConfigs = [];
	for (let i = 0; i < dropAreas.length; i++) {
		const iframe = dropAreas[i].querySelector("iframe");
		let panelConfig = {
			height: utils.getElementHeight(dropAreas[i]),
			src: iframe ? iframe.src : "",
			totalPanels: dropAreas.length
		}
		panelConfigs.push(panelConfig);
	}
	port.postMessage({ panelConfigs: panelConfigs })
}, 1000)



window.addEventListener("message", (event)=> {
  console.log("message sent")
})