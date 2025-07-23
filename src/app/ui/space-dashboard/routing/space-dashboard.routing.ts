import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SpaceDashboardComponent } from '../space-dashboard.component';

const routes: Routes = [
    { path: '', component: SpaceDashboardComponent }
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
export class SpaceDashboardRoutingModule { }