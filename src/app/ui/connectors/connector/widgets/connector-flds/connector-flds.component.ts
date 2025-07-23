import { Component } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { ConnectorService } from '../../services/connector.services';
import { ConnectorFldsDialogueProvider } from '../../providers/connector-flds.provider';

@Component({
  selector: 'app-connector-flds',
  templateUrl: './connector-flds.component.html',
  styleUrls: ['./connector-flds.component.scss'],
  providers: [MessageService]
})
export class ConnectorFldsComponent {
  rowCount: number = UtilConstant.ROW_COUNT;
  connectorFldsData: any[] = [];
  connectorId: number = 0
  constructor(
    private connectorFldsDialogueProvider: ConnectorFldsDialogueProvider,
    private connectorSrv: ConnectorService,
    private messageService: MessageService
  ) { }

  loadRecords(connectorId: any) {
    this.connectorId = connectorId;
    this.connectorSrv.getAllByConnectorId(connectorId).subscribe((res: any) => {
      this.connectorFldsData = res;
    })
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      isEdit: false,
      connectorId: this.connectorId,
      connectorFldsId: null,
      newRecord: true
    };
    this.connectorFldsDialogueProvider.openDialog(dialogConfig);
    this.connectorFldsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(result.connectorId);
      }
    });
  }
  onEdit(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      connectorId: data.connectorId,
      connectorFldsId: data.connectorFldsId,
      isEdit: true,
      newRecord: false
    };
    this.connectorFldsDialogueProvider.openDialog(dialogConfig);
    this.connectorFldsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(result.connectorId);
      }
    });
  }

}
