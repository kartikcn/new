import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddVisitorsFomComponent } from './add-visitors-fom.component';
import { AddEditVisitorsModule } from '../add-edit-visitors/add-edit-visitors.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddVisitorsFomComponent
  ],
  imports: [
    CommonModule,
    AddEditVisitorsModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    DirectiveModule
  ],
  exports: [AddVisitorsFomComponent],

  
})
export class AddVisitorsModule { }
