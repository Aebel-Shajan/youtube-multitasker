// Global variables oops
let sidePanelPort: chrome.runtime.Port|null = null;
let onSidePanelConnect = () => {};

// Open sidepanel on action icon click
chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

// Store sidepanel port
chrome.runtime.onConnect.addListener(function (port: chrome.runtime.Port) {
	if (port.name === 'mySidepanel') {
		sidePanelPort = port
		onSidePanelConnect()
		onSidePanelConnect = () => {}
		port.onDisconnect.addListener(async () => {
			sidePanelPort = null
			onSidePanelConnect = () => {}
		});
	}
});

console.log(sidePanelPort)

