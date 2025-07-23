import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BookingReportComponent } from '../widgets/booking-reports/booking-report/booking-report.component';

const routes: Routes = [
    { path: '', component: BookingReportComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class BookingReportsRoutingModule { }
