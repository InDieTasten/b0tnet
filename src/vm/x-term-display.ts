import { ConsoleApi } from "../environment";
import { Terminal, IDisposable } from "xterm";
import { Position } from "../utility/position";

export class XTermDisplay implements ConsoleApi, IDisposable {
    private disposables: IDisposable[] = [];

    private xterm: Terminal;

    constructor(xterm: Terminal) {
        this.xterm = xterm;
        this.disposables.push(xterm.onKey((e) => {
            
        }));
        this.disposables.push(xterm.onData((data) => {

        }));
    }

    write(text: string): void {
        this.xterm.write(text);
    }
    clear(): void {
        this.xterm.clear();
    }
    getCursorPos(): Promise<Position> {
        let esc = String.fromCharCode(27);
        this.xterm.write(`${esc}[6n`); // device status report DSR
        let resolver: (value?: Position | PromiseLike<Position>) => void;
        let promise = new Promise<Position>((resolve: (value?: Position | PromiseLike<Position>)
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
    setCursorPos(x: number, y: number): boolean {
        if (x > 0 && x <= this.xterm.cols && y > 0 && y <= this.xterm.rows) {
            this.xterm.write(`\x1B[${x};${y}M`); // cursor position CUP
            return true;
        }
        return false;
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
        this.disposables.length = 0;
    }
}