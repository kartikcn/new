import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoomEmployeeSvgComponent } from '../room-employee-svg.component';



const routes: Routes = [
    { path: '', component: RoomEmployeeSvgComponent }
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
export class RoomEmployeeSvgRoutingModule { }