import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';


@NgModule({
  imports: [BrowserAnimationsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatCardModule],
  exports: [BrowserAnimationsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatCardModule],
})
export class MaterialModule {
}
