import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EnumService } from 'src/app/services/enum.service';
import { UsersService } from 'src/app/services/users.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { UserModalDialogueProvider } from '../../user/provider/user.provider';
import { UserProfile } from '../model/user-profile.model';
import { UserPhotoModalDialogueProvider } from '../provider/add-user-profile.provider';
import { UserPasswordModalDialogueProvider } from '../provider/user-change-pwd.provider';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, ControlValueAccessor, OnDestroy {

  user_name: string = "";
  userProfileFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumUsers: EnumList[] = [];
  enumEm: EnumList[] = [];
  userProfileRec!: UserProfile;
  visibleSidebar = true;
  value: any;
  isUserProfileRec: boolean = false;
  userProfilePic: string = "";
  isInitialShow: boolean = true;
  compName: string = "";
  planName: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    private formBuilder: UntypedFormBuilder,
    private userSrv: UsersService,
    private enumsrv: EnumService,
    private emSrv: EmployeeService,
    private userPhotoModalDialogue: UserPhotoModalDialogueProvider,
    private userPwdModalDialogueProvider: UserPasswordModalDialogueProvider,
    private userModalDialogueProvider: UserModalDialogueProvider,
  ) {
    /// Start Of Building Form 
    this.userProfileFormPanel = this.formBuilder.group({
      userName: [''],
      emEmail: [''],
      userRole: [''],
      emName: [''],
      ipAddress: [''],
      emId: [''],
      compId: ['']
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.userProfileFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnInit(): void {
    this.loadEnums();
    if (this.data != null && this.data.user_name) {
      this.loadUserProfile(this.data.user_name);
      //this.getCompDetails();
    }

  }
  // getCompDetails(): void {
  //   this.compSrv.getPlanFromCompany().subscribe((res) => {
  //     if (res) {
  //       this.planName = res.planName;
  //       this.compName = res.compName;
  //     }
  //   });
  // }
  loadUserProfile(user_name: string) {
    this.userSrv.getUserProfile(user_name).subscribe((res: UserProfile) => {
      if (res) {
        if(res.initials==null){
          res.initials='';
        }
        this.userProfileRec = res;
        this.isUserProfileRec = true;
        this.isInitialShow = res.emPhoto.length == 0;
        if (!this.isInitialShow)
          this.userProfilePic = "data:image/png;base64," + res.emPhoto;

        //this.writeValue(this.userProfileRec);
      }
    });
  }
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumUsers = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'fm_users'.toLocaleUpperCase());
        this.enumEm = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'em'.toLocaleUpperCase());
      },
      error => {
        // this.loginError = error.errorDesc;
      }
    );
  }
  getNameById(enumKey: any) {
    return enumKey ? this.enumEm.find(t => t.enumKey == enumKey) != null ? this.enumEm.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }

  openEditItem() {
    this.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      userId: this.userProfileRec.userId,
      isEdit: true,
      newRecord: false,
      title: "Edit"
    };
    this.userModalDialogueProvider.openDialog(dialogConfig);
    this.userModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
    });
  }


  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.userProfileFormPanel.reset();

    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  onChange: any = () => { };
  onTouched: any = () => { };

  confirmDialog() {
    this.dialogRef.close();
  }
  onChangePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      user_name: this.data.user_name,

    };
    this.userPwdModalDialogueProvider.openDialog(dialogConfig);
    this.userPwdModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
    });
  }
  close(): void {
    this.visibleSidebar = false;
    this.dialog.closeAll()
  }
  onAddPhoto() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      display: true,

    };
    this.userPhotoModalDialogue.openDialog(dialogConfig);
    this.userPhotoModalDialogue.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.userPhotoChanged();
      }
    });
  }

  userPhotoChanged() {
    this.emSrv.getEmById(this.userProfileRec.emEmployeeEmId).subscribe((res) => {
      if (res && res.employeeDetails.emPhoto != null) {
        this.isInitialShow = res.employeeDetails.emPhotoMobile.length == 0;
        if (!this.isInitialShow)
          this.userProfilePic = "data:image/png;base64," + res.employeeDetails.emPhotoMobile;
      }
    })
  }

}
