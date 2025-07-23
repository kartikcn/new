import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { RmConfigDialogueProvider } from '../../provider/rm-config.provider';
import { RmConfigService } from '../../services/rm-config.service';
import { RmConfigFormComponent } from '../rm-config-form/rm-config-form.component';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-rm-config-list',
  templateUrl: './rm-config-list.component.html',
  styleUrls: ['./rm-config-list.component.scss']
})
export class RmConfigListComponent implements OnInit {
  addFormEvent!: any;
  eventData: any = { blId: null, flId: null, rmId: null };
  @ViewChild(RmConfigFormComponent, { static: false }) rmconfigF!: RmConfigFormComponent;
  roomConfigsRecords: any[] = [];
  @Output() refreshPanels = new EventEmitter();
  enumList: EnumList[] = [];
  enumRmConfig: EnumList[] = [];
  enumExtAllowedData: EnumList[] = [];
  enumIsReservable: EnumList[] = [];
  enumIdExtAllowed: number = 0;
  enumIdIsReservable: number = 0;
  enumIsApprovalRequiredValue: number = 0;
  enumIsApprovalRequiredList: EnumList[] = [];
  constructor(
    private rmModalDialogue: RmConfigDialogueProvider,
    private rmService: RmConfigService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private enumsrv: EnumService,
  ) { }

  ngOnInit(): void {
    this.loadEnums()
  }

  getRoomConfigData(e: any) {
    this.addFormEvent = e.data;
    this.eventData = {
      blId: e.data.blId,
      flId: e.data.flId,
      rmId: e.data.rmId,
    };
  }

  setRoomConfigData() {
    this.rmService.getRmConfig(this.eventData).subscribe((res: any) => {
      if (res !== null) {
        this.loaddata(res);
      }
      else{
        this.roomConfigsRecords = [];
      }
    });
  }

  loaddata(cdata: any) {
    this.roomConfigsRecords = [];
    this.roomConfigsRecords = cdata;
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res.map(x => Object.assign({}, x));
        this.enumRmConfig = this.enumList.filter(t => t.tableName.toLocaleUpperCase() === 'rm_config'.toLocaleUpperCase());
        this.enumExtAllowedData = this.enumRmConfig.filter(t => t.fieldName.toLocaleUpperCase() === 'external_allowed'.toLocaleUpperCase());
        this.enumExtAllowedData.unshift(new EnumList(null, "", "", 'Make a selection',null));
        this.enumIsReservable = this.enumRmConfig.filter(t => t.fieldName.toLocaleUpperCase() === 'is_reservable'.toLocaleUpperCase());
       // this.enumIsReservable.unshift(new Enums(0, "", "", 'Make a selection'));
        this.enumIsApprovalRequiredList = this.enumRmConfig.filter(t => t.fieldName.toLocaleUpperCase() === 'is_approval_req'.toLocaleUpperCase());
        this.enumIsApprovalRequiredList.unshift(new EnumList(null, "", "", 'Make a selection',null));
        this.enumExtAllowedData.map((item: any) => {
          if (item.enumValue == 'Yes') {
            this.enumIdExtAllowed = item.enumKey;
          }
        })
        this.enumIsReservable.map((item: any) => {
          if (item.enumValue == 'Yes') {
            this.enumIdIsReservable = item.enumKey;
          }
        })
        this.enumIsApprovalRequiredList.map((item: any) => {
          if (item.enumValue == 'Yes') {
            this.enumIsApprovalRequiredValue = item.enumKey;
          }
        })
      },
    );
  }

  addRecord() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      blId: this.addFormEvent.blId,
      flId: this.addFormEvent.flId,
      rmId: this.addFormEvent.rmId,
      blCode:this.addFormEvent.blBlCode,
      flCode:this.addFormEvent.flFlCode,
      rmCode:this.addFormEvent.rmCode,
      rmName: this.addFormEvent.rmName,
      configId: 0,
      preBlock: "0",
      postBlock: "0",
      maxCapacity: "1",
      minCapacity: "1",
      externalAllowed: this.enumIdExtAllowed,
      dayStart: "06:00",
      dayEnd: "18:00",
      dateCreated: null,
      timeCreated: null,
      dateLastUpdated: null,
      isReservable: this.enumIdIsReservable,
      isEdit: false,
      newRecord: true,
      isApprovalRequired: this.enumIsApprovalRequiredValue,
      arrangementId:null
    };
    this.rmModalDialogue.openDialog(dialogConfig);
    this.rmModalDialogue.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result == true) {
        this.messageService.add({ severity: 'success', summary: 'Record saved', detail: 'Record saved successfully' });
        this.setRoomConfigData();
      }
    });
  }

  openEditItem(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      blId: data.blId,
      flId: data.flId,
      rmId: data.rmId,
      blCode:this.addFormEvent.blBlCode,
      flCode:this.addFormEvent.flFlCode,
      rmCode:this.addFormEvent.rmCode,
      rmName: this.addFormEvent.rmName,
      configId: data.configId,
      preBlock: data.preBlock,
      postBlock: data.postBlock,
      maxCapacity: data.maxCapacity,
      minCapacity: data.minCapacity,
      externalAllowed: data.externalAllowed,
      dayStart: data.dayStart,
      dayEnd: data.dayEnd,
      isReservable: data.isReservable,
      isEdit: true,
      newRecord: false,
      isApprovalRequired: data.isApprovalRequired,
      arrangementId:data.arrangementId
    };
    this.rmModalDialogue.openDialog(dialogConfig);
    this.rmModalDialogue.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result == true) {
        this.messageService.add({ severity: 'success', summary: 'Record saved', detail: 'Record saved successfully' });
        this.setRoomConfigData();
      }
    });
  }

  deleteRecordConfirm(configId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Config Id-  ' + configId + '  ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletermc(configId);
      },
      key: "rmcGrid"
    });
  }

  deletermc(configId: number) {
    this.messageService.clear();
    this.rmService.deleteRmConfigById(configId).subscribe((res: any) => {
      if (res.code == 200) {
        this.messageService.add({ key: 'rmcMessage',severity: 'success', summary: 'Record deleted', detail: 'Record deleted' });
        setTimeout(() => {
          this.setRoomConfigData();
        }, 3);
      }else{
        this.messageService.add({ key: 'rmcMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
      }
    })
    
  }

  onCancel(): void {
    this.refreshPanels.emit(true);
  }

  getEnumById(id: any) {
    return id ? this.enumIsReservable.find(t => t.enumKey == id) != null ? this.enumIsReservable.find(t => t.enumKey == id)?.enumValue : '' : '';
  }

}
