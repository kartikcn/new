import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddResourcesFormComponent } from './add-resources-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddResourcesFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    DirectiveModule,
    MaterialModule
  ],
  exports: [AddResourcesFormComponent],
})
export class AddResourcesFormModule { }
