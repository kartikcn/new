import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PartUsageAnalysisPpmComponent } from '../modal/part-usage-analysis-ppm.component';

const routes: Routes = [
        { path: '', component: PartUsageAnalysisPpmComponent }
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
export class PartsUsageAnalysisPPMRoutingModule { }
