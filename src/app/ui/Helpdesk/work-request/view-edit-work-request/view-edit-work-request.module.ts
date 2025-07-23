import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEditWorkRequestComponent } from './view-edit-work-request.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ViewEditWrRequestRoutingModule } from '../routing/view-edit-work-request.routing';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ViewEditWorkRequestComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ConfirmBoxDialogModule,
    NgSelectModule,
    NgxSpinnerModule,
    ViewEditWrRequestRoutingModule,
    RadioButtonModule,
    MatTooltipModule
  ],
  exports: [ViewEditWorkRequestComponent]
})
export class ViewEditWorkRequestModule { }