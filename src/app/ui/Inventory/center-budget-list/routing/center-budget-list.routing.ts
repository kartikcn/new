import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CenterBudgetListComponent } from '../center-budget-list.component';



const routes: Routes = [
    { path: '', component: CenterBudgetListComponent }
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
export class CenterBudgetListRoutingModule{ 


}
