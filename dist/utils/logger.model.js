/**
 * Simple service for logging the module.
 */
var NgxUploadLogger = /** @class */ (function () {
    function NgxUploadLogger() {
    }
    return NgxUploadLogger;
}());
export { NgxUploadLogger };
var noop = function () { return undefined; };
var ɵ0 = noop;
/**
 * Default implementation of Logger that safely writes the message into the console.
 *
 */
var ConsoleLogger = /** @class */ (function () {
    function ConsoleLogger(_console, _debugEnabled) {
        if (_debugEnabled === void 0) { _debugEnabled = true; }
        this._console = _console;
        this._debugEnabled = _debugEnabled;
    }
    ConsoleLogger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._invokeConsoleMethod('log', args);
    };
    ConsoleLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._invokeConsoleMethod('info', args);
    };
    ConsoleLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._invokeConsoleMethod('warn', args);
    };
    ConsoleLogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._invokeConsoleMethod('error', args);
    };
    ConsoleLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._debugEnabled) {
            this._invokeConsoleMethod('debug', args);
        }
    };
    ConsoleLogger.prototype._invokeConsoleMethod = function (type, args) {
        var logFn = this._console[type] || this._console.log || noop;
        // console methods in IE9 don't have 'apply' method, polyfill it
        if (!logFn.apply) {
            logFn = Function.prototype.bind.call(logFn, this._console);
        }
        logFn.apply(this._console, args);
    };
    return ConsoleLogger;
}());
export { ConsoleLogger };
/**
 * No op implementation of Logger.
 *
 */
var NoOpLogger = /** @class */ (function () {
    function NoOpLogger() {
    }
    NoOpLogger.prototype.log = function () { };
    NoOpLogger.prototype.info = function () { };
    NoOpLogger.prototype.warn = function () { };
    NoOpLogger.prototype.error = function () { };
    NoOpLogger.prototype.debug = function () { };
    return NoOpLogger;
}());
export { NoOpLogger };
export { ɵ0 };
//# sourceMappingURL=logger.model.js.map