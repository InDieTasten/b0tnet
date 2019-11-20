import { FileSystem } from "./filesystem"

export class Drive {
    /**
     * Drive capacity in KiB
     */
    private _driveCapacity : number;
    public get driveCapacity() : number {
        return this._driveCapacity;
    }
    public set driveCapacity(v : number) {
        this._driveCapacity = v;
    }
    
    /**
     * Filesystem managing the space on the drive
     */
    private _fileSystem : FileSystem;
    public get fileSystem() : FileSystem {
        return this._fileSystem;
    }
    public set fileSystem(v : FileSystem) {
        this._fileSystem = v;
    }
    
    /**
     * capacity in KiB
     */
    constructor(capacity: number = 1024) {
        this.driveCapacity = capacity;

        this.fileSystem = new FileSystem(this);
    }
}
