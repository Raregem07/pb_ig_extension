// *****   Get Window Object and load it in myWindow *****

let initialData;

function injectScript(injectScriptFilename) {
  var s = document.createElement("script");
  s.src = chrome.extension.getURL(injectScriptFilename);
  (document.head || document.documentElement).appendChild(s);
}

function loadWindow(callback) {
  document.addEventListener("getWindowObject", function(event) {
    initialData = event.detail.initialData;
    callback(initialData);
    chrome.storage.local.set({ "user_initial_data": initialData }, () => {
      // console.log("initial data saved", initialData.data);
    });
  });
  injectScript("inject/inject_script.js");
}

// ********************************************************

async function sleep(timeInMS) {
  return new Promise(resolve => setTimeout(resolve, timeInMS));
}

async function getObject(key) {
  return new Promise((res, rej) => {
    chrome.storage.local.get([key], function(result) {
      res(result[key]);
    });
  });
}

async function saveObject(key, value) {
  return new Promise((res) => {
    chrome.storage.local.set({ [`${key}`]: value }, () => {
      res("saved");
    });
  });
}

async function getOrSetValue(key, v = null) {
  let dbValue = await getObject(key);
  if (dbValue === undefined || dbValue === null) {
    await saveObject(key, v);
    return v;
  }
  return dbValue;
}

async function concatToArray(key, arrayValue) {
  let value = await getOrSetValue(key, []);
  value = value.concat(arrayValue);
  await saveObject(key, value);
}

async function removeFromArray(key, value, propertyToCheck = null) {
  let dbValue = await getOrSetValue(key, []);
  if (dbValue.length === 0) {
    return;
  }
  let newArray = [];
  for (let i = 0; i < dbValue.length; i++) {
    if (propertyToCheck) {
      if (dbValue[i][propertyToCheck] !== value) {
        newArray.push(dbValue[i]);
      }
    } else {
      if (dbValue[i] !== value) {
        newArray.push(dbValue[i]);
      }
    }
  }
  await saveObject(key, newArray);
}
