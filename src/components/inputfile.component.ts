import { AfterViewInit, Component, Injector, OnInit, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClientUploadService } from '../';
import { InputFileOptions } from '../utils/configuration.model';


@Component({
  selector: 'ngx-upload-inputfile',
  template: `
      <label class="input-file">
          <input type="file" #file (change)="onFilesAdded()">
          <ng-content></ng-content>
      </label>`,
  styles: ['input[type="file"] { display: none; } .input-file { width: 100%; }']
})
export class InputfileComponent implements AfterViewInit {

  @ViewChild('file', {static: true}) file;

  files: Set<File> = new Set();

  options: InputFileOptions;

  private formGroup: FormGroup | null;


  constructor(private injector: Injector, private uploader: HttpClientUploadService, private renderer: Renderer2,
              @Optional() private ngForm: NgForm, @Optional() private formGroupDirective: FormGroupDirective) {
    if (this.ngForm) {
      this.formGroup = ngForm.form;
    } else if (this.formGroupDirective) {
      this.formGroup = formGroupDirective.form;
    } else {
      this.formGroup = null;
    }
  }

  onFilesAdded() {
    this.uploader.addToQueue(this.file.nativeElement.files, this.formGroup);
    // Clear the previous input value
    this.file.nativeElement.value = '';
  }

  ngAfterViewInit() {
    if (this.options.multiple !== false) this.renderer.setProperty(this.file.nativeElement, 'multiple', 'multiple');
    if (this.options.accept) this.renderer.setProperty(this.file.nativeElement, 'accept', this.options.accept.join());
    if (this.options.capture) this.renderer.setProperty(this.file.nativeElement, 'capture', this.options.capture);
  }
}
