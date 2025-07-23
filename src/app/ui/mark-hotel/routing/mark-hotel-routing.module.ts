import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MarkHotelComponent } from '../mark-hotel.component';

const routes: Routes = [
        { path: '', component: MarkHotelComponent }
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
export class MarkHotelRoutingModule { }
