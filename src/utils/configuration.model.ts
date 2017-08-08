import {InjectionToken} from '@angular/core';

export type Method = 'POST' | 'GET';

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
   url: string
}


export const NGX_DROP_TARGET_OPTIONS = new InjectionToken<DropTargetOptions>('Ngx drop Zone Options');
export const NGX_LOGGER_OPTIONS = new InjectionToken<LoggerOptions>('Ngx Logger Options');
export const NGX_UPLOAD_OPTIONS = new InjectionToken<UploadOptions>('Ngx Upload Options');


export const ngxDropTargetOptions: DropTargetOptions = {
    color: 'rgba(0,0,0,0.12)',
    colorDrag: 'grey',
    colorDrop: 'rgba(0,0,0,0.12)'
};

export const ngxloggerOptions: LoggerOptions = {
    enabled : false,
    debug: true
};

export const ngxUploadOptions: UploadOptions = {
    method : 'POST',
    url: 'ngx_upload_mock'
};
