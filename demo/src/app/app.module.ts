import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {Routes, RouterModule} from '@angular/router';
import {NgxUploadModule, UploadOptions} from '@wkoza/ngx-upload';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SimpleBootstrapComponent} from './bootstrap/simple.component';
import {SimpleMaterialComponent} from './material/simple.component';
import {MaterialModule} from './material/material.module';

const routes: Routes = [
  {path: '', redirectTo: 'simple-bootstrap', pathMatch: 'full'},
  {path: 'simple-bootstrap', component: SimpleBootstrapComponent},
  {path: 'simple-material', component: SimpleMaterialComponent}
];

const uploadOptions: UploadOptions = {
  method : 'POST',
  url: 'ngx_upload_mock'
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
    HttpModule,
    RouterModule.forRoot(routes, {useHash: true}),
    NgxUploadModule.forRoot(null, uploadOptions),
    NgbModule.forRoot(),
    MaterialModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
