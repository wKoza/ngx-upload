import { InjectionToken, isDevMode, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
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
  const enabled = options.enabled ? options.enabled : isDevMode();
  if (enabled) {
    const _console: Console = typeof console === 'object' ? console : <any>{};
    const debug = options.debug ? options.debug : true;
    return new ConsoleLogger(_console, debug);
  }
  return new NoOpLogger();
}

export const NGX_UPLOAD_ROOT_GUARD = new InjectionToken<void>('Internal forRoot Guard');

export function createNgxUploadRootGuard(options: LoggerOptions) {
  if (options) {
    throw new TypeError('NgxUploadModule.forRoot() is called twice.')
  }
  return 'guarded';
}

@NgModule({
  declarations: [
    ...ngxDeclarations
  ],
  exports: [
    ...ngxDeclarations
  ],
  imports: [],
  entryComponents: [InputfileComponent]
})

export class NgxUploadModule {

  static forRoot(dropTargetOptions?: DropTargetOptions,
    loggerOptions?: LoggerOptions): ModuleWithProviders<NgxUploadModule> {


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
        },
        {
          provide: NGX_UPLOAD_ROOT_GUARD,
          useFactory: createNgxUploadRootGuard,
          deps: [[NGX_LOGGER_OPTIONS, new Optional(), new SkipSelf()]]
        }
      ]
    }
  };
}

