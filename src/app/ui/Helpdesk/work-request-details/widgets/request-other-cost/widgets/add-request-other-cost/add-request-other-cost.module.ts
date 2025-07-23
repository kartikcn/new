import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRequestOtherCostComponent } from './add-request-other-cost.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';



@NgModule({
    declarations: [
        AddRequestOtherCostComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        DirectiveModule,
        PrimeNGModule,
        AntDesignModule
    ],
    exports: [AddRequestOtherCostComponent]
})
export class AddRequestOtherCostModule { }
