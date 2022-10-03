chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info) {
      // Replace the User-Agent header
      const userAgent = "Mozilla/5.0 (Linux; Android 8.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)";
      var headers = info.requestHeaders;
      headers.forEach(function(header, i) {
        if (header.name.toLowerCase() === 'user-agent') {
          header.value =  userAgent;
        }
      });
      return {requestHeaders: headers};
    },
    // Request filter
    {
      // Modify the headers for these pages
      urls: [
        "https://i.instagram.com/*",
      ],
      // In the main window and frames
      types: ["xmlhttprequest"]
    },
    ["requestHeaders"]
  );
  
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info) {
      // Replace the User-Agent header
      const userAgent = "Mozilla/5.0 (Linux; Android 8.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)";
      var headers = info.requestHeaders;
      console.log(headers, 'Line 6 | Class:  | Function: : ')
      headers.push({name: "Origin", value: "https://www.instagram.com"})
      return {requestHeaders: headers};
    },
    // Request filter
    {
      // Modify the headers for these pages
      urls: ["https://*.cdninstagram.net/*","https://*.fna.fbcdn.net/*", "https://*.cdninstagram.com/*",]
      // In the main window and frames
    },
    ["requestHeaders", "extraHeaders"]
  );

  //FIRENOTIFICATION.JS

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

  
  //MAIN.JS

let POLL_CHECK_TIME_FOR_AUTOMATION_DATA_SET = 300;
let POLL_CHECK_TIME_FOR_AUTOMATION_DATA_UNSET = 3600;

let pingReceiveTime = Math.floor(new Date().getTime() / 1000);
let isDataForAutomationSet;

class DetailedUser {
  constructor(
    biography, followerCount, followingCount, followsViewer, followedByViewer,
    isBusinessAccount, isPrivate, profilePicURL, profilePicURLHD, username, fullName,
    externalURL, mutualConnectionCount, timelineMedia, mutualConnections, id, blockedByViewer,
    businessCategoryName
  ) {
    this.biography = biography;
    this.followerCount = followerCount;
    this.followingCount = followingCount;
    this.followsViewer = followsViewer;
    this.followedByViewer = followedByViewer;
    this.isBusinessAccount = isBusinessAccount;
    this.isPrivate = isPrivate;
    this.profileURL = profilePicURL;
    this.profilePicURLHD = profilePicURLHD;
    this.username = username;
    this.fullName = fullName;
    this.externalURL = externalURL;
    this.mutualConnectionCount = mutualConnectionCount;
    this.timelineMedia = timelineMedia;
    this.mutualConnections = mutualConnections;
    this.id = id;
    this.blockedByViewer = blockedByViewer;
    this.businessCategoryName = businessCategoryName;
    this.postCount = this.timelineMedia.count;
    this.timeCaptured = Math.ceil(new Date().getTime()/1000);
  }
}

let analysisTimer = setTimeout(runAnalysisScript, 10 * 1000);
//extension clicked
const triggerExtension = () => {
  let key = "grambuddy_extension_button_status";
  chrome.storage.local.set({ [`${key}`]: "pressed" }, () => {
    chrome.storage.local.set({ "user_email": "test@gmail.com" }, () => {
      chrome.tabs.create({ url: "https://www.instagram.com" });
    });
  });
}

chrome.action.onClicked.addListener(triggerExtension);

// console.log("document title = " + document.title);

chrome.runtime.onMessageExternal.addListener(function(message){
  console.log(messagae.name);
  switch (message.name) {
    case "openExtensionFromDashboard":
      triggerExtension();
      break;
    default:
      // invalid message name
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.url.includes("https://app.profilebuddy.io/maindashboard") || tab.url.includes("localhost:3000/maindashboard")) {
      //if (tab.url.includes("localhost:3000/maindashboard")) {
          console.log("onActivated->" + tab.url);
          beginListeningToButtonClicks(tab);
      }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //console.log(tab.status);
  if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
    if (tab.url.includes("https://app.profilebuddy.io/maindashboard") || tab.url.includes("localhost:3000/maindashboard")) {
    // if (tab.url.includes("localhost:3000/maindashboard")) {
        //console.log(changeInfo);
        console.log("onUpdated->" + tab.url);
        beginListeningToButtonClicks(tab);
    }
}
});


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    let username, userID;
    console.log(message);
    switch (message.name) {
      case "openExtensionFromDashboard":
        triggerExtension();
        break;
      case "openExtension":
        username = message.username.toString();
        userID = message.userID.toString();
        closeCurrentTabAndOpenExtension(sender);
        sendResponse({});
        console.log('openExtension');
        break;
      case "updateUninstallURL":
        username = message.username.toString();
        userID = message.userID.toString();
        let level2Calls = message.level2Calls.toString();
        let level3Calls = message.level3Calls.toString();
        sendResponse({});
        console.log("updateUninstallURL");
        break;
      case "getRequest":
        console.log("get request bitch");
        makeGetRequest(message).then(r => {
          sendResponse({
            success: true,
            axiosResponse: r
          });
        }).catch(e => {
          sendResponse({
            success: false,
            error: e
          });
        });
        break;
      case "postRequest":
        console.log("postrequest");
        makePostRequest(message).then(r => {
          sendResponse({
            success: true,
            axiosResponse: r
          });
        }).catch(e => {
          sendResponse({
            success: false,
            error: e
          });
        });
        break;
      case "startBackgroundScrape":
        console.log("startBackgroundScrape")
        runAnalysisScript();
        sendResponse({});
        break;
    }
    return true;
  }
);

const beginListeningToButtonClicks = (tab) => {
  chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ["content/listenToButtonClick.js"]
  });
}

async function makeGetRequest(message) {
  let url = message.url;
  let params = message.params;
  let headers = message.headers;
  return await axios.get(url, {
    params: params,
    headers: headers
  });
}

async function makePostRequest(message) {
  let url = message.url;
  let body = message.body;
  let headers = message.headers;
  return axios.post(url, body, {
    headers: headers
  });
}
//ireremove nya si instagram
function closeCurrentTabAndOpenExtension(sender) {
  // chrome.tabs.remove(sender.tab.id);
  openExtension();
}

function fireNotificationIfConditionMet() {
  let currentTime = Math.floor(new Date().getTime() / 1000);
  // console.log(currentTime, pingReceiveTime);
  if (isDataForAutomationSet) {
    if (currentTime - pingReceiveTime > POLL_CHECK_TIME_FOR_AUTOMATION_DATA_SET) {
      fireNotificationAutomation();
      pingReceiveTime = currentTime;
    }
  } else {
    if (currentTime - pingReceiveTime > POLL_CHECK_TIME_FOR_AUTOMATION_DATA_UNSET) {
      fireNotificationSetContent();
      pingReceiveTime = currentTime;
    }
  }
}


async function getDetailedUserData(username) {
  let r;
  try {
    let data = await fetch("https://www.instagram.com/" + username + "/channel/?__a=1", {
      credentials: "omit"
    }).then(d => d.json());

    let iUser = data.graphql.user;
    return new DetailedUser(
      iUser.biography, iUser.edge_followed_by.count, iUser.edge_follow.count,
      iUser.follows_viewer, iUser.followed_by_viewer, iUser.is_business_account,
      iUser.is_private, iUser.profile_pic_url, iUser.profile_pic_url_hd, iUser.username,
      iUser.full_name, iUser.external_url, iUser.edge_mutual_followed_by.count, iUser.edge_owner_to_timeline_media,
      iUser.edge_mutual_followed_by, iUser.id, iUser.blocked_by_viewer, iUser.business_category_name
    );
  } catch (e) {
    console.log(e, 'Error in Getting detailed data of a username for user analysis');
    return null;
  }
}

async function saveUserDetails(username, detailedUserObj) {
  let usersData = await getObject("users_data");
  if (!usersData) {
    usersData = {}
  }
  detailedUserObj.timelineMedia = {};
  if (username in usersData) {
    usersData[username].push(detailedUserObj);
  } else {
    usersData[username] = [];
    usersData[username].push(detailedUserObj);
  }
  await saveObject("users_data", usersData);
}

async function runAnalysisScript() {
  let mainUserObj = await getObject("user_initial_data");
  if (!mainUserObj) {
    return;
  }
  let mainUsername = mainUserObj.config.viewer.username;
  let usernames = await getObject("users_for_analysis");
  if (!usernames) {
    usernames = [];
  }

  let usernamesForRequest = usernames.slice(0,50);
  if (usernames.length > 50) {
    for (let i=0;i<50;i++) {
      let a = usernames.shift();
      usernames.push(a);
    }
  }

  let data = await getDetailedUserData(mainUsername);
  if (data) {
    await saveUserDetails(mainUsername, data);
  }

  for (let i=0;i<usernamesForRequest.length;i++) {
    let data = await getDetailedUserData(usernamesForRequest[i]);
    if (data) {
      await saveUserDetails(usernamesForRequest[i], data);
    }
  }

  let totalUsernames = usernames.length;
  let numberOfTimesScrapeShouldHappen = Math.ceil(totalUsernames/50);
  clearTimeout(analysisTimer);
  if (totalUsernames === 0) {
    numberOfTimesScrapeShouldHappen = 1;
  }
  analysisTimer = setTimeout(runAnalysisScript, Math.floor(14400 * 1000 / numberOfTimesScrapeShouldHappen ));
}

function getObject(key) {
  return new Promise((res, rej) => {
    chrome.storage.local.get([key], function(result) {
      res(result[key]);
    });
  });
}

function saveObject(key, obj) {
  return new Promise((res, rej) => {
    chrome.storage.local.set({[`${key}`]: obj}, () => {
      res('saved');
    });
  });
}

// redirect to pb-chrome-ext
function openExtension() {
  chrome.tabs.create({ url: chrome.runtime.getURL("build/index.html") });
}
