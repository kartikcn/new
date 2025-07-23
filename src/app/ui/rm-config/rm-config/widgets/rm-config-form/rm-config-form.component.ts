import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { RmConfigService } from '../../services/rm-config.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { RmcatFilterInput } from 'src/app/ui/rmcat/modal/rmcatFilterInput.model';
import { RmTypeFilterInputDTO } from 'src/app/ui/room category/model/DTO/rmTypeFilterInput.model';
import { ArrangementService } from 'src/app/ui/arrangement/services/arrangement.service';
import { ArrangementFilterInputDTO } from 'src/app/ui/arrangement/model/arrangementFilterInput.model';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-rm-config-form',
  templateUrl: './rm-config-form.component.html',
  styleUrls: ['./rm-config-form.component.scss'],
  providers: [MessageService]
})
export class RmConfigFormComponent implements OnInit {
  isNew: boolean = true;
  isEdit: boolean = true;
  title: String = "Add";
  rmConfigForm: UntypedFormGroup;
  enumList: EnumList[] = [];
  enumRmConfig: EnumList[] = [];
  enumExtAllowedData: EnumList[] = [];
  enumIsReservable: EnumList[] = [];
  enumRmCat: RmcatFilterInput[] = [];
  enumAllRmCat: RmcatFilterInput[] = [];
  enumRmType: RmTypeFilterInputDTO[] = [];
  enumAllRmType: RmTypeFilterInputDTO[] = [];
  time: Date | null = null;
  dayStart: string | null = null;
  dayEnd: string | null = null;
  errorMsg: string = '';
  enumIsApprovalRequiredList: EnumList[] = [];
  enumArrangementType : any[]=[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private confirmationService: ConfirmationService,
    private enumsrv: EnumService,
    private service: RmConfigService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<RmConfigFormComponent>,
    private arrangeService : ArrangementService,
    private datePipe: DatePipe,
  ) {
    this.rmConfigForm = this.formBuilder.group({
      blId: [null, [Validators.required]],
      flId: [null, [Validators.required]],
      rmId: [null, [Validators.required]],
      blCode: ['', [Validators.required]],
      flCode: ['', [Validators.required]],
      rmCode: ['', [Validators.required]],
      rmName: [''],
      preBlock: ['',],
      postBlock: ['',],
      maxCapacity: ['', [Validators.required, Validators.min(1)]],
      minCapacity: ['', [Validators.required, Validators.min(1)]],
      dayStart: ['', [Validators.required]],
      dayEnd: ['', [Validators.required]],
      externalAllowed: [null, [Validators.required, Validators.min(1)]],
      isReservable: [null, [Validators.required, Validators.min(1)]],
      arrangementId:[null,[Validators.required]],
      isApprovalRequired: ['', [Validators.required,Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.setFormData(this.data);
    this.loadEnums();
    this.isNew = true;
    if (this.data != null) {
      this.isNewRecord();
    }
   
    this.loadArrangementType();
  }

  setFormData(data: any) {
    setTimeout(() => {
      this.rmConfigForm.patchValue({
        blId: data.blId,
        flId: data.flId,
        rmId: data.rmId,
        blCode:data.blCode,
        flCode:data.flCode,
        rmCode:data.rmCode,
        rmName: data.rmName,
        preBlock: data.preBlock,
        postBlock: data.postBlock,
        maxCapacity: data.maxCapacity,
        minCapacity: data.minCapacity,
        dayStart: data.dayStart,
        dayEnd: data.dayEnd,
        externalAllowed: data.externalAllowed,
        isReservable: data.isReservable,
        arrangementId:data.arrangementId,
        isApprovalRequired: data.isApprovalRequired,
      });
    }, 0);
    
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res.map(x => Object.assign({}, x));
        this.enumRmConfig = this.enumList.filter(t => t.tableName.toLocaleUpperCase() === 'rm_config'.toLocaleUpperCase());
        this.enumExtAllowedData = this.enumRmConfig.filter(t => t.fieldName.toLocaleUpperCase() === 'external_allowed'.toLocaleUpperCase());
        this.enumExtAllowedData.unshift(new EnumList(null, "", "", 'Make a selection',null));
        this.enumIsReservable = this.enumRmConfig.filter(t => t.fieldName.toLocaleUpperCase() === 'is_reservable'.toLocaleUpperCase());
        this.enumIsReservable.unshift(new EnumList(null, "", "", 'Make a selection',null));
        this.enumIsApprovalRequiredList = this.enumRmConfig.filter(t => t.fieldName.toLocaleUpperCase() === 'is_approval_req'.toLocaleUpperCase());
        this.enumIsApprovalRequiredList.unshift(new EnumList(null, "", "", 'Make a selection',null));
      },
      error => {
      }
    );
  }

  

  loadArrangementType(){
    this.arrangeService.getAllArrangements().subscribe( res => {
      this.enumArrangementType = res.map((i: any) => { i.name = i.arrangementType ; return i; });
      this.enumArrangementType.unshift(new ArrangementFilterInputDTO('','','Make a selection',null));
    });
  }

  checkSelectedValue(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value !== null && control.value !== "") {
        var isReservable = this.rmConfigForm.controls['isReservable'].value;
        var externalAllowed = this.rmConfigForm.controls['externalAllowed'].value;
        var isApprovalRequired = this.rmConfigForm.controls['isApprovalRequired'].value;
        this.rmConfigForm.clearAsyncValidators();
        this.rmConfigForm.updateValueAndValidity();
        if (control.value == 'Make a selection' && control.value == isReservable) {
          this.rmConfigForm.controls['isReservable'].setErrors({ 'incorrect': true });
          this.rmConfigForm.updateValueAndValidity();
          return { 'incorrect': true };
        } else if (control.value == 'Make a selection' && control.value == externalAllowed) {
          this.rmConfigForm.controls['externalAllowed'].setErrors({ 'incorrect': true });
          this.rmConfigForm.updateValueAndValidity();
          return { 'incorrect': true };
        }else if (control.value == 'Make a selection' && control.value == isApprovalRequired) {
          this.rmConfigForm.controls['isApprovalRequired'].setErrors({ 'incorrect': true });
          this.rmConfigForm.updateValueAndValidity();
          return { 'incorrect': true };
        }
        else {
          return null;
        }
      }
      return null;
    }
  }
  onSaveRecord() {
    var RmConfigData = {
      configId: this.data != null ? this.data.configId : 0,
      blId: this.data.blId,
      flId: this.data.flId,
      rmId: this.data.rmId,
      preBlock: this.rmConfigForm.controls.preBlock.value,
      postBlock: this.rmConfigForm.controls.postBlock.value,
      maxCapacity: this.rmConfigForm.controls.maxCapacity.value,
      minCapacity: "1",
      dayStart: this.convertToTime(this.rmConfigForm.controls.dayStart.value),
      dayEnd: this.convertToTime(this.rmConfigForm.controls.dayEnd.value),
      externalAllowed: this.rmConfigForm.controls.externalAllowed.value,
      isReservable: this.rmConfigForm.controls.isReservable.value,
      arrangementId:this.rmConfigForm.controls.arrangementId.value,
      rmName: this.data.rmName,
      isApprovalRequired: this.rmConfigForm.controls.isApprovalRequired.value
    };
    this.service.saveRmConfig(RmConfigData).subscribe((res: any) => {
      if (res.configId) {
        this.messageService.add({ key: 'rmConfig', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      }else if(res.code == 409){
        this.messageService.add({ key: 'rmConfig', severity: 'error', summary: 'error', detail: res.text });
      }
    })
  }

  convertToTime(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      currDate.setSeconds(0);
      currDate.setMilliseconds(0);
     return this.datePipe.transform(currDate, "HH:mm:ss");
    } else {
      return '';
    }
  }

  getTime(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      currDate.setSeconds(0);
      currDate.setMilliseconds(0);
      return currDate;
    } else {
      return null;
    }
  }

  setTimerDayStart() {
    var dayStartTime = this.rmConfigForm.controls['dayStart'].value;
    if (dayStartTime == "" || dayStartTime == null) {
      return;
    }
    var dayEndTime = this.rmConfigForm.controls['dayEnd'].value;
    var array = dayStartTime.split(":");
    var hours = array[0];
    var mins = array[1];
    hours = hours <= 23 ? hours : 23;
    mins = mins <= 59 ? mins : 59;
    dayStartTime = hours + ":" + mins;
    this.rmConfigForm.patchValue({
      dayStart: dayStartTime,
    });
    if (dayEndTime && dayStartTime != "") {
      var start = this.getTime(dayStartTime);
      var end = this.getTime(dayEndTime);
      if (start! >= end!) {
        this.rmConfigForm.controls['dayStart'].setErrors({ 'incorrect': true });
        this.rmConfigForm.updateValueAndValidity();
        this.errorMsg = "Time day start  must be less than  time day end "
      }
    }
  }

  setTimerDayEnd() {
    var dayEndTime = this.rmConfigForm.controls['dayEnd'].value;
    if (dayEndTime == "" || dayEndTime == null) {
      return;
    }
    var dayStartTime = this.rmConfigForm.controls['dayStart'].value;
    var array = dayEndTime.split(":");
    var hours = array[0];
    var mins = array[1];
    hours = hours <= 23 ? hours : 23;
    mins = mins <= 59 ? mins : 59;
    dayEndTime = hours + ":" + mins;
    this.rmConfigForm.patchValue({
      dayEnd: dayEndTime,
    });
    if (dayStartTime && dayStartTime != "") {
      var start = this.getTime(dayStartTime);
      var end = this.getTime(dayEndTime);
      if (start! >= end!) {
        this.rmConfigForm.controls['dayEnd'].setErrors({ 'incorrect': true });
        this.rmConfigForm.updateValueAndValidity();
        this.errorMsg = "Time day end  must be greater than  time day start"
      }
    }
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord
      if (!this.isNew) {
        this.title = 'Edit';
      }
    }
  }

  onCancel() {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
      }
    });
  }

}
