import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FloorplanArrangementSvgComponent } from '../floorplan-arrangement-svg.component';




const routes: Routes = [
    { path: '', component: FloorplanArrangementSvgComponent }
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
export class FloorplanArrangementSvgRoutingModule { }