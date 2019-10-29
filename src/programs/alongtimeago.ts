import { Program } from "../program";
import { Environment, CharacterEvent } from "../environment";

export class ALongTimeAgo implements Program {
    static Program = new ALongTimeAgo();

    name = 'alongtimeago';

    // Credits to Simon Jansen for this

    private g_currentFrame = 0;
    private g_updateDelay = 40;
    private g_frameStep = 1; //advance one frame per tick
    private g_timerHandle: number = null;
    private LINES_PER_FRAME = 14;

    private system: Environment;

    async main(system: Environment): Promise<number> {
        this.system = system;
        this.updateDisplay();

        await this.prompt(system);
        while (true) {
            var event = await system.os.pollEvent();
            if (event instanceof CharacterEvent) {
                system.console.write(event.character);
            }
        }
    }

    private updateDisplay() {
        if(this.g_timerHandle)
        {
            clearTimeout(this.g_timerHandle);
        }

        this.displayFrame(this.g_currentFrame);

        if( this.g_frameStep != 0 )
        {
            //read the first line of the current frame as it is a number containing how many times this frame should be displayed

            var nextFrameDelay = parseInt(this.film[this.g_currentFrame * this.LINES_PER_FRAME]) * this.g_updateDelay;

            var nextFrame = this.g_currentFrame + this.g_frameStep;

            if(this.validateFrame(nextFrame) == true)
                this.g_currentFrame = nextFrame;

            this.g_timerHandle = setTimeout(() => this.updateDisplay(), nextFrameDelay );
        }
    }

    private displayFrame(frameNumber: number) {
        if( this.validateFrame(frameNumber) != true ) {
            return;
        }

        this.system.console.write("\r\n\n\n\n")

        for (var line = 1; line < 14; line++) {
            let lineText = this.film[ (this.g_currentFrame * this.LINES_PER_FRAME) + line];
            if( !lineText || lineText.length < 1 ) {
                lineText = ' ';
            }

            this.system.console.write("      " + lineText + "\r\n");
        }
        this.system.console.write("\r\n\n\n\n\n\n\n");
    }

    private validateFrame(frameNumber: number) {
        return ( frameNumber > 0 && frameNumber < Math.floor( this.film.length / this.LINES_PER_FRAME ) );
    }

    private async prompt(system: Environment): Promise<void> {
        system.console.write(JSON.stringify(await system.console.getCursorPos()) + "\r\n");
        system.console.write(JSON.stringify(await system.console.getCursorPos()) + "\r\n");
        system.console.write("> ");
    }
}