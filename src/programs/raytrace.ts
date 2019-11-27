import { Process } from "../os/process";
import { TimeoutEvent } from "../os/apis/os";
import { ansiBackgroundColor, rgbTo256, ansiReset } from "./helpers/color256";

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
    public magnitude(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
}

interface RenderObject {
    material: Material;
    findIntersect(position: Vector3f, direction: Vector3f): Vector3f;
    getNormal(closestPoint: Vector3f): Vector3f;
}

class Material {
    constructor(
        public diffuseColor: Vector3f
    ) {}
}

class Sphere implements RenderObject {

    center: Vector3f;
    radius: number;
    material: Material;

    constructor(position?: Vector3f, radius?: number, material?: Material) {
        this.center = position || new Vector3f();
        this.radius = radius || 1;
        this.material = material || new Material(new Vector3f(0.2, 0.2, 0.2));
    }

    public findIntersect(position: Vector3f, direction: Vector3f): Vector3f|null {
        // ray to sphere intersection algorithm
        const oc = position.subtract(this.center);
        const a = direction.dot(direction);
        const b = 2 * oc.dot(direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b*b - 4*a*c;
        if (discriminant < 0) return null;
        const distance = (-b - Math.sqrt(discriminant)) / (2*a);

        // this prevents finding intersections opposite of the ray direction
        if (distance <= 0) return null;

        // calculate the point of intersection
        return position.add(direction.multiply(new Vector3f(distance, distance, distance)));
    }

    public getNormal(point: Vector3f): Vector3f {
        return point.subtract(this.center).normalize();
    }
}

class PointLight {
    constructor(
        public position: Vector3f,
        public intensity: number
    ) {}
}

class Scene {
    public constructor(
        public objects: Sphere[],
        public lights: PointLight[]) {}
}

export class RaytraceProgram extends Process {

    private fov: number = Math.PI/2; // 90 degrees
    private width: number;
    private height: number;
    private framebuffer: string[];

    async main(args: string[]): Promise<number> {

        const terminalSize = await this.term.getSize();
        this.width = terminalSize.width;
        this.height = terminalSize.height;
        this.framebuffer = [];

        let scene = new Scene([
            new Sphere(new Vector3f( 4,0,-5), 3, new Material(new Vector3f(1,0,0))),
            new Sphere(new Vector3f(-4,0,-5), 3, new Material(new Vector3f(0,0,1)))
        ], [
            new PointLight(new Vector3f(-3, 4, 0), 5)
        ]);
        
        let timerId = this.os.startTimer(0);
        while (true) {
            const event = await this.os.pollEvent();
            if (event instanceof TimeoutEvent && event.timerId === timerId) {
                timerId = this.os.startTimer(50);
                scene.objects.forEach(object => object.center = object.center.add(new Vector3f(0, 0, 0.01)));
                scene.lights.forEach(light => light.position = light.position.add(new Vector3f(0, 0, 0.01)));
                this.render(scene);
                this.display();
            }
        }
    }

    private async display(): Promise<void> {
        await this.io.stdout.write(ansiReset() + "\n\n" + this.framebuffer.join(''));
    }

    private render(scene: Scene) {
        const origin = new Vector3f();
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const x = (2* (i+0.5) / this.width-1) * Math.tan(this.fov/2) * this.width / this.height;
                const y = (2 * (j+0.5) / this.height-1) * Math.tan(this.fov/2); // essentially changing the vertical fov to correct for the pixel height
                const direction = new Vector3f(x, y, -1).normalize();

                this.framebuffer[i + j * this.width] = this.castRay(origin, direction, scene);
            }
        }
    }

    private castRay(position: Vector3f, direction: Vector3f, scene: Scene): string {
        
        let closestDistance = Infinity;
        let closestPoint: Vector3f = null;
        let closestObject: RenderObject = null;

        scene.objects.forEach(object => {
            let intersection = object.findIntersect(position, direction);
            if (intersection) {
                let distance = intersection.magnitude();
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = intersection;
                    closestObject = object;
                }
            }
        });

        if (closestObject) {

            let normal = closestObject.getNormal(closestPoint);
            let diffuseLightIntensity = 0;
            scene.lights.forEach(light => {
                let lightDirection = light.position.subtract(closestPoint).normalize();
                diffuseLightIntensity += light.intensity * Math.max(0, lightDirection.dot(normal));
            });

            let rgb = closestObject.material.diffuseColor.multiply(new Vector3f(diffuseLightIntensity, diffuseLightIntensity, diffuseLightIntensity)).normalize();
            return ansiBackgroundColor(rgbTo256(rgb.x, rgb.y, rgb.z)) + ' ';
        } else {
            // ambient character
            return ansiReset() + ' ';
        }
    }
}