import { ComponentFactoryResolver, Injector, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { InputFileOptions } from '../utils/configuration.model';
export declare class NgxInputFileDirective implements OnInit {
    private resolver;
    private injector;
    private vcRef;
    private templateRef;
    ngxInputFile: InputFileOptions;
    constructor(resolver: ComponentFactoryResolver, injector: Injector, vcRef: ViewContainerRef, templateRef: TemplateRef<any>);
    ngOnInit(): void;
}
