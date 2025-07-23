import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMyRequestsGridComponent } from './modal/dashboard-my-requests-grid.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule } from '@angular/forms';
import { AddTableModule } from 'src/app/ui/Helpdesk/requests-by-asset-reports/widgets/add-table/add-table.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
    declarations: [
        DashboardMyRequestsGridComponent
    ],
    imports: [
        CommonModule,
        PrimeNGModule,
        FormsModule,
        AddTableModule,
        MatTooltipModule
    ],
    exports: [DashboardMyRequestsGridComponent],
    providers: []
})
export class DashboardMyRequestsGridModule { }
