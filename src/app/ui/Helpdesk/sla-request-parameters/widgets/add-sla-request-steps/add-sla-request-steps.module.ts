import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSlaRequestStepsComponent } from './add-sla-request-steps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SelectButtonModule } from 'primeng/selectbutton';



@NgModule({
  declarations: [
    AddSlaRequestStepsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    PrimeNGModule,
    SelectButtonModule,
  ]
})
export class AddSlaRequestStepsModule { }
