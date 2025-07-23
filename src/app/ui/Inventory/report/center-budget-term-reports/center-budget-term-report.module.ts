import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterBudgetTermReportComponent } from './center-budget-term-report/center-budget-term-report.component';
import { CenterBudgetTermReportRoutingModule } from './routing/center-budget-term-report.routing';
import { CenterBudgetTermItemReportModule } from '../center-budget-term-item-report/center-budget-term-item-report.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    CenterBudgetTermReportComponent
  ],
  imports: [
    CommonModule,
    CenterBudgetTermReportRoutingModule,
    CenterBudgetTermItemReportModule,
    FormsModule,
    PrimeNGModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports:[CenterBudgetTermReportComponent]
})
export class CenterBudgetTermReportModule { }
