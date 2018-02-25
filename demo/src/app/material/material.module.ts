import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressBarModule } from '@angular/material';


@NgModule({
  imports: [BrowserAnimationsModule, MatButtonModule, MatInputModule, MatProgressBarModule, MatCardModule],
  exports: [BrowserAnimationsModule, MatButtonModule, MatInputModule, MatProgressBarModule, MatCardModule],
})
export class MaterialModule {
}
