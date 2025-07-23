import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEqFormComponent } from './add-eq-form/add-eq-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { AddEditResourcesFormModule } from 'src/app/ui/resources/widgets/add-edit-resources-form/add-edit-resources-form.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    AddEqFormComponent
  ],
  imports: [
    CommonModule,
    AddEditResourcesFormModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatTooltipModule,
    SelectButtonModule,
    DirectiveModule,
    PrimeNGModule
  ],
  exports: [AddEqFormComponent],
})
export class AddEquipmentModule { }
