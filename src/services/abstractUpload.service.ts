import { FileItem } from './fileItem.model';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { NgxUploadLogger } from '../utils/logger.model';
import { Method, UploadOptions } from '../utils/configuration.model';
import { Subject } from 'rxjs/Subject';


export abstract class AbstractUploadService {

    queue: FileItem[];
    isUploading: boolean;
    progressTotal = 0;
    method: Method;
    url: string;
    disableMultipart: boolean;
    withCredentials: boolean;

    /**
     * Internal map of lowercase header names to values.
     */
    protected headers: Map<string, string[]>;

    public onCancel$ = new Subject<FileItem>();
    public onError$ = new Subject<{ item: FileItem, body: any, status: number, headers: any }>();
    public onSuccess$ = new Subject<{ item: FileItem, body: any, status: number, headers: any }>(); // TODO headers n'est pas any mais Array
    public onBeforeUploadItem$ = new Subject<FileItem>();
    public onProgress$ = new Subject<{ item: FileItem, progress: number }>(); // https://embed.plnkr.co/P8xCEwSKgcOg07pwDrlO/


    constructor(protected logger: NgxUploadLogger, options: UploadOptions) {
        this.queue = new Array<FileItem>();
        this.isUploading = false;
        this.method = options.method !;
        this.url = options.url;
        this.headers = new Map();
        this.disableMultipart = false;
    }

    /**
     * Adds files to the queue
     */
    addToQueue(files: FileList, formGroup?: FormGroup | null) {

        this.logger.info('add to queue');

        for (let i = 0; i < files.length; i++) {
            this.logger.debug(files.item(i));
            const fileItem = new FileItem(files.item(i), this, this.logger);

            if (formGroup) {
                Object.keys(formGroup.controls).forEach((key) => {
                    fileItem.formData.append(key, formGroup.get(key) !.value);
                });
            }

            this.queue.push(fileItem);
        }

    }


    abstract uploadFileItem(fileItem: FileItem, options?: any): Observable<any>;


    cancelFileItem(fileItem: FileItem) {
        fileItem.isCancel = true;
        if (fileItem.isUploading) {
            fileItem.ɵxhr.abort();
        }
        fileItem.ɵonCancel(fileItem.ɵxhr.response, fileItem.ɵxhr.status, fileItem.ɵxhr.response.headers);
        this.onCancel$.next(fileItem)
    }

    /**
     * Uploads all not uploaded items of queue
     */
    uploadAll() {
        const items = this.getNotUploadedItems().filter(item => !item.isUploading);
        if (!items.length) {
            return;
        }

        for (const item of items) {
            item.upload();
        }
    }

    /**
     * Uploads all not uploaded items of queue
     */
    cancelAll() {
        const items: FileItem[] = this.getNotUploadedItems();
        if (!items.length) {
            return;
        }

        for (const item of items) {
            item.cancel();
        }
    }

    /**
     * Uploads all not uploaded items of queue
     */
    removeAllFromQueue() {
        const items: FileItem[] = this.getNotUploadedItems();
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
        if (item.isUploading) {
            item.cancel();
        }
        this.queue.splice(index, 1);
        this.progressTotal = this.getTotalProgress();
    }

    /**
     * Returns not uploaded items
     * @returns {Array}
     */
    public getNotUploadedItems() {
        return this.queue.filter(item => !item.isUploaded);
    }


    /**
     * Returns the total progress
     * @param {Number} [value]
     * @returns {Number}
     * @private
     */
    getTotalProgress(value?) {

        const notUploaded = this.getNotUploadedItems().length;
        const uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
        const ratio = 100 / this.queue.length;
        const current = (value || 0) * ratio / 100;

        this.logger.info('getTotalProgress : ' + Math.round(uploaded * ratio + current));

        return Math.round(uploaded * ratio + current);
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
        this.progressTotal = this.getTotalProgress(progress);
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
        item.ɵonError(body, status, headers);
        this.onError$.next({item, body, status, headers});
    }

    /**
     * Callback called when an upload success occurs
     * @param item
     * @param xhr
     */
    protected onSuccess(item: FileItem, body: any, status: number, headers: any) { // TODO headers n'est pas any
        this.logger.info(`call onSuccess ${item} ${body} ${status} ${headers}`);
        item.ɵonSuccess(body, status, headers);
        this.onSuccess$.next({item, body, status, headers});
    }


}

