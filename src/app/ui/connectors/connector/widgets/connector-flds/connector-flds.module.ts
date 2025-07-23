import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorFldsComponent } from './connector-flds.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    ConnectorFldsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    MatTooltipModule
  ],
  exports: [ConnectorFldsComponent]
})
export class ConnectorFldsModule { }
