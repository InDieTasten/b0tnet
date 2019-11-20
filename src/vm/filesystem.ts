import { Drive } from "./drive"
import { Process } from "../os/process";
import { FsApi, FileMode, FileReadHandle, FileWriteHandle } from "../os/apis/fs";

class FsNode {
    
    private _name : string;
    public get name() : string {
        return this._name;
    }
    public set name(v : string) {
        this._name = v;
    }
    
    
    private _parent : FsNode|undefined;
    public get parent() : FsNode|undefined {
        return this._parent;
    }
    public set parent(v : FsNode|undefined) {
        this._parent = v;
    }
    

}

export class Directory extends FsNode {

    private _childNodes : FsNode[];
    public get childNodes() : FsNode[] {
        return this._childNodes;
    }
    public set childNodes(v : FsNode[]) {
        this._childNodes = v;
    }

}

export class File extends FsNode {
    
    private _content: string;

    public get content(): string {
        return this._content;
    }
    public set content(v: string) {
        this._content = v;
    }
    
}

export class FileSystem implements FsApi {

    private _rootNodes : FsNode[];
    public get rootNodes() : FsNode[] {
        return this._rootNodes;
    }
    public set rootNodes(v : FsNode[]) {
        this._rootNodes = v;
    }

    
    private _drive : Drive;
    public get drive() : Drive {
        return this._drive;
    }
    public set drive(v : Drive) {
        this._drive = v;
    }
    
    /**
     *
     */
    constructor(drive: Drive) {
        this.drive = drive;
    }

    combine(pathSegments: string[]): string {
        throw new Error("Method not implemented.");
    }
    isFile(path: string): boolean {
        throw new Error("Method not implemented.");
    }
    isDirectory(path: string): boolean {
        throw new Error("Method not implemented.");
    }
    exists(path: string): boolean {
        throw new Error("Method not implemented.");
    }
}
