import {InjectionToken} from '@angular/core';

export interface DropTargetOptions {
    color: string,
    colorDrag: string
    colorDrop: string
}

export interface LoggerOptions {
    enabled?: boolean;
    debug?: boolean;
}


export interface NgxUploadOptions {

    dropTargetOptions: DropTargetOptions,
    logger: LoggerOptions
}

export const NGX_UPLOAD_OPTIONS = new InjectionToken<NgxUploadOptions>('Ngx Upload Options');


const dropTargetOptions: DropTargetOptions = {
    color: 'rgba(0,0,0,0.12)',
    colorDrag: 'grey',
    colorDrop: 'rgba(0,0,0,0.12)'
};

const loggerOptions: LoggerOptions = {
    enabled : true,
    debug: true
};


export const ngxUploadOptions: NgxUploadOptions = {
    dropTargetOptions: dropTargetOptions,
    logger: loggerOptions
};
