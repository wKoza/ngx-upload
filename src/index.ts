import {isDevMode, ModuleWithProviders, NgModule} from '@angular/core';

import {NGX_UPLOAD_OPTIONS, ngxUploadOptions, NgxUploadOptions} from './utils/configuration.model';
import {NgxDragAndDropDirective} from './directives/dropzone.directive';
import {ConsoleLogger, NgxUploadLogger, NoOpLogger} from './utils/logger.model';
import {UploadService} from './services/upload.service';

export {UploadService} from './services/upload.service';
export {NgxUploadOptions, DropTargetOptions, LoggerOptions} from './utils/configuration.model';

const ngxDeclarations = [
    NgxDragAndDropDirective
];

/**
 * Factory associated with internal logger
 * @param options
 * @returns {any}
 * @private
 */
export function _loggerFactory(options: NgxUploadOptions): NgxUploadLogger {
    const loggerOptions = options.logger || {};
    const enabled = loggerOptions.enabled != null ? loggerOptions.enabled : isDevMode();
    if (enabled) {
        const _console: Console = typeof console === 'object' ? console : <any>{};
        const debug = loggerOptions.debug != null ? loggerOptions.debug : true;
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
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxUploadModule,
            providers: [

                {provide: NGX_UPLOAD_OPTIONS, useValue: ngxUploadOptions},
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
