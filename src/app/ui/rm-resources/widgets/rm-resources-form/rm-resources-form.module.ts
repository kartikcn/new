import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RmResourcesFormComponent } from './rm-resources-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    RmResourcesFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    DirectiveModule,
    PrimeNGModule

  ],
  exports: [RmResourcesFormComponent],
})
export class RmResourcesFormModule { }
