import { Terminal } from "./terminal"
import { color_names } from "./utility/color16"

let dslify = require("dslify");

console.info("B0tnet Game launching...");

(function Startup() {
    // initialize game
    document.body.style.backgroundColor = "#101010";

    // create dom element for terminal
    let nativeTerminal = document.createElement("div");
    document.body.appendChild(nativeTerminal);

    // attach terminal to dom element
    let terminalObj = new Terminal(nativeTerminal, { width: 101, height: 45 });

    terminalObj.display();
    setInterval(() => {
        // random message:
        var text = "";
        var possible = "0000000000000000000000000000000000000123456789ABCDEF";
        for( var i=0; i < 7; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        terminalObj.setCursorPos({
            x: 0.5 + Math.random() * 93,
            y: 44
        });
        terminalObj.setTextColor(Math.ceil(Math.random()*16)-1);
        terminalObj.write("0x" + text + " ");

    }, 20);

    setInterval(() => {
        terminalObj.scroll(1);
    }, 20);

    (function draw() {
        setTimeout(() => {
            requestAnimationFrame(draw);
            terminalObj.display();
        }, 1000/60);
    })();
    

}());

console.info("B0tnet Game launched successfully :)");
