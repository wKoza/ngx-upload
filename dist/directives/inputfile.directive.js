import { ComponentFactoryResolver, Directive, Injector, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { InputfileComponent } from '../components/inputfile.component';
import { ngxInputFileOptions } from '../utils/configuration.model';
var NgxInputFileDirective = /** @class */ (function () {
    function NgxInputFileDirective(resolver, injector, vcRef, templateRef) {
        this.resolver = resolver;
        this.injector = injector;
        this.vcRef = vcRef;
        this.templateRef = templateRef;
    }
    NgxInputFileDirective.prototype.ngOnInit = function () {
        var _contentViewRef = this.templateRef.createEmbeddedView(null);
        var factory = this.resolver.resolveComponentFactory(InputfileComponent);
        var component = this.vcRef.createComponent(factory, 0, this.injector, [_contentViewRef.rootNodes]);
        component.instance.options = (this.ngxInputFile) ? this.ngxInputFile : ngxInputFileOptions;
        _contentViewRef.detectChanges();
    };
    NgxInputFileDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngxInputFile]'
                },] },
    ];
    /** @nocollapse */
    NgxInputFileDirective.ctorParameters = function () { return [
        { type: ComponentFactoryResolver },
        { type: Injector },
        { type: ViewContainerRef },
        { type: TemplateRef }
    ]; };
    NgxInputFileDirective.propDecorators = {
        ngxInputFile: [{ type: Input }]
    };
    return NgxInputFileDirective;
}());
export { NgxInputFileDirective };
//# sourceMappingURL=inputfile.directive.js.map