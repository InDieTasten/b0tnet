import { OsApi, OsEvent, TimeoutEvent } from "./apis/os";

export class BrowserOs implements OsApi {

    private eventQueue: OsEvent[] = [];
    private eventResolvers: Array<(value?: OsEvent | PromiseLike<OsEvent>) => void> = [];

    getName(): string {
        return "BrowserOS 0.1";
    }
    pollEvent(): Promise<OsEvent> {
        return new Promise<OsEvent>((resolve: (value?: OsEvent | PromiseLike<OsEvent>)
                        => void) => this.eventResolvers.push(resolve));
    }
    queueEvent(event: OsEvent): void {
        this.eventQueue.push(event);
        this.publishEvents();
    }
    startTimer(duration: number): Symbol {
        let timerId = Symbol();
        setTimeout(() => {
            this.queueEvent(new TimeoutEvent(timerId));
        }, duration);
        return timerId;
    }
    sleep(duration: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private publishEvents(): void {
        setTimeout(() => {
            while (this.eventQueue.length > 0) {
                let currentEvent = this.eventQueue.shift();
                
                this.eventResolvers.forEach(listener => {
                    listener(currentEvent);
                });
            }
        }, 0);
    }
}