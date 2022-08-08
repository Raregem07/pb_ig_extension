function checkIfHostIsInstagram() {
  let url = location.href;
  return url.includes("instagram.com");
}


function main() {
  let hostIsInstagram = checkIfHostIsInstagram();
  const grambuddyPressed = "grambuddy_extension_button_status";
  if (hostIsInstagram) {
    chrome.storage.local.get([grambuddyPressed], (result) => {
      if (result[grambuddyPressed] === "pressed") {
        chrome.storage.local.set({ [`${grambuddyPressed}`]: "finished" }, () => {
          loadWindow((data) => {
            if (data.config.viewerId && data.config.viewerId.length > 0) {
              chrome.runtime.sendMessage({ name: "openExtension", userID: data.config.viewerId, username: data.config.viewer.username  });
            } else {
              Swal.fire({
                position: "top-end",
                title: "Log in to your Instagram",
                text: "You need to Log in to your instagram to use ProfileBuddy",
                showConfirmButton: false,
                timer: 10000,
                imageUrl: "../assets/img/profilebuddy_logo.png",
                imageHeight: 200
              });
            }
          });
        });
      }
    });
  }
}


main();
