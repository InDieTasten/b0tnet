import { OutputStream, InputStream } from "./apis/io";

export class MemoryStream implements InputStream, OutputStream {
    private buffer: string[] = [];
    private bufferListeners: Array<() => boolean> = [];

    exposeInput(): InputStream {
        return this as InputStream;
    }

    exposeOutput(): OutputStream {
        return this as OutputStream;
    }

    readCharacter(): Promise<string> {
        if (this.buffer.length) {
            // buffer already contains characters to read
            return Promise.resolve(this.buffer.shift());
        } else {
            // buffer is currently empty. We need to return an unresolved promise
            // and create a listener to get notified, once there is data in the buffer
            return new Promise<string>((resolve: (value?: string | PromiseLike<string>)
                => void) => this.bufferListeners.push((): boolean => {
                    if (this.buffer.length) {
                        resolve(this.buffer.shift());
                        return true;
                    }
                    return false;
                }));
        }
    }
    readLine(): Promise<string> {
        let nextNewlineIndex = this.buffer.indexOf("\n");
        if (nextNewlineIndex !== -1) {
            return Promise.resolve(this.buffer.splice(0, nextNewlineIndex).join());
        } else {
            return new Promise<string>((resolve: (value?: string | PromiseLike<string>)
                => void) => this.bufferListeners.push((): boolean => {
                    let nextNewlineIndex = this.buffer.indexOf("\n");
                    if (nextNewlineIndex !== -1) {
                        resolve(this.buffer.splice(0, nextNewlineIndex).join());
                        return true;
                    }
                    return false;
                }));
        }
    }
    read(length?: number): Promise<string> {
        if (length === undefined && this.buffer.length || this.buffer.length >= length) {
            return Promise.resolve(this.buffer.splice(0, length).join());
        } else {
            return new Promise<string>((resolve: (value?: string | PromiseLike<string>)
            => void) => this.bufferListeners.push((): boolean => {
                    if (length === undefined && this.buffer.length || this.buffer.length >= length) {
                        resolve(this.buffer.splice(0, length).join());
                        return true;
                    }
                    return false;
                }));
        }
    }
    writeCharacter(character: string): Promise<void> {
        if (character.length === 1) {
            return this.write(character);
        }
        return Promise.resolve();
    }
    writeLine(line: string): Promise<void> {
        if (line.length > 0) {
            return this.write(line + "\n");
        }
        return Promise.resolve();
    }
    write(text: string): Promise<void> {
        if (text.length) {
            this.buffer = this.buffer.concat(text.split(''));
            this.notifyNextBufferListener();
        }
        return Promise.resolve();
    }

    private notifyNextBufferListener() {
        if (this.bufferListeners.length) {
            let listener = this.bufferListeners[0];
            if (listener()) {
                this.bufferListeners.shift();
                this.notifyNextBufferListener();
            }
        }
    }
}
