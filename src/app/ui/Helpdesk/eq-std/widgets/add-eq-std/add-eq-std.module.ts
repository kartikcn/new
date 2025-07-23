import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEqStdFormComponent } from './add-eq-std-form/add-eq-std-form.component';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddEqStdFormComponent
  ],
  imports: [
    CommonModule,
    DirectiveModule
  ]
})
export class AddEqStdModule { }
