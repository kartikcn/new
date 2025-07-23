import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FinancialYearComponent } from '../modal/financial-year.component';

const routes: Routes = [
    { path: '', component: FinancialYearComponent }
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
export class FinancialYearRoutingModule { }
