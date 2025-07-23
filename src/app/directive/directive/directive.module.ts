import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from '../numbers-only.directive';
import { UppercaseDirective } from './upper-case.directive';
import { TwoDigitDecimalNumberDirective } from './two-digit-decimal-number';
import { PositiveIntegerDirective } from './positive-integer.directive';
import { TrimInputDirective } from './trim-input.directive';



@NgModule({
  declarations: [NumbersOnlyDirective, UppercaseDirective, TwoDigitDecimalNumberDirective, PositiveIntegerDirective ,TrimInputDirective],
  imports: [
    CommonModule
  ],
  exports: [NumbersOnlyDirective, UppercaseDirective, TwoDigitDecimalNumberDirective,PositiveIntegerDirective,TrimInputDirective]
})
export class DirectiveModule { }
