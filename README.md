# Ngx-upload
[![Build Status](https://travis-ci.org/wKoza/ngx-upload.svg)](https://travis-ci.org/wKoza/ngx-upload)
[![codecov](https://codecov.io/gh/wKoza/ngx-upload/branch/master/graph/badge.svg)](https://codecov.io/gh/wKoza/ngx-upload)
[![npm version](https://badge.fury.io/js/%40wkoza%2Fngx-upload.svg)](https://badge.fury.io/js/%40wkoza%2Fngx-upload)
[![devDependency Status](https://david-dm.org/wKoza/ngx-upload/dev-status.svg)](https://david-dm.org/wKoza/ngx-upload?type=dev)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/wKoza/ngx-upload/master/LICENSE)

## Demo
https://ngx-upload.github.io

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Hooks](#hooks)
- [Documentation](#documentation)
- [License](#license)

## About

Ngx-upload is a module for the Angular framework. Ngx-upload supports drag and drop, upload progress and manages a file upload queue for you.
Ngx-upload is bound to anyone presentation framework but you can use it with ng(x)-bootstrap or Angular Material Design without any problems.

## Installation

Install through npm:
```
npm install @wkoza/ngx-upload
```
OR
```
yarn add @wkoza/ngx-upload
```

## Setup

Just include ngx-upload in your root module with `FormsModule` or `ReactiveFormsModule`:

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgxUploadModule} from '@wkoza/ngx-upload';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // or ReactiveFormsModule
    NgxUploadModule.forRoot()
  ]
})
export class AppModule {}
```

Ngx-upload become with a mock configuration. In a real application, you must configure by declaring the configuration object `UploadOptions` like this :

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgxUploadModule} from '@wkoza/ngx-upload';

const uploadOptions: UploadOptions = {
  method : 'POST',
  url: 'your_backend_upload_url',
  httpStrategy: HttpClientUploadService // or XhrUploadService
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // or ReactiveFormsModule
    HttpClientModule,
    NgxUploadModule.forRoot(uploadOptions)
  ]
})
export class AppModule {}
```

The `httpStrategy` property allows to specify if you wants to use HttpClient` or a simple XHR service for your upload.


Ngx-upload also proposes to configure the drop zone aspect. Then, you can change the css class of your drop zone regarding the drop event:
 - When you drag a file
 - When you drop a file
 - In other cases

For this, you should add the configuration object `DropTargetOptions` like this :

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgxUploadModule} from '@wkoza/ngx-upload';

const uploadOptions: UploadOptions = {
  method : 'POST',
  url: 'your_backend_upload_url',
  httpStrategy: HttpClientUploadService // or XhrUploadService
};

export const ngxDropTargetOptions: DropTargetOptions = {
  color: 'dropZoneColor',
  colorDrag: 'dropZoneColorDrag',
  colorDrop: 'dropZoneColorDrop'
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // or ReactiveFormsModule
    NgxUploadModule.forRoot(uploadOptions, ngxDropTargetOptions)
  ]
})
export class AppModule {}
```

In this example, you should also declare these css classes in your own css :

```css

.dropZoneColor {
  border: 3px dotted rgba(0,0,0,0.08);
  background-color: rgba(0,0,0,0.12)
}

.dropZoneColorDrag {
  border: 3px dotted rgba(0,0,0,0.28);
  background-color: grey
}

.dropZoneColorDrop {
  border: 3px dotted rgba(0,0,0,0.08);
  background-color: rgba(0,0,0,0.12)
}
```

## Usage

### Drop zone

Ngx-upload offers one directive for your drop zone called `ngxDragAndDrop`. It allows to add the files in the upload queue. During the drop event, it throws an event called `onDrop` that you can catch :

```html
<form #myForm="ngForm">

...

<div class="my-drop-zone" ngxDragAndDrop [formBinded]="myForm">
        Drop files here to upload
</div>


</form>
```

To finish, we can overwrite the `DropTargetOptions` for a specific case due to property binding :

```html
<div class="my-drop-zone" [ngxDragAndDrop]="options" [formBinded]="myForm">
        Drop files here to upload
</div>
```

### Upload queue

Each file is added to a queue that you can manage with `uploader` service. Here is an example :

```html
  <div class="col-md-9" style="margin-bottom: 40px">
    <h3>Upload queue <span *ngIf="uploader.queue.length>0"> - {{ uploader.queue.length }} item(s)</span></h3>

    <div class="card text-right">
      <div style="margin: 15px">
        <ngb-progressbar showValue="true" type="success" [striped]="true" [animated]="true"
                         [value]="uploader.progressTotal"></ngb-progressbar>
      </div>
      <div class="card-block">
        <button type="button" class="btn btn-outline-success btn-s" (click)="uploader.uploadAll()"
                [disabled]="!activeUploadAllBtn()">
          Upload all
        </button>
        <button type="button" class="btn btn-outline-warning btn-s" (click)="uploader.cancelAll()"
                [disabled]="!activeCancelAllBtn()">
           Cancel all
        </button>
        <button type="button" class="btn btn-outline-danger btn-s" (click)="uploader.removeAllFromQueue()"
                [disabled]="!activeRemoveAllBtn()">
           Remove all
        </button>
      </div>
    </div>
    <div class="card" style="margin-top: 20px">

      <table class="table" style="font-size: 14px">
        <thead>
        <tr>
          <th width="50%">Name</th>
          <th>Size</th>
          <th>Progress</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let itemFile of uploader.queue"
            [ngClass]="{'table-success' : itemFile.isSuccess, 'table-danger' : itemFile.isError, 'table-warning' : itemFile.isUploading  }">
          <td>{{ itemFile.file.name }}</td>
          <td>{{ itemFile.file.size/1024/1024 | number:'1.0-2' }} MB</td>
          <td>
            <div>
              <ngb-progressbar type="success" showValue="true"
                               [striped]="true" [animated]="true"
                               [value]="itemFile.progress">

              </ngb-progressbar>
            </div>
          </td>
          <td style="text-align: center">
            <button type="button" class="btn btn-outline-success btn-sm" (click)="itemFile.upload()"
                    [disabled]="!itemFile.isReady">
               Upload
            </button>
            <button type="button" class="btn btn-outline-warning btn-sm" (click)="itemFile.cancel()"
                    [disabled]="!itemFile.uploadInProgress || itemFile.isCancel">
             Cancel
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm" (click)="itemFile.remove()"
                    [disabled]="itemFile.isSuccess || itemFile.uploadInProgress">
              Remove
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>

```


Take a look at [those examples](https://github.com/wKoza/ngx-upload/tree/master/demo/src/app) for more details :

## Hooks

Ngx-upload offers 5 `Observable` to handle a specific behavior :

- onCancel$<FileItem> : This Observable emits when upload is canceled.
- onError$<{ item: FileItem, body: any, status: number, headers: any }> : This Observable emits on error during the upload process.
- onSuccess$<{ item: FileItem, body: any, status: number, headers: any }> : This Observable emits on success.
- onBeforeUploadItem$<FileItem> : This Observable emits just before the upload process.
- onProgress$<{ item: FileItem, progress: number }> : This Observable emits during the upload process.


For example :


```javascript

import { Component, OnInit } from '@angular/core';
import { FileItem, HttpClientUploadService } from '@wkoza/ngx-upload';


@Component({
    selector: 'app-root',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.css']
})
export class SimpleBootstrapComponent implements OnInit {

    constructor(public uploader: HttpClientUploadService) { }

    ngOnInit() {

        this.uploader.onCancel$.subscribe(
            (data: FileItem) => {
                console.log('file deleted: ' + data.file);

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


    }
}
```

## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://ngx-upload.github.io/docs/

## License

MIT
