import * as utils from "./utils.js"
// Some one tell me how to not make my code look like this pls
function addLogicToResizer(resizer) {
	let topDiv = resizer.previousElementSibling;
	let bottomDiv = resizer.nextElementSibling;
	let initialTopHeight = 0;
	let initialBottomHeight = 0;
	let initialY = 0;
	let veryTop = 0;
	let veryBottom = 0;
	resizer.addEventListener("mousedown", (event) => {
		event.preventDefault();
		window.addEventListener('mousemove', resize);
		window.addEventListener('mouseup', (event)=> {
			stopResize(event)
			console.log("mouse up");
		});
		initialY = event.clientY;
		initialTopHeight = topDiv.getBoundingClientRect().height ;
		initialBottomHeight = bottomDiv.getBoundingClientRect().height;
		veryTop = topDiv.getBoundingClientRect().top;
		veryBottom = bottomDiv.getBoundingClientRect().bottom;
		console.log(initialTopHeight + initialBottomHeight);
	})
	function resize(event) {
		// to stop interfering with resizing
		disableAllDropAreas();
		let newTopHeight = 0;
		let newBottomHeight = 0;
		const mouseAboveVeryTop = event.clientY < veryTop + 20 // add a lil offset
		const mouseBelowVeryBottom = event.clientY > veryBottom - 20
		if (mouseAboveVeryTop) {
			newBottomHeight = initialTopHeight + initialBottomHeight - 2*utils.getBorderWidth(topDiv); // Borders of other divs stay so we gotta subtract
		} else if (mouseBelowVeryBottom) {
			newTopHeight = initialTopHeight + initialBottomHeight - 2*utils.getBorderWidth(bottomDiv);
		} else {
			const dy = Math.round(event.clientY - initialY);
			newTopHeight = initialTopHeight + dy;
			newBottomHeight = initialBottomHeight - dy;
		}
		utils.resizeDiv(topDiv, newTopHeight);
		utils.resizeDiv(bottomDiv, newBottomHeight);
	}
	function stopResize() {
		// enable ability to click
		enableAllDropAreas();
		window.removeEventListener('mousemove', resize);
	}
}

function disableAllDropAreas() {
	let dropAreas = document.querySelectorAll(".drop-area");
	for (let k = 0; k < dropAreas.length; k++) {
		const dropArea = dropAreas[k];
		dropArea.style.pointerEvents = "none";
	}
}

function enableAllDropAreas() {
	let dropAreas = document.querySelectorAll(".drop-area");
	for (let k = 0; k < dropAreas.length; k++) {
		const dropArea = dropAreas[k];
		dropArea.style.pointerEvents = "unset";
	}
}

export default addLogicToResizer;