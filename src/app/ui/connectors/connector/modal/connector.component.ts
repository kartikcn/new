import { Component, ViewChild } from '@angular/core';
import { ConnectorListComponent } from '../widgets/connector-list/connector-list.component';
import { ConnectorFldsComponent } from '../widgets/connector-flds/connector-flds.component';
import { ConnectorLogComponent } from '../widgets/connector-log/connector-log.component';

@Component({
  selector: 'app-connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.scss']
})
export class ConnectorComponent {
  index: number = 0;
  connectorId: number = 0;
  selectedTab: string = "Connector";
  @ViewChild(ConnectorListComponent, { static: false }) connectorListComponent!: ConnectorListComponent;
  @ViewChild(ConnectorFldsComponent, { static: false }) connectorFldsComponent!: ConnectorFldsComponent;
  @ViewChild(ConnectorLogComponent, { static: false }) connectorLogComponent!: ConnectorLogComponent;


  handleChange(event: any) {
    if (event != null) {
      this.selectedTab = event.originalEvent.target.innerText;
    }
    switch (this.selectedTab) {
      case "Connector":
        this.index = 0;
        this.connectorId = 0;
        break;
      case "Connector Fields":
        this.index = 1;
        this.connectorFldsComponent.loadRecords(this.connectorId);
        break;
      case "Connector Logs":
        this.index = 2;
        this.connectorLogComponent.loadRecords(this.connectorId)
        break;
    }
  }

  getConnectorFlds(event: any) {
    this.connectorId = event.data.connectorId;
    if (event.type == "execute") {
      this.index = 2;
      this.connectorLogComponent.loadRecords(this.connectorId)
    } else {
      this.index = 1;
      this.connectorFldsComponent.loadRecords(this.connectorId);
    }

  }

}
