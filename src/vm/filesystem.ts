import { Drive } from "./drive"

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
    
    private _content : string;
    public get content() : string {
        return this._content;
    }
    public set content(v : string) {
        this._content = v;
    }
    
}

export class FileSystem {

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
}