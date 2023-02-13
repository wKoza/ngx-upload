import {TestBed, async, inject} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import { ConsoleLogger, NgxUploadLogger, NoOpLogger } from '../../lib/utils/logger.model';
import { LoggerOptions, NGX_LOGGER_OPTIONS } from '../../lib/utils/configuration.model';



function _testLoggerFactory(options: LoggerOptions): NgxUploadLogger {
    const enabled = options.enabled != null ? options.enabled : false;
    if (enabled) {
        const _console: Console = typeof console === 'object' ? console : <any>{};
        const debug = options.debug != null ? options.debug : true;
        return new ConsoleLogger(_console, debug);
    }
    return new NoOpLogger();
}



describe('NgxLogger', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: NGX_LOGGER_OPTIONS, useValue: {enabled: true}},
                {
                    provide: NgxUploadLogger,
                    useFactory: _testLoggerFactory,
                    deps: [NGX_LOGGER_OPTIONS]
                }
            ],
            imports: [
                BrowserModule,
                CommonModule
            ]
        });
    });


    it('should display hello world', () => {
        const logger = TestBed.get(NgxUploadLogger);
        expect(logger instanceof ConsoleLogger).toBeTruthy();
        logger.info('hello world');
    });

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
