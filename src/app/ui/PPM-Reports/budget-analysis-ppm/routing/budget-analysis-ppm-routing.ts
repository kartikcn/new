import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BudgetAnalysisPpmComponent } from '../modal/budget-analysis-ppm.component';


const routes: Routes = [
        { path: '', component: BudgetAnalysisPpmComponent }
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
export class BudgetAnalysisPPMRoutingModule { }
