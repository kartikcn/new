import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RmcatRmtypeComponent } from '../rmcat-rmtype.component';


const routes: Routes = [
    { path: '', component: RmcatRmtypeComponent }
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
export class RmcatRmtypeRoutingModule { }