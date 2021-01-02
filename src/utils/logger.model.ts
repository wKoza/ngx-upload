
/**
 * Simple service for logging the module.
 */
export abstract class NgxUploadLogger {
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

const noop = (): any => undefined;

/**
 * Default implementation of Logger that safely writes the message into the console.
 *
 */
export class ConsoleLogger implements NgxUploadLogger {
    constructor(private _console: Console, private _debugEnabled = true) {}

    log(...args: any[]): void { this._invokeConsoleMethod('log', args); }

    info(...args: any[]): void { this._invokeConsoleMethod('info', args); }

    warn(...args: any[]): void { this._invokeConsoleMethod('warn', args); }

    error(...args: any[]): void { this._invokeConsoleMethod('error', args); }

    debug(...args: any[]): void {
        if (this._debugEnabled) { this._invokeConsoleMethod('debug', args); }
    }

    private _invokeConsoleMethod(type: string, args?: any[]): void {
        let logFn: Function = (<any>this._console)[type] || this._console.log || noop;

        // console methods in IE9 don't have 'apply' method, polyfill it
        if (!logFn.apply) {
            logFn = Function.prototype.bind.call(logFn, this._console);
        }

        logFn.apply(this._console, args);
    }
}

/**
 * No op implementation of Logger.
 *
 */
export class NoOpLogger implements NgxUploadLogger {
    log(): void {}

    info(): void {}

    warn(): void {}

    error(): void {}

    debug(): void {}

}
