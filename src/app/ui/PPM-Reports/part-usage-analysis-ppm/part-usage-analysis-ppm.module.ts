import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartUsageAnalysisPpmComponent } from './modal/part-usage-analysis-ppm.component';
import { PartsUsageAnalysisPPMRoutingModule } from './routing/part-usage-analysis-ppm';
import { PartsUsageAnalysisModule } from '../../Helpdesk/parts-usage-analysis/parts-usage-analysis.module';



@NgModule({
  declarations: [
    PartUsageAnalysisPpmComponent
  ],
  imports: [
    CommonModule,
    PartsUsageAnalysisPPMRoutingModule,
    PartsUsageAnalysisModule
  ]
})
export class PartUsageAnalysisPpmModule { }
