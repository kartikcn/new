import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryRequestReportsPpmComponent } from './modal/summary-request-reports-ppm.component';
import { PPMSummaryRequestReportRoutingModule } from './routing/summary-request-reports-ppm-routing';
import { SummeryRequestReportsModule } from '../../Helpdesk/summery-request-report/summery-request-reports.module';



@NgModule({
  declarations: [
    SummaryRequestReportsPpmComponent
  ],
  imports: [
    CommonModule,
    PPMSummaryRequestReportRoutingModule,
    SummeryRequestReportsModule
  ]
})
export class SummaryRequestReportsPpmModule { }
