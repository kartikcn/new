import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPlanPartComponent } from './add-plan-part.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PartDetailsModule } from 'src/app/ui/common-components/part-details/part-details.module';



@NgModule({
  declarations: [
    AddPlanPartComponent
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
    SelectButtonModule,
    PartDetailsModule
  ],
  exports: [AddPlanPartComponent],
})
export class AddPlanPartModule { }
