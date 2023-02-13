import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FileItem } from './fileItem.model';
import { NgxUploadLogger } from '../utils/logger.model';
import { DropTargetOptions, InputFileOptions, UploadEndPoint } from '../utils/configuration.model';


// send an event for each upload event. These events can be catched by the user for call a callback

@Injectable({
  providedIn: 'root'
})
export class HttpClientUploadService {

  queue: FileItem[];
  progressTotal = 0;
  withCredentials = false;

  sub: Subscription | undefined;

  /**
   * Internal map of lowercase header names to values.
   */
  protected headers: Map<string, string[]>;

  public onCancel$ = new Subject<FileItem>();
  public onError$ = new Subject<{ item: FileItem, body: any, status: number, headers: any }>();
  public onDropError$ = new Subject<{ item?: File, errorAccept: boolean, errorMultiple: boolean }>();
  public onSuccess$ = new Subject<{ item: FileItem, body: any, status: number, headers: any }>(); // TODO headers isn't `any` but `Array`
  public onBeforeUploadItem$ = new Subject<FileItem>();
  public onProgress$ = new Subject<{ item: FileItem, progress: number }>();
  public onAddToQueue$ = new Subject<FileItem>();

  constructor(protected logger: NgxUploadLogger, private httpClient: HttpClient) {
    this.queue = new Array<FileItem>();
    this.headers = new Map();
  }

  /**
   * Adds files to the queue
   */
  addToQueue(files: FileList, formGroup: FormGroup | null, options?: DropTargetOptions | InputFileOptions) {

    this.logger.info('add to queue');

    if (options && !options.multiple) {
      if (files.length > 1) {
        this.logger.error('there is more than one file.');
        this.onDropError$.next({errorAccept: false, errorMultiple: true});
        return;
      }
    }

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)!;
      this.logger.debug(files.item(i));

      if (options && options.accept) {
        const accepted = options.accept.some((type: string) => {
          if (type.indexOf('/*') > -1) {
            return type.split('/')[0] === file.type.split('/')[0]
          } else {
            return (type === '*' || type === file.type)
          }
        });
        if (!accepted) {
          this.logger.error('this file is not accepted because of its type', file);
          this.onDropError$.next({item: file, errorAccept: true, errorMultiple: false});
          continue
        }
      }

      let fileItem: FileItem;
      if (options && options.disableMultipart) {
        fileItem = new FileItem(file, this, this.logger, true);
      } else {
        fileItem = new FileItem(file, this, this.logger, false);
        if (formGroup) {
          Object.keys(formGroup.controls).forEach((key) => {
            fileItem.formData.append(key, formGroup.get(key) !.value);
          });
        }
      }
      this.queue.push(fileItem);
      this.onAddToQueue$.next(fileItem);
    }
  }

  uploadFileItem(fileItem: FileItem, endpoint: UploadEndPoint, options: {
    headers?: HttpHeaders;
    reportProgress?: boolean;
    params?: HttpParams;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials?: boolean;
  } = {}): void {
    this.logger.info('enter uploadService.uploadFileItem()');

    const method = endpoint.method as string;
    const url = endpoint.url as string;

    const index = this.queue.indexOf(fileItem);
    const item = this.queue[index];

    this.onBeforeUploadItem(item);

    if (item.isCancel) {
      return
    }

    item.uploadInProgress = true;

    let sendable;

    if (!fileItem.disableMultipart) {
      sendable = item.formData;
      sendable.append(item.alias, item.file, item.file.name);
    } else {
      sendable = item.file;
    }

    const req = new HttpRequest(method, url, sendable, Object.assign(options, {reportProgress: true}));

    fileItem.sub = this.httpClient.request(req).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          // This is an upload progress event. Compute and show the % done:
          const percentDone = Math.round(event.loaded * 100 / (event.total ? event.total : event.loaded));
          this.logger.debug(`File is ${percentDone}% uploaded.`);
          fileItem.ɵonProgress(percentDone);
          this.onProgressItem(item, percentDone);

        } else if (event instanceof HttpResponse) {
          // A successful response is delivered on the event stream.
          fileItem.ɵonSuccess();
          this.onSuccess(item, event.body, event.status, event.headers);
        }
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (url === 'ngx_upload_mock') {
            item.ɵonSuccess();
            this.onSuccess(item, err.message, err.status, err.headers);
          } else if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            item.ɵonError();
            this.onError(item, err.error.message, err.status, err.headers);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            item.ɵonError();
            this.onError(item, err.error, err.status, err.headers);
          }
        }
      }
    );
  }

  cancelFileItem(fileItem: FileItem) {
    this.progressTotal = this.computeTotalProgress();
    this.onCancel$.next(fileItem)
  }

  /**
   * Uploads all not uploaded items of queue
   */
  uploadAll(endpoint: UploadEndPoint, options?: any) {
    const items = this.queue.filter(item => (item.isReady));
    if (!items.length) {
      return;
    }

    for (const item of items) {
      item.upload(endpoint, options);
    }
  }

  /**
   * Uploads all not uploaded items of queue
   */
  cancelAll() {
    const items: FileItem[] = this.queue.filter(item => (item.uploadInProgress));
    if (!items.length) {
      return;
    }

    for (const item of items) {
      item.cancel();
    }
    this.progressTotal = this.computeTotalProgress();
  }

  /**
   * Uploads all not uploaded items of queue
   */
  removeAllFromQueue() {
    const items: FileItem[] = this.queue.filter(item => (!item.uploadInProgress && !item.isSuccess));
    if (!items.length) {
      return;
    }

    for (const item of items) {
      this.removeFromQueue(item);
    }
  }

  removeFromQueue(fileItem: FileItem) {
    const index = this.queue.indexOf(fileItem);
    const item = this.queue[index];
    if (item.uploadInProgress) {
      item.cancel();
    }
    this.queue.splice(index, 1);
    this.progressTotal = this.computeTotalProgress();
  }


  /**
   * Returns the total progress
   * @param {Number} [value]
   * @returns {Number}
   * @private
   */
  computeTotalProgress(): number {
    let totalCurrent = 0;
    let total = 0;
    for (const item of this.queue) {
      if (item.uploadInProgress || item.isSuccess) {
        totalCurrent += (item.file.size / 100) * item.progress || 0;
        total += item.file.size;
        this.logger.debug(totalCurrent + ' / ' + total);
      }
    }
    return Math.round((totalCurrent * 100) / total);
  }

  /**
   * Prepares file status before upload
   * @param item
   */
  protected onBeforeUploadItem(item: FileItem) {
    this.logger.info('enter uploadService.ɵonBeforeUploadItem()');
    item.ɵonBeforeUploadItem();
    this.onBeforeUploadItem$.next(item);
  }

  /**
   * Update status during upload progress
   * @param item
   * @param progress
   */
  protected onProgressItem(item: FileItem, progress: number): void {
    this.logger.info(`call onProgressItem ${item} ${progress}`);
    this.progressTotal = this.computeTotalProgress();
    item.ɵonProgress(progress);
    this.onProgress$.next({item, progress});
  }

  /**
   * Callback called when an upload error occurs
   * @param item
   * @param xhr
   */
  protected onError(item: FileItem, body: any, status: number, headers: any) {
    this.logger.info(`call onError ${item} ${body} ${status} ${headers}`);
    item.ɵonError();
    this.onError$.next({item, body, status, headers});
  }

  /**
   * Callback called when an upload success occurs
   * @param item
   * @param xhr
   */
  protected onSuccess(item: FileItem, body: any, status: number, headers: any) { // TODO headers is not any
    this.logger.info(`call onSuccess ${item} ${body} ${status} ${headers}`);
    this.progressTotal = this.computeTotalProgress();
    item.ɵonSuccess();
    this.onSuccess$.next({item, body, status, headers});
  }


}

