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
import { HttpClient, HttpErrorResponse, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { AbstractUploadService } from './abstractUpload.service';
// send an event for each upload event. These events can be catched by the user for call a callback
var HttpClientUploadService = /** @class */ (function (_super) {
    __extends(HttpClientUploadService, _super);
    function HttpClientUploadService(logger, httpClient) {
        var _this = _super.call(this, logger) || this;
        _this.logger = logger;
        _this.httpClient = httpClient;
        return _this;
    }
    HttpClientUploadService.prototype.uploadFileItem = function (fileItem, endpoint, options) {
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
        var sendable = item.formData;
        sendable.append(item.alias, item.file, item.file.name);
        var req = new HttpRequest(method, url, sendable, Object.assign(options, { reportProgress: true }));
        fileItem.sub = this.httpClient.request(req).subscribe(function (event) {
            if (event.type === HttpEventType.UploadProgress) {
                // This is an upload progress event. Compute and show the % done:
                var percentDone = Math.round(event.loaded * 100 / (event.total ? event.total : event.loaded));
                _this.logger.debug("File is " + percentDone + "% uploaded.");
                fileItem.ɵonProgress(percentDone);
                _this.onProgressItem(item, percentDone);
            }
            else if (event instanceof HttpResponse) {
                // A successful response is delivered on the event stream.
                item.ɵonSuccess();
                _this.onSuccess(item, event.body, event.status, event.headers);
            }
        }, function (err) {
            if (err instanceof HttpErrorResponse) {
                if (url === 'ngx_upload_mock') {
                    item.ɵonSuccess();
                    _this.onSuccess(item, err.message, err.status, err.headers);
                }
                else if (err.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    item.ɵonError();
                    _this.onError(item, err.error.message, err.status, err.headers);
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    item.ɵonError();
                    _this.onError(item, err.error, err.status, err.headers);
                }
            }
        });
    };
    HttpClientUploadService.prototype.cancelFileItem = function (fileItem) {
        this.progressTotal = this.computeTotalProgress();
        this.onCancel$.next(fileItem);
    };
    HttpClientUploadService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    HttpClientUploadService.ctorParameters = function () { return [
        { type: NgxUploadLogger },
        { type: HttpClient }
    ]; };
    return HttpClientUploadService;
}(AbstractUploadService));
export { HttpClientUploadService };
//# sourceMappingURL=httpClientUpload.service.js.map