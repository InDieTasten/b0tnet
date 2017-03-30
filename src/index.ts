import { Terminal } from "./terminal"
import { color_names } from "./utility/color16"
import { VM } from "./vm/vm"

console.log("expression-sandbox Test START ---");

var compiler = require('expression-sandbox');
var code = compiler('(function () { try { \
\
    write("Hello World!\\n>"); \
\
} catch(err) { log(err) } })()');

console.log("expression-sandbox Test END ---");

let vm = new VM();

console.log("B0tnet Game launching...");

(function Startup() {
    // initialize game
    document.body.style.backgroundColor = "#101010";

    // create dom element for terminal
    let nativeTerminal = document.createElement("div");
    document.body.appendChild(nativeTerminal);

    // attach terminal to dom element
    let terminalObj = new Terminal(nativeTerminal, { width: 81, height: 25 });

    code({
        write: function(msg: string) {
            terminalObj.write(msg);
        },
        log: function(msg: any) {
            console.info(msg);
        }
    });

    (function draw() {
        setTimeout(() => {
            requestAnimationFrame(draw);
            terminalObj.display();
        }, 1000/60);
    })();
    


}());

console.log("B0tnet Game launched successfully :)");
