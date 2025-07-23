import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPlanToolComponent } from './add-plan-tool.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddToolsModule } from 'src/app/ui/Helpdesk/tools/widgets/add-tools/add-tools.module';



@NgModule({
  declarations: [
    AddPlanToolComponent
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
    AddToolsModule
  ],
  exports: [AddPlanToolComponent],
})
export class AddPlanToolModule { }
