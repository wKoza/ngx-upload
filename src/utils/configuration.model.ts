import { InjectionToken, Type } from '@angular/core';
import { XhrUploadService } from '../services/xhrUpload.service';
import { HttpClientUploadService } from '../services/httpClientUpload.service';
import { MineTypeEnum } from './mimetype.model';

export type Method = 'POST' | 'GET';

export type UploadService = Type<XhrUploadService> | Type<HttpClientUploadService>;

export interface DropTargetOptions {
  color: string,
  colorDrag: string,
  colorDrop: string,
  accept?: MineTypeEnum[],
  capture?: 'user' | 'environment',
  multiple?: boolean,
  folderAccept?: boolean
}

export interface LoggerOptions {
  enabled?: boolean;
  debug?: boolean;
}

export interface UploadEndPoint {
  method?: Method,
  url?: string
}

export interface InputFileOptions {
  accept?: MineTypeEnum[],
  capture?: 'user' | 'environment',
  multiple?: boolean
}

export const NGX_DROP_TARGET_OPTIONS = new InjectionToken<DropTargetOptions>('Ngx drop Zone Options');
export const NGX_UPLOAD_STRATEGY = new InjectionToken<UploadService>('Ngx Upload Strategy');
export const NGX_LOGGER_OPTIONS = new InjectionToken<LoggerOptions>('Ngx Logger Options');


export const ngxDropTargetOptions: DropTargetOptions = {
  color: '',
  colorDrag: '',
  colorDrop: '',
  multiple: true
};

export const ngxloggerOptions: LoggerOptions = {
  enabled: false,
  debug: true
};

export const ngxInputFileOptions: InputFileOptions = {
  multiple: true
};
