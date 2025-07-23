import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WorkRequestDetailsComponent } from '../model/work-request-details.component';

const routes: Routes = [
  { path: '', component: WorkRequestDetailsComponent }
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
export class WorkRequestDetailsRoutingModule { }
