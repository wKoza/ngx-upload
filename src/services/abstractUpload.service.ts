import { FileItem } from './fileItem.model';
import { FormGroup } from '@angular/forms';
import { NgxUploadLogger } from '../utils/logger.model';
import { Subject } from 'rxjs';
import { DropTargetOptions, UploadEndPoint } from '../utils/configuration.model';

export abstract class AbstractUploadService {

  queue: FileItem[];
  progressTotal = 0;
  disableMultipart: boolean;
  withCredentials: boolean;

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

  constructor(protected logger: NgxUploadLogger) {
    this.queue = new Array<FileItem>();
    this.headers = new Map();
    this.disableMultipart = false;
  }

  /**
   * Adds files to the queue
   */
  addToQueue(files: File[], formGroup: FormGroup | null, dropOptions?: DropTargetOptions) {

    this.logger.info('add to queue');

    if (dropOptions && !dropOptions.multiple) {
      if (files.length > 1) {
        this.logger.error('there is more than one file.');
        this.onDropError$.next({errorAccept: false, errorMultiple: true});
        return;
      }
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      this.logger.debug(files[i]);

      if (dropOptions && dropOptions.accept) {
        const accepted = dropOptions.accept.some((type: string) => type === file.type);
        if (!accepted) {
          this.logger.error('this file is not accepted because of its type', file);
          this.onDropError$.next({item: file, errorAccept: true, errorMultiple: false});
          continue
        }
      }

      const fileItem = new FileItem(file, this, this.logger);
      if (formGroup) {
        Object.keys(formGroup.controls).forEach((key) => {
          fileItem.formData.append(key, formGroup.get(key) !.value);
        });
      }
      this.queue.push(fileItem);
      this.onAddToQueue$.next(fileItem);
    }
  }


  abstract uploadFileItem(fileItem: FileItem, endpoint: UploadEndPoint, options?: any): void;


  abstract cancelFileItem(fileItem: FileItem): void;

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

