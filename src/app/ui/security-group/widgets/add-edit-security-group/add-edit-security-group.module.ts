import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditSecurityGroupFormComponent } from './add-edit-security-group-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationService } from 'primeng/api';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddSecurityGroupModule } from '../add-security-group/add-security-group.module';



@NgModule({
  declarations: [
    AddEditSecurityGroupFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddSecurityGroupModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    PrimeNGModule,
  ],
  exports: [AddEditSecurityGroupFormComponent],
  providers: [ ConfirmationService
  ],
})
export class AddEditSecurityGroupModule { }
