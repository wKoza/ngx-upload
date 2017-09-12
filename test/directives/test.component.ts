import { Component, NgModule } from '@angular/core';


@Component({
    template: `<div ngxDragAndDrop>
                   Drop files here to upload
               </div>`

})
export class TestComponent { }


@NgModule({declarations: [TestComponent]})
export class TestModule { }