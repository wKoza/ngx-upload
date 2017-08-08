import {NgModule} from '@angular/core';
import {MdButtonModule, MdCardModule, MdInputModule, MdProgressBarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  imports: [BrowserAnimationsModule, MdButtonModule, MdInputModule, MdProgressBarModule, MdCardModule],
  exports: [BrowserAnimationsModule, MdButtonModule, MdInputModule, MdProgressBarModule, MdCardModule],
})
export class MaterialModule {
}
