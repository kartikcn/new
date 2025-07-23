import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPlanFormComponent } from './add-plan-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddPlanFormComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    NgSelectModule,
    AntDesignModule,
    DirectiveModule
  ],
  exports: [AddPlanFormComponent],
})
export class AddPlanModule { }
