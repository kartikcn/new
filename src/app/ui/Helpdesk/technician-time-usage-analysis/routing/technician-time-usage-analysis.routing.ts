import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TechnicianTimeUsageAnalysisComponent } from '../model/technician-time-usage-analysis.component';


const routes: Routes = [
        { path: '', component: TechnicianTimeUsageAnalysisComponent }
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
export class TechnicianTimeUsageAnalysisRoutingModule { }