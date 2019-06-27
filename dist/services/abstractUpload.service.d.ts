import { FileItem } from './fileItem.model';
import { FormGroup } from '@angular/forms';
import { NgxUploadLogger } from '../utils/logger.model';
import { Subject } from 'rxjs';
import { DropTargetOptions, UploadEndPoint } from '../utils/configuration.model';
export declare abstract class AbstractUploadService {
    protected logger: NgxUploadLogger;
    queue: FileItem[];
    progressTotal: number;
    disableMultipart: boolean;
    withCredentials: boolean;
    /**
     * Internal map of lowercase header names to values.
     */
    protected headers: Map<string, string[]>;
    onCancel$: Subject<FileItem>;
    onError$: Subject<{
        item: FileItem;
        body: any;
        status: number;
        headers: any;
    }>;
    onDropError$: Subject<{
        item?: File | undefined;
        errorAccept: boolean;
        errorMultiple: boolean;
    }>;
    onSuccess$: Subject<{
        item: FileItem;
        body: any;
        status: number;
        headers: any;
    }>;
    onBeforeUploadItem$: Subject<FileItem>;
    onProgress$: Subject<{
        item: FileItem;
        progress: number;
    }>;
    onAddToQueue$: Subject<FileItem>;
    constructor(logger: NgxUploadLogger);
    /**
     * Adds files to the queue
     */
    addToQueue(files: FileList, formGroup: FormGroup | null, dropOptions?: DropTargetOptions): void;
    abstract uploadFileItem(fileItem: FileItem, endpoint: UploadEndPoint, options?: any): void;
    abstract cancelFileItem(fileItem: FileItem): void;
    /**
     * Uploads all not uploaded items of queue
     */
    uploadAll(endpoint: UploadEndPoint, options?: any): void;
    /**
     * Uploads all not uploaded items of queue
     */
    cancelAll(): void;
    /**
     * Uploads all not uploaded items of queue
     */
    removeAllFromQueue(): void;
    removeFromQueue(fileItem: FileItem): void;
    /**
     * Returns the total progress
     * @param {Number} [value]
     * @returns {Number}
     * @private
     */
    computeTotalProgress(): number;
    /**
     * Prepares file status before upload
     * @param item
     */
    protected onBeforeUploadItem(item: FileItem): void;
    /**
     * Update status during upload progress
     * @param item
     * @param progress
     */
    protected onProgressItem(item: FileItem, progress: number): void;
    /**
     * Callback called when an upload error occurs
     * @param item
     * @param xhr
     */
    protected onError(item: FileItem, body: any, status: number, headers: any): void;
    /**
     * Callback called when an upload success occurs
     * @param item
     * @param xhr
     */
    protected onSuccess(item: FileItem, body: any, status: number, headers: any): void;
}
