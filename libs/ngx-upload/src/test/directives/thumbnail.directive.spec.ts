import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { MockLogger } from '../mocks/logger.model.mock';
import { imageBase64 } from '../utils/image';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxUploadLogger } from '../../lib/utils/logger.model';
import { FileItem, HttpClientUploadService, NgxThumbnailDirective } from '@wkoza/ngx-upload';


// convert image to base64 encoded string

function createFile(base64: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'postit.jpg', {type: mime});
}

@Component({
    template: `<div [ngxThumbnail]="itemFile"></div>`
})
class TestComponent {

    constructor(private httpClient: HttpClient, private logger: NgxUploadLogger) { }

    itemFile = new FileItem(createFile(imageBase64), new HttpClientUploadService(this.logger, this.httpClient), this.logger, false);
}

describe('ngxThumbnailDirective', () => {

    let fixture: ComponentFixture<TestComponent>;
    let des;
    let thumbnail: NgxThumbnailDirective;
    let originalTimeout: number;

    beforeEach(() => {

        fixture = TestBed.configureTestingModule({
            imports: [ BrowserModule, CommonModule, HttpClientTestingModule],
            declarations: [ NgxThumbnailDirective, TestComponent ],
            providers: [ {provide: NgxUploadLogger, useClass: MockLogger} ]
        }).createComponent(TestComponent);

        des = fixture.debugElement.queryAll(By.directive(NgxThumbnailDirective));
        thumbnail = des[0].injector.get(NgxThumbnailDirective);
        jest.spyOn(thumbnail, '_getOrientation');

        originalTimeout = 3000;

        jest.setTimeout(5000);

    });

    afterEach(function() {
        jest.setTimeout(originalTimeout);
    });

    it("NgxThumbnailDirective should have a valid fileItem", function(done) {
        fixture.detectChanges(); // initial binding
        const orientation = thumbnail._getOrientation(thumbnail.fileItem.file,(orientation: number) => {
            expect(orientation).toEqual(6);
            done();
        });

    });

    it("NgxThumbnailDirective should have a file named postit.jpg", function() {
        fixture.detectChanges(); // initial binding
        expect(thumbnail.fileItem.file.name).toEqual('postit.jpg');
    });

    it("tracks that getOrientation was called", function() {
        fixture.detectChanges(); // initial binding
        expect(thumbnail._getOrientation).toHaveBeenCalled();
    });

    it("create an img element", function() {
        fixture.detectChanges(); // initial binding
        const img = fixture.debugElement.query(By.css('img'));
        expect(img.styles['width']).toEqual('100%');
        expect(img.styles['height']).toEqual('100%');
        expect(img).toBeDefined();
    });

    it("create an img element with a good orientation", (done) => {
        fixture.detectChanges(); // initial binding
        const img = fixture.debugElement.query(By.css('img'));
        setTimeout(() => {
            expect(img.nativeElement.src).toBeDefined();
            done();
        }, 4000);
    });

});
