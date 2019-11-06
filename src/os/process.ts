import { IoApi } from "./apis/io";
import { TermApi } from "./apis/term";
import { ShellApi } from "./apis/shell";
import { FsApi } from "./apis/fs";
import { OsApi } from "./apis/os";

export abstract class Process {
    constructor(
        protected io: IoApi,
        protected fs: FsApi,
        protected shell: ShellApi,
        protected term: TermApi,
        protected os: OsApi) {}

    abstract main(args: string[]): Promise<number>;
}
