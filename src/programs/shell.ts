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
        this.env.console.clear();
        this.env.console.write("BrowserOS 0.1\r\n");
    }

    prompt() {
        this.env.console.write("> ");
    }
}
