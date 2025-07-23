import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AddCraftspersonFormComponent } from './add-craftsperson-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { CraftspersonRoutingModule } from '../../craftsperson-routing';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    AddCraftspersonFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ConfirmBoxDialogModule,
    NgSelectModule,
    MaterialModule,
    PrimeNGModule,
    CraftspersonRoutingModule,
    SelectButtonModule,
    DirectiveModule,
    MatTooltipModule
  ],
  
  exports: [AddCraftspersonFormComponent]
})
export class AddCraftspersonFormModule { }
