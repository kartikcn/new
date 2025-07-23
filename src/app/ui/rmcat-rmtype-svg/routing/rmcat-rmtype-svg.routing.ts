import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RmcatRmtypeSvgComponent } from '../rmcat-rmtype-svg.component';





const routes: Routes = [
    { path: '', component: RmcatRmtypeSvgComponent }
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
export class RmcatRmtypeSvgRoutingModule { }