import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemTypeComponent } from './modal/problem-type.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ProblemTypeRoutingModule } from './routing/problem-type.routing';
import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';
import { AddProblemTypeModule } from './widgets/add-problem-type/add-problem-type.module';



@NgModule({
    declarations: [
        ProblemTypeComponent
    ],
    imports: [
        CommonModule,
        ProblemTypeRoutingModule,
        PrimeNGModule,
        TreeModule,
        AddProblemTypeModule
    ],
    exports: [ProblemTypeComponent],
    providers: []
})
export class ProblemTypeModule { }
