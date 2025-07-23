import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WorkRequestReportsComponent } from '../model/work-request-reports.component';

const routes: Routes = [
        { path: '', component: WorkRequestReportsComponent }
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
export class WorkRequestReportsRoutingModule { }
