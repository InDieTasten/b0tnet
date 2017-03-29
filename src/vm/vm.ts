import { Drive } from "./drive"

export class VM {

    
    private _drive : Drive;
    public get drive() : Drive {
        return this._drive;
    }
    public set drive(v : Drive) {
        this._drive = v;
    }
    
    private _runtimeScope : string;
    public get runtimeScope() : string {
        return this._runtimeScope;
    }
    public set runtimeScope(v : string) {
        this._runtimeScope = v;
    }
    
    

}