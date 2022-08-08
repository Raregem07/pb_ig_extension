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

chrome.browserAction.onClicked.addListener(function(tab) {
  let key = "grambuddy_extension_button_status";
  chrome.storage.local.set({ [`${key}`]: "pressed" }, () => {
    chrome.storage.local.set({ "user_email": "test@gmail.com" }, () => {
      chrome.tabs.create({ url: "https://www.instagram.com" });
    });
  });
});


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    let username, userID;
    switch (message.name) {
      case "openExtension":
        username = message.username.toString();
        userID = message.userID.toString();
        closeCurrentTabAndOpenExtension(sender);
        sendResponse({});
        break;
      case "updateUninstallURL":
        username = message.username.toString();
        userID = message.userID.toString();
        let level2Calls = message.level2Calls.toString();
        let level3Calls = message.level3Calls.toString();
        sendResponse({});
        break;
      case "getRequest":
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
        runAnalysisScript();
        sendResponse({});
        break;
    }
    return true;
  }
);

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

function closeCurrentTabAndOpenExtension(sender) {
  chrome.tabs.remove(sender.tab.id);
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
    r = await fetch("https://www.instagram.com/" + username + "/?__a=1", {
      credentials: "omit"
    });
    let data = await r.json();
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
  analysisTimer = setTimeout(runAnalysisScript, Math.floor(14400 * 1000 / numberOfTimesScrapeShouldHappen ))
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


function openExtension() {
  //> chrome.tabs.create({ url: chrome.extension.getURL("build/index.html") });
}
