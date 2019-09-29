# Ngx-upload
[![Build Status](https://travis-ci.org/wKoza/ngx-upload.svg)](https://travis-ci.org/wKoza/ngx-upload)
[![codecov](https://codecov.io/gh/wKoza/ngx-upload/branch/master/graph/badge.svg)](https://codecov.io/gh/wKoza/ngx-upload)
[![npm version](https://badge.fury.io/js/%40wkoza%2Fngx-upload.svg)](https://badge.fury.io/js/%40wkoza%2Fngx-upload)
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

Just include ngx-upload in your root module with `HttpClientModule` and (`FormsModule` or `ReactiveFormsModule`):

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {NgxUploadModule} from '@wkoza/ngx-upload';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, // or ReactiveFormsModule
    NgxUploadModule.forRoot()
  ]
})
export class AppModule {}
```

Remenber: When you are in a sub module, you haven't to call the `forRoot()` method. You just have to import `NgxUploadModule`.


Ngx-upload also proposes to configure the drop zone aspect. Then, you can change the css class of your drop zone regarding the drop event:
 - When you drag a file
 - When you drop a file
 - In other cases

For this, you should add the configuration object `DropTargetOptions` like this :

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {NgxUploadModule, MineTypeEnum, DropTargetOptions} from '@wkoza/ngx-upload';

export const ngxDropTargetOptions: DropTargetOptions = {
  color: 'dropZoneColor',
  colorDrag: 'dropZoneColorDrag',
  colorDrop: 'dropZoneColorDrop',
  multiple: true,
  accept: [MineTypeEnum.Image, MineTypeEnum.Application_Pdf]
};

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, // or ReactiveFormsModule
    NgxUploadModule.forRoot(ngxDropTargetOptions)
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

There are also 4 properties:
- `accept`	One or more unique file type specifiers describing file types to allow
- `capture`	What source to use for capturing image or video data
- `multiple` A Boolean which, if present, indicates that the user may choose more than one file. Default `true`. 
- `disableMultipart`. Ngx-uploader uses, by default, the content-type `multipart` when it sends a file. This boolean allows to change the content-type of the request by the type of the file when its value is `true`.
 
## Usage

### Directive ngxDragAndDrop

Ngx-upload offers one directive for your drop zone called `ngxDragAndDrop`. It allows to add the files in the upload queue. During the drop event, it throws an event called `onDrop` that you can catch :

```html
<form>

...

<div class="my-drop-zone" ngxDragAndDrop>
        Drop files here to upload
</div>


</form>
```

To finish, we can overwrite the `DropTargetOptions` for a specific case with this property binding :

```html
<div class="my-drop-zone" [ngxDragAndDrop]="options">
        Drop files here to upload
</div>
```


### Directive ngxInputFile

Ngx-upload offers one directive which allows the user to choose one or more files from their device storage.
This structural directive can be use like this :

```html
<form>

...

<div class="my-drop-zone" ngxDragAndDrop *ngxInputFile>
        Drop files here to upload
</div>


</form>
```

or like that with bootstrap:

```html
<form>

...

<span class="btn btn-outline-success btn-s" *ngxInputFile>Upload local files</span>

</form>
```


and with Material

```html
<form>

...

<button mat-raised-button [color]="'primary'" >
   <ng-template ngxInputFile> Upload local files</ng-template>
</button>
</form>
```

`*ngxInputFile` supports a configuration object of type `InputFileOptions`. For instance: 

```typescript
optionsInput: InputFileOptions = {
  multiple: true,
  accept: [MineTypeEnum.Image, MineTypeEnum.Application_Pdf]
};
```

There are 3 properties:
- `accept`	One or more unique file type specifiers describing file types to allow
- `capture`	What source to use for capturing image or video data
- `multiple` A Boolean which, if present, indicates that the user may choose more than one file. Default `true`.

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
        <button type="button" class="btn btn-outline-success btn-s" (click)="uploader.uploadAll({method: 'POST', url: 'my_url'})"
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
          <th></th>
          <th width="50%">Name</th>
          <th>Size</th>
          <th>Progress</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let itemFile of uploader.queue"
            [ngClass]="{'table-success' : itemFile.isSuccess, 'table-danger' : itemFile.isError, 'table-warning' : itemFile.isUploading  }">
          <td>
            <div [ngxThumbnail]="itemFile"></div>
          </td>
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
            <button type="button" class="btn btn-outline-success btn-sm" (click)="itemFile.upload({method: 'POST', url: 'my_url'})"
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


`upload` or `uploadAll` method require a parameter with the type `UploadEndPoint`. It's your server's endpoint.


Take a look at [those examples](https://github.com/wKoza/ngx-uploader-app) for more details :

## Hooks

Ngx-upload offers 7 `Observable` to handle a specific behavior :

- onCancel$<FileItem> : This Observable emits when upload is canceled.
- onError$<{ item: FileItem, body: any, status: number, headers: any }> : This Observable emits on error during the upload process.
- onSuccess$<{ item: FileItem, body: any, status: number, headers: any }> : This Observable emits on success.
- onBeforeUploadItem$<FileItem> : This Observable emits just before the upload process.
- onProgress$<{ item: FileItem, progress: number }> : This Observable emits during the upload process.
- onAddToQueue$<<FileItem>>: This Observable is trigged when a file is added in the queue.
- onDropError$<{ item?: File, errorAccept: boolean, errorMultiple: boolean }>: This Observable is trigged when a file is not accepted in the queue.


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
