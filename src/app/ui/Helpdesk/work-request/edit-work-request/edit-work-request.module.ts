import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditWorkRequestComponent } from './edit-work-request.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { LimitExceededModule } from 'src/app/ui/limit-exceeded/limit-exceeded.module';

@NgModule({
  declarations: [
    EditWorkRequestComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
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
    MaterialModule,
    PrimeNGModule,
    TabViewModule,
    MenuModule,
    NgxSpinnerModule,
    LimitExceededModule
  ],
  exports: [EditWorkRequestComponent]
})
export class EditWorkRequestModule { }
