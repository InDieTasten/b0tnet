import '../node_modules/xterm/css/xterm.css';
import './styles.css';
import { VM } from "./vm/vm";
import { Terminal } from 'xterm';
import { Machine } from './machine';
import { Shell } from './programs/shell';
import { ALongTimeAgo } from './programs/alongtimeago';

let vm = new VM();

console.log("B0tnet Game launching...");

(function Startup() {
    // create dom element for terminal
    let terminalElement = document.createElement("div");
    document.body.appendChild(terminalElement);

    
    let nativeTerm = new Terminal({
        scrollback: 0,
        fontSize: 22,
        cursorBlink: false,
        rendererType: "dom",
        allowTransparency: true,
        theme: {
            background: "rgba(0,0,0,0)"
        }
    });
    let virtualMachine = new Machine([
        Shell.Program,
        ALongTimeAgo.Program
    ]);

    nativeTerm.loadAddon(virtualMachine);
    nativeTerm.open(terminalElement);
    nativeTerm.resize(80, 25);
    // nativeTerm.write('BrowserOS 0.1');
    // nativeTerm.write('\r\n$ ');
    // nativeTerm.onLineFeed(() => {
    //     console.log("onLineFeed");
    // });
    // nativeTerm.onCursorMove(() => {
    //     console.log("onCursorMove");
    // });
    // nativeTerm.onData(e => {
    //     console.log("onData: ", e);
    // })
    // nativeTerm.onKey(e => {
    //     console.log("onKey: ", e);

    //     const printable = !e.domEvent.altKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

    //     if (e.domEvent.key == "Enter") {
    //         nativeTerm.write('\r\n$ ');
    //     } else if (e.domEvent.key === 'Backspace') {
    //         Do not delete the prompt
    //         if (nativeTerm.buffer.cursorX > 2) {
    //             nativeTerm.write('\b \b');
    //         }
    //     } else if (printable) {
    //         nativeTerm.write(e.key);
    //     }
    // });
}());

console.log("B0tnet Game launched successfully :)");
