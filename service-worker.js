let panelConfigs = []

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'sidePanel') {
    port.onDisconnect.addListener(() => {
			chrome.storage.local.set({ panelConfigs: panelConfigs });
			// console.log("saved");
    });
		port.onMessage.addListener((message)=>{
			panelConfigs = message.panelConfigs;
		});
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
