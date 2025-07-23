import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscalationAlertsGridComponent } from './modal/escalation-alerts-grid.component';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { ReactiveFormsModule } from '@angular/forms';
import { AddTableModule } from 'src/app/ui/Helpdesk/requests-by-asset-reports/widgets/add-table/add-table.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
//import { GaugeChartModule } from 'angular-gauge-chart'



@NgModule({
    declarations: [
        EscalationAlertsGridComponent
    ],
    imports: [
        CommonModule,
        PrimeNGModule,
        KnobModule,
        ReactiveFormsModule,
        AddTableModule,
        ChartModule,
       // GaugeChartModule,
    ],
    exports: [EscalationAlertsGridComponent],
    providers: []
})
export class EscalationAlertsGridModule { }
