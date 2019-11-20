import { Terminal, IDisposable } from "xterm";
import { TermApi, TerminalSize, CursorPosition } from "../os/apis/term";
import { OutputStream } from "../os/apis/io";

export class XTermDisplay implements TermApi, OutputStream, IDisposable {
    private disposables: IDisposable[] = [];
    
    private xterm: Terminal;
    
    constructor(xterm: Terminal) {
        this.xterm = xterm;
        // TODO expose this as io.InputStream
        this.disposables.push(xterm.onKey(() => {
            
        }));
        this.disposables.push(xterm.onData(() => {
            
        }));
    }
    
    writeCharacter(character: string): Promise<void> {
        if (character && character.length === 1) {
            return this.write(character);
        } else {
            return Promise.resolve();
        }
    }
    writeLine(line: string): Promise<void> {
        return this.write(line + '\n');
    }
    getSize(): Promise<TerminalSize> {
        return Promise.resolve({ width: this.xterm.cols, height: this.xterm.rows });
    }
    setCursorPosition(position: CursorPosition): Promise<boolean> {
        if (position.x > 0 && position.x <= this.xterm.cols && position.y > 0 && position.y <= this.xterm.rows) {
            this.xterm.write(`\x1B[${position.x};${position.y}M`); // cursor position CUP
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
    getCursorPosition(): Promise<CursorPosition> {
        this.xterm.write("\x1b[6n"); // device status report DSR
        let resolver: (value?: CursorPosition | PromiseLike<CursorPosition>) => void;
        let promise = new Promise<CursorPosition>((resolve: (value?: CursorPosition | PromiseLike<CursorPosition>)
        => void) => resolver = resolve);
        let disposable = this.xterm.onData((data) => {
            let match = data.match(/^\x1B\[(\d+);(\d+)R$/);
                
                if (match !== null && match.length == 3) {
                    resolver({
                        x: parseInt(match[2]),
                        y: parseInt(match[1])
                });
                disposable.dispose();
            }
        });

        return promise;
    }

    write(text: string): Promise<void> {
        this.xterm.write(text.replace(/\n/g, "\r\n"));
        return Promise.resolve();
    }
    clear(): Promise<void> {
        this.xterm.clear();
        return Promise.resolve();
    }
    dispose(): void {
        this.disposables.forEach(d => d.dispose());
        this.disposables.length = 0;
    }
}