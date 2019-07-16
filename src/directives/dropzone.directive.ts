import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    Renderer2,
    Inject, Injector, Optional
} from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import {
    DropTargetOptions, NGX_DROP_TARGET_OPTIONS, NGX_UPLOAD_STRATEGY, UploadService
} from '../utils/configuration.model';
import { NgxUploadLogger } from '../utils/logger.model';
import { AbstractUploadService } from '../services/abstractUpload.service';


/**
 * Transforms a node into a drag and drop zone.
 */
@Directive({
    selector: '[ngxDragAndDrop]',
    exportAs: 'ngxDragAndDrop'
})
export class NgxDragAndDropDirective implements OnInit {

    uploader: AbstractUploadService;

    @Input()
    set ngxDragAndDrop(dropOptions: DropTargetOptions) {
        if (dropOptions) {
            this.logger.debug(JSON.stringify(dropOptions));
            this.dropOptions = dropOptions;
        }
    }

    private formGroup: FormGroup | null;

    constructor(private el: ElementRef,
                private renderer: Renderer2,
                private injector: Injector,
                private logger: NgxUploadLogger,
                @Inject(NGX_DROP_TARGET_OPTIONS) private dropOptions: DropTargetOptions,
                @Inject(NGX_UPLOAD_STRATEGY) private strategy: UploadService,
                @Optional() private ngForm: NgForm, @Optional() private formGroupDirective: FormGroupDirective) {

        if (this.ngForm) {
            this.formGroup = ngForm.form;
        } else if (this.formGroupDirective) {
            this.formGroup = formGroupDirective.form;
        } else {
            this.formGroup = null;
        }
    }

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.color);
        this.logger.info('strategy : ' + this.strategy!.toString());
        this.uploader = this.injector.get(this.strategy);
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
        this.logger.debug('dragleave event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrag);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrop);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.color);
        this.stopAndPrevent(event);
    }

    @HostListener('drop', ['$event']) dropEvent(event: Event) {
        this.logger.debug('drop event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.color);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrag);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.colorDrop);
        const transfer = this.getTransfer(event);
        if (!transfer) {
            return;
        }
        if (this.dropOptions.folderAccept == true)
        {
            this.getFilesWebkitDataTransferItems(transfer.items).then(
                (data : File[])=>{
                    this.uploader.addToQueue(data, this.formGroup, this.dropOptions);
                }
            )
        }
        else
        {
            var files = transfer.files;
            var filelist: File[] = [];
            for(var i = 0;i < files.length;i++)
            {
                filelist.push(files.item(i));
            }
            this.uploader.addToQueue(filelist, this.formGroup, this.dropOptions);
        }
        transfer.dropEffect = 'copy';
        this.stopAndPrevent(event);
    }


    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
        this.logger.debug('dragover event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.color);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrop);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.colorDrag);
        const transfer = this.getTransfer(event);
        if (!this.haveFiles(transfer.types)) {
            return;
        }
        this.stopAndPrevent(event);
    }

    private stopAndPrevent(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }

    private getTransfer(event): DataTransfer {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
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




    private getFilesWebkitDataTransferItems(dataTransferItems) {
        function traverseFileTreePromise(item, path='') {
          return new Promise(
              resolve => {
                if (item.isFile) {
                    item.file(
                        file => {
                            file.filePath = path + file.name; //save full path
                            files.push(file);
                            resolve(file);
                        }
                    );
                } else if (item.isDirectory) {
                    let dirReader = item.createReader();
                    dirReader.readEntries(entries => {
                        let entriesPromises = [];
                        entries.forEach(element => {
                            entriesPromises.push(traverseFileTreePromise(element, path + item.name + "/"))
                        });
                        resolve(Promise.all(entriesPromises))
                    })
                }
            })
        }
      
        let files = [];
        return new Promise((resolve) => {
            let entriesPromises = [];
            
             for (let it of dataTransferItems)
                entriesPromises.push(traverseFileTreePromise(it.webkitGetAsEntry()));

            Promise.all(entriesPromises).then(entries => {
              resolve(files)
            });
        });
      }



}
