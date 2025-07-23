import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HighlightByDivisionComponent } from '../highlight-by-division.component';




const routes: Routes = [
    { path: '', component: HighlightByDivisionComponent }
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
export class HightlightByDivisionRoutingModule { }