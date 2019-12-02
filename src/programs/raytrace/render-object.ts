import { Material } from "./material";
import { Vector3f } from "./vector3f";

export interface RenderObject {
    material: Material;
    findIntersect(position: Vector3f, direction: Vector3f): Vector3f;
    getNormal(closestPoint: Vector3f): Vector3f;
}
