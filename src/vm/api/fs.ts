
interface fileHandle {
    /** TODO read write binary write append modes */
    close: () => void;
}

interface fs {
    /**
     * Returns a list of all files (including subdirectories but not their contents) contained in a directory
     */
    list: (path: string) => string[];

    /**
     * Checks, if a path refers to an existing file or directory
     */
    exists: (path: string) => boolean;

    /**
     * Checks, if a path refers to an existing directory
     */
    isDir: (path: string) => boolean;

    /**
     * Checks, if a path is read-only (i.e. cannot be modified)
     */
    isReadOnly: (path: string) => boolean;

    /**
     * Gets the final component of a pathname
     */
    getName: (path: string) => string;

    /**
     * Gets the size of a file
     */
    getSize: (path: string) => number;

    /**
     * Gets the remaining space on the drive containeing the given directory
     */
    getFreeSpace: (path: string) => number;

    /**
     * Makes a directory
     */
    makeDir: (path: string) => void;

    /**
     * Moves a file or directory to a new location
     */
    move: (fromPath: string, toPath: string) => void;

    /**
     * Copies a file or directory to a new location
     */
    copy: (fromPath: string, toPath: string) => void;

    /**
     * Deletes a file or directory
     */
    delete: (path: string) => void;

    /**
     * Combines two path components, returning a path consisting of the local path nested inside the base path
     */
    combine: (basePath: string, localPath: string) => string;

    /**
     * Opens a file, so it can be read or written
     */
    open: (path: string, mode: string) => fileHandle;

    /**
     * Searches the filesystems files using wildcards
     */
    find: (wildcard: string) => string[];

    /**
     * Returns the parent directory of path
     */
    getDir: (path: string) => string;

    /**
     * Returns a list of strings that could be combined with the provided name to produce valid entries in the specified folder
     */
    complete: (partialName: string, path: string, includeFiles?: boolean, includeSlashes?: boolean) => string[];
}
