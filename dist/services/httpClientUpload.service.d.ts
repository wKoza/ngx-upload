import { FileItem } from './fileItem.model';
import { NgxUploadLogger } from '../utils/logger.model';
import { UploadEndPoint } from '../utils/configuration.model';
import { HttpClient } from '@angular/common/http';
import { AbstractUploadService } from './abstractUpload.service';
import { Subscription } from 'rxjs/index';
export declare class HttpClientUploadService extends AbstractUploadService {
    protected logger: NgxUploadLogger;
    private httpClient;
    sub: Subscription;
    constructor(logger: NgxUploadLogger, httpClient: HttpClient);
    uploadFileItem(fileItem: FileItem, endpoint: UploadEndPoint, options?: any): void;
    cancelFileItem(fileItem: FileItem): void;
}
