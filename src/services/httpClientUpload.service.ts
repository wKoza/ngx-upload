import { Injectable, Inject } from '@angular/core';
import { FileItem } from './fileItem.model';
import { Observable } from 'rxjs/Observable';
import { NgxUploadLogger } from '../utils/logger.model';
import { NGX_UPLOAD_OPTIONS, UploadOptions } from '../utils/configuration.model';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { AbstractUploadService } from './abstractUpload.service';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

// send an event for each upload event. These events can be catched by the user for call a callback

@Injectable()
export class HttpClientUploadService extends AbstractUploadService {

    constructor(protected logger: NgxUploadLogger,
                @Inject(NGX_UPLOAD_OPTIONS) options: UploadOptions,
                private httpClient: HttpClient) {
        super(logger, options);
    }


    uploadFileItem(fileItem: FileItem, options?: any): Observable<any> {

        this.logger.info('enter uploadService.uploadFileItem()');

        const index = this.queue.indexOf(fileItem);
        const item = this.queue[index];

        this.onBeforeUploadItem(item);

        if (item.isCancel) {
            return Observable.of();
        }

        item.isUploading = true;
        this.isUploading = true;

        const sendable = item.formData;
        sendable.append(item.alias, item.file, item.file.name);

        const req = new HttpRequest(this.method, this.url, sendable, options);

        return this.httpClient.request(req).do(event => {

            if (event.type === HttpEventType.UploadProgress) {
                // This is an upload progress event. Compute and show the % done:
                const percentDone = Math.round(event.loaded * 100 / (event.total ? event.total : event.loaded));
                this.logger.debug(`File is ${percentDone}% uploaded.`);
                const total = this.getTotalProgress(percentDone);
                this.logger.debug('progress : ' + total);
                fileItem.ɵonProgress(total);
                this.onProgressItem(item, percentDone);

            } else if (event instanceof HttpResponse) {
                // A successful response is delivered on the event stream.
                item.ɵonSuccess(event.body, event.status, event.headers);
                this.onSuccess(item, event.body, event.status, event.headers);

            }
        }).catch((err) => {
            if (err instanceof HttpErrorResponse) {
                if (this.url === 'ngx_upload_mock') {
                    item.ɵonSuccess(err.message, err.status, err.headers);
                    this.onSuccess(item, err.message, err.status, err.headers);
                } else if (err.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    item.ɵonError(err.error.message, err.status, err.headers);
                    this.onError(item, err.error.message, err.status, err.headers);
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    item.ɵonError(err.error, err.status, err.headers);
                    this.onError(item, err.error, err.status, err.headers);
                }
            }
            throw err;
        });
    }

}

