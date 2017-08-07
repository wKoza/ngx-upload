import {TestBed, async, inject} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {ConsoleLogger, NgxUploadLogger, NoOpLogger} from '../../../src/utils/logger.model';
import {NGX_UPLOAD_OPTIONS, NgxUploadOptions} from '../../../src/utils/configuration.model';


function _testLoggerFactory(options: NgxUploadOptions): NgxUploadLogger {
    const loggerOptions = options.logger || {};
    const enabled = loggerOptions.enabled != null ? loggerOptions.enabled : false;
    if (enabled) {
        const _console: Console = typeof console === 'object' ? console : <any>{};
        const debug = loggerOptions.debug != null ? loggerOptions.debug : true;
        return new ConsoleLogger(_console, debug);
    }
    return new NoOpLogger();
}



describe('NgxLogger', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: NGX_UPLOAD_OPTIONS, useValue: {logger: {enabled: true}}},
                {
                    provide: NgxUploadLogger,
                    useFactory: _testLoggerFactory,
                    deps: [NGX_UPLOAD_OPTIONS]
                }
            ],
            imports: [
                BrowserModule,
                CommonModule
            ]
        });
    }));


    it('should display hello world', inject([NgxUploadLogger], (logger: NgxUploadLogger) => {
        expect(logger instanceof ConsoleLogger).toBeTruthy();
        logger.info('hello world');
    }));

    it('should display hello world', inject([NgxUploadLogger], (logger: NgxUploadLogger) => {
        expect(logger instanceof ConsoleLogger).toBeTruthy();
        logger.log('hello world');
    }));

    it('should display hello world', inject([NgxUploadLogger], (logger: NgxUploadLogger) => {
        expect(logger instanceof ConsoleLogger).toBeTruthy();
        logger.debug('hello world');
    }));

    it('should display hello world', inject([NgxUploadLogger], (logger: NgxUploadLogger) => {
        expect(logger instanceof ConsoleLogger).toBeTruthy();
        logger.error('hello world');
    }));

    it('should display hello world', inject([NgxUploadLogger], (logger: NgxUploadLogger) => {
        expect(logger instanceof ConsoleLogger).toBeTruthy();
        logger.warn('hello world');
    }));


});
