import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CraftspersonComponent } from './modal/craftsperson.component';

const routes: Routes = [
        { path: '', component: CraftspersonComponent }
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
export class CraftspersonRoutingModule { }
