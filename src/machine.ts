import { Terminal, IDisposable, ITerminalAddon } from "xterm";
import { Environment } from "./environment";
import { Program } from "./program";
import { EventEmitter } from "./event";

export class Machine implements ITerminalAddon {
    private _disposables: IDisposable[] = [];

    private _onKeyEmitter = new EventEmitter<{ key: string, domEvent: KeyboardEvent }>();
    private environment: Environment = new Environment();

    constructor(private programs: Program[]) {
    }

    activate(terminal: Terminal): void {
        terminal.writeln("Initializing runtime environment...");
        this.environment.term = {
            onKey: this._onKeyEmitter.event,
            write: (data) => terminal.write(data),
            clear: () => terminal.clear(),
            getCursorX: () => terminal.buffer.cursorX,
            getCursorY: () => terminal.buffer.cursorY
        };
        terminal.writeln("Install programs");
        this.environment.programs = this.programs;

        terminal.writeln("Register keyboard events...");
        this._disposables.push(terminal.onKey(e => {
            // some filtering, such that not all keys will be captured and forwarded to the current program
            this._onKeyEmitter.fire(e);
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
