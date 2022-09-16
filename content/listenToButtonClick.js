let igButton = document.getElementById("openExtensionFromDashboard");

igButton.onEventAddListener("click", () => {
    chrome.runtime.sendMessage(
        { 
            name: "openExtension", 
            userID: data.config.viewerId, 
            username: data.config.viewer.username  }
    );
})