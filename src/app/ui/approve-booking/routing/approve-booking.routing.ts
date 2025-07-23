import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ApproveBookingComponent } from '../modal/approve-booking.component';



const routes: Routes = [
    { path: '', component: ApproveBookingComponent }
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
export class ApproveBookingRoutingModule { }
