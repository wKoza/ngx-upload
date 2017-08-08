import {Injectable, Inject} from '@angular/core';
import {FileItem} from './FileItem.model';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {FormGroup} from '@angular/forms';
import {NgxUploadLogger} from '../utils/logger.model';
import {NGX_UPLOAD_OPTIONS, UploadOptions} from '../utils/configuration.model';

@Injectable()
export class UploadService {

    queue: FileItem[];
    isUploading: boolean;

    method: string;
    url: string;

    private disableMultipart: boolean;

    progress = 0;

    withCredentials: boolean;


    /**
     * Internal map of lowercase header names to values.
     */
    private headers: Map<string, string[]>;


    constructor(private logger: NgxUploadLogger, @Inject(NGX_UPLOAD_OPTIONS) options: UploadOptions) {
        this.queue = new Array<FileItem>();
        this.isUploading = false;
        this.method = options.method;
        this.url = options.url;
        this.headers = new Map();
        this.disableMultipart = false;
    }

    /**
     * Adds files to the queue
     * @param {File|HTMLInputElement|Object|FileList|Array<Object>} files
     * @param {Object} [options]
     * @param {Array<Function>|String} filters
     */
    addToQueue(files: FileList, formGroup: FormGroup) {

        this.logger.info('add to queue');

        const incomingQueue = (Object.prototype.toString.call(files) === '[object FileList]') ? Array.prototype.slice.call(files) : [files];

        for (const file of incomingQueue) {
            this.logger.info(file);
            const fileItem = new FileItem(file, this);

            Object.keys(formGroup.controls).forEach((key) => {
                fileItem.formData.append(key, formGroup.get(key).value);
            });

            this.queue.push(fileItem);
        }


    }


    uploadFileItem(fileItem: FileItem): Observable<Response> {

        this.logger.info('enter uploadService.uploadFileItem()');

        const index = this.queue.indexOf(fileItem);
        const item = this.queue[index];

        this.ɵonBeforeUploadItem(item);

        if (item.isCancel) {
            return;
        }

        item.isUploading = true;
        this.isUploading = true;


        return new Observable<Response>((responseObserver: Observer<Response>) => {

            const xhr = item.ɵxhr = new XMLHttpRequest()
            xhr.open(this.method, this.url, true);

            if (!!this.withCredentials) {
                xhr.withCredentials = true;
            }

            // Add all the requested headers.
            this.headers.forEach((values, name) => {
                xhr.setRequestHeader(name, values.join(','));
            });


            /** load event */
            const onLoad = () => {


                const ok = xhr.status >= 200 && xhr.status < 300;
                this.isUploading = false;

                if (this.url === 'ngx_upload_mock') {
                    // A successful response is delivered on the event stream.
                    responseObserver.next(xhr.response);
                    item.ɵonSuccess(xhr.response, 200, xhr.response.headers);
                    this.onSuccess(item);
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    responseObserver.complete();
                } else if (ok) {
                    // A successful response is delivered on the event stream.
                    responseObserver.next(xhr.response);
                    item.ɵonSuccess(xhr.response, xhr.status, xhr.response.headers);
                    this.onSuccess(item);
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    responseObserver.complete();
                } else {
                    // An unsuccessful request is delivered on the error channel.
                    responseObserver.error(xhr.response);
                    item.ɵonError(xhr.response, xhr.status, xhr.response.headers);
                    this.onError(item);
                }

            };

            // error event handler
            const onError = (err: ErrorEvent) => {
                responseObserver.error(xhr.response);
                item.ɵonError(xhr.response, xhr.status, xhr.response.headers);
                this.onError(item);
            };


            /**
             * Les évènements d'envoi (upload) sont lancés sur l'objet XMLHttpRequest.upload
             * @param event
             */
            const onProgress = (event) => {
                const progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                this.logger.debug('progress : ' + progress);
                const total = this.getTotalProgress(progress);
                this.logger.debug('progress : ' + total);
                fileItem.ɵonProgress(total);
                this.ɵonProgressItem(item, progress);
            };


            // By default, register for load and error events.
            xhr.addEventListener('load', onLoad);
            xhr.addEventListener('error', onError);
            xhr.upload.addEventListener('progress', onProgress);

            let sendable;


            if (!this.disableMultipart) {
                sendable = item.formData;
                sendable.append(item.alias, item.file, item.file.name);
            } else {
                this.logger.debug(item.file);
                sendable = item.file;
            }

            xhr.send(sendable);

            // This is the return from the Observable function, which is the
            // request cancellation handler.
            return () => {
                // On a cancellation, remove all registered event listeners.
                xhr.removeEventListener('error', onError);
                xhr.removeEventListener('load', onLoad);
                xhr.upload.removeEventListener('progress', onProgress);
                // Finally, abort the in-flight request.
                xhr.abort();
            };
        });
    }

    cancelFileItem(fileItem: FileItem) {
        fileItem.isCancel = true;
        if (fileItem.isUploading) {
            fileItem.ɵxhr.abort();
        }
        fileItem.ɵonCancel(fileItem.ɵxhr.response, fileItem.ɵxhr.status, fileItem.ɵxhr.response.headers);
        this.onCancel(fileItem);
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
        this.progress = this.getTotalProgress();
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
    private getTotalProgress(value?) {

        const notUploaded = this.getNotUploadedItems().length;
        const uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
        const ratio = 100 / this.queue.length;
        const current = (value || 0) * ratio / 100;

        this.logger.info('getTotalProgress : ' + Math.round(uploaded * ratio + current));

        return Math.round(uploaded * ratio + current);
    }


    private ɵonBeforeUploadItem(item: FileItem) {
        this.logger.info('enter uploadService.uploadFileItem()');
        item.ɵonBeforeUploadItem();
        this.onBeforeUploadItem(item);
    }

    private ɵonProgressItem(item: FileItem, progress: number): void {
        const total = this.getTotalProgress(progress);
        this.progress = total;
        item.ɵonProgress(progress);
        this.onProgressItem(item, progress);
        this.onProgressAll(total);
    }


    /**
     * Callback
     * @param {FileItem} fileItem
     */
    onBeforeUploadItem(fileItem: FileItem) {
    }

    /**
     * Callback
     * @param {FileItem} fileItem
     * @param {Number} progress
     */
    onProgressItem(fileItem, progress) {
    }

    /**
     * Callback
     * @param {Number} progress
     */
    onProgressAll(progress) {
    }


    /**
     * Callback
     * @param {*} response
     * @param {Number} status
     * @param {Object} headers
     */
    onCancel(fileItem: FileItem) {
    }

    onError(fileItem: FileItem) {
    }

    onSuccess(fileItem: FileItem) {
    }
}

