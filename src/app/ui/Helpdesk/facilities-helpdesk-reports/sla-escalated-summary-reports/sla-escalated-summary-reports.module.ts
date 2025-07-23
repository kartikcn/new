import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaEscalatedSummaryReportsComponent } from './modal/sla-escalated-summary-reports.component';
import { SlaEscalatedSummaryReportsRoutingModule } from './routing/sla-escalated-summary-report-routing';
import { ChartModule } from 'primeng/chart';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddTableModule } from '../../requests-by-asset-reports/widgets/add-table/add-table.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [
    SlaEscalatedSummaryReportsComponent
  ],
  imports: [
    CommonModule,
    SlaEscalatedSummaryReportsRoutingModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule,
    NgSelectModule,
    AddTableModule,
    NgxChartsModule
  ],
  exports: [SlaEscalatedSummaryReportsComponent]
})
export class SlaEscalatedSummaryReportsModule { }
