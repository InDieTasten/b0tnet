
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
     * Registers a callback
     */
    pullEvent: (callback: (event: event) => void, targetEvents?: string) => void

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

}
