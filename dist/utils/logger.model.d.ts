/**
 * Simple service for logging the module.
 */
export declare abstract class NgxUploadLogger {
    /** Write a log message. */
    abstract log(...args: any[]): void;
    /** Write an information message. */
    abstract info(...args: any[]): void;
    /** Write a warning message. */
    abstract warn(...args: any[]): void;
    /** Write an error message. */
    abstract error(...args: any[]): void;
    /** Write a debug message. */
    abstract debug(...args: any[]): void;
}
/**
 * Default implementation of Logger that safely writes the message into the console.
 *
 */
export declare class ConsoleLogger implements NgxUploadLogger {
    private _console;
    private _debugEnabled;
    constructor(_console: Console, _debugEnabled?: boolean);
    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
    private _invokeConsoleMethod;
}
/**
 * No op implementation of Logger.
 *
 */
export declare class NoOpLogger implements NgxUploadLogger {
    log(): void;
    info(): void;
    warn(): void;
    error(): void;
    debug(): void;
}
