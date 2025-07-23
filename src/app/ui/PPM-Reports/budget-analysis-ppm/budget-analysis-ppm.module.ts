import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetAnalysisPpmComponent } from './modal/budget-analysis-ppm.component';
import { BudgetAnalysisPPMRoutingModule } from './routing/budget-analysis-ppm-routing';
import { BudgetAnalysisModule } from '../../Helpdesk/budget-analysis/budget-analysis.module';



@NgModule({
  declarations: [
    BudgetAnalysisPpmComponent
  ],
  imports: [
    CommonModule,
    BudgetAnalysisPPMRoutingModule,
    BudgetAnalysisModule
  ]
})
export class BudgetAnalysisPpmModule { }
