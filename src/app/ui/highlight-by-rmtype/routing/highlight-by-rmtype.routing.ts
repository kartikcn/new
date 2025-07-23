import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HighlightByRmtypeComponent } from '../highlight-by-rmtype.component';

const routes: Routes = [
    { path: '', component: HighlightByRmtypeComponent }
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
export class HightlightByRmTypeRoutingModule { }