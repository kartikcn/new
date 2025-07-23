import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllocationReportBySubDepComponent } from '../allocation-report-by-sub-dep.component';

const routes: Routes = [
    { path: '', component: AllocationReportBySubDepComponent }
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
export class AllocationReportBySubDepRoutingModule { }