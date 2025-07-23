import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { Enums } from 'src/app/model/enums.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { RequestToolsDialogueProvider } from './provider/request-tool';
import { RequestToolsService } from './widgets/services/request-tools.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-tools',
  templateUrl: './request-tools.component.html',
  styleUrls: ['./request-tools.component.scss'],
  providers: [MessageService]
})
export class RequestToolsComponent implements OnInit {
  reqtoolData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  loading: boolean = false;
  requestId: any = 0;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  loggedIdUserName: any;
  @Input() isReadOnly:boolean = false;
  constructor(
    private messageService: MessageService,
    private requestToolsDialogueProvider: RequestToolsDialogueProvider,
    private confirmationService: ConfirmationService,
    private requestToolsService: RequestToolsService,
    private authService: AuthService,
    private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.loggedIdUserName = this.authService.getLoggedInUserId();
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
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestToolsDialogueProvider.openDialog(dialogConfig);
    this.requestToolsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'requestToolsSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.requestId);
      }
    });
  }

  loadRecords(requestId: any) {
    this.loading = true;
    this.requestToolsService.getAllRequestTools(requestId).subscribe((res: any) => {
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

  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: this.requestId,
      reqToolId: id,
      isEdit: true,
      newRecord: false,
      isView: false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestToolsDialogueProvider.openDialog(dialogConfig);
    this.requestToolsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true || result == "deleted") {
        if(result === true) {
          this.messageService.add({ key: 'requestToolsSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        } else {
          this.messageService.add({ key: 'requestToolsSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        }
        this.loadRecords(this.requestId);
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
      key: "requestToolsgrid"
    });
  }

  deleteRequestTools(requestToolsType: any) {
    this.requestToolsService.deleteByRequestTools(requestToolsType).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.messageService.add({ key: 'requestToolswarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      } else {
        this.messageService.add({ key: 'requestToolsSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
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

  onView(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: this.requestId,
      reqToolId: id,
      isEdit: true,
      newRecord: false,
      isView: true,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestToolsDialogueProvider.openDialog(dialogConfig);
    this.requestToolsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'requestToolsSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.requestId);
      }
    });
  }
}
