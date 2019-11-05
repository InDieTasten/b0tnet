
export interface OsApi {
    getName(): string;
    pollEvent(): Promise<OsEvent>;
    queueEvent(event: OsEvent): void;
    startTimer(duration: number): Symbol;
    sleep(duration: number): Promise<void>;
}

export class OsEvent {
    type: string;
}

export class TimeoutEvent extends OsEvent {
    type = 'timeout';
    timerId: Symbol;
}
