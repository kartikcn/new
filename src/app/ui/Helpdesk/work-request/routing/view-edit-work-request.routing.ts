import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ViewEditWorkRequestComponent } from '../view-edit-work-request/view-edit-work-request.component';
const routes: Routes = [
        { path: '', component: ViewEditWorkRequestComponent }
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
export class ViewEditWrRequestRoutingModule { }
