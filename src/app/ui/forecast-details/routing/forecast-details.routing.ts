import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ForecastDetailsComponent } from '../modal/forecast-details.component';

const routes: Routes = [
        { path: '', component: ForecastDetailsComponent }
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
export class ForecastDetailsRoutingModule { }
