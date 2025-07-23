import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanTradeComponent } from './modal/plan-trade.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditPlanTradeModule } from './widgets/add-edit-plan-trade/add-edit-plan-trade.module';



@NgModule({
  declarations: [
    PlanTradeComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AddEditPlanTradeModule
  ],
  exports:[PlanTradeComponent]
})
export class PlanTradeModule { }
