import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { ConnectorService } from '../../services/connector.services';

@Component({
  selector: 'app-connector-log',
  templateUrl: './connector-log.component.html',
  styleUrls: ['./connector-log.component.scss'],
  providers: [MessageService]
})
export class ConnectorLogComponent {
  rowCount: number = UtilConstant.ROW_COUNT;
  connectorLogData: any[] = [];

  constructor(
    private connectorSrv:ConnectorService
  ) { }

  loadRecords(connectorId:any) {
    this.connectorSrv.getAllLogsByConnectorId(connectorId).subscribe((res:any) => {
      this.connectorLogData = res;
    })
  }
}
