import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MaterialModule } from 'src/app/material/material.module';
import { AddStateFormComponent } from './add-state-form.component';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';


@NgModule({
  declarations: [ AddStateFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    DirectiveModule
  ],
  exports: [AddStateFormComponent]
})
export class AddStateFormModule { }
