import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupervisorDashboardComponent } from './modal/supervisor-dashboard.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { CompleteByAlertModule } from '../widgets/complete-by-alert/complete-by-alert.module';
import { DashboardMyRequestsGridModule } from '../widgets/dashboard-my-requests-grid/dashboard-my-requests-grid.module';
import { DashboardStatusPieChartModule } from '../widgets/dashboard-status-pie-chart/dashboard-status-pie-chart.module';
import { EscalationAlertsGridModule } from '../widgets/escalation-alerts-grid/escalation-alerts-grid.module';
import { SupervisorDashboardRoutingModule } from './routing/supervisor-dashboard.routing';
import { KnobModule } from 'primeng/knob';
import { ChartModule } from 'primeng/chart';
import { AddTableModule } from '../../Helpdesk/requests-by-asset-reports/widgets/add-table/add-table.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [
    SupervisorDashboardComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    SupervisorDashboardRoutingModule,
    CompleteByAlertModule,
    DashboardMyRequestsGridModule,
    DashboardStatusPieChartModule,
    EscalationAlertsGridModule,
    KnobModule,
    ChartModule,
    AddTableModule,
    NgxChartsModule
  ],
  exports:[SupervisorDashboardComponent]
})
export class SupervisorDashboardModule { }
