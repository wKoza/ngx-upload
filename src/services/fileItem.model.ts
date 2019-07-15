import { AbstractUploadService } from './abstractUpload.service';
import { NgxUploadLogger } from '../utils/logger.model';
import { Subscription } from 'rxjs';
import { UploadEndPoint } from '../utils/configuration.model';

export class FileItem {

    uploadInProgress: boolean;
    isReady = true;
    isSuccess: boolean;
    isCancel: boolean;
    isError: boolean;
    progress = 0;

    disableMultipart: boolean = false;
    formData: FormData = new FormData();

    alias = 'file';

    sub: Subscription;

    constructor(public file: File, private uploadService: AbstractUploadService, protected logger: NgxUploadLogger) {
    }

    upload(endpoint: UploadEndPoint, options?: any) {
        if (endpoint) {
            this.uploadService.uploadFileItem(this, endpoint, options);
        } else {
            this.logger.error('You must define a UploadEndPoint object.');
        }
    }

    cancel() {
        this.logger.debug('upload cancel');
        if (this.uploadInProgress) {
            this.ɵonCancel();
            this.uploadService.cancelFileItem(this);
        }
    }

    remove() {
        this.logger.debug('upload remove');
        this.uploadService.removeFromQueue(this);
    }

    ɵonBeforeUploadItem() {
        this.isReady = true;
        this.uploadInProgress = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = false;
        this.progress = 0;
    }

    ɵonProgress(progress: number) {
        this.isReady = false;
        this.progress = progress;
    }

    ɵonSuccess() {
        this.isReady = false;
        this.uploadInProgress = false;
        this.isSuccess = true;
        this.isCancel = false;
        this.isError = false;
        this.progress = 100;
    }

    ɵonError() {
        this.isReady = false;
        this.uploadInProgress = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = true;
        this.progress = 0;
    }

    ɵonCancel() {
        this.isReady = true;
        this.uploadInProgress = false;
        this.isSuccess = false;
        this.isCancel = true;
        this.isError = false;
        this.progress = 0;
        this.sub.unsubscribe();
    }


}
