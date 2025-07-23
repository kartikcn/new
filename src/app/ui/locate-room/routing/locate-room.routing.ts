import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LocateRoomComponent } from '../locate-room.component';




const routes: Routes = [
    { path: '', component:  LocateRoomComponent}
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
export class LocateRoomRoutingModule { }