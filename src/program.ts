import { Environment } from "./environment";

export interface Program {
    name: string;
    main(env: Environment, callback: (exitCode: number) => void): void
}
