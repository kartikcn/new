import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ToolTypeComponent } from '../modal/tool-type.component';

const routes: Routes = [
        { path: '', component: ToolTypeComponent }
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
export class ToolTypeRoutingModule { }
