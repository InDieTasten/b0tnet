# Browser OS Operating System

This document describes the workings of the `BrowserOS` operating system.

This is not a real operating system. It simply emulates a simplified version of what real operating systems do.

BrowserOS is inspired strongly by Linux operating systems.

This is the base operating system in the b0tnet game. Many instances of this operating will be running simultaneously on different machines. The detail of simulation is not yet determined. There may be different operating system derivatives specialized for different devices, such as Routers, Printers, IP cameras, IoT devices, mobile phones and desktop computers.

## Processes

### Multi Process Execution
BrowserOS supports "parallel" execution of processes. There is no multi-threading. Parts of different processes run sequentially in quick succession. There is also no scheduling. Execution time is handed back and forth between processes in cooperative manner. This is accomplished by running only quick code, in short loops, and using asynchronous programming together with Promises to resume a task after other processes had the ability to execute.

### User Management
When processes are launched, they will carry over the owner of the process that launched them. 

### IO streaming
BrowserOS implements IO streaming. Each process has a standard input stream `stdin` and standard output stream `stdout`. The input stream by default is fed from the terminal and will receive characters from the keyboard. The output stream by default will write back to the terminal to display it to the user.
The shell may be used to redirect the output stream from one process to the input stream of another process. The output stream way as well be redirected into a file.

### Event Handling
BrowserOS implements event queueing to pass information between processes.
Keystrokes, incoming IP packets and similar events will be queued up for all processes individually, so that each process has the ability to handle these events for itself.

## File System

### General
The file system is custom written and has it's string format for laying out files into localstorage for saving and loading save-games. During the runtime of a machine, the file-system will be entirely in-memory.

### Permissions
Files and directories have an owner, a group, and access levels for each of these. (More design is needed here)

### Program files
Program files are not stored with their source-code inside the actual files. Program files are marked with meta-information invisible to players, to point to the actual program implementation inside the javascript bundle.

Program files can also be marked with additional payloads, which will be executed, once the associated program is executed. (further game design required)

### Shell scripts
Shell scripts actually have shell script source as their file data. These files are modifiable by players.

### Data files
All other files are data files. Depending on the type of data, data might be stored in the file content, otherwise there might only be summary information.

## Programs

Programs extend the `Process` abstract class, which will provide the following APIs to the program. These APIs may also be overridden for a particular program, to allow for the IO redirection covered in the processes chapter.

- io - providing input and output streams
- fs - providing file system operations such as reading and writing of files and directories
- os - providing event queueing functionality, sleep and similar operations concerning cross-process communications.
- shell - providing operations to read and write environment variables, as well as launching other programs
- ip - providing inter-machine communications
