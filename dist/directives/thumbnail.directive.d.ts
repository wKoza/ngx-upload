import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FileItem } from '../services/fileItem.model';
/**
 * Transforms a node into a thumbnail zone.
 */
export declare class NgxThumbnailDirective implements OnInit {
    private renderer;
    private el;
    fileItem: FileItem;
    constructor(renderer: Renderer2, el: ElementRef);
    ngOnInit(): void;
    _getOrientation(file: any, callback: any): void;
}
