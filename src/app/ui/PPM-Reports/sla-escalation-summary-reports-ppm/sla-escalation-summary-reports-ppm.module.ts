import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaEscalationSummaryReportsPpmComponent } from './modal/sla-escalation-summary-reports-ppm.component';
import { SLAEscalationSummaryReportPPMRoutingModule } from './routing/sla-escalation-summary-reports-ppm-routing';
import { SlaEscalatedSummaryReportsModule } from '../../Helpdesk/facilities-helpdesk-reports/sla-escalated-summary-reports/sla-escalated-summary-reports.module';



@NgModule({
  declarations: [
    SlaEscalationSummaryReportsPpmComponent
  ],
  imports: [
    CommonModule,
    SLAEscalationSummaryReportPPMRoutingModule,
    SlaEscalatedSummaryReportsModule
  ]
})
export class SlaEscalationSummaryReportsPpmModule { }
