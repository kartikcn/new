import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BackgroundLocComponent } from '../modal/background-loc.component';

const routes: Routes = [
  { path: '', component: BackgroundLocComponent }
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
export class BackLocRoutingModule { }
