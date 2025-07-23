import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BudgetAnalysisComponent } from '../model/budget-analysis.component';


const routes: Routes = [
        { path: '', component: BudgetAnalysisComponent }
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
export class BudgetAnalysisRoutingModule { }
