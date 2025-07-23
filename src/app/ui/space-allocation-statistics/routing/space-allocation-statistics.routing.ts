import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SpaceAllocationStatisticsComponent } from '../space-allocation-statistics.component';


const routes: Routes = [
    { path: '', component: SpaceAllocationStatisticsComponent }
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
export class SpaceAllocationStatisticsRoutingModule { }