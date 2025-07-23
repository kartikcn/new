import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestTradeDialogueProvider } from '../providers/request-trade.provider';
import { RequestTradeService } from '../services/request-trade-services';

@Component({
  selector: 'app-request-trades',
  templateUrl: './request-trades.component.html',
  styleUrls: ['./request-trades.component.scss'],
  providers: [MessageService]
})
export class RequestTradesComponent {
  reqtoolData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  loading: boolean = false;
  requestId: any = 0;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  loggedIdUserName: any;
  @Input() isReadOnly: boolean = false;

  constructor(
    private messageService: MessageService,
    private requestTradeDialogueProvider: RequestTradeDialogueProvider,
    private confirmationService: ConfirmationService,
    private requestTradeService: RequestTradeService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loggedIdUserName = this.authService.getLoggedInUserId();
  }

  loadRecords(requestId: any) {
    this.loading = true;
    this.requestTradeService.getAllRequestTrades(requestId).subscribe((res: any) => {
      if (res.status != 202) {

        this.reqtoolData = res.map((each: any)=>{
          return{
            ...each,
            formatedDateAssigned : this.datePipe.transform(each.dateAssign, 'dd MMMM yyyy')
          }
        })
      }
      else {
        this.reqtoolData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: this.requestId,
      isEdit: false,
      newRecord: true,
      isView: false,
      requestTradeId:null,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTradeDialogueProvider.openDialog(dialogConfig);
    this.requestTradeDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'requestTradeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.requestId);
      }
    });
  }

  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: this.requestId,
      requestTradeId: id,
      isEdit: true,
      newRecord: false,
      isView: false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTradeDialogueProvider.openDialog(dialogConfig);
    this.requestTradeDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true || "deleted") {
        if(result === true){
          this.messageService.add({ key: 'requestTradeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        } else {
          this.messageService.add({ key: 'requestTradeSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        }
        this.loadRecords(this.requestId);
      }
    });
  }

  onView(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: this.requestId,
      requestTradeId: id,
      isEdit: true,
      newRecord: false,
      isView: true,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTradeDialogueProvider.openDialog(dialogConfig);
    this.requestTradeDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'requestTradeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        //this.loadRecords(this.requestId);
      }
    });
  }

  onDelete(reqTools: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRequestTools(reqTools);
      },
      key: "requestTradegrid"
    });
  }

  deleteRequestTools(requestToolsType: any) {
    this.requestTradeService.deleteByRequestTrade(requestToolsType).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.messageService.add({ key: 'requestTradewarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      } else {
        this.messageService.add({ key: 'requestTradeSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.requestId);
      }
    },
      error => {
      }
    );
  }

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }


}
