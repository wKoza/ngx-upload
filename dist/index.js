import { isDevMode, NgModule } from '@angular/core';
import { NGX_DROP_TARGET_OPTIONS, ngxDropTargetOptions, ngxloggerOptions, NGX_UPLOAD_STRATEGY, NGX_LOGGER_OPTIONS } from './utils/configuration.model';
import { NgxDragAndDropDirective } from './directives/dropzone.directive';
import { ConsoleLogger, NgxUploadLogger, NoOpLogger } from './utils/logger.model';
import { XhrUploadService } from './services/xhrUpload.service';
import { HttpClientUploadService } from './services/httpClientUpload.service';
import { NgxThumbnailDirective } from './directives/thumbnail.directive';
import { NgxInputFileDirective } from './directives/inputfile.directive';
import { InputfileComponent } from './components/inputfile.component';
export { FileItem } from './services/fileItem.model';
export { XhrUploadService } from './services/xhrUpload.service';
export { HttpClientUploadService } from './services/httpClientUpload.service';
var ngxDeclarations = [
    NgxDragAndDropDirective, NgxThumbnailDirective, NgxInputFileDirective, InputfileComponent
];
/**
 * Factory associated with internal logger
 * @param options
 * @returns {any}
 * @private
 */
export function _loggerFactory(options) {
    var enabled = options.enabled != null ? options.enabled : isDevMode();
    if (enabled) {
        var _console = typeof console === 'object' ? console : {};
        var debug = options.debug != null ? options.debug : true;
        return new ConsoleLogger(_console, debug);
    }
    return new NoOpLogger();
}
var NgxUploadModule = /** @class */ (function () {
    function NgxUploadModule() {
    }
    NgxUploadModule.forRoot = function (dropTargetOptions, loggerOptions) {
        return {
            ngModule: NgxUploadModule,
            providers: [
                { provide: NGX_LOGGER_OPTIONS, useValue: (loggerOptions) ? loggerOptions : ngxloggerOptions },
                {
                    provide: NGX_DROP_TARGET_OPTIONS,
                    useValue: (dropTargetOptions) ? dropTargetOptions : ngxDropTargetOptions
                },
                { provide: NGX_UPLOAD_STRATEGY, useValue: HttpClientUploadService },
                {
                    provide: NgxUploadLogger,
                    useFactory: _loggerFactory,
                    deps: [NGX_LOGGER_OPTIONS]
                },
                XhrUploadService,
                HttpClientUploadService
            ]
        };
    };
    ;
    NgxUploadModule.decorators = [
        { type: NgModule, args: [{
                    declarations: ngxDeclarations.slice(),
                    exports: ngxDeclarations.slice(),
                    entryComponents: [InputfileComponent]
                },] },
    ];
    return NgxUploadModule;
}());
export { NgxUploadModule };
//# sourceMappingURL=index.js.map