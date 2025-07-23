import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorLogComponent } from './connector-log.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    ConnectorLogComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    MatTooltipModule
  ],
  exports: [ConnectorLogComponent]
})
export class ConnectorLogModule { }
