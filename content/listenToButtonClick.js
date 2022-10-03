igButton = document.getElementById("openExtensionFromDashboard");
console.log(document.title);

igButton.addEventListener("click", () => {
    // chrome.runtime.sendMessage(
    //     { 
    //         name: "openExtension", 
    //         userID: data.config.viewerId, 
    //         username: data.config.viewer.username  }
console.log("sent a click message to open extension.")
chrome.runtime.sendMessage({name: "openExtensionFromDashboard"});
})

chrome.runtime.connect().onDisconnect.addListener(function() {
    console.log("disconnected");
});
