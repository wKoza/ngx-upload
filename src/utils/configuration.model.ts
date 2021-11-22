import { InjectionToken } from '@angular/core';
import { MineTypeEnum } from './mimetype.model';

export type Method = 'POST' | 'PUT' | 'GET';

export interface DropTargetOptions {
  color: string;
  colorDrag: string;
  colorDrop: string;
  accept?: MineTypeEnum[];
  capture?: 'user' | 'environment';
  multiple?: boolean;
  disableMultipart?: boolean;
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
  disableMultipart?: boolean;
}

export const NGX_DROP_TARGET_OPTIONS = new InjectionToken<DropTargetOptions>('Ngx drop Zone Options');
export const NGX_LOGGER_OPTIONS = new InjectionToken<LoggerOptions>('Ngx Logger Options');


export const ngxDropTargetOptions: DropTargetOptions = {
  color: '',
  colorDrag: '',
  colorDrop: '',
  multiple: true,
  disableMultipart: false
};

export const ngxloggerOptions: LoggerOptions = {
  enabled: false,
  debug: true
};

export const ngxInputFileOptions: InputFileOptions = {
  multiple: true,
  disableMultipart: false
};
