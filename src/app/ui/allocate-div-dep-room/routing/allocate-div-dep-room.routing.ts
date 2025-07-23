import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllocateDivDepRoomComponent } from '../allocate-div-dep-room.component';

const routes: Routes = [
    { path: '', component: AllocateDivDepRoomComponent }
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
export class AllocateDivDepRoomRoutingModule { }