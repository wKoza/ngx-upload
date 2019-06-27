import { Directive, ElementRef, HostListener, Input, Renderer2, Inject, Injector, Optional } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { NGX_DROP_TARGET_OPTIONS, NGX_UPLOAD_STRATEGY } from '../utils/configuration.model';
import { NgxUploadLogger } from '../utils/logger.model';
/**
 * Transforms a node into a drag and drop zone.
 */
var NgxDragAndDropDirective = /** @class */ (function () {
    function NgxDragAndDropDirective(el, renderer, injector, logger, dropOptions, strategy, ngForm, formGroupDirective) {
        this.el = el;
        this.renderer = renderer;
        this.injector = injector;
        this.logger = logger;
        this.dropOptions = dropOptions;
        this.strategy = strategy;
        this.ngForm = ngForm;
        this.formGroupDirective = formGroupDirective;
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
    Object.defineProperty(NgxDragAndDropDirective.prototype, "ngxDragAndDrop", {
        set: function (dropOptions) {
            if (dropOptions) {
                this.logger.debug(JSON.stringify(dropOptions));
                this.dropOptions = dropOptions;
            }
        },
        enumerable: true,
        configurable: true
    });
    NgxDragAndDropDirective.prototype.ngOnInit = function () {
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.color);
        this.logger.info('strategy : ' + this.strategy.toString());
        this.uploader = this.injector.get(this.strategy);
    };
    NgxDragAndDropDirective.prototype.onDragLeave = function (event) {
        this.logger.debug('dragleave event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrag);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrop);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.color);
        this.stopAndPrevent(event);
    };
    NgxDragAndDropDirective.prototype.dropEvent = function (event) {
        this.logger.debug('drop event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.color);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrag);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.colorDrop);
        var transfer = this.getTransfer(event);
        if (!transfer) {
            return;
        }
        transfer.dropEffect = 'copy';
        this.stopAndPrevent(event);
        this.uploader.addToQueue(transfer.files, this.formGroup, this.dropOptions);
    };
    NgxDragAndDropDirective.prototype.onDragOver = function (event) {
        this.logger.debug('dragover event');
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.color);
        this.renderer.removeClass(this.el.nativeElement, this.dropOptions.colorDrop);
        this.renderer.addClass(this.el.nativeElement, this.dropOptions.colorDrag);
        var transfer = this.getTransfer(event);
        if (!this.haveFiles(transfer.types)) {
            return;
        }
        this.stopAndPrevent(event);
    };
    NgxDragAndDropDirective.prototype.stopAndPrevent = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };
    NgxDragAndDropDirective.prototype.getTransfer = function (event) {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    };
    NgxDragAndDropDirective.prototype.haveFiles = function (types) {
        if (!types) {
            return false;
        }
        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        }
        else if (types.contains) {
            return types.contains('Files');
        }
        else {
            return false;
        }
    };
    NgxDragAndDropDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngxDragAndDrop]',
                    exportAs: 'ngxDragAndDrop'
                },] },
    ];
    /** @nocollapse */
    NgxDragAndDropDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: Injector },
        { type: NgxUploadLogger },
        { type: undefined, decorators: [{ type: Inject, args: [NGX_DROP_TARGET_OPTIONS,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [NGX_UPLOAD_STRATEGY,] }] },
        { type: NgForm, decorators: [{ type: Optional }] },
        { type: FormGroupDirective, decorators: [{ type: Optional }] }
    ]; };
    NgxDragAndDropDirective.propDecorators = {
        ngxDragAndDrop: [{ type: Input }],
        onDragLeave: [{ type: HostListener, args: ['dragleave', ['$event'],] }],
        dropEvent: [{ type: HostListener, args: ['drop', ['$event'],] }],
        onDragOver: [{ type: HostListener, args: ['dragover', ['$event'],] }]
    };
    return NgxDragAndDropDirective;
}());
export { NgxDragAndDropDirective };
//# sourceMappingURL=dropzone.directive.js.map