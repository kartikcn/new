import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicianDashboardComponent } from './modal/technician-dashboard.component';
import { TechnicianDashboardRoutingModule } from './routing/technician-dashboard-routing';
import { CompleteByAlertModule } from '../widgets/complete-by-alert/complete-by-alert.module';
import { DashboardMyRequestsGridModule } from '../widgets/dashboard-my-requests-grid/dashboard-my-requests-grid.module';
import { DashboardStatusPieChartModule } from '../widgets/dashboard-status-pie-chart/dashboard-status-pie-chart.module';
import { EscalationAlertsGridModule } from '../widgets/escalation-alerts-grid/escalation-alerts-grid.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    TechnicianDashboardComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    TechnicianDashboardRoutingModule,
    CompleteByAlertModule,
    DashboardMyRequestsGridModule,
    DashboardStatusPieChartModule,
    EscalationAlertsGridModule
  ]
})
export class TechnicianDashboardModule { }
