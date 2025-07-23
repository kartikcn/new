import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllocationReportByBlFlComponent } from '../allocation-report-by-bl-fl.component';

const routes: Routes = [
    { path: '', component: AllocationReportByBlFlComponent }
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
export class AllocationReportByBlFlRoutingModule { }