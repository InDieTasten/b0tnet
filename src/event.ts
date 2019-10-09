interface IListener<T> {
    (e: T): void;
  }
  
  export interface IEvent<T> {
    (listener: (e: T) => any): void;
  }
  
  export interface IEventEmitter<T> {
    event: IEvent<T>;
    fire(data: T): void;
  }
  
  export class EventEmitter<T> implements IEventEmitter<T> {
    private _listeners: IListener<T>[] = [];
    private _event?: IEvent<T>;
  
    public get event(): IEvent<T> {
      if (!this._event) {
        this._event = (listener: (e: T) => any) => {
            this._listeners.length = 0; // HACK
          this._listeners.push(listener);
          const disposable = {
            dispose: () => {
              for (let i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === listener) {
                  this._listeners.splice(i, 1);
                  return;
                }
              }
            }
          };
          return disposable;
        };
      }
      return this._event;
    }
  
    public fire(data: T): void {
      const queue: IListener<T>[] = [];
      for (let i = 0; i < this._listeners.length; i++) {
        queue.push(this._listeners[i]);
      }
      for (let i = 0; i < queue.length; i++) {
        queue[i].call(undefined, data);
      }
    }
  }