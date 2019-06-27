var FileItem = /** @class */ (function () {
    function FileItem(file, uploadService, logger) {
        this.file = file;
        this.uploadService = uploadService;
        this.logger = logger;
        this.isReady = true;
        this.progress = 0;
        this.formData = new FormData();
        this.alias = 'file';
    }
    FileItem.prototype.upload = function (endpoint, options) {
        if (endpoint) {
            this.uploadService.uploadFileItem(this, endpoint, options);
        }
        else {
            this.logger.error('You must define a UploadEndPoint object.');
        }
    };
    FileItem.prototype.cancel = function () {
        this.logger.debug('upload cancel');
        if (this.uploadInProgress) {
            this.ɵonCancel();
            this.uploadService.cancelFileItem(this);
        }
    };
    FileItem.prototype.remove = function () {
        this.logger.debug('upload remove');
        this.uploadService.removeFromQueue(this);
    };
    FileItem.prototype.ɵonBeforeUploadItem = function () {
        this.isReady = true;
        this.uploadInProgress = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = false;
        this.progress = 0;
    };
    FileItem.prototype.ɵonProgress = function (progress) {
        this.isReady = false;
        this.progress = progress;
    };
    FileItem.prototype.ɵonSuccess = function () {
        this.isReady = false;
        this.uploadInProgress = false;
        this.isSuccess = true;
        this.isCancel = false;
        this.isError = false;
        this.progress = 100;
    };
    FileItem.prototype.ɵonError = function () {
        this.isReady = false;
        this.uploadInProgress = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = true;
        this.progress = 0;
    };
    FileItem.prototype.ɵonCancel = function () {
        this.isReady = true;
        this.uploadInProgress = false;
        this.isSuccess = false;
        this.isCancel = true;
        this.isError = false;
        this.progress = 0;
        this.sub.unsubscribe();
    };
    return FileItem;
}());
export { FileItem };
//# sourceMappingURL=fileItem.model.js.map