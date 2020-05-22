import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector:'[section-host]'    
})
export class SectionDirective {
    constructor(public viewContainerRef: ViewContainerRef){}
}