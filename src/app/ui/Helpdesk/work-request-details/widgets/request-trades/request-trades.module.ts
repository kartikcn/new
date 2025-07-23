import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestTradesComponent } from './modal/request-trades.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditRequestTradeModule } from './widgets/add-edit-request-trade/add-edit-request-trade.module';



@NgModule({
  declarations: [
    RequestTradesComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AddEditRequestTradeModule
  ],
  exports: [RequestTradesComponent]
})
export class RequestTradesModule { }
