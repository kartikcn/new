import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelStatusModule } from 'src/app/core/level-status/level-status.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestComponent } from './table-request.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
    declarations: [RequestComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        PrimeNGModule,
        LevelStatusModule,
        MatTooltipModule
    ],
    exports: [RequestComponent]
})
export class RequestModule { }
