import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {Routes, RouterModule} from '@angular/router';
import {
  DropTargetOptions, HttpClientUploadService, LoggerOptions, NgxUploadModule, UploadOptions,
  XhrUploadService
} from '@wkoza/ngx-upload';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SimpleBootstrapComponent} from './bootstrap/simple.component';
import {SimpleMaterialComponent} from './material/simple.component';
import {MaterialModule} from './material/material.module';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {path: '', redirectTo: 'simple-bootstrap', pathMatch: 'full'},
  {path: 'simple-bootstrap', component: SimpleBootstrapComponent},
  {path: 'simple-material', component: SimpleMaterialComponent}
];

const uploadOptions: UploadOptions = {
  method : 'POST',
  url: 'ngx_upload_mock', // 'http://localhost:8090/upload'
  httpStrategy: HttpClientUploadService
};

export const ngxDropTargetOptions: DropTargetOptions = {
  color: 'dropZoneColor',
  colorDrag: 'dropZoneColorDrag',
  colorDrop: 'dropZoneColorDrop'
};

export const loggerOptions: LoggerOptions = {
  enabled: true,
  debug: true
}

@NgModule({
  declarations: [
    AppComponent,
    SimpleBootstrapComponent,
    SimpleMaterialComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
      HttpClientModule,
  //  HttpModule,
    RouterModule.forRoot(routes, {useHash: true}),
    NgxUploadModule.forRoot(uploadOptions, ngxDropTargetOptions, loggerOptions),
    NgbModule.forRoot(),
    MaterialModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
