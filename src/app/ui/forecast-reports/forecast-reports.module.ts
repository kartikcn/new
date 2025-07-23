import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
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
import { NgxSpinnerModule } from 'ngx-spinner';
import { ForecastReportsComponent } from './forecast-reports.component';
import { ForecastReportsRoutingModule } from './routing/forecast-reports.routing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AccordionModule } from 'primeng/accordion';
import { AddToolsModule } from '../Helpdesk/tools/widgets/add-tools/add-tools.module';
import { PartDetailsModule } from '../common-components/part-details/part-details.module';
import { TradeDetailsModule } from '../common-components/trade-details/trade-details.module';
import { ForecastPlanDetailsModule } from '../forecast-details/widgets/forecast-plan-details/forecast-plan-details.module';


@NgModule({
  declarations: [ ForecastReportsComponent ],
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
    ForecastReportsRoutingModule,
    MatGridListModule,
    CheckboxModule ,
    NgxSpinnerModule,
    NgxChartsModule,
    AccordionModule,
    TradeDetailsModule,
    PartDetailsModule,
    AddToolsModule,
    ForecastPlanDetailsModule,
     ],
  exports: [ForecastReportsComponent],
  providers: []
})
export class ForecastReportsModule { }
