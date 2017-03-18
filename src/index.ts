
import { Terminal } from "./terminal"

console.info("B0tnet Game launching...");

(function Startup() {
    // initialize game
    document.body.style.backgroundColor = "#101010";

    // create dom element for terminal
    let nativeTerminal = document.createElement("div");
    document.body.appendChild(nativeTerminal);

    // attach terminal to dom element
    let terminalObj = new Terminal(nativeTerminal, { width: 80, height: 25 });

    terminalObj.write("Hello World!");

    //terminalObj.display();
    
}());

console.info("B0tnet Game launched successfully :)");
