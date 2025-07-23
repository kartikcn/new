import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SpaceAllocationStatisticsByDivDepComponent } from '../space-allocation-statistics-by-div-dep.component';

const routes: Routes = [
    { path: '', component: SpaceAllocationStatisticsByDivDepComponent }
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
export class SpaceAllocationStatisticsByDivDepRoutingModule { }