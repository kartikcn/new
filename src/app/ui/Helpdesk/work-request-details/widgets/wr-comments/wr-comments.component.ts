import { Component, Input, OnInit } from '@angular/core';
import { WrCommentsServices } from '../../../work-request/service/work-request-comments.services';
import { MatDialogConfig } from '@angular/material/dialog';
import { WrCommentsProvider } from '../../../work-request/provider/wr-comments-provider';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-wr-comments',
  templateUrl: './wr-comments.component.html',
  styleUrls: ['./wr-comments.component.scss'],
  providers: [MessageService]
})
export class WrCommentsComponent implements OnInit {
  wrCommentsData: any[] = [];
  requestId!: number;
  allEmployees: any[] = [];
  enumEm: any[] = [];
  fullName: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  loggedInEm: any;
  @Input() isReadOnly:boolean= false;
  @Input() isDetails:boolean= false;
  constructor(
    private wrCommentsServices: WrCommentsServices,
    private wrCommentsProvider: WrCommentsProvider,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.loggedInEm = this.authService.getLoggedInUserEMId();
    this.loadAllEmployee();
  }

  loadWrComments(requestId:any) {
    // this.requestId = requestId
    if (requestId != null) {
      this.wrCommentsServices.getWrCommentsByWrId(requestId).subscribe((res: any) => {
        if (res) {
          this.wrCommentsData = res.map((each: any)=>{
            return{
              ...each,
              formatedCommentedBy : this.getEmployeeFullName(each.emId),
              formatedCommentedDate : this.datePipe.transform(each.commentDate, 'dd MMM yyyy')
            }
          })
        } else {
          this.wrCommentsData = []
        }
      })
    }
  }

  
  onAddComments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      wrId: this.requestId,
      isEdit:false,
      isView: false,
    }
    this.wrCommentsProvider.openDialog(dialogConfig);
    this.wrCommentsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'wr-comments-save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadWrComments(result.wrId)
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

  getEmployeeFullName(id: any) {
    if (this.allEmployees) {
      this.enumEm = this.allEmployees.filter(em => em.emId == id);
      this.fullName = this.enumEm.map(em => {
        if (em.firstName.length > 0 && em.lastName.length > 0) {
          return em.firstName + " " + em.lastName + ' - ' + em.emCode;
        } else {
          return em.firstName + ' - ' + em.emCode;
        }
      })
    }
    return this.fullName;
  }

  onEdit(commentId:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      wrId: this.requestId,
      commentId:commentId,
      isEdit:true,
      isView: false,
    }
    this.wrCommentsProvider.openDialog(dialogConfig);
    this.wrCommentsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'wr-comments-save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadWrComments(result.wrId)
      }
    });
  }

  onView(commentId:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      wrId: this.requestId,
      commentId:commentId,
      isView: true,
      isEdit:false
    }
    this.wrCommentsProvider.openDialog(dialogConfig);
    this.wrCommentsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'wr-comments-save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadWrComments(result.wrId)
      }
    });
  }

}
