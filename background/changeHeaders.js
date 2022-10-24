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