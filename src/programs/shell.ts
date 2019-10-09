import { Program } from "../program";
import { Environment } from "../environment";
import { Terminal } from "xterm";

export class Shell implements Program {
    static Program = new Shell();

    name = 'shell';
    
    private env: Environment
    private callback: (exitCode: number) => void;

    main(env: Environment, callback: (exitCode: number) => void): void {
        this.env = env;
        this.callback = callback;
        this.printOs();
        this.prompt();
    }

    printOs() {
        this.env.term.clear();
        this.env.term.write("BrowserOS 0.1\r\n");
    }

    prompt() {
        this.env.term.write("> ");
        this.readLine(command => {

            if (command === 'exit') {
                this.callback(0);
                return;
            }

            this.env.term.write(`Error: Command '${command}' not found.\r\n`);
            this.prompt();
        });
    }
    readLine(callback: (command: any) => void) {
        let userinput = '';
        setTimeout(() => {
            let initialCursorX = this.env.term.getCursorX();
            let initialCursorY = this.env.term.getCursorY();

            this.env.term.onKey(e => {
                if (e.domEvent.key === 'Backspace') {
                    if (this.env.term.getCursorX() > initialCursorX
                    || this.env.term.getCursorY() > initialCursorY) {
                        userinput = userinput.slice(0, userinput.length-1);
                        this.env.term.write('\b \b');
                    }
                } else if (e.domEvent.key === 'Enter') {
                    this.env.term.write('\r\n');
                    callback(userinput);
                } else {
                    this.env.term.write(e.key);
                    userinput += e.key;
                }
                console.log("userinput: ", userinput);
            });
        }, 0);
    }
}
