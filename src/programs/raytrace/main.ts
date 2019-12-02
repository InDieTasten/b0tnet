import { Process } from "../../os/process";
import { TimeoutEvent } from "../../os/apis/os";
import { ansiReset, ansiBackgroundTrueColor } from "../helpers/color256";
import { Vector3f } from "./vector3f";
import { Material } from "./material";
import { Sphere } from "./sphere";
import { RenderObject } from "./render-object";

class PointLight {
    constructor(
        public position: Vector3f,
        public intensity: number
    ) { }
}

class Scene {
    public constructor(
        public objects: Sphere[],
        public lights: PointLight[]) { }
}

export class RaytraceProgram extends Process {

    private fov: number = Math.PI / 2; // 90 degrees
    private width: number;
    private height: number;
    private framebuffer: Vector3f[];

    async main(args: string[]): Promise<number> {

        const terminalSize = await this.term.getSize();
        this.width = terminalSize.width;
        this.height = terminalSize.height;
        this.framebuffer = [];

        let scene = new Scene([
            new Sphere(new Vector3f(4, 0, -5), 3, new Material(0.6, 0.3, new Vector3f(0.2, 0, 0), 50)),
            new Sphere(new Vector3f(-4, 0, -5), 3, new Material(0.9, 0.1, new Vector3f(0, 0, 0.2), 10))
        ], [
            new PointLight(new Vector3f(-3, -2, 0), 5)
        ]);

        let timerId = this.os.startTimer(0);
        while (true) {
            const event = await this.os.pollEvent();
            if (event instanceof TimeoutEvent && event.timerId === timerId) {
                timerId = this.os.startTimer(10);
                scene.objects.forEach(object => object.center = object.center.add(new Vector3f(0, 0, 0.01)));
                scene.lights.forEach(light => light.position = light.position.add(new Vector3f(0, 0, 0.01)));
                this.render(scene);
                this.display();
            }
        }
    }

    private async display(): Promise<void> {
        await this.io.stdout.write(ansiReset() + "\n\n" + this.framebuffer.map(pixel => {
            let maxComponent = Math.max(pixel.x, pixel.y, pixel.z);
            if (maxComponent > 1)
                pixel = pixel.multiplyScalar(1 / maxComponent);
            return ansiBackgroundTrueColor(pixel.x, pixel.y, pixel.z) + ' ';
        }).join(''));
    }

    private render(scene: Scene) {
        const origin = new Vector3f();
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const x = (2 * (i + 0.5) / this.width - 1) * Math.tan(this.fov / 2) * this.width / this.height;
                const y = (2 * (j + 0.5) / this.height - 1) * Math.tan(this.fov / 2);
                const direction = new Vector3f(x, y, -1).normalize();

                this.framebuffer[i + j * this.width] = this.castRay(origin, direction, scene);
            }
        }
    }

    private reflect(i: Vector3f, normal: Vector3f) {
        //  I - N*2.f*(I*N)

        let dot = i.dot(normal);

        return i.subtract(normal.multiplyScalar(2 * dot)).multiplyScalar(-1);
    }

    private castRay(position: Vector3f, direction: Vector3f, scene: Scene): Vector3f {

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

            let material = closestObject.material;
            let normal = closestObject.getNormal(closestPoint);
            let diffuseLightIntensity = 0;
            let specularLightIntensity = 0;
            scene.lights.forEach(light => {
                let lightDirection = light.position.subtract(closestPoint).normalize();
                

                diffuseLightIntensity += light.intensity * Math.max(0, lightDirection.dot(normal));

                specularLightIntensity += Math.pow(
                    Math.max(0, this.reflect(lightDirection, normal).dot(lightDirection)),
                    material.specularExponent) * light.intensity;
            });

            let diffuseComponent = material.diffuseColor
                    .multiplyScalar(diffuseLightIntensity * material.albedoA);

            let specularComponent = new Vector3f(1, 1, 1)
                .multiplyScalar(specularLightIntensity * material.albedoB);

            let rgb = diffuseComponent.add(specularComponent);

            return rgb;
        } else {
            // ambient color
            return new Vector3f(0.2, 0.5, 0.5);
        }
    }
}