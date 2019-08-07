import {
  ComponentFactoryResolver, ComponentRef, Directive, Injector, Input, OnInit, TemplateRef, ViewContainerRef
} from '@angular/core';
import { InputfileComponent } from '../components/inputfile.component';
import { InputFileOptions, ngxInputFileOptions } from '../utils/configuration.model';


@Directive({
  selector: '[ngxInputFile]'
})
export class NgxInputFileDirective implements OnInit {

  @Input()
  ngxInputFile: InputFileOptions;

  @Input()
  folder: boolean = false;

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector,
              private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {
  }

  ngOnInit() {
    const _contentViewRef = this.templateRef.createEmbeddedView(null);
    const factory = this.resolver.resolveComponentFactory(InputfileComponent);
    const component: ComponentRef<InputfileComponent> = this.vcRef.createComponent(factory, 0, this.injector, [_contentViewRef.rootNodes]);
    component.instance.options = (this.ngxInputFile) ? this.ngxInputFile : ngxInputFileOptions;
    component.instance.folder = this.folder;
    _contentViewRef.detectChanges();
  }
}
