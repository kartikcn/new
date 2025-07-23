import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PlanDetailsComponent } from '../plan-details.component';

const routes: Routes = [
        { path: '', component: PlanDetailsComponent }
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
export class PlanDetailsRoutingModule { }
