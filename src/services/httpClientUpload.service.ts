import { Injectable } from '@angular/core';
import { FileItem } from './fileItem.model';
import { NgxUploadLogger } from '../utils/logger.model';
import { UploadEndPoint } from '../utils/configuration.model';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { AbstractUploadService } from './abstractUpload.service';
import { Subscription } from 'rxjs/index';


// send an event for each upload event. These events can be catched by the user for call a callback

@Injectable()
export class HttpClientUploadService extends AbstractUploadService {


    sub: Subscription;

    constructor(protected logger: NgxUploadLogger,
                private httpClient: HttpClient) {
        super(logger);
    }


    uploadFileItem(fileItem: FileItem, endpoint: UploadEndPoint, options: any = {}): void {

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

        var sendable;

        if (item.disableMultipart == true)
            sendable = item.file;
        else
        {
            sendable = item.formData;
            sendable.append(item.alias, item.file, item.file.name);
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
                    item.ɵonSuccess();
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

}

