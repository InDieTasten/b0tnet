import { Vector3f } from "./vector3f";

export class Material {
    constructor(
        public albedoA: number,
        public albedoB: number,
        public diffuseColor: Vector3f,
        public specularExponent: number
    ) {}
}
