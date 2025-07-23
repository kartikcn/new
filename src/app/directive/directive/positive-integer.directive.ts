import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPositiveInteger]'
})
export class PositiveIntegerDirective {

  private readonly POSITIVE_INTEGER_PATTERN = /^\d+$/;

  constructor(private elementRef: ElementRef) { }


  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;
    let sanitizedValue = inputValue.replace(/[^\d]/g, '');
    if (sanitizedValue !== '' && Number(sanitizedValue) === 0) {
      sanitizedValue = '0'; // allow zero as a valid input
    }
    inputElement.value = sanitizedValue;
    inputElement.dispatchEvent(new Event('input'));
  }
}