import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { FileItem } from '../services/fileItem.model';
/**
 * Transforms a node into a thumbnail zone.
 */
var NgxThumbnailDirective = /** @class */ (function () {
    function NgxThumbnailDirective(renderer, el) {
        this.renderer = renderer;
        this.el = el;
    }
    NgxThumbnailDirective.prototype.ngOnInit = function () {
        var _this = this;
        // must be used only with image file
        if (this.fileItem.file.type.indexOf('image/jpeg') !== 0 &&
            this.fileItem.file.type.indexOf('image/png') !== 0) {
            return;
        }
        else {
            var imgEl_1 = this.renderer.createElement('img');
            this.renderer.appendChild(this.el.nativeElement, imgEl_1);
            this.renderer.setStyle(imgEl_1, 'width', '100px');
            this._getOrientation(this.fileItem.file, function (srcOrientation) {
                var img = new Image();
                var reader = new FileReader();
                reader.onload = function (evt) {
                    img.onload = function () {
                        var width = img.width, height = img.height, canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
                        // set proper canvas dimensions before transform & export
                        if (4 < srcOrientation && srcOrientation < 9) {
                            canvas.width = height;
                            canvas.height = width;
                        }
                        else {
                            canvas.width = width;
                            canvas.height = height;
                        }
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
                        // draw image
                        ctx.drawImage(img, 0, 0);
                        _this.renderer.setProperty(imgEl_1, 'src', canvas.toDataURL());
                    };
                    img.src = evt.target['result'];
                };
                reader.readAsDataURL(_this.fileItem.file);
            });
        }
    };
    /*
    * getOrientation computes the real orientation of the image
    *
    */
    NgxThumbnailDirective.prototype._getOrientation = function (file, callback) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var view = new DataView(event.target['result']);
            if (view.getUint16(0, false) !== 0xFFD8)
                return callback(-2);
            var length = view.byteLength;
            var offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker === 0xFFE1) {
                    if (view.getUint32(offset += 2, false) !== 0x45786966) {
                        return callback(-1);
                    }
                    var little = view.getUint16(offset += 6, false) === 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) === 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                }
                else if ((marker & 0xFF00) !== 0xFF00)
                    break;
                else
                    offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    };
    ;
    NgxThumbnailDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngxThumbnail]',
                    exportAs: 'ngxThumbnail'
                },] },
    ];
    /** @nocollapse */
    NgxThumbnailDirective.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: ElementRef }
    ]; };
    NgxThumbnailDirective.propDecorators = {
        fileItem: [{ type: Input, args: ['ngxThumbnail',] }]
    };
    return NgxThumbnailDirective;
}());
export { NgxThumbnailDirective };
//# sourceMappingURL=thumbnail.directive.js.map