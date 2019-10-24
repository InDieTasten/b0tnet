import { Program } from "../program";
import { Environment, KeyEvent, CharacterEvent } from "../environment";
import { Terminal } from "xterm";

export class Shell implements Program {
    static Program = new Shell();

    name = 'shell';

    async main(system: Environment): Promise<number> {
        this.printOs(system);
        await this.prompt(system);

        while (true) {
            var event = await system.os.pollEvent();
            if (event instanceof CharacterEvent) {
                system.console.write(event.character);
            }
        }
    }

    private printOs(system: Environment) {
        system.console.clear();
        system.console.write(system.os.getVersion() + "\r\n");
    }

    private async prompt(system: Environment): Promise<void> {
        system.console.write(JSON.stringify(await system.console.getCursorPos()) + "\r\n");
        system.console.write(JSON.stringify(await system.console.getCursorPos()) + "\r\n");
        system.console.write("> ");
    }
}
