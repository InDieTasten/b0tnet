import { Terminal, IDisposable, ITerminalAddon } from "xterm";
import { OsEvent, CharacterEvent } from "./environment";
import { XTermDisplay } from "./vm/x-term-display";
import { Shell } from "./programs/shell";
import { BrowserOs } from "./os/browser-os";
import { ALongTimeAgo } from "./programs/alongtimeago";
import { IgniteProgram } from "./programs/ignite";
import { RaytraceProgram } from "./programs/raytrace/main";

export class Machine implements ITerminalAddon {
    private _disposables: IDisposable[] = [];
    private eventQueue: OsEvent[] = [];
    private eventResolvers: Array<(value?: OsEvent | PromiseLike<OsEvent>) => void> = [];

    activate(terminal: Terminal): void {
        terminal.writeln("Initializing runtime environment...");

        this._disposables.push(terminal.onData((data) => {
            if (data.length === 1) {
                if (data.charCodeAt(0) >= 32) {
                    this.eventQueue.push(new CharacterEvent(data));
                    setTimeout(() => this.publishEvents(), 0);
                }
            }
        }));

        this._disposables.push(terminal.onKey((e) => {
            console.log("Key: ", e.key, e.domEvent.keyCode);
        }));
        this._disposables.push(terminal.onData((e) => {
            console.log("Data: ", e);
        }));

        terminal.writeln("Machine launched successfully!");
        terminal.writeln("Launching shell...");

        let display = new XTermDisplay(terminal);
        let os = new BrowserOs();

        let shellProgram = new RaytraceProgram({ stdin: null, stdout: display }, null, null, display, os);
        shellProgram.main([]).then((exitCode: number) => {
            if (exitCode) {
                terminal.writeln(`Error: Shell exited with code ${exitCode}`);
            }
            terminal.writeln("Shutdown...");
        }).catch((error: any) => {
            terminal.writeln(`\x1b[1;31mERROR: Error was thrown: "${error}"\x1b[0m`);
            if (error instanceof Error) {
                console.log(error);
                terminal.write(error.stack.replace(/\n/g, "\n\r"));
            }
        });
    }
    
    private publishEvents(): void {
        while (this.eventQueue.length > 0) {
            let currentEvent = this.eventQueue.shift();
            
            this.eventResolvers.forEach(listener => {
                listener(currentEvent);
            });
        }
    }

    dispose(): void {
        this._disposables.forEach(d => d.dispose());
        this._disposables.length = 0;
    }
}
