
export interface ShellApi {
    run: (path: string, args: string[]) => Promise<number>;

    setEnvironmentVariable: (key: string, value: string) => void;
    getEnvironmentVariable: (key: string) => string;
}
