import { NgModule } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SimpleMaterialComponent } from './simple.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxUploadModule } from '@wkoza/ngx-upload';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'material', pathMatch: 'full' },
  { path: 'material', component: SimpleMaterialComponent }
];

@NgModule({
  declarations: [SimpleMaterialComponent],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatCardModule,
    FormsModule,
    CommonModule,
    NgxUploadModule
  ],
  exports: [],
})
export class MaterialModule {
}
