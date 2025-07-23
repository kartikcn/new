import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BudgetTermsListComponent } from '../budget-terms-list.component';



const routes: Routes = [ 
    { path: '', component:BudgetTermsListComponent }
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
export class BudegetTermsListRoutingModule{ 


}
