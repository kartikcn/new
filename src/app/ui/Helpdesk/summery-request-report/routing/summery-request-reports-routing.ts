import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SummeryRequestReportsComponent } from '../modal/summery-request-report.component';

const routes: Routes = [
        { path: '', component: SummeryRequestReportsComponent }
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
export class SummeryRequestReportsRoutingModule { }
