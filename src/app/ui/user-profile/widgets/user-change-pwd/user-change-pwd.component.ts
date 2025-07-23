import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { UsersService } from 'src/app/services/users.service';
import { UserPasswrodInputDto } from '../../model/user-password.model';
import { UserProfile } from '../../model/user-profile.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-change-pwd',
  templateUrl: './user-change-pwd.component.html',
  styleUrls: ['./user-change-pwd.component.scss'],
  providers: [MessageService]
})
export class UserChangePwdComponent implements OnInit, ControlValueAccessor, OnDestroy {

  user_name: string = "";
  userPasswordPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumUsers: Enums[] = [];
  enumStatus: Enums[] = [];
  userPasswordRec!: UserPasswrodInputDto;
  userUpdateRec!: UserPasswrodInputDto;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UserChangePwdComponent>,
    private formBuilder: UntypedFormBuilder,
    private userSrv: UsersService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {
    /// Start Of Building Form 
    this.userPasswordPanel = this.formBuilder.group({
      userName: [''],
      userPwd: [''],
      userNewPwd: ['', [Validators.required]],
      newPasswordConfirm: ['', [Validators.required,this.checkPassword()]],
      
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.userPasswordPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnInit(): void {
    if (this.data != null && this.data.user_name) {
      this.loadData(this.data.user_name);
    }

  }
  loadData(user_name: string) {
    this.userPasswordRec = {
      "userName": user_name,
      "userDatePwdChanged": this.datePipe.transform(new Date(),"dd/MM/yyyy"),
      "userNewPwd": "",
      "userPwd": ""

    }
    this.writeValue(this.userPasswordRec);
  }
  loadEnums() {
    
  }
  checkPassword(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null && control.value.length > 1 ) {
        this.userPasswordPanel.controls['newPasswordConfirm'].setErrors(null);
        this.userPasswordPanel.clearAsyncValidators();
        this.userPasswordPanel.updateValueAndValidity();
        let userPwd = this.userPasswordPanel.controls['userNewPwd'].value;
        if (userPwd != null && userPwd === control.value){
          return null;
       }
       else{
          return { 'incorrect': true };
       }

      }
      return null;
    };
  }

  /// Start Preparing Entered Data Model
  get value(): UserPasswrodInputDto {
    const records: UserPasswrodInputDto = {
      userName: this.userPasswordPanel.controls.userName.value,
      userNewPwd: this.userPasswordPanel.controls.userNewPwd.value,
      userPwd: this.userPasswordPanel.controls.userPwd.value,
      userDatePwdChanged: this.userPasswordPanel.controls.userDatePwdChanged.value,
    }
    return records;
  }

  set value(value: UserPasswrodInputDto) {
    setTimeout(() => {
      this.userPasswordPanel.patchValue({
        userName: value.userName,
        userNewPwd: value.userNewPwd,
        userPwd: value.userPwd,
        userDatePwdChanged: value.userDatePwdChanged,
      });
      this.onChange(value);
      this.onTouched();
    }, 0);
  }
  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.userPasswordPanel.reset();

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
  onSave(){
    if (this.userPasswordPanel.valid) {
      let userPwdRec: UserPasswrodInputDto = {
        "userName": this.data.user_name,
        "userDatePwdChanged": this.datePipe.transform(new Date(), "dd/MM/yyyy"),
        "userNewPwd": this.userPasswordPanel.controls.userNewPwd.value,
        "userPwd": this.userPasswordPanel.controls.userPwd.value
      };
      this.userSrv.updateUserCrendentials(userPwdRec).subscribe((res) => {
        if(res.text == 'Record saved successfully.') {
          this.messageService.clear();
          this.messageService.add({ key: 'message', severity: 'success', summary: 'Password updated successfully', detail: 'Password updated successfully' });
          setTimeout(() => {
            this.dialogRef.close(true);
          },1000)
        }
        
      })
    }
    
  }
}
