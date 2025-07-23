import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ViewEmployeeReportComponent } from '../view-employee-report.component';


const routes: Routes = [
        { path: '', component: ViewEmployeeReportComponent }
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
export class ViewEmployeeReportRoutingModule { }