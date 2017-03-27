import { Terminal } from "./terminal"
import { color_names } from "./utility/color16"

console.info("DSLify Test START ---");

let dslify = require("dslify");


var fn = "function() { (function() { sout(this.document); })() }";
var shouter = dslify.transform(fn);

var dsl : any = {
    sout: function(something: any) {
        console.info("Aye: ", something);
        return something + "!!";
    },
    word: "unicorns",
    this: dsl
};

shouter(dsl);

console.info("DSLify Test END ---");


console.info("B0tnet Game launching...");

(function Startup() {
    // initialize game
    document.body.style.backgroundColor = "#101010";

    // create dom element for terminal
    let nativeTerminal = document.createElement("div");
    document.body.appendChild(nativeTerminal);

    // attach terminal to dom element
    let terminalObj = new Terminal(nativeTerminal, { width: 81, height: 25 });

    terminalObj.display();
    setInterval(() => {
        // random message:
        var text = "";
        var possible = "0000000000000000000000000000000000000123456789ABCDEF";
        for( var i=0; i < 7; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        terminalObj.setCursorPos({
            x: 0.5 + Math.random() * 73,
            y: 24
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
