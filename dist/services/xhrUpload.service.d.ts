import { FileItem } from './fileItem.model';
import { NgxUploadLogger } from '../utils/logger.model';
import { UploadEndPoint } from '../utils/configuration.model';
import { AbstractUploadService } from './abstractUpload.service';
import { Subscription } from 'rxjs';
export declare class XhrUploadService extends AbstractUploadService {
    protected logger: NgxUploadLogger;
    private xhr;
    sub: Subscription;
    constructor(logger: NgxUploadLogger);
    uploadFileItem(fileItem: FileItem, endpoint: UploadEndPoint, options?: any): void;
    cancelFileItem(fileItem: FileItem): void;
}
