import { Terminal, IDisposable, ITerminalAddon } from "xterm";
import { Environment, OsEvent, CharacterEvent } from "./environment";
import { XTermDisplay } from "./vm/x-term-display";
import { Shell } from "./programs/shell";

export class Machine implements ITerminalAddon {
    private _disposables: IDisposable[] = [];
    private environment: Environment = new Environment();
    private eventQueue: OsEvent[] = [];
    private eventResolvers: Array<(value?: OsEvent | PromiseLike<OsEvent>) => void> = [];

    activate(terminal: Terminal): void {
        terminal.writeln("Initializing runtime environment...");
        this.environment = {
            console: new XTermDisplay(terminal),
            os: {
                pollEvent: (): Promise<OsEvent> => {
                    return new Promise<OsEvent>((resolve: (value?: OsEvent | PromiseLike<OsEvent>)
                        => void) => this.eventResolvers.push(resolve))
                },
                queueEvent: (event: OsEvent) => {
                    this.eventQueue.push(event);
                },
                getVersion: () => "BrowserOS v0.1"
            }
        };

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

        let shellProgram = new Shell(this.environment, this.environment.console);
        shellProgram.main([]).then((exitCode) => {
            if (exitCode) {
                terminal.writeln(`Error: Shell exited with code ${exitCode}`);
            }
            terminal.writeln("Shutdown...");
        }).catch(error => {
            terminal.writeln(`ERROR: Error was thrown: "${error}"`);
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
