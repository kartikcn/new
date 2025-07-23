import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
//import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { AddEmployeeComponent } from './add-employee.component';
import {AntDesignModule} from 'src/app/material/ant-design.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [AddEmployeeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    AntDesignModule,
    DirectiveModule
    
  ],
  exports: [AddEmployeeComponent]
})
export class AddEmployeeModule { }
