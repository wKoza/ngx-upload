import { Injector, OnInit, Renderer2 } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClientUploadService } from '../';
import { InputFileOptions } from '../utils/configuration.model';
export declare class InputfileComponent implements OnInit {
    private injector;
    private uploader;
    private renderer;
    private ngForm;
    private formGroupDirective;
    file: any;
    files: Set<File>;
    options: InputFileOptions;
    private formGroup;
    constructor(injector: Injector, uploader: HttpClientUploadService, renderer: Renderer2, ngForm: NgForm, formGroupDirective: FormGroupDirective);
    onFilesAdded(): void;
    ngOnInit(): void;
}
