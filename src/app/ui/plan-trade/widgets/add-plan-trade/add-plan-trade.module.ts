import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdddPlanTradeComponent } from './addd-plan-trade.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { TradeDetailsModule } from 'src/app/ui/common-components/trade-details/trade-details.module';



@NgModule({
  declarations: [
    AdddPlanTradeComponent
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
    TradeDetailsModule
  ],
  exports: [AdddPlanTradeComponent],
 
})
export class AddPlanTradeModule { }
