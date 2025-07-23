import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[appTrimInput]'
})
export class TrimInputDirective {

  constructor(private el: ElementRef,  @Optional() private ngControl: NgControl) { }

  @HostListener('blur') onBlur() {
    if(this.ngControl){
      this.ngControl.control!.setValue(this.el.nativeElement.value.trim());
    }
  }
}