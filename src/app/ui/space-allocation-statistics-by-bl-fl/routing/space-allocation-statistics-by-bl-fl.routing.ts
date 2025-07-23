import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SpaceAllocationStatisticsByBlFlComponent } from '../space-allocation-statistics-by-bl-fl.component';

const routes: Routes = [
    { path: '', component: SpaceAllocationStatisticsByBlFlComponent }
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
export class SpaceAllocationStatisticsByBlFlRoutingModule { }