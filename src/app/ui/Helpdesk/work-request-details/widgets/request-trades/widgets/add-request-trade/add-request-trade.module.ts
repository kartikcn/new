import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRequestTradeComponent } from './add-request-trade.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddRequestTradeComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DirectiveModule
  ],
  exports: [AddRequestTradeComponent]
})
export class AddRequestTradeModule { }
