import { FileItem } from './fileItem.model';
import { Subject } from 'rxjs';
var AbstractUploadService = /** @class */ (function () {
    function AbstractUploadService(logger) {
        this.logger = logger;
        this.progressTotal = 0;
        this.onCancel$ = new Subject();
        this.onError$ = new Subject();
        this.onDropError$ = new Subject();
        this.onSuccess$ = new Subject(); // TODO headers isn't `any` but `Array`
        this.onBeforeUploadItem$ = new Subject();
        this.onProgress$ = new Subject();
        this.onAddToQueue$ = new Subject();
        this.queue = new Array();
        this.headers = new Map();
        this.disableMultipart = false;
    }
    /**
     * Adds files to the queue
     */
    AbstractUploadService.prototype.addToQueue = function (files, formGroup, dropOptions) {
        this.logger.info('add to queue');
        if (dropOptions && !dropOptions.multiple) {
            if (files.length > 1) {
                this.logger.error('there is more than one file.');
                this.onDropError$.next({ errorAccept: false, errorMultiple: true });
                return;
            }
        }
        var _loop_1 = function (i) {
            var file = files.item(i);
            this_1.logger.debug(files.item(i));
            if (dropOptions && dropOptions.accept) {
                var accepted = dropOptions.accept.some(function (type) { return type === file.type; });
                if (!accepted) {
                    this_1.logger.error('this file is not accepted because of its type', file);
                    this_1.onDropError$.next({ item: file, errorAccept: true, errorMultiple: false });
                    return "continue";
                }
            }
            var fileItem = new FileItem(file, this_1, this_1.logger);
            if (formGroup) {
                Object.keys(formGroup.controls).forEach(function (key) {
                    fileItem.formData.append(key, formGroup.get(key).value);
                });
            }
            this_1.queue.push(fileItem);
            this_1.onAddToQueue$.next(fileItem);
        };
        var this_1 = this;
        for (var i = 0; i < files.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * Uploads all not uploaded items of queue
     */
    AbstractUploadService.prototype.uploadAll = function (endpoint, options) {
        var items = this.queue.filter(function (item) { return (item.isReady); });
        if (!items.length) {
            return;
        }
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            item.upload(endpoint, options);
        }
    };
    /**
     * Uploads all not uploaded items of queue
     */
    AbstractUploadService.prototype.cancelAll = function () {
        var items = this.queue.filter(function (item) { return (item.uploadInProgress); });
        if (!items.length) {
            return;
        }
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            item.cancel();
        }
        this.progressTotal = this.computeTotalProgress();
    };
    /**
     * Uploads all not uploaded items of queue
     */
    AbstractUploadService.prototype.removeAllFromQueue = function () {
        var items = this.queue.filter(function (item) { return (!item.uploadInProgress && !item.isSuccess); });
        if (!items.length) {
            return;
        }
        for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
            var item = items_3[_i];
            this.removeFromQueue(item);
        }
    };
    AbstractUploadService.prototype.removeFromQueue = function (fileItem) {
        var index = this.queue.indexOf(fileItem);
        var item = this.queue[index];
        if (item.uploadInProgress) {
            item.cancel();
        }
        this.queue.splice(index, 1);
        this.progressTotal = this.computeTotalProgress();
    };
    /**
     * Returns the total progress
     * @param {Number} [value]
     * @returns {Number}
     * @private
     */
    AbstractUploadService.prototype.computeTotalProgress = function () {
        var totalCurrent = 0;
        var total = 0;
        for (var _i = 0, _a = this.queue; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.uploadInProgress || item.isSuccess) {
                totalCurrent += (item.file.size / 100) * item.progress || 0;
                total += item.file.size;
                this.logger.debug(totalCurrent + ' / ' + total);
            }
        }
        return Math.round((totalCurrent * 100) / total);
    };
    /**
     * Prepares file status before upload
     * @param item
     */
    AbstractUploadService.prototype.onBeforeUploadItem = function (item) {
        this.logger.info('enter uploadService.ɵonBeforeUploadItem()');
        item.ɵonBeforeUploadItem();
        this.onBeforeUploadItem$.next(item);
    };
    /**
     * Update status during upload progress
     * @param item
     * @param progress
     */
    AbstractUploadService.prototype.onProgressItem = function (item, progress) {
        this.logger.info("call onProgressItem " + item + " " + progress);
        this.progressTotal = this.computeTotalProgress();
        item.ɵonProgress(progress);
        this.onProgress$.next({ item: item, progress: progress });
    };
    /**
     * Callback called when an upload error occurs
     * @param item
     * @param xhr
     */
    AbstractUploadService.prototype.onError = function (item, body, status, headers) {
        this.logger.info("call onError " + item + " " + body + " " + status + " " + headers);
        item.ɵonError();
        this.onError$.next({ item: item, body: body, status: status, headers: headers });
    };
    /**
     * Callback called when an upload success occurs
     * @param item
     * @param xhr
     */
    AbstractUploadService.prototype.onSuccess = function (item, body, status, headers) {
        this.logger.info("call onSuccess " + item + " " + body + " " + status + " " + headers);
        this.progressTotal = this.computeTotalProgress();
        item.ɵonSuccess();
        this.onSuccess$.next({ item: item, body: body, status: status, headers: headers });
    };
    return AbstractUploadService;
}());
export { AbstractUploadService };
//# sourceMappingURL=abstractUpload.service.js.map