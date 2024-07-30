// Util functions
export function preventDefaultEvents(event) {
	event.preventDefault();
	event.stopPropagation();
}
export function getStringBetween(str, firstSubstring, secondSubstring) {
	let startIndex = str.indexOf(firstSubstring);
	if (startIndex === -1) {
		return ''; // firstSubstring not found
	}
	// Adjust startIndex to get the index immediately after the first substring
	startIndex += firstSubstring.length;
	const endIndex = str.indexOf(secondSubstring, startIndex);
	if (endIndex === -1) {
		return str.slice(startIndex); // secondSubstring not found
	}
	return str.slice(startIndex, endIndex);
}
export function idFromYoutubeUrl(url) {
	var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11) {
		return match[2];
	} else {
		return false;
	}
}
export function generateEmbeddedYoutubeUrl(url) {
	if ((url.includes("youtube.com") || url.includes("youtu.be")) && idFromYoutubeUrl(url)) {
		let output = "https://www.youtube.com/embed/" + idFromYoutubeUrl(url);
		if (url.includes("t=")) {
			const videoTime = getStringBetween(url, "t=", "&");
			output += "?start=" + videoTime;
		}
		return output
	}
	return false
}
export function interceptIframeEvent(event) {
	console.log("triggered")
	// Check that the event was sent from the YouTube IFrame.
	if (event.source === iframe.contentWindow) {
		var data = JSON.parse(event.data);
		// The "infoDelivery" event is used by YT to transmit any
		// kind of information change in the player,
		// such as the current time or a playback quality change.
		if (
			data.event === "infoDelivery" &&
			data.info &&
			data.info.currentTime
		) {
			// currentTime is emitted very frequently,
			// but we only care about whole second changes.
			var time = Math.floor(data.info.currentTime);
			console.log(time)
			if (time !== iframe.className) {
				iframe.className = time;
				console.log(time); // Update the dom, emit an event, whatever.
			}
		}
	}

}
export function getBaseUrl(url) {
	try {
		const urlObject = new URL(url);
		return urlObject.hostname;
	} catch {
		return "";
	}
}
export function cloneFromTemplate(selector) {
	return document.querySelector("template").content.querySelector(selector).cloneNode(true);
}
export function getElementHeight(element) {
	return element.getBoundingClientRect().height
}
export function getBorderWidth(element) {
	return parseFloat(getComputedStyle(element).borderWidth.slice(0, -2));
}
export function resizeDiv(div, amountInPx) {
	div.style.height = `${amountInPx}px`;
}