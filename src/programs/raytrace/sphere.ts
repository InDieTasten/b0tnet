import { RenderObject } from "./render-object";
import { Vector3f } from "./vector3f";
import { Material } from "./material";

export class Sphere implements RenderObject {

    center: Vector3f;
    radius: number;
    material: Material;

    constructor(position?: Vector3f, radius?: number, material?: Material) {
        this.center = position || new Vector3f();
        this.radius = radius || 1;
        this.material = material || new Material(0.6, 0.3, new Vector3f(0.2, 0.2, 0.2), 30);
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
