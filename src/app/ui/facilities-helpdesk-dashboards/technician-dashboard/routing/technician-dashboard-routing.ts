import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TechnicianDashboardComponent } from '../modal/technician-dashboard.component';

const routes: Routes = [
  { path: '', component: TechnicianDashboardComponent }
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
export class TechnicianDashboardRoutingModule { }
