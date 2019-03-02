import { async, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


import { NgxUploadLogger, NoOpLogger } from '../../src/utils/logger.model';
import { MockLogger } from '../mocks/logger.model.mock';
import { HttpClientUploadService } from '../../src/services/httpClientUpload.service';
import { HttpClientModule } from '@angular/common/http';

import * as FileAPI from 'file-api';
import { FileItem } from '../../src/services/fileItem.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DropTargetOptions, MineTypeEnum, UploadEndPoint } from '../../src';

export function _loggerFactory(): NgxUploadLogger {
  return new NoOpLogger();
}

describe('HttpClientUploadService', () => {

  let httpClientUploadService: HttpClientUploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {


    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        CommonModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: NgxUploadLogger, useClass: MockLogger},
        HttpClientUploadService
      ]
    });

    httpClientUploadService = TestBed.get(HttpClientUploadService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should add a file to the queue', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'));
    expect(httpClientUploadService.queue.length).toBe(0);
    httpClientUploadService.addToQueue(files, null);
    expect(httpClientUploadService.queue.length).toBe(1);
  });


  it('should add a file to the queue', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'));
    expect(httpClientUploadService.queue.length).toBe(0);
    httpClientUploadService.addToQueue(files, null);
    expect(httpClientUploadService.queue.length).toBe(1);
  });

  it('should add 3 files in the queue', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'), new FileAPI.File('./image2.jpg'), new FileAPI.File('./image3.jpg'));
    expect(httpClientUploadService.queue.length).toBe(0);
    httpClientUploadService.addToQueue(files, null);
    expect(httpClientUploadService.queue.length).toBe(3);
  });

  it('should add 3 files with different types in the queue', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'), new FileAPI.File('./doc.pdf'), new FileAPI.File('./image3.jpg'));
    expect(httpClientUploadService.queue.length).toBe(0);
    const dropOptions: DropTargetOptions = {color: '', colorDrag: '', colorDrop: '', multiple: true, accept: [MineTypeEnum.Image_Jpeg, MineTypeEnum.Application_Pdf]};
    httpClientUploadService.addToQueue(files, null, dropOptions);
    expect(httpClientUploadService.queue.length).toBe(3);
  });

  it('should not accept 3 files in the queue', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'), new FileAPI.File('./image2.jpg'), new FileAPI.File('./image3.jpg'));
    expect(httpClientUploadService.queue.length).toBe(0);
    const dropOptions: DropTargetOptions = {color: '', colorDrag: '', colorDrop: '', multiple: false};
    httpClientUploadService.addToQueue(files, null, dropOptions);
    expect(httpClientUploadService.queue.length).toBe(0);
  });

  it('should not accept pdf file', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'), new FileAPI.File('./doc.pdf'), new FileAPI.File('./image3.jpg'));
    expect(httpClientUploadService.queue.length).toBe(0);
    const dropOptions: DropTargetOptions = {color: '', colorDrag: '', colorDrop: '', multiple: true, accept: [MineTypeEnum.Image_Jpeg]};
    httpClientUploadService.addToQueue(files, null, dropOptions);
    expect(httpClientUploadService.queue.length).toBe(2);
  });

  it('should push onDropError', async() => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'), new FileAPI.File('./doc.pdf'), new FileAPI.File('./image3.jpg'));
    expect(httpClientUploadService.queue.length).toBe(0);
    const dropOptions: DropTargetOptions = {color: '', colorDrag: '', colorDrop: '', multiple: true, accept: [MineTypeEnum.Image_Jpeg]};
    httpClientUploadService.onDropError$.subscribe((err) => {
      expect(err.errorAccept).toBe(true);
    });
    httpClientUploadService.addToQueue(files, null, dropOptions);
  });

  it('should have a fileItem in the queue', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'));
    httpClientUploadService.addToQueue(files, null);

    const fileItem = httpClientUploadService.queue[0] as FileItem;
    expect(fileItem.file.name).toBe('image.jpg');
    expect(fileItem.file.type).toBe('image/jpeg');

  });


  it('should have a fileItem in the queue', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'));
    httpClientUploadService.addToQueue(files, null);

    const fileItem = httpClientUploadService.queue[0] as FileItem;
    fileItem.ɵonBeforeUploadItem();

    expect(fileItem.uploadInProgress).toBe(false);
    expect(fileItem.isReady).toBe(true);
    expect(fileItem.isSuccess).toBe(false);
    expect(fileItem.isCancel).toBe(false);
    expect(fileItem.isError).toBe(false);

  });

  it('should remove a fileItem ', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'));
    httpClientUploadService.addToQueue(files, null);
    expect(httpClientUploadService.queue.length).toBe(1);
    httpClientUploadService.removeFromQueue(httpClientUploadService.queue[0]);
    expect(httpClientUploadService.queue.length).toBe(0);


  });


  it('should remove a fileItem ', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'), new FileAPI.File('./image2.jpg'), new FileAPI.File('./image3.jpg'));
    httpClientUploadService.addToQueue(files, null);
    expect(httpClientUploadService.queue.length).toBe(3);
    httpClientUploadService.removeAllFromQueue();
    expect(httpClientUploadService.queue.length).toBe(0);
  });


  it('should remove all fileItem ', () => {
    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'), new FileAPI.File('./image2.jpg'), new FileAPI.File('./image3.jpg'));
    httpClientUploadService.addToQueue(files, null);
    expect(httpClientUploadService.queue.length).toBe(3);
    expect(httpClientUploadService.queue.filter(item => (item.isReady)).length).toBe(3);
  });

  it('should upload fileItem ', () => {
    const endpoint: UploadEndPoint = {
      method: 'POST',
      url: 'ngx_upload_mock' // 'http://localhost:8090/upload'
    };

    const files = new FileAPI.FileList(new FileAPI.File('./image.jpg'));
    httpClientUploadService.addToQueue(files, null);
    httpClientUploadService.uploadFileItem(httpClientUploadService.queue[0], endpoint);

    const req = httpMock.expectOne('ngx_upload_mock');
    expect(req.request.method).toEqual('POST');
    req.flush('success');
  });

});