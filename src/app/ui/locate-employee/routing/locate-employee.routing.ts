import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LocateEmployeeComponent } from '../locate-employee.component';

const routes: Routes = [
    { path: '', component:  LocateEmployeeComponent}
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
export class LocateEmployeeRoutingModule { }