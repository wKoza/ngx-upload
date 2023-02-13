import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    DropTargetOptions, NgxUploadModule
} from '@wkoza/ngx-upload';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
    {path: '', redirectTo: 'simple-material', pathMatch: 'full'},
    {path: 'simple-bootstrap', loadChildren: () => import('./bootstrap/bootstrap.module').then(mod => mod.BootstrapModule)},
    {path: 'simple-material', loadChildren: () => import('./material/material.module').then(mod => mod.MaterialModule)}
];

export const ngxDropTargetOptions: DropTargetOptions = {
    color: 'dropZoneColor',
    colorDrag: 'dropZoneColorDrag',
    colorDrop: 'dropZoneColorDrop'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(routes),
      NgxUploadModule.forRoot(ngxDropTargetOptions)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
