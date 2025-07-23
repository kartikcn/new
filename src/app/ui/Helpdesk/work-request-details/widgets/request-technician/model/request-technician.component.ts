import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestTechnicianDialogueProvider } from '../provider/request-technician';
import { Enums } from 'src/app/model/enums.model';
import { RequestTechnicianService } from '../widgets/services/request_technician.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-technician',
  templateUrl: './request-technician.component.html',
  styleUrls: ['./request-technician.component.scss'],
  providers: [MessageService]
})
export class RequestTechnicianComponent implements OnInit {

  reqtechniData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumRequestTechniciansData: Enums[] = [];
  enumTechnicianId: any[] = [];
  loading: boolean = false;
  requestId: any = 0;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  loggedIdTechnicianId: any;
  @Input() isReadOnly:boolean = false;
  constructor(
    private requestTechnicianDialogueProvider: RequestTechnicianDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private requestTechnicianService: RequestTechnicianService,
    private authService: AuthService,
    private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.loggedIdTechnicianId = this.authService.getLoggedInTechnicianId();
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
      isView:false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTechnicianDialogueProvider.openDialog(dialogConfig);
    this.requestTechnicianDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'requestTechnicianSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.requestId);
      }
    });
  }

  loadRecords(requestId: any) {
    this.loading = true;
    this.requestTechnicianService.getAllRequestTechnician(requestId).subscribe((res: any) => {
      if (res.status != 202) {

        this.reqtechniData = res.map((each: any)=>{
          return {
            ...each,
            formatedDateAssign : this.datePipe.transform(each.dateAssign, 'dd MMMM yyyy')
          }
        })
      }
      else {
        this.reqtechniData = [];
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
      requestTechId: id,
      isEdit: true,
      newRecord: false,
      isView:false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTechnicianDialogueProvider.openDialog(dialogConfig);
    this.requestTechnicianDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true || result === 'deleted') {
        if(result === true) {
          this.messageService.add({ key: 'requestTechnicianSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        } else {
          this.messageService.add({ key: 'requestTechnicianSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        }
        this.loadRecords(this.requestId);
      }
    });
  }

  onDelete(reqTechnician: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRequestTechnician(reqTechnician);
      },
      key: "requestTechniciangrid"
    });
  }

  deleteRequestTechnician(requestTechnicianType: any) {
    this.requestTechnicianService.deleteByRequestTechnician(requestTechnicianType).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.messageService.add({ key: 'requestTechnicianwarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      } else {
        this.messageService.add({ key: 'requestTechnicianSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
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
      requestTechId: id,
      isEdit: true,
      newRecord: false,
      isView:true,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTechnicianDialogueProvider.openDialog(dialogConfig);
    this.requestTechnicianDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'requestTechnicianSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.requestId);
      }
    });
  }


}
