import {Component, OnInit} from '@angular/core';
import {UploadService} from '@wKoza/ngx-upload';
import {Person} from './person.model';
import {DropTargetOptions} from '@wKoza/ngx-upload';

@Component({
  selector: 'app-root',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css']
})
export class SimpleMaterialComponent implements OnInit {

  model: Person;

  options: DropTargetOptions = {
    color : 'green',
    colorDrag : 'purple',
    colorDrop : 'green'
  };

  constructor(public uploader: UploadService) {
  }

  ngOnInit() {
    this.model = new Person();
  }


  onDrop(data: File) {
    console.log('dropped:', this.parseFile(data[0]))
  }


  parseFile(file) {
    return (`File information: ${file.name} | type: ${file.type} | size: ${file.size} bytes`);
  }

}
