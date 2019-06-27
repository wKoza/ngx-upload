import { Component, Injector, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClientUploadService } from '../';
var InputfileComponent = /** @class */ (function () {
    function InputfileComponent(injector, uploader, renderer, ngForm, formGroupDirective) {
        this.injector = injector;
        this.uploader = uploader;
        this.renderer = renderer;
        this.ngForm = ngForm;
        this.formGroupDirective = formGroupDirective;
        this.files = new Set();
        if (this.ngForm) {
            this.formGroup = ngForm.form;
        }
        else if (this.formGroupDirective) {
            this.formGroup = formGroupDirective.form;
        }
        else {
            this.formGroup = null;
        }
    }
    InputfileComponent.prototype.onFilesAdded = function () {
        this.uploader.addToQueue(this.file.nativeElement.files, this.formGroup);
        // Clear the previous input value
        this.file.nativeElement.value = '';
    };
    InputfileComponent.prototype.ngOnInit = function () {
        if (this.options.multiple !== false)
            this.renderer.setProperty(this.file.nativeElement, 'multiple', 'multiple');
        if (this.options.accept)
            this.renderer.setProperty(this.file.nativeElement, 'accept', this.options.accept.join());
        if (this.options.capture)
            this.renderer.setProperty(this.file.nativeElement, 'capture', this.options.capture);
    };
    InputfileComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-upload-inputfile',
                    template: "\n      <label class=\"input-file\">\n          <input type=\"file\" #file (change)=\"onFilesAdded()\">\n          <ng-content></ng-content>\n      </label>",
                    styles: ['input[type="file"] { display: none; } .input-file { width: 100%; }']
                },] },
    ];
    /** @nocollapse */
    InputfileComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClientUploadService },
        { type: Renderer2 },
        { type: NgForm, decorators: [{ type: Optional }] },
        { type: FormGroupDirective, decorators: [{ type: Optional }] }
    ]; };
    InputfileComponent.propDecorators = {
        file: [{ type: ViewChild, args: ['file',] }]
    };
    return InputfileComponent;
}());
export { InputfileComponent };
//# sourceMappingURL=inputfile.component.js.map