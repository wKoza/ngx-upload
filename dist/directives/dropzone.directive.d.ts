import { ElementRef, OnInit, Renderer2, Injector } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { DropTargetOptions, UploadService } from '../utils/configuration.model';
import { NgxUploadLogger } from '../utils/logger.model';
import { AbstractUploadService } from '../services/abstractUpload.service';
/**
 * Transforms a node into a drag and drop zone.
 */
export declare class NgxDragAndDropDirective implements OnInit {
    private el;
    private renderer;
    private injector;
    private logger;
    private dropOptions;
    private strategy;
    private ngForm;
    private formGroupDirective;
    uploader: AbstractUploadService;
    ngxDragAndDrop: DropTargetOptions;
    private formGroup;
    constructor(el: ElementRef, renderer: Renderer2, injector: Injector, logger: NgxUploadLogger, dropOptions: DropTargetOptions, strategy: UploadService, ngForm: NgForm, formGroupDirective: FormGroupDirective);
    ngOnInit(): void;
    onDragLeave(event: DragEvent): void;
    dropEvent(event: Event): void;
    onDragOver(event: DragEvent): void;
    private stopAndPrevent;
    private getTransfer;
    private haveFiles;
}
