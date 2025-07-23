import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HighlightBySubDepartmentComponent } from '../highlight-by-sub-department.component';

const routes: Routes = [
    { path: '', component: HighlightBySubDepartmentComponent }
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
export class HightlightBySubDepartmentRoutingModule { }