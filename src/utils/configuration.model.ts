import { InjectionToken } from '@angular/core';

import { XhrUploadService } from '../services/xhrUpload.service';
import { HttpClientUploadService } from '../services/httpClientUpload.service';

export type Method = 'POST' | 'GET';

export type UploadService = typeof XhrUploadService | typeof HttpClientUploadService;

export interface DropTargetOptions {
    color: string,
    colorDrag: string
    colorDrop: string
}

export interface LoggerOptions {
    enabled?: boolean;
    debug?: boolean;
}

export interface UploadOptions {
    method?: Method,
    url: string,
    httpStrategy?: UploadService
}


export const NGX_DROP_TARGET_OPTIONS = new InjectionToken<DropTargetOptions>('Ngx drop Zone Options');
export const NGX_LOGGER_OPTIONS = new InjectionToken<LoggerOptions>('Ngx Logger Options');
export const NGX_UPLOAD_OPTIONS = new InjectionToken<UploadOptions>('Ngx Upload Options');


export const ngxDropTargetOptions: DropTargetOptions = {
    color: '',
    colorDrag: '',
    colorDrop: ''
};

export const ngxloggerOptions: LoggerOptions = {
    enabled: false,
    debug: true
};

export const ngxUploadOptions: UploadOptions = {
    method: 'POST',
    url: 'ngx_upload_mock',
    httpStrategy: XhrUploadService
};
