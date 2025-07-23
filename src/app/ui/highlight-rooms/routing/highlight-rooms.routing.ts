import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HighlightRoomsComponent } from '../highlight-rooms.component';


const routes: Routes = [
    { path: '', component: HighlightRoomsComponent }
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
export class HightlightRoomsRoutingModule { }