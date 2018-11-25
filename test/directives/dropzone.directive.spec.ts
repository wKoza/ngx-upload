import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxDragAndDropDirective } from '../../src/directives/dropzone.directive';
import { TestComponent } from './test.component';
import {
    DropTargetOptions, NGX_DROP_TARGET_OPTIONS,
    NGX_UPLOAD_STRATEGY
} from '../../src/utils/configuration.model';
import { NgxUploadLogger, NoOpLogger } from '../../src/utils/logger.model';
import { MockLogger } from '../mocks/logger.model.mock';
import { HttpClientUploadService } from '../../src/services/httpClientUpload.service';
import { HttpClientUploadServiceMock } from '../mocks/httpClientUpload.service.mock';
import { UploadEndPoint } from '../../src';


export function _loggerFactory(): NgxUploadLogger {
      return new NoOpLogger();
}

describe('NgxDragAndDropDirective', () => {

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {

        const ngxDropTargetOptions: DropTargetOptions = {
            color: 'dropZoneColor',
            colorDrag: 'dropZoneColorDrag',
            colorDrop: 'dropZoneColorDrop'
        };

        const endpoint: UploadEndPoint = {
            method : 'POST',
            url: 'ngx_upload_mock' // 'http://localhost:8090/upload'
        };

        fixture = TestBed.configureTestingModule({
            declarations: [
                NgxDragAndDropDirective, TestComponent
            ],
            imports: [
                BrowserModule,
                CommonModule
            ],
           providers: [
               {
                   provide: NGX_DROP_TARGET_OPTIONS,
                   useValue: ngxDropTargetOptions
               },
               {provide: NGX_UPLOAD_STRATEGY, useValue: HttpClientUploadService},
               {provide: NgxUploadLogger, useClass: MockLogger},
               {provide: HttpClientUploadService, useExisting: HttpClientUploadServiceMock},
               HttpClientUploadServiceMock
           ]
        }).createComponent(TestComponent);

         fixture.detectChanges(); // initial binding
    });


    it('should have dropZoneColor class on init', () => {
        const de = fixture.debugElement.query(By.directive(NgxDragAndDropDirective));
        const cssClass = de.nativeElement.className;
        expect(cssClass).toBe('dropZoneColor');
    });

   it('should change css class on dragover event', () => {
        const de = fixture.debugElement.query(By.directive(NgxDragAndDropDirective));
        const cssClass = de.nativeElement.className;
        expect(cssClass).toBe('dropZoneColor');

        de.triggerEventHandler('dragover', new DragEvent('dragover', { dataTransfer: new DataTransfer() }));
        const cssClassDragover = de.nativeElement.className;
        expect(cssClassDragover).toBe('dropZoneColorDrag');

    });

    it('should change css class on dragleave event', () => {
        const de = fixture.debugElement.query(By.directive(NgxDragAndDropDirective));
        const cssClass = de.nativeElement.className;
        expect(cssClass).toBe('dropZoneColor');

        de.triggerEventHandler('dragover', new DragEvent('dragover', { dataTransfer: new DataTransfer() }));
        const cssClassDragover = de.nativeElement.className;
        expect(cssClassDragover).toBe('dropZoneColorDrag');

        de.triggerEventHandler('dragleave', new DragEvent('dragover', { dataTransfer: new DataTransfer() }));
        const cssClassDragleave = de.nativeElement.className;
        expect(cssClassDragleave).toBe('dropZoneColor');
    });

    it('should change css class on drop event', () => {
        const de = fixture.debugElement.query(By.directive(NgxDragAndDropDirective));
        const cssClass = de.nativeElement.className;
        expect(cssClass).toBe('dropZoneColor');

        de.triggerEventHandler('drop', new DragEvent('drop', { dataTransfer: new DataTransfer() }));
        const cssClassDragover = de.nativeElement.className;
        expect(cssClassDragover).toBe('dropZoneColorDrop');
    });

    it('should add file to uploadService on drop event', () => {
        const de = fixture.debugElement.query(By.directive(NgxDragAndDropDirective));
        de.triggerEventHandler('drop', new DragEvent('drop', { dataTransfer: new DataTransfer() }));

        this.uploader = de.injector.get<NgxDragAndDropDirective>(NgxDragAndDropDirective).uploader;
        expect(this.uploader.queue.length).toBe(0);

    });


});