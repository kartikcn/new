import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllocationReportByDivDepComponent } from '../allocation-report-by-div-dep.component';

const routes: Routes = [
    { path: '', component: AllocationReportByDivDepComponent }
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
export class AllocationReportByDivDepRoutingModule { }