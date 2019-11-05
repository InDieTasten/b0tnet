
export interface IoApi {
    stdin: InputStream;
    stdout: OutputStream;
}

export interface InputStream {
    readCharacter(): Promise<string>;
    readLine(): Promise<string>;
    read(length?: number): Promise<string>;
}

export interface OutputStream {
    writeCharacter(character: string): Promise<void>;
    writeLine(line: string): Promise<void>;
    write(text: string): Promise<void>;
}
