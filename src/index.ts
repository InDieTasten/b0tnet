
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


    // terminalObj.write("AAA");
    // terminalObj.write("BBB");
    // terminalObj.display();
    setInterval(() => {
        // random message:
        var text = "";
        var possible = "0000000000000000000000000000000000000123456789ABCDEF";
        for( var i=0; i < 7; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        terminalObj.setCursorPos({
            x: Math.random() * 79,
            y: Math.random() * 24
        });
        terminalObj.setTextColor(Math.ceil(Math.random()*16)-1);
        terminalObj.write("0x" + text + " ");
    }, 10);

    function draw() {
        setTimeout(() => {
            requestAnimationFrame(draw);
            terminalObj.display();
        }, 1000/30);
    }

    draw();
    

}());

console.info("B0tnet Game launched successfully :)");
