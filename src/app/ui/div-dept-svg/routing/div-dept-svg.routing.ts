import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DivDeptSvgComponent } from '../div-dept-svg.component';


const routes: Routes = [
    { path: '', component: DivDeptSvgComponent }
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
export class DivDeptSvgRoutingModule { }