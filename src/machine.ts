import { Terminal, IDisposable, ITerminalAddon } from "xterm";
import { Environment, OsEvent } from "./environment";
import { Program } from "./program";

export class Machine implements ITerminalAddon {
    private _disposables: IDisposable[] = [];
    private environment: Environment = new Environment();
    private eventQueue: OsEvent[];
    private eventResolvers: any[];

    constructor(private programs: Program[]) {
    }

    activate(terminal: Terminal): void {
        terminal.writeln("Initializing runtime environment...");
        this.environment = {
            console: {
                write: (text: string) => terminal.write(text),
                clear: () => terminal.clear()
            },
            os: {
                pollEvent: (): Promise<OsEvent> => {
                    return new Promise<OsEvent>((resolve: (value?: OsEvent | PromiseLike<OsEvent>)
                        => void) => this.eventResolvers.push(resolve))
                },
                queueEvent: (event: OsEvent) => {
                    this.eventQueue.push(event);
                }
            },
            programs: this.programs
        };

        this._disposables.push(terminal.onKey((e) => {
            console.log("Key: ", e.key, e.domEvent.keyCode);

            let escape = String.fromCharCode(27);
            if (e.domEvent.keyCode == 70) {
                terminal.write("offset" + escape + "[6n");
            }
        }));
        this._disposables.push(terminal.onData((e) => {
            console.log("Data: ", e);
        }));

        terminal.writeln("Machine launched successfully!");
        terminal.writeln("Launching shell...");

        var shellProgram = this.programs.filter(program => program.name === 'shell')[0];
        if (shellProgram) {
            shellProgram.main(this.environment, (exitCode) => {
                if (exitCode) {
                    terminal.writeln(`Error: Shell exited with code ${exitCode}`);
                }
                terminal.writeln("Shutdown...");
            });
        } else {
            terminal.writeln("Error: shell program not found");
        }
    }
    
    dispose(): void {
        this._disposables.forEach(d => d.dispose());
        this._disposables.length = 0;
    }
}
