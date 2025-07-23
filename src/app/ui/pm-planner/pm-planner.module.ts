import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PmPlannerRoutingModule } from './routing/pm-planner.routing';
import { PmPlannerComponent } from './pm-planner.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { CheckboxModule } from 'primeng/checkbox';
import { PmPlannerReqDetailsTableModule } from './widgets/pm-planner-req-details-table/pm-planner-req-details-table.module';
import { AddTableModule } from '../Helpdesk/requests-by-asset-reports/widgets/add-table/add-table.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [ PmPlannerComponent ],
  imports:      [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ConfirmBoxDialogModule,
    NgSelectModule,
    MaterialModule,
    PrimeNGModule,
    SelectButtonModule,
    DirectiveModule,
    ToggleButtonModule,
    FormsModule, 
    DragDropModule, 
    PmPlannerRoutingModule,
    MatGridListModule,
    CheckboxModule ,
    PmPlannerReqDetailsTableModule,
    AddTableModule,
    NgxSpinnerModule
     ],
  exports: [PmPlannerComponent],
  providers: []
})
export class PmPlannerModule { }
