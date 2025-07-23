import { MaterialModule } from 'src/app/material/material.module';
import { AntDesignModule } from '../../../../material/ant-design.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddSubDepartmentComponent } from './add-sub-department.component';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';


@NgModule({
  declarations: [AddSubDepartmentComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    DirectiveModule
  ],
  exports: [AddSubDepartmentComponent]
})
export class AddSubDepartmentModule { }