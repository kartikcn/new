import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetAnalysisRoutingModule } from './routing/budget-analysis.routing';
import { BudgetAnalysisComponent } from './model/budget-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
    declarations: [
        BudgetAnalysisComponent
    ],
    imports: [
        CommonModule,
        BudgetAnalysisRoutingModule,
        FormsModule,
        PrimeNGModule,
        ReactiveFormsModule,
        NgSelectModule,
    ],
    exports: [BudgetAnalysisComponent],
    providers: []
})
export class BudgetAnalysisModule { }
