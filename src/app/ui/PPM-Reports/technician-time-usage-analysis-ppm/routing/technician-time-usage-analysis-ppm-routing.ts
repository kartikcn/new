import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TechnicianTimeUsageAnalysisPpmComponent } from '../modal/technician-time-usage-analysis-ppm.component';


const routes: Routes = [
        { path: '', component: TechnicianTimeUsageAnalysisPpmComponent }
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
export class TechnicianTimeUsageAnalysisPPMRoutingModule { }