
export interface TermApi {
    getSize(): Promise<TerminalSize>;
    setCursorPosition(x: number, y: number): Promise<boolean>;
    setCursorPosition(position: CursorPosition): Promise<boolean>;
    getCursorPosition(): Promise<CursorPosition>;
    clear(): Promise<void>;
}

export interface TerminalSize {
    width: number;
    height: number;
}

export interface CursorPosition {
    x: number,
    y: number
}
