import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPlanStepsFormComponent } from './add-plan-steps-form.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddPlanStepsFormComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    AntDesignModule,
    NgSelectModule,
    DirectiveModule
  ],
  exports: [AddPlanStepsFormComponent],
})
export class AddPlanStepsModule { }
