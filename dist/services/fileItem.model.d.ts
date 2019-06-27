import { AbstractUploadService } from './abstractUpload.service';
import { NgxUploadLogger } from '../utils/logger.model';
import { Subscription } from 'rxjs';
import { UploadEndPoint } from '../utils/configuration.model';
export declare class FileItem {
    file: File;
    private uploadService;
    protected logger: NgxUploadLogger;
    uploadInProgress: boolean;
    isReady: boolean;
    isSuccess: boolean;
    isCancel: boolean;
    isError: boolean;
    progress: number;
    formData: FormData;
    alias: string;
    sub: Subscription;
    constructor(file: File, uploadService: AbstractUploadService, logger: NgxUploadLogger);
    upload(endpoint: UploadEndPoint, options?: any): void;
    cancel(): void;
    remove(): void;
    ɵonBeforeUploadItem(): void;
    ɵonProgress(progress: number): void;
    ɵonSuccess(): void;
    ɵonError(): void;
    ɵonCancel(): void;
}
