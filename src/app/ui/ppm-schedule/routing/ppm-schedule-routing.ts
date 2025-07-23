import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PpmScheduleComponent } from '../modal/ppm-schedule.component';

const routes: Routes = [
        { path: '', component: PpmScheduleComponent }
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
export class PpmScheduleRoutingModule { }
