import { Injectable, Inject } from '@angular/core';
import { FileItem } from './fileItem.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { NgxUploadLogger } from '../utils/logger.model';
import { NGX_UPLOAD_OPTIONS, UploadOptions } from '../utils/configuration.model';
import { AbstractUploadService } from './abstractUpload.service';

import 'rxjs/add/observable/of';


// send an event for each upload event. These events can be catched by the user for call a callback


@Injectable()
export class XhrUploadService extends AbstractUploadService {


    constructor(protected logger: NgxUploadLogger, @Inject(NGX_UPLOAD_OPTIONS) options: UploadOptions) {
        super(logger, options);
    }


    uploadFileItem(fileItem: FileItem): Observable<Response> {

        this.logger.info('enter uploadService.uploadFileItem()');

        const index = this.queue.indexOf(fileItem);
        const item = this.queue[index];

        this.onBeforeUploadItem(item);

        if (item.isCancel) {
            return Observable.of();
        }

        item.isUploading = true;
        this.isUploading = true;

        return new Observable<Response>((responseObserver: Observer<Response>) => {

            const xhr = item.ɵxhr = new XMLHttpRequest();
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
                    this.onSuccess(item, xhr.response, xhr.status, xhr.getAllResponseHeaders());
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    responseObserver.complete();
                } else if (ok) {
                    // A successful response is delivered on the event stream.
                    responseObserver.next(xhr.response);
                    this.onSuccess(item, xhr.response, xhr.status, xhr.getAllResponseHeaders());
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    responseObserver.complete();
                } else {
                    // An unsuccessful request is delivered on the error channel.
                    responseObserver.error(xhr.response);
                    this.onError(item, xhr.response, xhr.status, xhr.getAllResponseHeaders());
                }
            };

            // error event handler
            const onError = (err: ErrorEvent) => {
                responseObserver.error(xhr.response);
                this.onError(item, xhr.response, xhr.status, xhr.getAllResponseHeaders());
            };

            /**
             * Les évènements d'envoi (upload) sont lancés sur l'objet XMLHttpRequest.upload
             * @param event
             */
            const onProgress = (event) => {
                const progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                this.logger.debug('progress : ' + progress);
                // this.onProgressItem(item, progress);
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


}

