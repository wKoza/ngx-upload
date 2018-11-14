import { Component, Injector, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClientUploadService } from '../';


@Component({
    selector: 'ngx-upload-inputfile',
    template:  `
        <label class="input-file">
           <input type="file" #file (change)="onFilesAdded()" multiple >
           <ng-content></ng-content>
        </label>`,
    styles: ['input[type="file"] { display: none; } .input-file { width: 100%; }']
})
export class InputfileComponent {

    @ViewChild('file') file;
    public files: Set<File> = new Set();

    private formGroup: FormGroup | null;



    constructor(private injector: Injector, public uploader: HttpClientUploadService,
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
    }
}
