import { Component, OnInit, ViewChild } from '@angular/core';

import { Person } from './person.model';
import {
  DropTargetOptions,
  FileItem,
  HttpClientUploadService,
  InputFileOptions,
  MineTypeEnum
} from '@wkoza/ngx-upload';


@Component({
  selector: 'app-root',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css']
})
export class SimpleMaterialComponent implements OnInit {

  model: Person;

  @ViewChild('ourForm') ourForm;

  optionsDrop: DropTargetOptions = {
    color: 'dropZoneColorMaterial',
    colorDrag: 'dropZoneColorDragMaterial',
    colorDrop: 'dropZoneColorDropMaterial',
    multiple: true,
    accept: [MineTypeEnum.Image_Jpeg, MineTypeEnum.Image_Png]
  };

  optionsInput: InputFileOptions = {
    multiple: true,
    accept: [MineTypeEnum.Image, MineTypeEnum.Application_Pdf]
  };

  title = 'Upload local files';

  constructor(public uploader: HttpClientUploadService) {
  }

  ngOnInit() {

    this.uploader.queue = [];
    this.model = new Person();
    this.uploader.removeAllFromQueue();

    this.uploader.onCancel$.subscribe(
      (data: FileItem) => {
        console.log('file deleted: ' + data.file);

      });

    this.uploader.onDropError$.subscribe(
      (err) => {
        console.log('error during drop action: ', err);
      });

    this.uploader.onProgress$.subscribe(
      (data: any) => {
        console.log('upload file in progree: ' + data.progress);

      });

    this.uploader.onSuccess$.subscribe(
      (data: any) => {
        console.log(`upload file successful:  ${data.item} ${data.body} ${data.status} ${data.headers}`);

      }
    );

    this.uploader.onAddToQueue$.subscribe(
      () => {
        console.log(`reset of our form`);
        this.ourForm.reset();

      }
    )

  }

  upload(item: FileItem) {
    item.upload({
      method: 'POST',
      url: 'ngx_upload_mock' //'http://localhost:8090/upload' //
    });
  }

  uploadAll() {
    this.uploader.uploadAll({
      method: 'POST',
      url: 'ngx_upload_mock' //'http://localhost:8090/upload' //
    })
  }


  activeRemoveAllBtn(): boolean {
    return this.uploader.queue.some(item => (item.isReady || item.isCancel || item.isError));
  }

  activeUploadAllBtn(): boolean {
    return this.uploader.queue.some(item => (item.isReady));
  }

  activeCancelAllBtn(): boolean {
    return this.uploader.queue.some((item: FileItem) => item.uploadInProgress);
  }


}
