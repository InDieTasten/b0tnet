import { position } from "./utility/position"
import { size } from "./utility/size"
import { color_palette } from "./utility/color16"

export class Terminal {

    private target: HTMLDivElement;
    private document: HTMLDocument;

    private textBuffer: string = "";
    private textColorBuffer: number[] = [];

    private dimensions: size;
    private cursorPosition: number = 0;
    private cursorBlink: boolean = true;

    constructor(targetElement: HTMLDivElement, dimensions: size) {
        
        // persist important references
        this.target = targetElement;
        this.document = targetElement.ownerDocument;

        this.dimensions = dimensions;
    }

    /**
     * getSize
     */
    public getSize() : size {

        throw "Not implemented";
    }

    /**
     * setCursorPos
     */
    public setCursorPos(position: position) : boolean {
        
        throw "Not implemented";
    }

    /**
     * setCursorBlinking
     */
    public setCursorBlinking(blink: boolean) {
        
        throw "Not implemented";
    }

    /**
     * getCursorPos
     */
    public getCursorPos() : position {
        
        throw "Not implemented";
    }


    /**
     * write
     * @returns {Number} Number of line breaks that occurred while writing the content
     */
    public write(content: string) : number {
        
        let preStart = this.textBuffer.substring(0, this.cursorPosition-1);
        let postEnd = this.textBuffer.substring(this.cursorPosition + content.length);
        
        this.textBuffer = preStart + content + postEnd;

        // increment cursorPosision
        this.cursorPosition += content.length;

        // scroll
        let excessLength = this.textBuffer.length - (this.dimensions.width * this.dimensions.height)
        if (excessLength > 0) {
            let linesToScroll = Math.floor(excessLength / this.dimensions.width);
            
            // cut away amount of lines to scroll from beginning of text buffer
            this.textBuffer = this.textBuffer.substr(linesToScroll * this.dimensions.width);
            
            // also shift the cursor position
            this.cursorPosition -= linesToScroll * this.dimensions.width;
        }

        return 0;
    }

    /**
     * setTextColor
     */
    public setTextColor(color: number) {
        
        throw "Not implemented";
    }

    /**
     * display
     */
    public display() {

        // remove all childs of target        
        while (this.target.firstChild) {
            this.target.removeChild(this.target.firstChild)
        }

        // calculate new view
        let view = this.constructFrame();
        this.target.appendChild(view);

    }

    private constructFrame() : HTMLElement {

        let i = 0;
        let container = this.document.createElement("div");

        while (i < this.dimensions.width * this.dimensions.height)
        {
            let currentColor = this.textColorBuffer[i];
            let fragment = this.document.createElement("font");
            fragment.style.color = color_palette[currentColor];
            container.appendChild(fragment);

            let startingIndex = i;
            let brokenString = "";
            do {
                if (i % this.dimensions.width === 0) {
                    brokenString += this.textBuffer.substring(startingIndex, i) + "<br>";
                    startingIndex = i;
                }

                i++;

            } while (currentColor === this.textColorBuffer[i])

            fragment.innerHTML = brokenString + this.textBuffer.substring(startingIndex, i);

        }

        return container;
    }
}
