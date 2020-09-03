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

            this._getOrientation(this.fileItem.file, (srcOrientation) => {

                const img = new Image();
                const reader = new FileReader();
                const canvas = document.createElement('canvas');

                reader.onload = (evt) => {


                     imgEl.onload = () => {
                        canvas.width = srcOrientation > 4 ? imgEl.height : imgEl.width;
                        canvas.height = srcOrientation > 4 ? imgEl.width : imgEl.height;
                        const ctx = canvas.getContext('2d')!;

                        // transform context before drawing image
                        switch (srcOrientation) {
                            case 2:
                                // horizontal flip
                                ctx.translate(imgEl.width, 0);
                                ctx.scale(-1, 1);
                                break;
                            case 3:
                                // 180° rotate left
                                ctx.translate(imgEl.width, imgEl.height);
                                ctx.rotate(Math.PI);
                                break;
                            case 4:
                                // vertical flip
                                ctx.translate(0, imgEl.height);
                                ctx.scale(1, -1);
                                break;
                            case 5:
                                // vertical flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.scale(1, -1);
                                break;
                            case 6:
                                // 90° rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(0, -imgEl.height);
                                break;
                            case 7:
                                // horizontal flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(imgEl.width, -imgEl.height);
                                ctx.scale(-1, 1);
                                break;
                            case 8:
                                // 90° rotate left
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(-imgEl.width, 0);
                                break;
                            default:
                                break;
                        }

                        // draw image
                        ctx.drawImage(imgEl, 0, 0);

                        this.renderer.setProperty(imgEl, 'src', canvas.toDataURL());
                    };

                    img.src = evt.target!.result as string;
                };
                reader.readAsDataURL(this.fileItem.file);

            });
        }
    }

    /*
    * getOrientation computes the real orientation of the image
    *
    */
    _getOrientation(file, callback) {
        const reader = new FileReader();
        reader.onload = (event) => {

            const view = new DataView(event.target!.result as ArrayBuffer);

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
