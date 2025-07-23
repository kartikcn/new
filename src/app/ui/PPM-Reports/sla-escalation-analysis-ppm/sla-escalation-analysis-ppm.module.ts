import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaEscalationAnalysisPpmComponent } from './modal/sla-escalation-analysis-ppm.component';
import { SlaEscalationAnalysisPPMRoutingModule } from './routing/sla-escalation-analysis-ppm-routing';
import { SlaEscalationAnalysisModule } from '../../Helpdesk/sla-escalation-analysis/sla-escalation-analysis.module';



@NgModule({
  declarations: [
    SlaEscalationAnalysisPpmComponent
  ],
  imports: [
    CommonModule,
    SlaEscalationAnalysisPPMRoutingModule,
    SlaEscalationAnalysisModule
  ]
})
export class SlaEscalationAnalysisPpmModule { }
