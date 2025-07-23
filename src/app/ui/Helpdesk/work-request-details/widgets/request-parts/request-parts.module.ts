import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestPartsComponent } from './modal/request-parts.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditRequestPartsModule } from './widgets/add-edit-request-parts/add-edit-request-parts.module';



@NgModule({
    declarations: [
        RequestPartsComponent
    ],
    imports: [
        CommonModule,
        AddEditRequestPartsModule,
        PrimeNGModule
    ],
    exports: [RequestPartsComponent],
    providers: []
})
export class RequestPartsModule { }
