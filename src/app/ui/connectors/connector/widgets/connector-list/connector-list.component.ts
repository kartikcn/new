import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { EnumList } from 'src/app/model/enum-list.model';
import { UtilConstant } from 'src/common/UtilConstant';
import { ConnectorListDialogueProvider } from '../../providers/connector-list.provider';
import { EnumService } from 'src/app/services/enum.service';
import { ConnectorService } from '../../services/connector.services';

@Component({
  selector: 'app-connector-list',
  templateUrl: './connector-list.component.html',
  styleUrls: ['./connector-list.component.scss'],
  providers: [MessageService]
})
export class ConnectorListComponent implements OnInit {

  rowCount: number = UtilConstant.ROW_COUNT;
  connectorData: any[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumType: EnumList[] = [];
  enumFormat: EnumList[] = [];
  enumSeperator: EnumList[] = [];
  event = {
    data: '',
    type: ''
  }
  @Output() parentFun = new EventEmitter();
  constructor(
    private connectorListDialogueProvider: ConnectorListDialogueProvider,
    private enumsrv: EnumService,
    private connectorSrv: ConnectorService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.loadRecords();
  }
  loadRecords() {
    this.connectorSrv.getAllConnectors().subscribe((res: any) => {
      this.connectorData = res;
    })
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: any[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.filter(t => t.tableName.toLocaleUpperCase() === 'conncetor'.toLocaleUpperCase());
        this.enumType = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'connector_type'.toLocaleUpperCase());
        this.enumFormat = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'file_format'.toLocaleUpperCase());
        this.enumSeperator = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'seperator'.toLocaleUpperCase());
      },
      error => {
      });
  }

  getEnumByKey(enumKey: any) {
    return this.enumClonedList.find(t => t.enumKey == enumKey) ? this.enumClonedList.find(t => t.enumKey == enumKey)?.enumValue : null;
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      isEdit: false,
      connectorId: null,
      newRecord: true
    };
    this.connectorListDialogueProvider.openDialog(dialogConfig);
    this.connectorListDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      connectorId: id,
      isEdit: true,
      newRecord: false
    };
    this.connectorListDialogueProvider.openDialog(dialogConfig);
    this.connectorListDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onRowSelect(event: any) {
    this.event.data = event.data;
    this.event.type = "row";
    this.parentFun.emit(this.event);
  }

  onExecute(event: any) {
    this.connectorSrv.execute(event).subscribe((res: any) => {
      console.log(res);
    });
    this.event.data = event;
    this.event.type = "execute";
    this.parentFun.emit(this.event);
  }

}
