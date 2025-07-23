import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompleteByAlertComponent } from './modal/complete-by-alert.component';
import { ChartModule } from 'primeng/chart';
import { AddTableModule } from 'src/app/ui/Helpdesk/requests-by-asset-reports/widgets/add-table/add-table.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
    declarations: [
        CompleteByAlertComponent
    ],
    imports: [
        CommonModule,
        ChartModule,
        AddTableModule,
        PrimeNGModule
    ],
    exports: [CompleteByAlertComponent],
    providers: []
})
export class CompleteByAlertModule { }
