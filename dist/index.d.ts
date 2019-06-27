import { ModuleWithProviders } from '@angular/core';
import { DropTargetOptions, LoggerOptions } from './utils/configuration.model';
import { NgxUploadLogger } from './utils/logger.model';
export { DropTargetOptions, UploadEndPoint, LoggerOptions, InputFileOptions } from './utils/configuration.model';
export { MineTypeEnum } from './utils/mimetype.model';
export { FileItem } from './services/fileItem.model';
export { XhrUploadService } from './services/xhrUpload.service';
export { HttpClientUploadService } from './services/httpClientUpload.service';
export { UploadService } from './utils/configuration.model';
/**
 * Factory associated with internal logger
 * @param options
 * @returns {any}
 * @private
 */
export declare function _loggerFactory(options: LoggerOptions): NgxUploadLogger;
export declare class NgxUploadModule {
    static forRoot(dropTargetOptions?: DropTargetOptions, loggerOptions?: LoggerOptions): ModuleWithProviders;
}
