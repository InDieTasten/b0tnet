import * as ste from "./utility/strongly-typed-events"
import { position } from "./utility/position"
import { size } from "./utility/size"
import { repeat_string } from "./utility/string"
import { color_palette, color_names } from "./utility/color16"

export class View extends HTMLElement {}

export class Terminal {

    private target: HTMLDivElement;
    private document: HTMLDocument;
    private viewTarget: HTMLElement;
    private inputElement: HTMLInputElement;

    private buffersDirty: boolean = true;
    private lastView: View;
    private textBuffer: string = "";
    private textColorBuffer: number[] = [];

    private inputBuffer: string = "";

    private _onInputBufferChange = new ste.EventDispatcher<Terminal, string>();
    public get onInputBufferChange(): ste.IEvent<Terminal, string> {
        return this._onInputBufferChange.asEvent();
    }

    private dimensions: size;
    private cursorPosition: number = 0;
    private _cursorBlink: boolean = true;
    private _selectedTextColor: number = color_names.light_grey;


    constructor(targetElement: HTMLDivElement, dimensions: size) {
        
        // persist important references
        this.target = targetElement;
        this.document = targetElement.ownerDocument;

        this.dimensions = dimensions;

        // prepare view target
        this.viewTarget = this.document.createElement("div");
        this.viewTarget.style.display = "inline-block";
        this.viewTarget.style.fontFamily = "monospace";
        this.viewTarget.style.whiteSpace = "pre";
        this.viewTarget.style.border = "1px solid #c0c0c0";
        this.viewTarget.style.padding = "5px";
        this.viewTarget.tabIndex = -1;

        // prepare input element
        this.inputElement = this.document.createElement("input");
        this.inputElement.style.opacity = "0";
        this.inputElement.style.width = "0";
        this.inputElement.style.height = "0";
        this.attachInputListener();

        this.target.appendChild(this.inputElement);
        this.target.appendChild(this.viewTarget);
        this.clear();
    }

    private attachInputListener() {
        this.viewTarget.addEventListener("focus", (ev: Event) => {
            this.inputElement.focus();
        });
        this.inputElement.addEventListener("input", (ev: Event) => {
            let target = (<HTMLInputElement> ev.target);
            this.inputBuffer += target.value;
            this._onInputBufferChange.dispatch(this, this.inputBuffer);
            target.value = "";
        });
    }

    /**
     * Flushes/clears the input buffer
     * @returns {string} buffer content before flush
     */
    public flushInputBuffer() : string {
        let tmp = this.inputBuffer;
        this.inputBuffer = "";
        return tmp;
    }

    /**
     * clear
     */
    public clear() {
        this.write(repeat_string(" ", this.dimensions.width * this.dimensions.height));
        this.setCursorPos({x: 0, y: 0});
    }

    /**
     * getSize
     */
    public getSize() : size {

        return this.dimensions;
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
            && position.y >= 0) {

            let linesToScroll = position.y - this.dimensions.height;
            if (linesToScroll > 0) {
                //debugger;
                this.scroll(linesToScroll);
                position.y -= linesToScroll;
            }

            this.cursorPosition = position.y * this.dimensions.width + position.x;
            
            return true;
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
        return {
            x: this.cursorPosition % this.dimensions.width,
            y: Math.floor(this.cursorPosition / this.dimensions.width)
        }
    }


    /**
     * write
     * @returns {Number} Number of line breaks that occurred while writing the content
     */
    /**
     * write
     */
    public write(content: string) {
        
        let substrings = content.split("\n");

        this.write_raw(substrings[0]);

        for (let i = 1; i < substrings.length; i++) {
            let pos = this.getCursorPos();
            this.setCursorPos({x: 0, y: pos.y + 1});

            this.write_raw(substrings[i]);
        }

    }

    /**
     * scroll
     */
    public scroll(lineCount: number) {
        
        // cut away amount of lines to scroll from beginning buffers
        this.textBuffer = this.textBuffer.substr(lineCount * this.dimensions.width);
        this.textColorBuffer = this.textColorBuffer.slice(lineCount * this.dimensions.width);
        
        // also shift the cursor position
        this.cursorPosition -= lineCount * this.dimensions.width;

        // append trailing padding to buffer, in case nobody writes to it after scrolling
        this.textBuffer += repeat_string(" ", this.dimensions.width * this.dimensions.height - this.textBuffer.length);

        let buffercontent = [];
        let i = 0;
        while (i < this.dimensions.width * this.dimensions.height - this.textColorBuffer.length)
            buffercontent[i++] = this._selectedTextColor;
        
        this.textColorBuffer = this.textColorBuffer.concat(buffercontent);
    }

    public write_raw(content: string) : number {
        
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
                buffercontent[i++] = this._selectedTextColor;

            this.textColorBuffer = preStart.concat(buffercontent.concat(postEnd));
        }

        // increment cursorPosition
        this.cursorPosition += content.length;

        // scroll
        let excessLength = this.textBuffer.length - (this.dimensions.width * this.dimensions.height)
        if (excessLength > 0) {
            let linesToScroll = Math.ceil(excessLength / this.dimensions.width);
            
            this.scroll(linesToScroll);
        }

        return 0;
    }

    /**
     * setTextColor
     */
    public setTextColor(color: number) {
        this._selectedTextColor = color;
    }

    /**
     * display
     */
    public display(view?: View) {

        // remove all childs of target        
        while (this.viewTarget.firstChild) {
            this.viewTarget.removeChild(this.viewTarget.firstChild)
        }

        // calculate new view
        if (view == null)
            view = this.constructView();

        this.viewTarget.appendChild(view);

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
