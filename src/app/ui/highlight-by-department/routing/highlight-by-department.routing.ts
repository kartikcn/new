import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HighlightByDepartmentComponent } from '../highlight-by-department.component';



const routes: Routes = [
    { path: '', component: HighlightByDepartmentComponent }
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
export class HightlightByDepartmentRoutingModule { }