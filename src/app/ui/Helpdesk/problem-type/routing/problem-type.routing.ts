import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProblemTypeComponent } from '../modal/problem-type.component';

const routes: Routes = [
        { path: '', component: ProblemTypeComponent }
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
export class ProblemTypeRoutingModule { }
