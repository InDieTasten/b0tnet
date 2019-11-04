import { Environment, TerminalApi } from "../environment";

export abstract class Process {
    constructor(
        protected env: Environment,
        protected term: TerminalApi) {}

    abstract main(args: string[]): Promise<number>
}
