import {isDevMode, ModuleWithProviders, NgModule} from '@angular/core';

import {
    DropTargetOptions,
    LoggerOptions,
    NGX_UPLOAD_OPTIONS,
    NGX_DROP_TARGET_OPTIONS,
    NGX_LOGGER_OPTIONS,
    ngxUploadOptions,
    ngxDropTargetOptions,
    ngxloggerOptions,
    UploadOptions
} from './utils/configuration.model';
import {NgxDragAndDropDirective} from './directives/dropzone.directive';
import {ConsoleLogger, NgxUploadLogger, NoOpLogger} from './utils/logger.model';
import {UploadService} from './services/upload.service';

export {UploadService} from './services/upload.service';
export {DropTargetOptions, UploadOptions, LoggerOptions} from './utils/configuration.model';

const ngxDeclarations = [
    NgxDragAndDropDirective
];

/**
 * Factory associated with internal logger
 * @param options
 * @returns {any}
 * @private
 */
export function _loggerFactory(options: LoggerOptions): NgxUploadLogger {
    const enabled = options.enabled != null ? options.enabled : isDevMode();
    if (enabled) {
        const _console: Console = typeof console === 'object' ? console : <any>{};
        const debug = options.debug != null ? options.debug : true;
        return new ConsoleLogger(_console, debug);
    }
    return new NoOpLogger();
}

@NgModule({
    declarations: [
        ...ngxDeclarations
    ],
    exports: [
        ...ngxDeclarations
    ]
})
export class NgxUploadModule {
    static forRoot(dropTargetOptions?: DropTargetOptions,
                   loggerOptions?: LoggerOptions,
                   uploadOptions?: UploadOptions): ModuleWithProviders {

        return {
            ngModule: NgxUploadModule,
            providers: [

                {provide: NGX_LOGGER_OPTIONS, useValue: (loggerOptions) ? loggerOptions : ngxUploadOptions},
                {
                    provide: NGX_DROP_TARGET_OPTIONS,
                    useValue: (dropTargetOptions) ? dropTargetOptions : ngxDropTargetOptions
                },
                {provide: NGX_UPLOAD_OPTIONS, useValue: (uploadOptions) ? uploadOptions : ngxUploadOptions},
                {
                    provide: NgxUploadLogger,
                    useFactory: _loggerFactory,
                    deps: [NGX_UPLOAD_OPTIONS]
                },
                UploadService
            ]
        }

    };
}
