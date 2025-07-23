import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { HighlightByDepartmentComponent } from './highlight-by-department.component';
import { HightlightByDepartmentRoutingModule } from './routing/highlight-by-department.routing';
import { SvgViewModule } from '../svg-view/svg-view.module';

@NgModule({
  declarations: [
    HighlightByDepartmentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    HightlightByDepartmentRoutingModule,
    SvgViewModule
  ],
  exports: [HighlightByDepartmentComponent]
})
export class HighlightByDepartmentModule { }