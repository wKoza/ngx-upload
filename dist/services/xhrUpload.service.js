var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Injectable } from '@angular/core';
import { NgxUploadLogger } from '../utils/logger.model';
import { AbstractUploadService } from './abstractUpload.service';
import { Observable } from 'rxjs';
// send an event for each upload event. These events can be catched by the user for call a callback
/*
  @Deprecated since 6.1.0
 */
var XhrUploadService = /** @class */ (function (_super) {
    __extends(XhrUploadService, _super);
    function XhrUploadService(logger) {
        var _this = _super.call(this, logger) || this;
        _this.logger = logger;
        return _this;
    }
    XhrUploadService.prototype.uploadFileItem = function (fileItem, endpoint, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.logger.info('enter uploadService.uploadFileItem()');
        var method = endpoint.method;
        var url = endpoint.url;
        var index = this.queue.indexOf(fileItem);
        var item = this.queue[index];
        this.onBeforeUploadItem(item);
        if (item.isCancel) {
            return;
        }
        item.uploadInProgress = true;
        fileItem.sub = new Observable(function (responseObserver) {
            _this.xhr = new XMLHttpRequest();
            _this.xhr.open(method, url, true);
            if (!!_this.withCredentials) {
                _this.xhr.withCredentials = true;
            }
            // Add all the requested headers.
            _this.headers.forEach(function (values, name) {
                _this.xhr.setRequestHeader(name, values.join(','));
            });
            /** load event */
            var onLoad = function () {
                var ok = _this.xhr.status >= 200 && _this.xhr.status < 300;
                if (url === 'ngx_upload_mock') {
                    // A successful response is delivered on the event stream.
                    responseObserver.next(_this.xhr.response);
                    _this.onSuccess(item, _this.xhr.response, _this.xhr.status, _this.xhr.getAllResponseHeaders());
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    responseObserver.complete();
                }
                else if (ok) {
                    // A successful response is delivered on the event stream.
                    responseObserver.next(_this.xhr.response);
                    _this.onSuccess(item, _this.xhr.response, _this.xhr.status, _this.xhr.getAllResponseHeaders());
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    responseObserver.complete();
                }
                else {
                    // An unsuccessful request is delivered on the error channel.
                    responseObserver.error(_this.xhr.response);
                    _this.onError(item, _this.xhr.response, _this.xhr.status, _this.xhr.getAllResponseHeaders());
                }
            };
            // error event handler
            var onError = function (err) {
                responseObserver.error(_this.xhr.response);
                _this.onError(item, _this.xhr.response, _this.xhr.status, _this.xhr.getAllResponseHeaders());
            };
            /**
             * Les évènements d'envoi (upload) sont lancés sur l'objet XMLHttpRequest.upload
             * @param event
             */
            var onProgress = function (event) {
                var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                _this.logger.debug('progress : ' + progress);
                _this.onProgressItem(item, progress);
            };
            // By default, register for load and error events.
            _this.xhr.addEventListener('load', onLoad);
            _this.xhr.addEventListener('error', onError);
            _this.xhr.upload.addEventListener('progress', onProgress);
            var sendable;
            if (!_this.disableMultipart) {
                sendable = item.formData;
                sendable.append(item.alias, item.file, item.file.name);
            }
            else {
                _this.logger.debug(item.file);
                sendable = item.file;
            }
            _this.xhr.send(sendable);
            return function () {
                // On a cancellation, remove all registered event listeners.
                _this.xhr.removeEventListener('error', onError);
                _this.xhr.removeEventListener('load', onLoad);
                _this.xhr.upload.removeEventListener('progress', onProgress);
                // Finally, abort the in-flight request.
                _this.xhr.abort();
            };
        }).subscribe();
    };
    XhrUploadService.prototype.cancelFileItem = function (fileItem) {
        this.progressTotal = this.computeTotalProgress();
        this.onCancel$.next(fileItem);
    };
    XhrUploadService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    XhrUploadService.ctorParameters = function () { return [
        { type: NgxUploadLogger }
    ]; };
    return XhrUploadService;
}(AbstractUploadService));
export { XhrUploadService };
//# sourceMappingURL=xhrUpload.service.js.map