import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestPartsDialogueProvider } from '../providers/request-parts.provider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RequestPartsService } from '../services/request-parts.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-request-parts',
  templateUrl: './request-parts.component.html',
  styleUrls: ['./request-parts.component.scss'],
  providers: [MessageService]
})
export class RequestPartsComponent implements OnInit {
  requestPartsData:any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  requestId:any = 0;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  loggedIdUserName: any;
  @Input() isReadOnly:boolean = false;
  constructor(
   private requestPartsDialogueProvider: RequestPartsDialogueProvider,
   private messageService: MessageService,
   private requestPartsService:RequestPartsService,
   private confirmationService: ConfirmationService,
   private authService: AuthService,
   private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.loggedIdUserName = this.authService.getLoggedInUserId();
  }

  loadRecords(id:any) {
    this.requestPartsService.getAllByRquestId(id).subscribe((res: any) => {
      if (res.status != 202) {
        this.requestPartsData = res.map((each: any)=>{
          return{
            ...each,
            formateDateAssigned : this.datePipe.transform(each.dateAssigned, 'dd MMMM yyyy')
          }
        })
      }
      else {
        this.requestPartsData = [];
      }
     });
  }


  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: this.requestId,
      isView: false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    }
    this.requestPartsDialogueProvider.openDialog(dialogConfig);
    this.requestPartsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(result.requestId)
      }
    });
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

  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestPartId: id,
      requestId: this.requestId,
      isEdit: true,
      newRecord: false,
      isView: false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestPartsDialogueProvider.openDialog(dialogConfig);
    this.requestPartsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result===true || result=="deleted") {
        if(result===true){
          this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        }else {
          this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        }
        this.loadRecords(this.requestId);
      }
    });
  }

  onDelete(requestPartId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRequestPart(requestPartId);
      },
      key: "requestPartGrid"
    });
  }

  deleteRequestPart(requestPartId: any) {
    this.requestPartsService.deleteById(requestPartId).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.messageService.add({ key: 'requestPartwarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      } else {
        this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.requestId);
      }
    },
      error => {
      }
    );
  }

  onView(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestPartId: id,
      requestId: this.requestId,
      isEdit: true,
      newRecord: false,
      isView: true,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestPartsDialogueProvider.openDialog(dialogConfig);
    this.requestPartsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(result.requestId);
      }
    });
  }

}
