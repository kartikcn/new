import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ViewOccupancyStatisticsComponent } from '../view-occupancy-statistics.component';


const routes: Routes = [
    { path: '', component: ViewOccupancyStatisticsComponent }
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
export class ViewOccupancyStatisticsRoutingModule { }