import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSecurityGroupFormComponent } from './add-security-group-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputMaskModule } from 'primeng/inputmask';
import { MaterialModule } from 'src/app/material/material.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddSecurityGroupFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    InputMaskModule,
    DirectiveModule
  ],
  exports: [AddSecurityGroupFormComponent],
})
export class AddSecurityGroupModule { }
