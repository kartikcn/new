import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ViewRoomReportComponent } from '../view-room-report.component';


const routes: Routes = [
        { path: '', component: ViewRoomReportComponent }
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
export class ViewRoomReportRoutingModule { }