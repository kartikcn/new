import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterBudgetTermItemReportComponent } from './center-budget-term-item-report/center-budget-term-item-report.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CenterBudgetTermItemReportComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[CenterBudgetTermItemReportComponent]
})
export class CenterBudgetTermItemReportModule { }
