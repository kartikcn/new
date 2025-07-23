import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PmPlannerComponent } from '../pm-planner.component';

const routes: Routes = [
        { path: '', component: PmPlannerComponent }
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
export class PmPlannerRoutingModule { }