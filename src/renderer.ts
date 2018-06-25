// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process
const ipcRenderer: any = require('electron').ipcRenderer
window.prompt = function(title: string, val: string): string{
  return ipcRenderer.sendSync('prompt', {title, val})
}

/**
 * Display text in the chat box
 * @param {string} t
 *  String to display
 */
function text(t: string): void {
  document.getElementById('text').innerHTML = document.getElementById('text').innerHTML + '<br>' + t;
}

/**
 * Display application log
 * @param {string} t
 *  String to display
 */
function log(t: string): void {
  text('<span style="color:cyan;text-decoration:underlined;"><u>' + t + '</u></span>')
}

/**
 * Display received message
 * @param {string} from
 *  Username who sent the message
 * @param {string} to
 *  Username who receives the message
 * @param {string} t
 *  String to display
 */
function message(from: any, to: any, t: any): void {
  text(`<strong><span class="msginf">[<span class="from">${from}</span> => <span class="to">${to}</span>] ${t}</strong>`);
}

log("Starting MIRCO...")
const irc: any = require('protonirc')
console.log(irc)
let server: string   = window.prompt("What server would you like to connect to?", "irc.freenode.com");
let nickname: string = window.prompt("What nickname would you like to have?", "MIRCO");
let channel: string  = window.prompt("What channel would you like to connect to?", "#open-roberta");
log(`Connecting to server '${server}' on channel '${channel}' with username '${nickname}'...`);
var client: any = new irc.Client(server, nickname, {
    channels: [channel],
});
client.join(channel);
client.say(channel, "Hello.");

client.addListener('error', function(message: string): void {
    log('error: ' + message);
});

client.addListener('message', function (from: any, to: any, message: any): void {
    message(from, to, message);
});

client.addListener('join', function(channel: string, who: string): void {
    log(`${who} has joined ${channel}`);
});

client.addListener('part', function(channel: string, who: string, reason: string): void {
    log(`${who} has left ${channel} because ${reason}`);
});
