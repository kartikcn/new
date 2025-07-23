import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpmScheduleTypeComponent } from './ppm-schedule-type.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { AccordionModule } from 'primeng/accordion';



@NgModule({
  declarations: [
    PpmScheduleTypeComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    MatDialogModule,
    ConfirmBoxDialogModule,
    AntDesignModule,
    RadioButtonModule,
    DirectiveModule,
    AccordionModule 
  ],
  exports:[PpmScheduleTypeComponent]
})
export class PpmScheduleTypeModule { }
