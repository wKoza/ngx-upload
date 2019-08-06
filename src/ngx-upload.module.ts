import { isDevMode, ModuleWithProviders, NgModule } from '@angular/core';
import { NgxDragAndDropDirective } from './directives/dropzone.directive';
import { NgxThumbnailDirective } from './directives/thumbnail.directive';
import { NgxInputFileDirective } from './directives/inputfile.directive';
import {
  DropTargetOptions,
  LoggerOptions, NGX_DROP_TARGET_OPTIONS,
  NGX_LOGGER_OPTIONS,
  ngxDropTargetOptions,
  ngxloggerOptions
} from './utils/configuration.model';
import { ConsoleLogger, NgxUploadLogger, NoOpLogger } from './utils/logger.model';
import { InputfileComponent } from './components/inputfile.component';
import { HttpClientModule } from '@angular/common/http';

const ngxDeclarations = [
  NgxDragAndDropDirective, NgxThumbnailDirective, InputfileComponent, NgxInputFileDirective
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
  ],
  imports: [ HttpClientModule ],
  entryComponents: [InputfileComponent]
})

export class NgxUploadModule {
  static forRoot(dropTargetOptions?: DropTargetOptions,
                 loggerOptions?: LoggerOptions): ModuleWithProviders {

    return {
      ngModule: NgxUploadModule,
      providers: [
        { provide: NGX_LOGGER_OPTIONS, useValue: (loggerOptions) ? loggerOptions : ngxloggerOptions },
        {
          provide: NGX_DROP_TARGET_OPTIONS,
          useValue: (dropTargetOptions) ? dropTargetOptions : ngxDropTargetOptions
        },
        {
          provide: NgxUploadLogger,
          useFactory: _loggerFactory,
          deps: [NGX_LOGGER_OPTIONS]
        }
      ]
    }

  };
}
