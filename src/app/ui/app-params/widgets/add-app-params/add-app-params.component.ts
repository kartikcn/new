import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { AuthService } from 'src/app/services/auth.service';
import { AppParams } from '../../model/app-params.model';
import { AppParamsService } from '../../services/app-params.service';

@Component({
  selector: 'app-add-app-params',
  templateUrl: './add-app-params.component.html',
  styleUrls: ['./add-app-params.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddAppParamsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddAppParamsComponent),
      multi: true
    }
  ]
})
export class AddAppParamsComponent implements OnInit,ControlValueAccessor, OnDestroy {

  AppParamFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew: boolean = false;
  isEditable : boolean = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private apSrv: AppParamsService
  ) { 
    this.AppParamFormPanel = this.formBuilder.group({
      appParamsId:[null,[Validators.required]],
      paramId: ['', [Validators.required,]],
      paramValue : ['', [Validators.required]],
      description: ['', [Validators.required]],
      isEditable : ['']
    });
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.AppParamFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
  }

  // checkAppParamIdValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: boolean } | null => {
  //     if (control.value !== undefined && control.value != null && control.value.length > 1 && this.isNew) {
  //       this.AppParamFormPanel.controls['paramId'].setErrors(null);
  //       this.AppParamFormPanel.clearAsyncValidators();
  //       this.AppParamFormPanel.updateValueAndValidity();
  //       this.apSrv.checkAppParamExists(control.value).subscribe((res: any) => {
  //         if (res && res.text == "true") {
  //           this.AppParamFormPanel.controls['paramId'].setErrors({ 'incorrect': true });
  //           this.AppParamFormPanel.updateValueAndValidity();
  //           return { 'incorrect': true };
  //         }
  //         else {
  //           return null;
  //         }
  //       });
  //       return null;
  //     }
  //     return null;
  //   };
  // }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    Object.keys(this.AppParamFormPanel.controls).forEach(key => {
      let field = this.AppParamFormPanel.get(key);
      const controlErrors: ValidationErrors | null = field != null ? field.errors : null;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          validationErros.push(new VaildationError(key, keyError, controlErrors[keyError]));
        });
      }
    });
    return validationErros;
  }
  get value(): AppParams {
    const records: AppParams = {
      appParamsId:this.AppParamFormPanel.controls.appParamsId.value,
      paramId: this.AppParamFormPanel.controls.paramId.value,
      paramValue: this.AppParamFormPanel.controls.paramValue.value,
      description : this.AppParamFormPanel.controls.description.value,
      isEditable : this.AppParamFormPanel.controls.isEditable.value
      
    }
    return records;
  }

  set value(value: AppParams) {

    if (value.isEditable === "1") { // Check edit condition.
      this.isEditable = true;
    } else {
      this.isEditable = false;
    }

    setTimeout(() => {
      this.AppParamFormPanel.patchValue({
        appParamsId:value.appParamsId,
        paramId: value.paramId,
        paramValue: value.paramValue,
        description: value.description,
        isEditable: value.isEditable
       
      });
      this.onChange(value);
      this.onTouched();
    }, 0);
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.AppParamFormPanel.reset();
    }
  }


  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };
  validate(_: UntypedFormControl) {
    return this.AppParamFormPanel.valid ? null : { AppParamFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
