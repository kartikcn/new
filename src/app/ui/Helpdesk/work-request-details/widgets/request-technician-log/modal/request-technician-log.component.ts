import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestTechnicianLogDialogueProvider } from '../provider/request-technician-log.provider';
import { RequestTechnicianLogService } from '../services/request-technician-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';

@Component({
  selector: 'app-request-technician-log',
  templateUrl: './request-technician-log.component.html',
  styleUrls: ['./request-technician-log.component.scss'],
  providers: [MessageService]
})
export class RequestTechnicianLogComponent implements OnInit {

  requestTechnicianLogData: any[] = [];
  requestTechnicianId:any = 0;
  requestId:any=0;
  enumTechReqLogData:any[]=[];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumWorkType: any[] = [];
  enumResourceType:any[]=[];
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  loggedIdTechnicianId : any;
  allEmployees : any[]=[];
  enumEm: any[] = [];
  fullName : any = '';
  @Input() isReadOnly:boolean = false;
  constructor(
    private requestTechnicianLogProvider: RequestTechnicianLogDialogueProvider,
    private requestTechnicianLogService: RequestTechnicianLogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private enumsrv: EnumService,
    private authServe : AuthService,
    private employeeService : EmployeeService
  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.loadAllEmployee();
    this.loggedIdTechnicianId = this.authServe.getLoggedInTechnicianId();
  }

  loadRecords(requestId:any) {
    this.loading = true;
    this.requestTechnicianLogService.getAllByRequestId(requestId).subscribe((res: any) => {
      if (res) {
        this.requestTechnicianLogData = res;
      }
      else {
        this.requestTechnicianLogData = [];
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
    dialogConfig.autoFocus = false;
    dialogConfig.width = '700px';
    dialogConfig.data = {

     requestTechnicianId:this.requestTechnicianId,
      isEdit: false,
      newRecord: true,
      requestId:this.requestId,
      technician : true,
      isView: false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTechnicianLogProvider.openDialog(dialogConfig);
    this.requestTechnicianLogProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'reqTechLogSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.requestId);
      }
    });
  }

  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      requestTechnicianId:this.requestTechnicianId,
      requestTechnicianLogId: id,
      requestId:this.requestId,
      isEdit: true,
      newRecord: false,
      isView: false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTechnicianLogProvider.openDialog(dialogConfig);
    this.requestTechnicianLogProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'reqTechLogSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.requestId);
      }
    });
  }

  onDelete(reqTechLogId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleterequestTechnicianLog(reqTechLogId);
      },
      key: "reqTechLoggrid"
    });
  }

  deleterequestTechnicianLog(requestTechnicianLogType: any) {
    this.requestTechnicianLogService.deleteByRequestTechnicanLogId(requestTechnicianLogType).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.messageService.add({ key: 'reqTechlogwarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      } else {
        this.messageService.add({ key: 'reqTechLogSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.requestId);
      }
    },
      error => {
      }
    );
  }
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumTechReqLogData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'request_technician_log'.toLocaleUpperCase());
        this.enumWorkType = this.enumTechReqLogData.filter(t => t.fieldName.toLocaleUpperCase() === 'work_type'.toLocaleUpperCase());
        this.enumResourceType = this.enumTechReqLogData.filter(t => t.fieldName.toLocaleUpperCase() === 'resource_type'.toLocaleUpperCase());
         this.loadRecords(this.requestId);
        },
     error => {
     }
    );
  }
  getEnumById(id: any) {
    return this.enumWorkType.find((t: any) => t.id === id)?.enumValue
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

  getResourceTypeName (enumKey: any){
    return enumKey ? this.enumResourceType.find(t => t.enumKey == enumKey) != null ? this.enumResourceType.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }

  loadAllEmployee() {
    this.employeeService.getAllEmployeeList().subscribe((res: any) => {
      if (res) {
        this.allEmployees = res;
      }
      else {
        this.allEmployees = [];
      }
    })
  }

  onView(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '650px';
    dialogConfig.data = {
      requestTechnicianId:this.requestTechnicianId,
      requestTechnicianLogId: id,
      requestId:this.requestId,
      isEdit: true,
      newRecord: false,
      isView: true,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestTechnicianLogProvider.openDialog(dialogConfig);
    this.requestTechnicianLogProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'reqTechLogSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.requestId);
      }
    });
  }

}
