import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HolidaysComponent } from '../modal/holidays.component';

const routes: Routes = [
  { path: '', component: HolidaysComponent }
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
export class HolidayRoutingModule { }
