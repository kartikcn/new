import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BookingReportsByMonthComponent } from '../widgets/booking-reports-by-month/booking-reports-by-month.component';


const routes: Routes = [
    { path: '', component: BookingReportsByMonthComponent }
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
export class BookingReportsByMonthRoutingModule { }
