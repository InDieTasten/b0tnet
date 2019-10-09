import { Program } from './program';
import { IEvent } from './event';

export class Environment {
    term: TermApi;
    programs: Program[];
}

export interface TermApi {
    onKey: IEvent<{ key: string, domEvent: KeyboardEvent }>
    write: (data: string) => void;
    clear: () => void;
    getCursorX: () => number;
    getCursorY: () => number;
}
