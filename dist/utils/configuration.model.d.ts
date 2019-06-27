import { InjectionToken, Type } from '@angular/core';
import { XhrUploadService } from '../services/xhrUpload.service';
import { HttpClientUploadService } from '../services/httpClientUpload.service';
import { MineTypeEnum } from './mimetype.model';
export declare type Method = 'POST' | 'GET';
export declare type UploadService = Type<XhrUploadService> | Type<HttpClientUploadService>;
export interface DropTargetOptions {
    color: string;
    colorDrag: string;
    colorDrop: string;
    accept?: MineTypeEnum[];
    capture?: 'user' | 'environment';
    multiple?: boolean;
}
export interface LoggerOptions {
    enabled?: boolean;
    debug?: boolean;
}
export interface UploadEndPoint {
    method?: Method;
    url?: string;
}
export interface InputFileOptions {
    accept?: MineTypeEnum[];
    capture?: 'user' | 'environment';
    multiple?: boolean;
}
export declare const NGX_DROP_TARGET_OPTIONS: InjectionToken<DropTargetOptions>;
export declare const NGX_UPLOAD_STRATEGY: InjectionToken<UploadService>;
export declare const NGX_LOGGER_OPTIONS: InjectionToken<LoggerOptions>;
export declare const ngxDropTargetOptions: DropTargetOptions;
export declare const ngxloggerOptions: LoggerOptions;
export declare const ngxInputFileOptions: InputFileOptions;
