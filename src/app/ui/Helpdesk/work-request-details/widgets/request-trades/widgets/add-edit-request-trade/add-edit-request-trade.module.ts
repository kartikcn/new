import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditRequestTradeComponent } from './add-edit-request-trade.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddRequestTradeModule } from '../add-request-trade/add-request-trade.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddEditRequestTradeComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AddRequestTradeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddEditRequestTradeComponent]
})
export class AddEditRequestTradeModule { }
