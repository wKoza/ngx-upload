import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    Renderer2,
    Inject, Injector, Optional, PLATFORM_ID
} from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import {
    DropTargetOptions, NGX_DROP_TARGET_OPTIONS
} from '../utils/configuration.model';
import { NgxUploadLogger } from '../utils/logger.model';
import { HttpClientUploadService } from '../services/httpClientUpload.service';
import {isPlatformBrowser} from '@angular/common';


/**
 * Transforms a node into a drag and drop zone.
 */
@Directive({
    selector: '[ngxDragAndDrop]',
    exportAs: 'ngxDragAndDrop'
})
export class NgxDragAndDropDirective implements OnInit {

    private readonly formGroup: FormGroup | null;

    @Input()
    set ngxDragAndDrop(dropOptions: DropTargetOptions) {
        if (dropOptions) {
            this.logger.debug(JSON.stringify(dropOptions));
            this.dropOptions = dropOptions;
        }
    }

    constructor(private el: ElementRef,
                private renderer: Renderer2,
                private injector: Injector,
                private logger: NgxUploadLogger,
                public uploader: HttpClientUploadService,
                @Inject(NGX_DROP_TARGET_OPTIONS) private dropOptions: DropTargetOptions,
                @Optional() private ngForm: NgForm, @Optional() private formGroupDirective: FormGroupDirective,
                @Inject(PLATFORM_ID) platformId: Object) {
        if (this.ngForm) {
            this.formGroup = ngForm.form;
        } else if (this.formGroupDirective) {
            this.formGroup = formGroupDirective.form;
        } else {
            this.formGroup = null;
        }
        if (isPlatformBrowser(platformId)) {
            this.renderer.listen(el.nativeElement, 'dragleave', ($event) => this.onDragLeave($event));
            this.renderer.listen(el.nativeElement, 'drop', ($event) => this.dropEvent($event));
            this.renderer.listen(el.nativeElement, 'dragover', ($event) => this.onDragOver($event));
        }
    }

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.color);
    }

    onDragLeave(event: Event) {
        this.logger.debug('dragleave event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrag);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrop);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.color);
        this.stopAndPrevent(event);
    }

    dropEvent(event: Event) {
        this.logger.debug('drop event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.color);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrag);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.colorDrop);
        const transfer = this.getTransfer(event);
        if (!transfer) {
            return;
        }
        transfer.dropEffect = 'copy';
        this.stopAndPrevent(event);
        this.uploader.addToQueue(transfer.files, this.formGroup, this.dropOptions);
    }


    onDragOver(event: Event) {
        this.logger.debug('dragover event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.color);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrop);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.colorDrag);
        const transfer = this.getTransfer(event);
        if (!transfer || !this.haveFiles(transfer.types)) {
            return;
        }
        this.stopAndPrevent(event);
    }

    private stopAndPrevent(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }

    private getTransfer(event: DragEvent | any): DataTransfer {
        return event.dataTransfer ? event.dataTransfer : event?.originalEvent?.dataTransfer;
    }

    private haveFiles(types: any): boolean {
        if (!types) {
            return false;
        }
        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        } else if (types.contains) {
            return types.contains('Files');
        } else {
            return false;
        }
    }

}
