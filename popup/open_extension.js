class Command {
  constructor(name, data) {
    this.name = name;
    this.data = data;
  }
}

let command = new Command('openExtension', null);
chrome.runtime.sendMessage(command);
