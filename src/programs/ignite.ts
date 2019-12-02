import { Process } from "../os/process";
import { TimeoutEvent } from "../os/apis/os";



export class IgniteProgram extends Process {

    private dithers: string[] = [' ', '.', '+', '\u2591', '\u2573', '\u2592'];
    private colorIndices: number[] = [
        16, // black
        0, // gray
        160, // hot red
        208, // orange
        226, // yellow
        229 // bright yellow
    ]

    private tileShades: string[];

    private coolingGrid: number[][];
    private coolingWeight: number = 30;
    private coolingGridYResolution = 2;
    private coolingGridXResolution = 2;
    private coolingOffsetY: number = 0;
    private coolingOffsetX: number = 0;

    private flamingGrid: number[][];

    async main(args: string[]): Promise<number> {
        
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let combined = (i * 16 + j).toString();
                await this.io.stdout.write('\x1b[38;5;' + combined + 'm\u2588'+ combined);
            }
            await this.io.stdout.write('\n');
        }
        this.calculateShades();
        for (let shade = 0; shade < this.tileShades.length; shade++) {
            await this.io.stdout.write(this.tileShades[shade]);
        }

        await this.os.sleep(1000);
        
        let terminalSize = await this.term.getSize();
        this.coolingGrid = this.buildGrid(
            terminalSize.width * this.coolingGridXResolution,
            terminalSize.height * this.coolingGridYResolution);

        this.flamingGrid = this.buildGrid(
            terminalSize.width,
            terminalSize.height);

        this.randomizeCoolingGrid();
        await this.drawGrid(this.coolingGrid);
        await this.os.sleep(1000);

        for (let i = 0; i < 3; i++) {
            this.smoothCoolingGrid(1);
            await this.drawGrid(this.coolingGrid);
            await this.os.sleep(200);
        }
        await this.os.sleep(1000);

        let timer = this.os.startTimer(1);
        while (true) {
            let event = await this.os.pollEvent();
            if (event instanceof TimeoutEvent) {
                timer = this.os.startTimer(30);
                this.drawGrid(this.flamingGrid);
                this.smoothHeatGrid();
                this.coolingOffsetX++;
                this.coolingOffsetY+=2;
            }
        }

        return 0;
    }

    private async drawGrid(grid: number[][]): Promise<void> {
        let terminalSize = await this.term.getSize();
        let gridSize = { height: grid.length, width: grid[0].length };

        let minGridValue = Math.min(...grid.map(row => Math.min(...row)));
        let maxGridValue = Math.max(...grid.map(row => Math.max(...row)));
        let gridRange = maxGridValue - minGridValue;

        let maxShadeValue = this.tileShades.length-1;
        let shadeRange = maxShadeValue;

        let buffer = '\n\n';
        for (let y = 0; y < terminalSize.height; y++) {
            for (let x = 0; x < terminalSize.width; x++) {
                let gridValue = grid[Math.floor(y / gridSize.height * terminalSize.height)][Math.floor(x / gridSize.width * terminalSize.width)];
                let shadeValue = Math.floor((gridValue - minGridValue) / gridRange * shadeRange) || 0;
                buffer += this.tileShades[shadeValue];
            }
        }

        await this.io.stdout.write(buffer);
    }

    private smoothCoolingGrid(iterations: number) {
        for(let y = 0; y < this.coolingGrid.length; y++) {
            for (let x = 0; x < this.coolingGrid[0].length; x++) {
                
                try {
                    let top =    this.coolingGrid[(y) % this.coolingGrid.length][x];
                    let bottom = this.coolingGrid[(y+2) % this.coolingGrid.length][x];
                    let left =   this.coolingGrid[y][(x) % this.coolingGrid[0].length];
                    let right =  this.coolingGrid[y][(x+2) % this.coolingGrid[0].length];
    
                    let smoothedValue = (top+bottom+left+right)/4;
                    this.coolingGrid
                        [(y+1) % this.coolingGrid.length]
                        [(x+1) % this.coolingGrid[0].length] = smoothedValue;
                } catch (error) {
                    debugger;
                }
            }
        }
        if (iterations > 1) {
            this.smoothCoolingGrid(iterations-1);
        }
    }

    private smoothHeatGrid(): void {
        for (let y = 0; y < this.flamingGrid.length; y++) {
            let upperY = Math.max(0, y-1);
            let lowerY = Math.min(this.flamingGrid.length-1, y+1);
            let coolingY = (y + this.coolingOffsetY) % this.coolingGrid.length;

            for (let x = 0; x < this.flamingGrid[0].length; x++) {
                let leftX = (x - 1 + this.flamingGrid[0].length) % this.flamingGrid[0].length;
                let rightX = (x + 1) % this.flamingGrid[0].length;
                let coolingX = (x + this.coolingOffsetX) % this.coolingGrid[0].length;

                let coolingCoefficient = this.coolingGrid[coolingY][coolingX];

                //this.flamingGrid[y][x] = coolingCoefficient;

                this.flamingGrid[y][x] = (
                    this.flamingGrid[y][leftX]
                    + this.flamingGrid[y][rightX]
                    + this.flamingGrid[upperY][x]
                    + this.flamingGrid[lowerY][x]*2) / 6 - coolingCoefficient;
            }
        }
    }

    private buildGrid(width: number, height: number): number[][] {
        let grid: number[][] = [];
        for (let y = 0; y < height; y++) {
            let row: number[] = [];
            grid.push(row);
            for (let x = 0; x < width; x++) {
                row.push(0);
            }
        }
        return grid;
    }

    private async randomizeCoolingGrid(): Promise<void> {
        let gridSize = { height: this.coolingGrid.length, width: this.coolingGrid[0].length };
        for (let randomSpot = 0; randomSpot < 1.6 * gridSize.height * gridSize.width / this.coolingGridYResolution / this.coolingGridXResolution; randomSpot++) {
            let y = Math.floor(Math.random()*gridSize.height);
            let x = Math.floor(Math.random()*gridSize.width);
            this.coolingGrid[y][x] = this.coolingWeight;
        }
    }
    private calculateShades() {
        let numberOfDithers = this.dithers.length*2-1;
        let shadeCount = numberOfDithers * (this.colorIndices.length-1);
        this.tileShades = [];

        for (let shadeIndex = 0; shadeIndex < shadeCount; shadeIndex++) {
            let ditherIndex = shadeIndex % numberOfDithers;
            let colorIndex = (shadeIndex - ditherIndex) / numberOfDithers;
    
            let backgroundColorIndex = colorIndex;
            let textColorIndex = colorIndex + 1;
    
            if (ditherIndex >= this.dithers.length) {
                // mirror the dither
                ditherIndex = (this.dithers.length*2-1) - ditherIndex;
    
                // swap background and text colors
                [textColorIndex, backgroundColorIndex] = [backgroundColorIndex, textColorIndex];
            }
    
            this.tileShades.push('\x1b[38;5;' + this.colorIndices[Math.floor(textColorIndex)].toString()
                + 'm\x1b[48;5;' + this.colorIndices[Math.floor(backgroundColorIndex)].toString()
                + 'm' + this.dithers[Math.floor(ditherIndex)]);
        }
    }
}
