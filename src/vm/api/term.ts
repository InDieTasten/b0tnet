
interface term {
    write: (message: string) => void,
    clear: () => void,
    setCursorPos: (position: Position) => boolean,
    getCursorPos: () => Position,
    setTextColor: (color: number) => void,
    getTextColor: () => number,
    setBackgroundColor: (color: number) => void,
    getBackgroundColor: () => number,
    readTextBuffer: (start: number, length?: number) => string,
    readTextColorBuffer: (start: number, length?: number) => number[],
    readBackgroundColorBuffer: (start: number, length?: number) => number[],
}
