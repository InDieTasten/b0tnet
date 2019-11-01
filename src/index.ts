import '../node_modules/xterm/css/xterm.css';
import './styles.css';
import { VM } from "./vm/vm";
import { Terminal } from 'xterm';
import { Machine } from './machine';
import { Shell } from './programs/shell';
import { ALongTimeAgo } from './programs/alongtimeago';

(function Startup() {

    window.addEventListener("load", () => {
        // create dom element for terminal
        let terminalElement = document.createElement("div");
        document.body.appendChild(terminalElement);

        let nativeTerm = new Terminal({
            scrollback: 0,
            fontSize: 22,
            cursorBlink: false,
            rendererType: "canvas",
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
    });

    
}());
