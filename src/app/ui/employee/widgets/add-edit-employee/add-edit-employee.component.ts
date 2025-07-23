import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeOutput } from '../../../user/model/employeOutput.model';
import { EmployeeLocation } from '../../model/employee-location.model';
import { EmployeeContact } from '../../model/employee-contact.model';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss'],
  providers:[MessageService]
})
export class AddEditEmployeeComponent implements OnInit {

  frmEmpDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditEmployeeComponent>,
    private empSrv: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.frmEmpDetail = this.formBuilder.group({
      frmEmployeeDetails: [],
      frmEmployeeContact: [],
      frmEmployeeLocation: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.isEdit = this.data.isEdit != null ? this.data.isEdit : false;
      this.loadData();
      this.isNewRecord();
    }
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord;
      if(this.isEdit && this.isNew){
        this.title = 'Add';
      }else if (this.isEdit && !this.isNew){
        this.title = 'Edit';
      }else {
        this.title = 'View';
      }
        
    }
  }
  loadData() {
    const calls = [];
    if (this.data.em_id != 0) {
      calls.push(this.empSrv.getEmById(this.data.em_id));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var data = {
          emId: 0,
          initials: null,
          firstName: null,
          lastName: null,
          maidenName: null,
          aliasName: null,
          email: null,
          emStd: null,
          emStatus: null,
          idNumber: null,
          birthDate: null,
          gender: null,
          dateJoin: null,
          dateLeave: null,
          costCentreId:null,
          emCode:null,
          em :{
            blId: null,
            flId: null,
            rmId: null,
            workType:null,
            divId:null,
            depId:null,
            subDepId:null
          }
        }
        var empLocation : EmployeeLocation={
          blId: null,
          flId: null,
          rmId: null,
          workType:null,
          divId:null,
          depId:null,
          subDepId:null
        }
        var empContact:EmployeeContact={
          // phoneHome: null,
          phoneWork: null,
          phonePersonal: null,
          faxNum: null,
          altContactName: null,
          altContactPhone: null,
        }
        setTimeout(() => {
          this.frmEmpDetail.patchValue({
            frmEmployeeDetails: data,
            frmEmployeeContact: empContact,
            frmEmployeeLocation: data
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.frmEmpDetail.patchValue({
            frmEmployeeDetails: results[0].employeeDetails,
            frmEmployeeContact: results[0].employeeContact,
            frmEmployeeLocation: results[0]

          });
        }, 0);
      }
    });
  }
  saveRecords() {
    this.messageService.clear();
    if (this.frmEmpDetail.valid) {
      const empData: EmployeeOutput = {
        "employeeContact": this.frmEmpDetail.controls.frmEmployeeContact.value,
        "employeeDetails": this.frmEmpDetail.controls.frmEmployeeDetails.value,
        "employeeLocation": this.frmEmpDetail.controls.frmEmployeeLocation.value
      }
      this.empSrv.saveEmployee(empData).subscribe((res: any) => {
        if (res.code == 200) {
          // this.toastr.success("Record saved Successfully.");
          this.messageService.add({ key: 'save', severity: 'success', summary: 'success', detail: res.text });
          this.dialogRef.close(true);
        }else{
          this.messageService.add({ key: 'save', severity: 'error', summary: 'error', detail: res.text });
        }
      },
      );
    }

  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      }
    });
  }

  clearForm() {
    this.frmEmpDetail.controls.frmEmployeeDetails.reset();
  }
  getFormAction(){
    if(this.frmEmpDetail.valid){
      return false;
    }
    else
    return true;
  }

}
