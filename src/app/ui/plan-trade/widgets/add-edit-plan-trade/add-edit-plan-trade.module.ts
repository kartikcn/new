import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditPlanTradeComponent } from './add-edit-plan-trade.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddPlanTradeModule } from '../add-plan-trade/add-plan-trade.module';



@NgModule({
  declarations: [
    AddEditPlanTradeComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    AddPlanTradeModule
  ],
  exports:[AddEditPlanTradeComponent]
})
export class AddEditPlanTradeModule { }
