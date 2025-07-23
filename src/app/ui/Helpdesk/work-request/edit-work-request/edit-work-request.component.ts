import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { WrCommentsServices } from '../service/work-request-comments.services';
import { UtilConstant } from 'src/common/UtilConstant';
import { WrCommentsProvider } from '../provider/wr-comments-provider';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';

@Component({
  selector: 'app-edit-work-request',
  templateUrl: './edit-work-request.component.html',
  styleUrls: ['./edit-work-request.component.scss'],
  providers: [MessageService]
})
export class EditWorkRequestComponent implements OnInit {

  frmWrDetail!: UntypedFormGroup;
  isView: boolean = false;
  isEdit:boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  wrCommentsData: any[] = [];
  allEmployees: any[] = [];
  enumEm: any[] = [];
  fullName: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditWorkRequestComponent>,
    private confirmationService: ConfirmationService,
    private wrCommentsServices: WrCommentsServices,
    private wrCommentsProvider: WrCommentsProvider,
    private messageService: MessageService,
    private employeeService: EmployeeService,
  ) {
    this.frmWrDetail = this.formBuilder.group({
      addWrFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isView = this.data.isView;
    this.isEdit = this.data.isEdit;
    this.loadFormData();
    this.loadAllEmployee();
    this.loadWrComments();
  }

  loadFormData() {
    if (this.data.wrData != null) {
      setTimeout(() => {
        this.frmWrDetail.patchValue({
          addWrFormPanel: this.data.wrData
        });
      }, 0);

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
      this.enumEm = this.allEmployees.filter(em => em.emId === id);
      this.fullName = this.enumEm.map(em => {
        if (em.firstName.length > 0 && em.lastName.length > 0) {
          return em.firstName + " " + em.lastName + ' - ' + em.emId;
        } else {
          return em.firstName + ' - ' + em.emId;
        }
      })
    }
    return this.fullName;
  }

  loadWrComments() {
    if (this.data.wrData.wrId != null) {
      this.wrCommentsServices.getWrCommentsByWrId(this.data.wrData.wrId).subscribe((res: any) => {
        if (res) {
          this.wrCommentsData = res
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
      wrId: this.data.wrData.wrId
    }
    this.wrCommentsProvider.openDialog(dialogConfig);
    this.wrCommentsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'wr-comments-save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadWrComments();
      }
    });
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to close ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: "wr-view"
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

}
