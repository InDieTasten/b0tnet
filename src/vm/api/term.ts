
import { position } from "../../utility/position"
import { size } from "../../utility/size"

interface term {

    /**
     * Writes text to the screen, using the current text and background colors
     */
    write: (text: string) => void;

    /**
     * Writes text to the screen using the specified text and background colors
     */
    blit: (text: string, textColors: number[], backgroundColors: number[]) => void;

    /**
     * Clears the entire screen
     */
    clear: () => void;

    /**
     * Clears the line the sursor is on
     */
    clearLine: () => void;

    /**
     * Returns the x and y position of the cursor
     */
    getCursorPos: () => position;

    /**
     * Sets the cursor's position
     */
    setCursorPos: (position: position) => boolean;

    /**
     * Disables the blinking or turns it on
     */
    setCursorBlink: (enable: boolean) => void;

    /**
     * Returns whether the terminal supports color
     */
    isColor: () => boolean;

    /**
     * Returns the width and height values stating the size of the screen
     */
    getSize: () => size;

    /**
     * Scrolls the terminal n lines
     */
    scroll: (n: number) => void;

    /**
     * Redirects terminal output to another terminal object
     */
    redirect: (target: term) => term;

    /**
     * Returns the current terminal object
     */
    current: () => term;

    /**
     * Returns the original terminal object
     */
    native: () => term;

    /**
     * Sets the text color of the terminal
     */
    setTextColor: (color: number) => void;

    /**
     * Returns the current text color of the terminal
     */
    getTextColor: () => number;

    /**
     * Sets the background color of the terminal
     */
    setBackgroundColor: (color: number) => void;

    /**
     * Returns the current background color of the terminal
     */
    getBackgroundColor: () => number;

    /**
     * Returns a section of the text channel of the output buffer
     */
    readTextBuffer: (start: number, length?: number) => string;

    /**
     * Returns a section of the text color channel of the output buffer
     */
    readTextColorBuffer: (start: number, length?: number) => number[];

    /**
     * Returns a section of the background color channel of the output buffer
     */
    readBackgroundColorBuffer: (start: number, length?: number) => number[];

}
