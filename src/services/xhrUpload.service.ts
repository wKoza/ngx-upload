import { Injectable, Inject } from '@angular/core';
import { FileItem } from './fileItem.model';
import { NgxUploadLogger } from '../utils/logger.model';
import {
    NGX_UPLOAD_ENDPOINT, UploadEndPoint
} from '../utils/configuration.model';
import { AbstractUploadService } from './abstractUpload.service';
import { Subscription, Observer, Observable } from 'rxjs';

// send an event for each upload event. These events can be catched by the user for call a callback


@Injectable()
export class XhrUploadService extends AbstractUploadService {

    private xhr: XMLHttpRequest;
    sub: Subscription;

    constructor(protected logger: NgxUploadLogger,
                @Inject(NGX_UPLOAD_ENDPOINT) endpoint: UploadEndPoint) {
        super(logger, endpoint);

    }


    uploadFileItem(fileItem: FileItem, pEndpoint: UploadEndPoint, options: any = {}): void {

        this.logger.info('enter uploadService.uploadFileItem()');

        const method = pEndpoint.method as string;
        const url = pEndpoint.url as string;

        const index = this.queue.indexOf(fileItem);
        const item = this.queue[index];

        this.onBeforeUploadItem(item);

        if (item.isCancel) {
            return;
        }

        item.uploadInProgress = true;

        fileItem.sub = new Observable<Response>((responseObserver: Observer<Response>) => {

            this.xhr = new XMLHttpRequest();
            this.xhr.open(method, url, true);

            if (!!this.withCredentials) {
                this.xhr.withCredentials = true;
            }

            // Add all the requested headers.
            this.headers.forEach((values, name) => {
                this.xhr.setRequestHeader(name, values.join(','));
            });

            /** load event */
            const onLoad = () => {

                const ok = this.xhr.status >= 200 && this.xhr.status < 300;

                if (url === 'ngx_upload_mock') {
                    // A successful response is delivered on the event stream.
                    responseObserver.next(this.xhr.response);
                    this.onSuccess(item, this.xhr.response, this.xhr.status, this.xhr.getAllResponseHeaders());
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    responseObserver.complete();
                } else if (ok) {
                    // A successful response is delivered on the event stream.
                    responseObserver.next(this.xhr.response);
                    this.onSuccess(item, this.xhr.response, this.xhr.status, this.xhr.getAllResponseHeaders());
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    responseObserver.complete();
                } else {
                    // An unsuccessful request is delivered on the error channel.
                    responseObserver.error(this.xhr.response);
                    this.onError(item, this.xhr.response, this.xhr.status, this.xhr.getAllResponseHeaders());
                }
            };

            // error event handler
            const onError = (err: ErrorEvent) => {
                responseObserver.error(this.xhr.response);
                this.onError(item, this.xhr.response, this.xhr.status, this.xhr.getAllResponseHeaders());
            };

            /**
             * Les évènements d'envoi (upload) sont lancés sur l'objet XMLHttpRequest.upload
             * @param event
             */
            const onProgress = (event) => {
                const progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                this.logger.debug('progress : ' + progress);
                this.onProgressItem(item, progress);
            };


            // By default, register for load and error events.
            this.xhr.addEventListener('load', onLoad);
            this.xhr.addEventListener('error', onError);
            this.xhr.upload.addEventListener('progress', onProgress);

            let sendable;


            if (!this.disableMultipart) {
                sendable = item.formData;
                sendable.append(item.alias, item.file, item.file.name);
            } else {
                this.logger.debug(item.file);
                sendable = item.file;
            }

            this.xhr.send(sendable);

            return () => {
                // On a cancellation, remove all registered event listeners.
                console.log('stop !!!!@');
                this.xhr.removeEventListener('error', onError);
                this.xhr.removeEventListener('load', onLoad);
                this.xhr.upload.removeEventListener('progress', onProgress);
                // Finally, abort the in-flight request.
                this.xhr.abort();
            };
        }).subscribe();
    }


    cancelFileItem(fileItem: FileItem) {
        this.progressTotal = this.computeTotalProgress();
        this.onCancel$.next(fileItem);
    }

}

