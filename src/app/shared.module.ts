import { NgModule } from '@angular/core';

import { NgxUploadModule } from '@wkoza/ngx-upload';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LogsMaterialInterceptor } from './logs-material.interceptor';

@NgModule({
  imports: [
    NgxUploadModule,
    HttpClientModule,
  ],
  exports: [
    NgxUploadModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LogsMaterialInterceptor, multi: true },
  ]
})
export class SharedModule {
}
