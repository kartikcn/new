import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorComponent } from './modal/connector.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConnectorRoutingModule } from './routing/connector-routing';
import { ConnectorListModule } from './widgets/connector-list/connector-list.module';
import { AddEditConnectorModule } from './widgets/add-edit-connector/add-edit-connector.module';
import { ConnectorFldsModule } from './widgets/connector-flds/connector-flds.module';
import { AddEditConnectorFldsModule } from './widgets/add-edit-connector-flds/add-edit-connector-flds.module';
import { ConnectorLogModule } from './widgets/connector-log/connector-log.module';



@NgModule({
  declarations: [
    ConnectorComponent
  ],
  imports: [
    CommonModule,
    ConnectorRoutingModule,
    PrimeNGModule,
    ConnectorListModule,
    AddEditConnectorModule,
    ConnectorFldsModule,
    AddEditConnectorFldsModule,
    ConnectorLogModule
  ]
})
export class ConnectorModule { }
