import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartDetailsComponent } from './modal/part-details.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    PartDetailsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    AntDesignModule,
    NgSelectModule,
    DirectiveModule,
    SelectButtonModule
  ],
  exports:[PartDetailsComponent]
})
export class PartDetailsModule { }
