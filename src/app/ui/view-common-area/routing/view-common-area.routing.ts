import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ViewCommonAreaComponent } from '../view-common-area.component';

const routes: Routes = [
    { path: '', component: ViewCommonAreaComponent }
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
export class ViewCommonAreaRoutingModule { }