import { Process } from "../os/process";
import { TimeoutEvent } from "../os/apis/os";

class Vector3f {
    public constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    x: number;
    y: number;
    z: number;

    public normalize(): Vector3f {
        const ratio = Math.max(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
        return new Vector3f(this.x / ratio, this.y / ratio, this.z / ratio);
    }
    public add(other: Vector3f): Vector3f {
        return new Vector3f(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    public subtract(other: Vector3f): Vector3f {
        return new Vector3f(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    public multiply(other: Vector3f): Vector3f {
        return new Vector3f(this.x * other.x, this.y * other.y, this.z * other.z);
    }
    public dot(other: Vector3f): number { // dot product
        const product = this.multiply(other);
        return product.x + product.y + product.z;
    }
}

interface RenderObject {
    intersects(position: Vector3f, direction: Vector3f): boolean;
}

class Sphere implements RenderObject {

    center: Vector3f;
    radius: number;

    constructor(position?: Vector3f, radius?: number) {
        this.center = position || new Vector3f();
        this.radius = radius || 1;
    }

    public intersects(position: Vector3f, direction: Vector3f): boolean {
        // ray to sphere intersection algorithm
        const oc = position.subtract(this.center);
        const a = direction.dot(direction);
        const b = 2 * oc.dot(direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b*b - 4*a*c;

        if (discriminant < 0) return false;
        const distance = (-b - Math.sqrt(discriminant)) / (2*a);

        return distance > 0;
    }
}

export class RaytraceProgram extends Process {

    private sphere: Sphere = new Sphere(new Vector3f(0,0,-16), 2);

    private fov: number = Math.PI/2; // 90 degrees
    private width: number;
    private height: number;
    private framebuffer: Float32Array;

    async main(args: string[]): Promise<number> {

        const terminalSize = await this.term.getSize();
        this.width = terminalSize.width;
        this.height = terminalSize.height;
        this.framebuffer = new Float32Array(this.width * this.height);
        
        let timerId = this.os.startTimer(0);
        while (true) {
            const event = await this.os.pollEvent();
            if (event instanceof TimeoutEvent && event.timerId === timerId) {
                timerId = this.os.startTimer(10);
                this.sphere.center = this.sphere.center.multiply(new Vector3f(1, 1, 0.995));
                this.render(this.sphere);
                this.display();
            }
        }
    }

    private async display(): Promise<void> {
        let outputBuffer = '\n\n';
        for (let i = 0; i < this.framebuffer.length; i++) {
            if (this.framebuffer[i] === 0) {
                outputBuffer += '.';
            } else {
                outputBuffer += '+';
            }
        }

        await this.io.stdout.write(outputBuffer);
    }

    private render(sphere: Sphere) {
        const origin = new Vector3f();
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const x = (2* (i+0.5) / this.width-1) * Math.tan(this.fov/2) * this.width / this.height;
                const y = (2 * (j+0.5) / this.height-1) * Math.tan(this.fov/1.45);
                const direction = new Vector3f(x, y, -1).normalize();

                this.framebuffer[i + j * this.width] = this.castRay(origin, direction, sphere);
            }
        }
    }

    private castRay(position: Vector3f, direction: Vector3f, object: RenderObject): number {
        let distance;
        if (!object.intersects(position, direction)) {
            return 0;
        } else {
            return 1;
        }
    }
}