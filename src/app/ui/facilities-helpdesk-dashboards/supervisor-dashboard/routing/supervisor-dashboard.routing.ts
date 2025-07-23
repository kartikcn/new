import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SupervisorDashboardComponent } from '../modal/supervisor-dashboard.component';

const routes: Routes = [
  { path: '', component: SupervisorDashboardComponent }
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
export class SupervisorDashboardRoutingModule { }
