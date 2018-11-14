import { Component, OnInit, ViewChild } from '@angular/core';

import { Person } from './person.model';
import { FileItem, HttpClientUploadService } from '@wkoza/ngx-upload';


@Component({
    selector: 'app-root',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.css']
})
export class SimpleBootstrapComponent implements OnInit {

    model: Person;

    @ViewChild('ourForm') ourForm;

    constructor(public uploader: HttpClientUploadService) { }

    ngOnInit() {


        this.uploader.queue = [];

        this.model = new Person();

        this.uploader.onCancel$.subscribe(
            (data: FileItem) => {
                console.log('file canceled: ' + data.file.name);

            });

        this.uploader.onProgress$.subscribe(
            (data: any) => {
                console.log('upload file in progree: ' + data.progress);

            });

        this.uploader.onSuccess$.subscribe(
            (data: any) => {
                console.log(`upload file successful:  ${data.item} ${data.body} ${data.status} ${data.headers}`);
            }
        );

        this.uploader.onAddToQueue$.subscribe(
            () => {
                console.log(`reset of our form`);
                this.ourForm.reset();

            }
        )


    }


    upload(item: FileItem) {
        item.upload({
            method: 'POST',
            url: 'ngx_upload_mock'
        });
    }

    uploadAll() {
        this.uploader.uploadAll({
            method: 'POST',
            url: 'ngx_upload_mock'
        })  //'http://localhost:8090/upload'
    }


    makeThumbnail(item: FileItem) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // get loaded data and render thumbnail.
            //   document.getElementById("thumbnail").src = e.target.result;
            // this.renderer.setProperty(el,'src',e.target.result)
        };

        // read the image file as a data URL.
        reader.readAsDataURL(item.file);

    }

    activeRemoveAllBtn(): boolean {
        return this.uploader.queue.some(item => (item.isReady || item.isCancel || item.isError));
    }

    activeUploadAllBtn(): boolean {
        return this.uploader.queue.some(item => (item.isReady));
    }

    activeCancelAllBtn(): boolean {
        return this.uploader.queue.some((item: FileItem) => item.uploadInProgress);
    }




}
