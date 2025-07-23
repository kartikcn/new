import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { RmResourcesDTO } from '../../model/rm-resourcesDTO';
import { RmResourcesService } from '../../service/rm-resources.service';


declare var $: any;
@Component({
  selector: 'app-rm-resources-form',
  templateUrl: './rm-resources-form.component.html',
  styleUrls: ['./rm-resources-form.component.scss'],
  providers: [MessageService]
})
export class RmResourcesFormComponent implements OnInit {
  rmResourcesFormPanel: UntypedFormGroup;
  errorMsg: string = '';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RmResourcesFormComponent>,
    private confirmationService: ConfirmationService,
    private rmResourceSrv: RmResourcesService,
    private currencyPipe: CurrencyPipe,
    private messageService: MessageService,
  ) {
    this.rmResourcesFormPanel = this.formBuilder.group({
      title:[null,[Validators.required]],
      quanity: [null, [Validators.required,this.checkGreaterThanZero()]],
      costPerUnit: [null,[Validators.required]],
      comments: ['' ],
    });
   }

  ngOnInit(): void {
   setTimeout(() => {
      this.rmResourcesFormPanel.patchValue({
        title: this.data.title,
        costPerUnit: this.formatValue(this.data.costPerUnit, 'GBP',2),
        quanity: null,
        comments:null
      });
    }, 0);
  }
  checkGreaterThanZero(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null ) {
        this.rmResourcesFormPanel.controls['quanity'].setErrors(null);
        this.rmResourcesFormPanel.clearAsyncValidators();
        this.rmResourcesFormPanel.updateValueAndValidity();
       
          if (control.value <= 0){
            this.rmResourcesFormPanel.controls['quanity'].setErrors({ 'incorrect': true });
            this.rmResourcesFormPanel.updateValueAndValidity();
            this.errorMsg = "Quantity can not be less than one"
            return { 'incorrect': true };
          }
          else if (control.value > this.data.quantity){
            this.rmResourcesFormPanel.controls['quanity'].setErrors({ 'incorrect': true });
            this.rmResourcesFormPanel.updateValueAndValidity();
            this.errorMsg = "Quantity can not be greater than the resource quantity " + this.data.quantity;
            return { 'incorrect': true };
          }
          else{
            return null;
          }  
      }
      return null;
    };
  }

  saveRecords(){
    this.messageService.clear();
     var RmResourceData:RmResourcesDTO = {
      blId:this.data.blId,
      flId:this.data.flId,
      rmId:this.data.rmId,
      quanity:this.rmResourcesFormPanel.controls.quanity.value,
      costPerUnit:this.data.costPerUnit,
      resourcesId:this.data.resourcesId,
      comments:this.rmResourcesFormPanel.controls.comments.value,
      rmResourcesId:this.data.rmResourcesId
     };
     console.log(RmResourceData);
     this.rmResourceSrv.saveRmResource(RmResourceData).subscribe((res:any) => {
      if(res.rmResourcesId!=null){
        this.dialogRef.close(res.rmResourcesId)
      }else if (res.code !=200){
        this.messageService.add({ key: 'rmResource', severity: 'error', summary: 'error', detail:res.text });
      }
     })
  }
  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(null);
      }
    });
  }
  formatValue(value:any, symbol:any,decimal_pt:any) {
    if (value !== 'undefined' && value != null) {
      const temp = `${value}`.replace(/\,/g, "");
      var digit_format="1."+decimal_pt+"-"+decimal_pt;
      return this.currencyPipe.transform(temp, symbol, 'symbol-narrow',digit_format);
    }
    else {
      return '';
    }
  }

  deformatValue(value:any) {
    return value.replace(/[\n\£\,]+/g, '');
  }

  setCostPerUnitCurrenyFormat() {
    var costPerReq = this.deformatValue(this.rmResourcesFormPanel.controls.costPerUnit.value);
    setTimeout(() => {
      this.rmResourcesFormPanel.patchValue({
        costPerUnit: this.formatValue(costPerReq, 'GBP',2),
      });
    }, 10);
  }

}
