import {Component, OnInit} from '@angular/core';

import {Person} from './person.model';
import { FileItem, HttpClientUploadService, XhrUploadService } from '@wkoza/ngx-upload';


@Component({
    selector: 'app-root',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.css']
})
export class SimpleBootstrapComponent implements OnInit {

    model: Person;

    constructor(public uploader: HttpClientUploadService) {
    }

    ngOnInit() {
        this.model = new Person();

        this.uploader.onCancel$.subscribe(
            (data: FileItem) => {
                console.log('file deleted: ' + data.file);

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


    }


    onDrop(data: File) {
        console.log('dropped:', this.parseFile(data[0]))
    }


    parseFile(file) {
        return (`File information: ${file.name} | type: ${file.type} | size: ${file.size} bytes`);
    }


}
