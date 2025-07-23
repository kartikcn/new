import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PpmPlanComponent } from '../modal/ppm-plan.component';

const routes: Routes = [
        { path: '', component: PpmPlanComponent }
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
export class PpmPlanRoutingModule { }
