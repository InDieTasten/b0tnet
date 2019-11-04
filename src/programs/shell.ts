import { Process } from "../os/process";
import { Environment, CharacterEvent } from "../environment";

export class Shell extends Process {
    static Name = 'shell';

    async main(args: string[]): Promise<number> {
        this.printOs();
        this.prompt();

        while (true) {
            var event = await this.env.os.pollEvent();
            if (event instanceof CharacterEvent) {
                this.term.write(event.character);
            }
        }
    }

    private printOs() {
        this.term.clear();
        this.term.write(this.env.os.getVersion() + "\r\n");
    }

    private prompt() {
        this.term.write("> ");
    }
}
