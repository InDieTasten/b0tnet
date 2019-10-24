import { Program } from './program';
import { Position } from './utility/position';

export class Environment {
    console: ConsoleApi;
    os: OsApi;
    programs: Program[];
}

export interface ConsoleApi {
    write(text: string): void;
    clear(): void;

    getCursorPos(): Promise<Position>;
    setCursorPos(x: number, y: number): boolean;
}

export interface OsApi {
    getVersion(): string;

    pollEvent(): Promise<OsEvent>;
    queueEvent(event: OsEvent): void;

    // setTimeout(delay: number): Symbol;
    // clearTimeout(timer: Symbol): void;
}

export class OsEvent {
    type: string;
}

export class KeyEvent extends OsEvent {

    constructor(keyCode: number, control: boolean, shift: boolean, alternate: boolean) {
        super();
        this.keyCode = keyCode;
        this.control = control;
        this.shift = shift;
        this.alternate = alternate;
    }

    public type: 'key';
    public keyCode: number;
    public control: boolean;
    public shift: boolean;
    public alternate: boolean;
}

export class CharacterEvent extends OsEvent {

    constructor(text: string) {
        super();
        this.character = text;
    }

    public type: 'char';
    public character: string;
}
