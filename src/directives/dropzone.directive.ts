import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';
import {UploadService} from '../services/upload.service';
import {NgForm} from '@angular/forms';
import {DropTargetOptions} from '../utils/configuration.model';
import {NgxUploadLogger} from '../utils/logger.model';


/**
 * Transforms a node into a drag and drop zone.
 */
@Directive({
    selector: '[ngxDragAndDrop]',
    exportAs: 'ngxDragAndDrop'
})
export class NgxDragAndDropDirective implements OnInit {

    options: DropTargetOptions;

    @Input()
    set ngxDragAndDrop(options: DropTargetOptions) {
        if (options) {
            this.logger.debug(JSON.stringify(options));
            this.options = options;
        }
    }

    @Input() formBinded: NgForm;

    @Output() onDrop = new EventEmitter();

    ngOnInit(): void {
        this.options = {
            color: 'rgba(0,0,0,0.12)',
            colorDrag: 'grey',
            colorDrop: 'rgba(0,0,0,0.12)'
        };

        this.renderer.setStyle(this.el.nativeElement, 'background-color', this.options.color);

    }

    constructor(private el: ElementRef, private renderer: Renderer2, private uploader: UploadService, private logger: NgxUploadLogger) {

    }


    @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
        this.logger.info('dragleave event');
        this.renderer.setStyle(this.el.nativeElement, 'background-color', this.options.color);
        this.preventAndStop(event);
    }

    @HostListener('drop', ['$event']) dropEvent(event: DragEvent) {

        this.logger.info('drop event');

        this.renderer.setStyle(this.el.nativeElement, 'background-color', this.options.colorDrop);

        const transfer = this.getTransfer(event);

        if (!this.isFile(this.getTransfer(event).types)) {
            console.log('It is not a file');
            return;
        }


        const droppedFiles = transfer.files;

        transfer.dropEffect = 'copy';

        this.onDrop.next(droppedFiles);
        this.preventAndStop(event);

        this.uploader.addToQueue(transfer.files, this.formBinded.form);


    }


    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
        this.logger.info('dragover event');
        this.renderer.setStyle(this.el.nativeElement, 'background-color', this.options.colorDrag);
        this.preventAndStop(event);

    }

    private preventAndStop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    private  getTransfer(event): DataTransfer {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }

    private isFile(types: string[]) {

        if (!types) {
            return false;
        }

        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        } else {
            return false;
        }


    }

}
