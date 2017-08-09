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

Just include ngx-upload in your module with `FormsModule` or `ReactiveFormsModule`:

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
  url: 'your_backend_upload_url'
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // or ReactiveFormsModule
    NgxUploadModule.forRoot(uploadOptions)
  ]
})
export class AppModule {}
```

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
  url: 'your_backend_upload_url'
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
<div class="my-drop-zone" ngxDragAndDrop (onDrop)="onDrop($event)" [formBinded]="myForm">
        Drop files here to upload
</div>
```

To finish, we can overwrite the `DropTargetOptions` for a specific case due to property binding :

```html
<div class="my-drop-zone" [ngxDragAndDrop]="options" (onDrop)="onDrop($event)" [formBinded]="myForm">
        Drop files here to upload
</div>
```

### Upload queue

Each file is added to a queue that you can manage with `uploader` service. Take a look at [those examples](https://github.com/wKoza/ngx-upload/tree/master/demo/src/app) for more details :




## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://ngx-upload.github.io/docs/

## License

MIT
