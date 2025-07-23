import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import {InputMaskModule} from 'primeng/inputmask';
import { ViewBookingDetailsComponent } from './view-booking-details.component';
import { RadioButtonModule } from 'primeng/radiobutton';



@NgModule({
  declarations: [
    ViewBookingDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    DirectiveModule,
    PrimeNGModule,
    AntDesignModule,
    InputMaskModule,
    RadioButtonModule
  ],
  exports: [ViewBookingDetailsComponent]
})
export class ViewBookingDetailsModule { }
