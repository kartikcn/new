import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CheckBookingComponent } from '../modal/check-booking.component';


const routes: Routes = [
    { path: '', component: CheckBookingComponent }
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
export class CheckBookingRoutingModule { }
