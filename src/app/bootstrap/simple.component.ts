import { Component, OnInit, ViewChild } from '@angular/core';

import { Person } from './person.model';
import {
  DropTargetOptions,
  FileItem,
  HttpClientUploadService,
  InputFileOptions,
  MineTypeEnum
} from '@wkoza/ngx-upload';
import { AbstractControl, NgForm } from '@angular/forms';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-bootstrap',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css']
})
export class SimpleBootstrapComponent implements OnInit {


  model: Person;

  @ViewChild('ourForm', {static: true}) ourForm: NgForm | undefined;

  optionsInput: InputFileOptions = {
    multiple: true,
    accept: [MineTypeEnum.All],
    disableMultipart: false
  };

  optionsDrop: DropTargetOptions = {
    color: 'dropZoneColorMaterial',
    colorDrag: 'dropZoneColorDragMaterial',
    colorDrop: 'dropZoneColorDropMaterial',
    multiple: true,
    accept: [MineTypeEnum.Image_Jpeg, MineTypeEnum.Image_Png],
    disableMultipart: false
  };

  constructor(public uploader: HttpClientUploadService) {
    this.model = new Person();
  }

  ngOnInit() {


    this.uploader.queue = [];

    this.uploader.onCancel$.subscribe(
      (data: FileItem) => {
        console.log('file canceled: ' + data.file.name);

    });

    this.uploader.onDropError$.subscribe(
      (err) => {
        console.log('error during drop action: ', err);
      });

    this.uploader.onProgress$.subscribe(
      (data: any) => {
        console.log('upload file in progree: ', data.progress);

      });

    this.uploader.onSuccess$.subscribe(
      (data: any) => {
        console.log(`upload file successful:  ${data.item} ${data.body} ${data.status} ${data.headers}`);
      }
    );

    this.uploader.onAddToQueue$.subscribe(
      () => {
        console.log(`reset of our form`);
        this.ourForm?.reset();

      }
    )
  }


  upload(item: FileItem) {
    item.upload({
      method: 'POST',
      url: 'ngx_upload_mock'
    });
  }

  uploadAll() {
    this.uploader.uploadAll({
      method: 'POST',
      url: 'ngx_upload_mock'
    })  //'http://localhost:8090/upload'
  }


  makeThumbnail(item: FileItem) {
    const reader = new FileReader();
    // read the image file as a data URL.
    reader.readAsDataURL(item.file);

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
