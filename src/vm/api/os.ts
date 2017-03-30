
interface event {

    type: string,
    args: any[]

}

interface os {

    /**
     * Returns the version of the OS the vm is running
     */
    version: () => string

    /**
     * Registers a callback to a given event type. wildcard filters events, that will trigger
     */
    pullEvent: (wildcard: string, callback: (event: event) => void) => void

    /**
     * Adds an event to the event queue
     */
    queueEvent: (event: event) => void

    /**
     * Returns the amount of seconds since the vm launched
     */
    clock: () => number

    /**
     * Returns the current in-game time
     */
    time: () => Date

    /**
     * Runs a callback after specified amount of seconds
     */
    defer: (seconds: number, callback: () => void) => void

    /**
     * Runs a callback repeatedly in an interval of specified amount of seconds until the callback returns true
     */
    interval: (seconds: number, callback: () => boolean) => void
}
