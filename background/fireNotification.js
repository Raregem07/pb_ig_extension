function fireNotificationAutomation() {
  var opt = {
    type: "basic",
    title: "Open Extension to Start Automation",
    message: "Open for automtation to happen",
    iconUrl: '../assets/img/instagram_icon.png'
  };
  chrome.notifications.create(new Date().toString(), opt, () => {console.log("fireNotificationAutomation shown")});
}

function fireNotificationSetContent() {
  var opt = {
    type: "basic",
    title: "Set Hashtags, places and commonusers",
    message: "Set the hashtags",
    iconUrl: '../assets/img/instagram_icon.png'
  };
  chrome.notifications.create(new Date().toString(), opt, () => {console.log("fireNotificationSetContent shown")});
}
