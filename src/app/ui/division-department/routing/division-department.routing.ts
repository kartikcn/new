import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DivisionDepartmentComponent } from '../division-department.component';

const routes: Routes = [
    { path: '', component: DivisionDepartmentComponent }
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
export class DivisionDepartmentRoutingModule { }