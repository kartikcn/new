import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatusPieChartComponent } from './modal/dashboard-status-pie-chart.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob'
import { ReactiveFormsModule } from '@angular/forms';
import { AddTableModule } from 'src/app/ui/Helpdesk/requests-by-asset-reports/widgets/add-table/add-table.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
    declarations: [
        DashboardStatusPieChartComponent
    ],
    imports: [
        CommonModule,
        PrimeNGModule,
        ChartModule,
        KnobModule,
        ReactiveFormsModule,
        AddTableModule,
        NgxChartsModule
    ],
    exports: [DashboardStatusPieChartComponent],
    providers: []
})
export class DashboardStatusPieChartModule { }
