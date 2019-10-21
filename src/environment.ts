import { Program } from './program';
// import { Position } from './utility/position';

export class Environment {
    console: ConsoleApi;
    os: OsApi;
    programs: Program[];
}

export interface ConsoleApi {
    write(text: string): void;
    clear(): void;
    // getCursorPos(): Position;
    // setCursorPos(position: Position): boolean;
    // setCursorPos(x: number, y: number): boolean;
}

export interface OsApi {
    pollEvent(): Promise<OsEvent>;
    queueEvent(event: OsEvent): void;
}

export interface OsEvent {
    type: string;
}
