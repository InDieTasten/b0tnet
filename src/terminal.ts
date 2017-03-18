import { position } from "./utility/position"
import { size } from "./utility/size"
import { color_palette, color_names } from "./utility/color16"

export class View extends HTMLElement {}

export class Terminal {

    private target: HTMLDivElement;
    private document: HTMLDocument;

    private buffersDirty: boolean = true;
    private lastView: View;
    private textBuffer: string = "";
    private textColorBuffer: number[] = [];

    private dimensions: size;
    private cursorPosition: number = 0;
    private cursorBlink: boolean = true;
    private selectedTextColor: number = color_names.light_grey;

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
        
        this.buffersDirty = true;
        
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);

        if (position.x >= 0
            && position.x < this.dimensions.width
            && position.y >= 0
            && position.y < this.dimensions.height) {

            this.cursorPosition = position.y * this.dimensions.width + position.x;
            
        } else {
            return false;
        }
    }

    /**
     * setCursorBlinking
     */
    public setCursorBlinking(blink: boolean) {
        
        this.buffersDirty = true;
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
        
        this.buffersDirty = true;

        // text buffer update
        {
            let preStart = this.textBuffer.substring(0, this.cursorPosition);
            let postEnd = this.textBuffer.substring(this.cursorPosition + content.length);
            
            this.textBuffer = preStart + content + postEnd;
        }
        {
            let preStart = this.textColorBuffer.slice(0, this.cursorPosition);
            let postEnd = this.textColorBuffer.slice(this.cursorPosition + content.length);

            let buffercontent = [];
            let i = 0;
            while (i < content.length)
                buffercontent[i++] = this.selectedTextColor;

            this.textColorBuffer = preStart.concat(buffercontent.concat(postEnd));
        }

        // increment cursorPosision
        this.cursorPosition += content.length;

        // scroll
        let excessLength = this.textBuffer.length - (this.dimensions.width * this.dimensions.height)
        if (excessLength > 0) {
            let linesToScroll = Math.ceil(excessLength / this.dimensions.width);
            
            // cut away amount of lines to scroll from beginning buffers
            this.textBuffer = this.textBuffer.substr(linesToScroll * this.dimensions.width);
            this.textColorBuffer = this.textColorBuffer.slice(linesToScroll * this.dimensions.width);
            
            // also shift the cursor position
            this.cursorPosition -= linesToScroll * this.dimensions.width;
        }

        return 0;
    }

    /**
     * setTextColor
     */
    public setTextColor(color: number) {
        this.selectedTextColor = color;
    }

    /**
     * display
     */
    public display(view?: View) {

        // remove all childs of target        
        while (this.target.firstChild) {
            this.target.removeChild(this.target.firstChild)
        }

        // calculate new view
        if (view == null)
            view = this.constructView();

        let stylingContainer = document.createElement("div");

        stylingContainer.style.display = "inline-block"
        stylingContainer.style.fontFamily = "monospace";
        stylingContainer.style.whiteSpace = "pre";
        stylingContainer.style.border = "1px solid #c0c0c0";
        stylingContainer.style.padding = "5px";

        stylingContainer.appendChild(view);

        this.target.appendChild(stylingContainer);

    }

    public constructView() : View {

        if (!this.buffersDirty)
            return this.lastView;

        let i = 0;
        let container = this.document.createElement("font");

        while (i < this.textBuffer.length)
        {
            let currentColor = this.textColorBuffer[i];
            let fragment = this.document.createElement("font");
            fragment.style.color = color_palette[currentColor];
            container.appendChild(fragment);

            let startingIndex = i;
            let brokenString = "";
            do {
                if (i % this.dimensions.width === 0 && i !== 0) {
                    brokenString += this.textBuffer.substring(startingIndex, i) + "<br>";
                    startingIndex = i;
                }

                i++;

            } while (currentColor === this.textColorBuffer[i])

            fragment.innerHTML = brokenString + this.textBuffer.substring(startingIndex, i);

        }

        this.lastView = container;
        this.buffersDirty = false;
        return container;
    }
}
