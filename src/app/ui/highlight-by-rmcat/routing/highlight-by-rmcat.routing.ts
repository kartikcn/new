import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HighlightByRmcatComponent } from '../highlight-by-rmcat.component';

const routes: Routes = [
    { path: '', component: HighlightByRmcatComponent }
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
export class HightlightByRmCatRoutingModule { }