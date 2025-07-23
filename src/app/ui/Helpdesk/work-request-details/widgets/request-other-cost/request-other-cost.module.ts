import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestOtherCostComponent } from './modal/request-other-cost.component';
import { AddEditRequestOtherCostModule } from './widgets/add-edit-request-other-cost/add-edit-request-other-cost.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
    declarations: [
        RequestOtherCostComponent
    ],
    imports: [
        CommonModule,
        AddEditRequestOtherCostModule,
        PrimeNGModule
    ],
    exports: [RequestOtherCostComponent],
    providers: []
})
export class RequestOtherCostModule { }
