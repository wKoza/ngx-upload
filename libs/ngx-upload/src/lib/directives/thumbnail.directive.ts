import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FileItem } from '../services/fileItem.model';

/**
 * Transforms a node into a thumbnail zone.
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ngxThumbnail]',
    exportAs: 'ngxThumbnail'
})
export class NgxThumbnailDirective implements OnInit {

    @Input('ngxThumbnail') fileItem!: FileItem;

    constructor(private renderer: Renderer2, private el: ElementRef) { }

    ngOnInit() {
        // must be used only with image file
        if (this.fileItem.file.type.indexOf('image/jpeg') !== 0 &&
            this.fileItem.file.type.indexOf('image/png') !== 0) {
            return
        } else {

            const imgEl = this.renderer.createElement('img');
            this.renderer.appendChild(this.el.nativeElement, imgEl);
            this.renderer.setStyle(imgEl, 'width', '100%');
            this.renderer.setStyle(imgEl, 'height', '100%');

            this._getOrientation(this.fileItem.file, (srcOrientation: number) => {

                const img = new Image();
                const reader = new FileReader();

                reader.onload = (evt) => {

                    img.onload = () => {
                        const width = img.width,
                            height = img.height,
                            canvas = document.createElement('canvas'),
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            ctx = canvas.getContext('2d')!;

                        canvas.width = width;
                        canvas.height = height;

                        // draw image
                        ctx.drawImage(img, 0, 0);

                        // transform context before drawing image
                        switch (srcOrientation) {
                            case 2:
                                ctx.transform(-1, 0, 0, 1, width, 0);
                                break;
                            case 3:
                                ctx.transform(-1, 0, 0, -1, width, height);
                                break;
                            case 4:
                                ctx.transform(1, 0, 0, -1, 0, height);
                                break;
                            case 5:
                                ctx.transform(0, 1, 1, 0, 0, 0);
                                break;
                            case 6:
                                ctx.transform(0, 1, -1, 0, height, 0);
                                break;
                            case 7:
                                ctx.transform(0, -1, -1, 0, height, width);
                                break;
                            case 8:
                                ctx.transform(0, -1, 1, 0, 0, width);
                                break;
                            default:
                                break;
                        }
                        this.renderer.setProperty(imgEl, 'src', canvas.toDataURL());
                    };

                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    img.src = (evt.target! as any).result as string;
                };
                reader.readAsDataURL(this.fileItem.file);

            });
        }
    }

    /*
    * getOrientation computes the real orientation of the image
    *
    */
    // eslint-disable-next-line @typescript-eslint/ban-types
    _getOrientation(file: File, callback: Function) {
        const reader = new FileReader();
        reader.onload = (event) => {

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const view = new DataView((event.target! as any).result as ArrayBuffer);

            if (view.getUint16(0, false) !== 0xFFD8) return callback(-2);

            const length = view.byteLength;
            let offset = 2;

            while (offset < length) {
                const marker = view.getUint16(offset, false);
                offset += 2;

                if (marker === 0xFFE1) {
                    if (view.getUint32(offset += 2, false) !== 0x45786966) {
                        return callback(-1);
                    }
                    const little = view.getUint16(offset += 6, false) === 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    const tags = view.getUint16(offset, little);
                    offset += 2;

                    for (let i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) === 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                } else if ((marker & 0xFF00) !== 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    };
}
