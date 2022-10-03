try {
    importScripts('background/changeHeaders.js', 'background/fireNotification.js', 'background/main.js');
  } catch (e) {
    console.error(e);
  }