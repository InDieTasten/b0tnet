import { VM } from "./vm/vm"
import { Terminal } from 'xterm';

require("style-loader!../node_modules/xterm/css/xterm.css");

let vm = new VM();

console.log("B0tnet Game launching...");

(function Startup() {
    // initialize game
    document.body.style.backgroundColor = "#101010";

    // create dom element for terminal
    let nativeTerminal = document.createElement("div");
    document.body.appendChild(nativeTerminal);

    let term = new Terminal();
    term.open(nativeTerminal);
    term.resize(80, 25);

    let controlChar = String.fromCharCode(parseInt("33", 8));
    (function draw() {
        setTimeout(() => {
            term.write(`Hello from ${controlChar}[1;3;3${Math.floor(0.5 + Math.random()*8)}mxterm.js${controlChar}[0m `);
            draw();
        }, 10);
    })();
}());

console.log("B0tnet Game launched successfully :)");
