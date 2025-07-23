import { Component, OnInit, Inject, ViewChild,  } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EnumService } from 'src/app/services/enum.service';
import { UsersService } from 'src/app/services/users.service';
import { ConfirmationService } from 'primeng/api';
import { UserOutputDto } from '../../model/DTO/userOutputDTO.model';
import { AddUserComponent } from '../add-user-item/add-user-item.component';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { EmployeeOutput } from '../../model/employeOutput.model';
import { UserOutput } from '../../model/userOutput.model';
import { UtilConstant } from '../../../../../common/UtilConstant';


declare var $ : any;
@Component({
  selector: 'app-user-detail',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})

export class AddEditUserComponent implements OnInit {

  frmUserDetail: UntypedFormGroup;
  @ViewChild(AddUserComponent, { static: false }) userFormPanel!: AddUserComponent;
  @ViewChild(AddEmployeeComponent, { static: false }) empFormPanel!: AddEmployeeComponent;


  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean= true;
  title:string="";
  isProfile:boolean=false;
  isEmpFormPanelShow:boolean=false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    private enumsrv: EnumService,
    private userSrv: UsersService,
    private confirmationService: ConfirmationService,
    private empSrv:EmployeeService
  ) {
    this.frmUserDetail = this.formBuilder.group({
      userFormPanel: [],
      frmEmployeeDetails:[],
      frmEmployeeLocation:[],
      frmEmployeeContact:[]

    });
  }

  ngOnInit() {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.isEdit = this.data.isEdit;
      this.loadData();
      this.isNewRecord();
      this.title = this.data.title;
    }
  }
  
 
  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord
    }
    if(this.data.isProfile){
      this.isProfile = this.data.isProfile;
    }
  }
  loadData() {
    const calls = [];
    if (this.data.userId != null && this.data.userId > 0) {
      calls.push(this.userSrv.getUserById(this.data.userId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe((results:any) => {
      if (results[0] == null) {
        
      } else {
        if(results[0].user.technicianId !== null){
          this.userFormPanel.loadUnAssignedTechnician(results[0].user.technicianId)
        }
        setTimeout(() => {
          this.frmUserDetail.patchValue({
            userFormPanel: results[0].user,
            frmEmployeeDetails: results[0]?.employee.employeeDetails,
            frmEmployeeContact: results[0]?.employee.employeeContact,
            frmEmployeeLocation: results[0]?.employee
          });
        }, 0);
        if (results[0]?.employee != null){
          this.isEmpFormPanelShow = true;
        }
      }
    });
  }
  saveRecords() { // save only user data
    this.userFormPanel.user_name_exists = false;
    if (this.frmUserDetail.controls.userFormPanel.valid ) {
      
      let empData: EmployeeOutput = {
        "employeeContact": this.frmUserDetail.controls.frmEmployeeContact.value,
        "employeeDetails": this.frmUserDetail.controls.frmEmployeeDetails.value,
        "employeeLocation": this.frmUserDetail.controls.frmEmployeeLocation.value
      }
      const userFormRecord: UserOutput = this.frmUserDetail.controls.userFormPanel.value;
      if(empData.employeeDetails){
        // empData.employeeDetails.compId =  userFormRecord.compId;
      }

      const userRecord: UserOutputDto={
        user: userFormRecord,
        employee: empData,
        newRecord:this.isNew
      }
      this.userSrv.saveUsers(userRecord).subscribe((res:any)=>{
        this.loadData()
        this.dialogRef.close( true);
      })
    }

  }


  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
      }
    });
    
  }
  isEmpChecked(event:any){
    this.isEmpFormPanelShow = event.showEmpPanel;
    let em_id = event.em_id;
    this.loadEmployeeData(em_id);
  }

  loadEmployeeData(em_id:any) {
    const calls = [];
    if (em_id != null && em_id !=="0") {
      calls.push(this.empSrv.getEmById(em_id));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe((results:any) => {
      if (results[0] == null) {
        
        var data = {
          emId: null,
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
          phoneHome: null,
          phoneWork: null,
          phonePersonal: null,
          faxNum: null,
          altContactName: null,
          altContactPhone: null,
          dateJoin: null,
          dateLeave: null,
          compId: 1,
        }
        setTimeout(() => {
          this.frmUserDetail.patchValue({
            frmEmployeeDetails: data
          });
          this.empFormPanel.isNew = true;
        }, 0);
      } else {
        setTimeout(() => {
          this.frmUserDetail.patchValue({
            frmEmployeeDetails: results[0].employeeDetails,
            frmEmployeeLocation:results[0].employeeLocation
          });
          this.empFormPanel.isNew = false;
        }, 0);
      }
    });
  }

}
