import { NgModule } from '@angular/core';
import { SimpleBootstrapComponent } from './simple.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxUploadModule } from '@wkoza/ngx-upload';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'bootstrap', pathMatch: 'full' },
  { path: 'bootstrap', component: SimpleBootstrapComponent }
];

@NgModule({
  declarations: [SimpleBootstrapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    NgxUploadModule
  ]
})
export class BootstrapModule { }
