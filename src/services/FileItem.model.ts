import {UploadService} from './upload.service';

export class FileItem {

  isUploading: boolean;
  isReady: boolean;
  isUploaded: boolean;
  isSuccess: boolean;
  isCancel: boolean;
  isError: boolean;
  progress = 0;

  formData: FormData = new FormData();

  alias = 'file';

  ɵxhr: XMLHttpRequest;

  constructor(public file: File, private uploadService: UploadService) {
  }

  upload() {
    console.log('upload item');
    this.uploadService.uploadFileItem(this).subscribe(
      (res: Response) => console.log(res.status),
      (err) => {
        console.log('err cb');
        console.log(err)
      },
      () => console.log('complete')
    );
  }

  cancel() {
    console.log('upload cancel');
    this.uploadService.cancelFileItem(this);
  }

  remove() {
    console.log('upload remove');
    this.uploadService.removeFromQueue(this);
  }

  ɵonBeforeUploadItem() {
    this.isReady = true;
    this.isUploading = false;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = false;
    this.progress = 0;
    this.onBeforeUpload();
  }

  ɵonProgress(progress: number) {
    this.progress = progress;
    this.onProgress(progress);
  }

  ɵonSuccess(response, status, headers) {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = true;
    this.isCancel = false;
    this.isError = false;
    this.progress = 100;
    // this.index = null;
    this.onSuccess(response, status, headers);
  }

  ɵonError(response, status, headers) {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = true;
    this.progress = 0;
    // this.index = null;
    this.onError(response, status, headers);
  }

  ɵonCancel(response, status, headers) {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = true;
    this.isError = false;
    this.progress = 0;
    // this.index = null;
    this.onCancel(response, status, headers);
  }

  /**
   * Callback
   * @private
   */
  onBeforeUpload() {
  }

  onProgress(progress: number) {
  }

  onSuccess(response, status, headers) {
  }


  onError(response, status, headers) {
  }


  onCancel(response, status, headers) {
  }

}
