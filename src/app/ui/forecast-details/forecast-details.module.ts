import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastDetailsComponent } from './modal/forecast-details.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ForecastDetailsRoutingModule } from './routing/forecast-details.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { TradeDetailsModule } from '../common-components/trade-details/trade-details.module';
import { PartDetailsModule } from '../common-components/part-details/part-details.module';
import { AddToolsModule } from '../Helpdesk/tools/widgets/add-tools/add-tools.module';
import { ForecastPlanDetailsModule } from './widgets/forecast-plan-details/forecast-plan-details.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanDetailsModule } from '../plan-details/plan-details.module';



@NgModule({
  declarations: [
    ForecastDetailsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ForecastDetailsRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    TradeDetailsModule,
    PartDetailsModule,
    AddToolsModule,
    ForecastPlanDetailsModule,
    ForecastPlanDetailsModule,
    MatTooltipModule,
    PlanDetailsModule
  ]
})
export class ForecastDetailsModule { }
