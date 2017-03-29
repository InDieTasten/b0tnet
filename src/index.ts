import { Terminal } from "./terminal"
import { color_names } from "./utility/color16"
import { VM } from "./vm/vm"

console.info("expression-sandbox Test START ---");

var n = require;

var compiler = n('expression-sandbox');
var code = compiler('(function () {})()');
 
var result = code({shout: function(thing: any) {console.log("Aye: ", thing)}});

console.info("expression-sandbox Test END ---");

let vm = new VM();

console.info("B0tnet Game launching...");

(function Startup() {
    // initialize game
    document.body.style.backgroundColor = "#101010";

    // create dom element for terminal
    let nativeTerminal = document.createElement("div");
    document.body.appendChild(nativeTerminal);

    // attach terminal to dom element
    let terminalObj = new Terminal(nativeTerminal, { width: 81, height: 25 });

    (function draw() {
        setTimeout(() => {
            requestAnimationFrame(draw);
            terminalObj.display();
        }, 1000/60);
    })();
    


}());

console.info("B0tnet Game launched successfully :)");
