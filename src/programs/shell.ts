import { Process } from "../os/process";
import { CharacterEvent } from "../environment";

export class Shell extends Process {
    static Name = 'shell';

    async main(args: string[]): Promise<number> {
        await this.printOs();
        this.prompt();

        while (true) {
            var event = await this.os.pollEvent();
            if (event instanceof CharacterEvent) {
                this.io.stdout.write(event.character);
            }
        }
    }

    private async printOs(): Promise<void> {
        await this.term.clear();
        await this.io.stdout.writeLine(this.os.getName());
    }

    private async prompt(): Promise<string> {
        await this.io.stdout.write("> ");
        return await this.io.stdin.readLine();
    }
}
