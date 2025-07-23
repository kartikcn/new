import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PpmRequestsConsoleComponent } from '../Modal/ppm-requests-console.component';

const routes: Routes = [
        { path: '', component: PpmRequestsConsoleComponent }
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
export class PPMRequestConsoleRoutingModule { }
