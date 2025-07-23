import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicianTimeUsageAnalysisPpmComponent } from './modal/technician-time-usage-analysis-ppm.component';
import { TechnicianTimeUsageAnalysisPPMRoutingModule } from './routing/technician-time-usage-analysis-ppm-routing';
import { TechnicianTimeUsageAnalysisModule } from '../../Helpdesk/technician-time-usage-analysis/technician-time-usage-analysis.module';



@NgModule({
  declarations: [
    TechnicianTimeUsageAnalysisPpmComponent
  ],
  imports: [
    CommonModule,
    TechnicianTimeUsageAnalysisPPMRoutingModule,
    TechnicianTimeUsageAnalysisModule
  ]
})
export class TechnicianTimeUsageAnalysisPpmModule { }
