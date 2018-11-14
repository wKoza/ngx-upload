import {
    ComponentFactoryResolver, Directive, Injector, OnInit, TemplateRef, ViewContainerRef
} from '@angular/core';
import { InputfileComponent } from '../components/inputfile.component';


@Directive({
    selector: '[ngxInputFile]'
})
export class NgxInputFileDirective implements OnInit {

    constructor(private resolver: ComponentFactoryResolver, private injector: Injector,
                private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) { }

    ngOnInit() {
        const _contentViewRef = this.templateRef.createEmbeddedView(null);
        const factory = this.resolver.resolveComponentFactory(InputfileComponent);
        this.vcRef.createComponent(factory, 0, this.injector, [_contentViewRef.rootNodes]);
        _contentViewRef.detectChanges();
     }
}
