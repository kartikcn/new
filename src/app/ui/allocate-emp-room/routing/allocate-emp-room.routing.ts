import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllocateEmpRoomComponent } from '../allocate-emp-room.component';


const routes: Routes = [
    { path: '', component: AllocateEmpRoomComponent }
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
export class AllocateEmpRoomRoutingModule { }