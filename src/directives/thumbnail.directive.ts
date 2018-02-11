import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FileItem } from '../services/fileItem.model';

/**
 * Transforms a node into a thumbnail zone.
 */
@Directive({
    selector: '[ngxThumbnail]',
    exportAs: 'ngxThumbnail'
})
export class NgxThumbnailDirective implements OnInit {

    @Input('ngxThumbnail') fileItem: FileItem;

    constructor(private renderer: Renderer2, private el: ElementRef) {
    }

    ngOnInit() {
        const reader = new FileReader();

        reader.onload = (e: any) => {
            // get loaded data and render thumbnail.
            const imgEl = this.renderer.createElement('img');
            this.renderer.appendChild(this.el.nativeElement, imgEl);
            this.renderer.setProperty(imgEl, 'src', e.target.result);
            this.renderer.setStyle(imgEl, 'width', '100px');
        };
        // read the image file as a data URL.
        reader.readAsDataURL(this.fileItem.file);
    }
}
