import { InputStream, OutputStream } from "./io";

export interface FsApi {
    open(path: string, mode: FileMode.read): Promise<FileReadHandle>;
    open(path: string, mode: FileMode.write): Promise<FileWriteHandle>;
    open(path: string, mode: FileMode.append): Promise<FileWriteHandle>;

    combine(pathSegments: string[]): string;
    
    isFile(path: string): boolean;
    isDirectory(path: string): boolean;
    exists(path: string): boolean;
}

export enum FileMode {
    read,
    write,
    append
}

export interface FileHandle {
    close: () => Promise<void>;
}

export interface FileReadHandle extends InputStream, FileHandle {
}

export interface FileWriteHandle extends OutputStream, FileHandle {
    flush: () => Promise<void>;
}