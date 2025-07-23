import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { UntypedFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { UserPasswrodInputDto } from '../user-profile/model/user-password.model';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements  OnInit, ControlValueAccessor, OnDestroy {

  passResetForm: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  isExpired:boolean=true;
  resetLinkTime:number=0;
  currentTime: number = new Date().getTime();
  msg:string="";
  resMsg:boolean=false;
  isSuccess:boolean=false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private userSrv:UsersService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) { 
    /// Start Of Building Form 
    this.passResetForm = this.formBuilder.group({
      userName: [''],
      userNewPwd: ['', [Validators.required]],
      newPasswordConfirm: ['', [Validators.required, this.checkPassword()]],

    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.passResetForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  /// Start Preparing Entered Data Model
  get value(): UserPasswrodInputDto {
    const records: UserPasswrodInputDto = {
      userName: this.passResetForm.controls.userName.value,
      userNewPwd: this.passResetForm.controls.userNewPwd.value,
      userPwd: this.passResetForm.controls.userPwd.value,
      userDatePwdChanged: this.passResetForm.controls.userDatePwdChanged.value,
    }
    return records;
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.key != null) {
        var url_key:string = params.key;
        this.resetLinkTime = Number(url_key.substr(url_key.lastIndexOf("_")+1, url_key.length));

        if (Math.abs(this.currentTime - this.resetLinkTime) <= 60 * 60 * 24 * 1000) {
          this.isExpired =false;
        }
        else{
          this.isExpired=true;
        }
        
         
      }
      else{
        this.isExpired = true;
      }
      if (params.user !=null){
          setTimeout(() => {
            this.passResetForm.patchValue({
              userName: params.user,
            });
          },0
        );
      }
    });
  }

  set value(value: UserPasswrodInputDto) {
    setTimeout(() => {
      this.passResetForm.patchValue({
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
      this.passResetForm.reset();

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


  checkPassword(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null && control.value.length > 1) {
        this.passResetForm.controls['newPasswordConfirm'].setErrors(null);
        this.passResetForm.clearAsyncValidators();
        this.passResetForm.updateValueAndValidity();
        let userPwd = this.passResetForm.controls['userNewPwd'].value;
        if (userPwd != null && userPwd === control.value) {
          return null;
        }
        else {
          return { 'incorrect': true };
        }

      }
      return null;
    };
  }

  onCancel(){
    this.passResetForm.reset();
  }
  onSave(){
    this.msg="";
    if (this.passResetForm.valid){
      let userPwdRec: UserPasswrodInputDto = {
        "userName": this.passResetForm.controls.userName.value,
        "userDatePwdChanged": this.datePipe.transform(new Date(), "dd/MM/yyyy"),
        "userNewPwd": this.passResetForm.controls.userNewPwd.value,
        "userPwd": ""
      };
      this.userSrv.updateUserCrendentials(userPwdRec).subscribe((res) => {
        if(res !== null && res.code=="200"){
          this.resMsg=true;
          this.isSuccess =true;
          this.msg = "password updated successfully"
        }else{
          this.resMsg = true;
          this.isSuccess=false;
          this.msg = "Unable to process the record."
        }
        
      },(error)=>{
        this.resMsg = true;
        this.isSuccess = false;
        this.msg = "Unable to process the record."
      })

    }
  }

}
