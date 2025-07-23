import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AssignEmployeeRoomComponent } from '../assign-employee-room.component';

const routes: Routes = [
    { path: '', component: AssignEmployeeRoomComponent }
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
export class AssignEmployeeRoomRoutingModule { }