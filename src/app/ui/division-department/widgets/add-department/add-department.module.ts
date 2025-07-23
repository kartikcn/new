import { MaterialModule } from 'src/app/material/material.module';
import { AntDesignModule } from '../../../../material/ant-design.module';
import { AddDepartmentComponent } from './add-department.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';


@NgModule({
  declarations: [AddDepartmentComponent ],
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
  exports: [AddDepartmentComponent]
})
export class AddDepartmentModule { }