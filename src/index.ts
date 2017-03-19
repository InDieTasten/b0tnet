
import { Terminal } from "./terminal"
import { color_names } from "./utility/color16"

console.info("B0tnet Game launching...");

(function Startup() {
    // initialize game
    document.body.style.backgroundColor = "#101010";

    // create dom element for terminal
    let nativeTerminal = document.createElement("div");
    document.body.appendChild(nativeTerminal);

    // attach terminal to dom element
    let terminalObj = new Terminal(nativeTerminal, { width: 80, height: 25 });

    terminalObj.display();
    setInterval(() => {
        // random message:
        var text = "";
        var possible = "0000000000000000000000000000000000000123456789ABCDEF\n\n\n";
        for( var i=0; i < 9; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        terminalObj.setTextColor(Math.ceil(Math.random()*16)-1);
        terminalObj.write("0x" + text + " ");

    }, 100);
    terminalObj.setTextColor(color_names.green);

    setInterval(() => {
        // random message:
        //terminalObj.clear();
    }, 1000);

    (function draw() {
        setTimeout(() => {
            requestAnimationFrame(draw);
            terminalObj.display();
        }, 1000/30);
    })();
    

}());

console.info("B0tnet Game launched successfully :)");
