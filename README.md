# Ngx-upload

## About

Ngx-upload is a module for the Angular framework. Ngx-upload supports drag and drop, upload progress and manages a file upload queue.

## Demo
https://wkoza.github.io/ngx-upload/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

## About

Upload module for Angular
## Installation

Install through npm:
```
npm install --save @wkoza/ngx-upload
```

Then include in your apps module:

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgxUploadModule} from '@wKoza/ngx-upload';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgxUploadModule.forRoot()
  ]
})
export class MyModule {}
```

Finally use in one of your apps components:
```typescript
import { Component } from '@angular/core';

@Component({
  template: `
  <div style="margin-left: 15px; margin-right: 15px; margin-top: 60px">
  <h1>Simple upload example with Bootstrap</h1>
  <hr>

  <form #myForm="ngForm">
  <div class="form-group row">
    <label class="col-2 col-form-label">Name</label>
    <div class="col-10">
      <input class="form-control" type="text" [(ngModel)]="model.name" name="name">
    </div>
  </div>
  <div class="form-group row">
    <label class="col-2 col-form-label">Email</label>
    <div class="col-10">
      <input class="form-control" type="email" [(ngModel)]="model.email" name="email">
    </div>
  </div>
  </form>

  <div class="form-group row">
    <div class="col-md-3">
      <h3>Add files</h3>
      <div>
        <div class="well my-drop-zone" ngxDragAndDrop (onDrop)="onDrop($event)" [formBinded]="myForm">
          Drop files here to upload
        </div>
      </div>
    </div>

    <div class="col-md-9" style="margin-bottom: 40px">
      <h3>Upload queue <span *ngIf="uploader.queue.length>0"> - {{ uploader.queue.length }} item(s)</span></h3>

      <div class="card text-right">
        <div style="margin: 15px">
          <ngb-progressbar showValue="true" type="success" [striped]="true" [animated]="true"
                           [value]="uploader.progress"></ngb-progressbar>
        </div>
        <div class="card-block">
          <button type="button" class="btn btn-outline-success btn-s" (click)="uploader.uploadAll()"
                  [disabled]="!uploader.getNotUploadedItems().length">
            Upload all
          </button>
          <button type="button" class="btn btn-outline-warning btn-s" (click)="uploader.cancelAll()"
                  [disabled]="!uploader.isUploading || !uploader.queue.length">
             Cancel all
          </button>
          <button type="button" class="btn btn-outline-danger btn-s" (click)="uploader.removeAllFromQueue()"
                  [disabled]="!uploader.getNotUploadedItems().length">
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
                <ngb-progressbar type="success" showValue="true" [striped]="true" [animated]="true"
                                 [value]="itemFile.progress"></ngb-progressbar>
              </div>
            </td>
            <td style="text-align: center">
              <button type="button" class="btn btn-outline-success btn-sm" (click)="itemFile.upload()"
                      [disabled]="itemFile.isReady || itemFile.isUploading || itemFile.isSuccess">
                 Upload
              </button>
              <button type="button" class="btn btn-outline-warning btn-sm" (click)="itemFile.cancel()"
                      [disabled]="!itemFile.isUploading">
               Cancel
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" (click)="itemFile.remove()"
                      [disabled]="itemFile.isUploaded">
                Remove
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
  </div>

  `
})
export class MyComponent {}
```


You may also find it useful to view the [demo source](https://github.com/wKoza/ngx-upload-demo/tree/master/src/app).

### Usage without a module bundler
```
<script src="node_modules/@wKoza/ngx-upload/bundles/ngx-upload.umd.js"></script>
<script>
    // everything is exported ngx-upload namespace
</script>
```

## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://ngx-upload.github.io/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## License

MIT
