import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CenterBudgetTermReportComponent } from '../center-budget-term-report/center-budget-term-report.component';



const routes: Routes = [
    { path: '', component: CenterBudgetTermReportComponent }
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
export class CenterBudgetTermReportRoutingModule{ 


}
