import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import {
    DropTargetOptions, HttpClientUploadService, LoggerOptions, NgxUploadModule, UploadOptions,
    XhrUploadService
} from '@wkoza/ngx-upload';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleBootstrapComponent } from './bootstrap/simple.component';
import { SimpleMaterialComponent } from './material/simple.component';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import {
    MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule,
    MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
    {path: '', redirectTo: 'simple-bootstrap', pathMatch: 'full'},
    {path: 'simple-bootstrap', component: SimpleBootstrapComponent},
    {path: 'simple-material', component: SimpleMaterialComponent}
];

const uploadOptions: UploadOptions = {
    method: 'POST',
    url: 'ngx_upload_mock', // 'http://localhost:8090/upload'
    httpStrategy: HttpClientUploadService
};

export const ngxDropTargetOptions: DropTargetOptions = {
    color: 'dropZoneColor',
    colorDrag: 'dropZoneColorDrag',
    colorDrop: 'dropZoneColorDrop'
};

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
        RouterModule.forRoot(routes, {useHash: true}),
        NgxUploadModule.forRoot(uploadOptions, ngxDropTargetOptions),
        NgbModule.forRoot(),
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        MatProgressBarModule,
        MatInputModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
