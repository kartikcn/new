import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddWorkRequestComponent } from '../add-work-request/add-work-request.component';

const routes: Routes = [
        { path: '', component: AddWorkRequestComponent }
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
export class AddRequestRoutingModule { }
