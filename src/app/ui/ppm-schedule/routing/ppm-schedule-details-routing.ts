import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PpmScheduleTypeListComponent } from '../widgets/ppm-schedule-type-list/ppm-schedule-type-list.component';

const routes: Routes = [
        { path: '', component: PpmScheduleTypeListComponent }
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
export class PpmScheduleDetailsRoutingModule { }
