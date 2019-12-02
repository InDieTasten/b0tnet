
export class Vector3f {
    public constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    x: number;
    y: number;
    z: number;

    public normalize(): Vector3f {
        const ratio = this.magnitude();
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
    public multiplyScalar(scalar: number): Vector3f {
        return new Vector3f(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    public dot(other: Vector3f): number { // dot product
        const product = this.multiply(other);
        return product.x + product.y + product.z;
    }
    public magnitude(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
    public capMax(maximum: Vector3f): Vector3f {
        return new Vector3f(Math.max(this.x, maximum.x), Math.max(this.y, maximum.y), Math.max(this.z, maximum.z));
    }
}
