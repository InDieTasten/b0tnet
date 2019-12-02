
export function rgbTo256(r: number, g: number, b: number): number {
    const steps = [0x00, 0x5f, 0x87, 0xaf, 0xdf, 0xff];

    function findClosestComponent(target: number): number {
        return steps.reduce((previous, current) =>
            Math.abs(current - target) < Math.abs(previous - target) ? current : previous);
    }

    let rComponent = findClosestComponent(r * 255);
    let gComponent = findClosestComponent(g * 255);
    let bComponent = findClosestComponent(b * 255);
    
    let rIndex = steps.indexOf(rComponent);
    let gIndex = steps.indexOf(gComponent);
    let bIndex = steps.indexOf(bComponent);

    return rIndex * 36 + gIndex * 6 + bIndex + 16;
}

export function ansiTextColor(colorCode: number): string {
    return `\x1b[38;5;${colorCode}m`;
}
export function ansiBackgroundColor(colorCode: number): string {
    return `\x1b[48;5;${colorCode}m`;
}
export function ansiTextTrueColor(r: number, g: number, b: number): string {
    return `\x1b[38;2;${Math.floor(r*255)};${Math.floor(g*255)};${Math.floor(b*255)}m`;
}
export function ansiBackgroundTrueColor(r: number, g: number, b: number): string {
    return `\x1b[48;2;${Math.floor(r*255)};${Math.floor(g*255)};${Math.floor(b*255)}m`;
}
export function ansiReset(): string {
    return `\x1b[0m`;
}
