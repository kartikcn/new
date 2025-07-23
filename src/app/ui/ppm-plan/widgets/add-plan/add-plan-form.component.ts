import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-add-plan-form',
  templateUrl: './add-plan-form.component.html',
  styleUrls: ['./add-plan-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddPlanFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddPlanFormComponent),
      multi: true
    }
  ]
})
export class AddPlanFormComponent implements ControlValueAccessor, OnDestroy, Validators {
  planFormPanel: FormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  EnumPlanData: EnumList[] = [];
  fileName: string = "No file chosen";
  showWarning: boolean = false;
  fileSelected: boolean = false;
  selectedFile: any;
  errorMsg: string = '';
  prevPlanName: string = '';
  @Input() isNew!: boolean;
  constructor(
    private enumsrv: EnumService,
    private formBuilder: FormBuilder,
  ) {
    this.planFormPanel = this.formBuilder.group({
      planId: [null],
      planName: [null, [Validators.required]],
      planType: [null, [Validators.required]],
      description: [null],
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.planFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadEnums();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        // this.enumClonedList = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'psr'.toLocaleUpperCase());
        this.EnumPlanData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plans'.toLocaleUpperCase() && t.fieldName.toLowerCase() === 'plan_type'.toLowerCase());
        this.EnumPlanData.unshift(new EnumList(null, "", "", 'Make a selection',null));
      },
      error => {
        // this.loginError = error.errorDesc;
      }
    );
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];

    return validationErros;
  }
  /// End Of Form Validation Related Code

  get value(): any {
    const stateDetails: any = {
      planId: this.planFormPanel.controls.planId.value,
      planName: this.planFormPanel.controls.planName.value,
      planType: this.planFormPanel.controls.planType.value,
      description: this.planFormPanel.controls.description.value,
    };
    return stateDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.planFormPanel.patchValue({
        planId: value.planId,
        planName: value.planName,
        planType: value.planType,
        description: value.description,
      });
    });
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.planFormPanel.reset();
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

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.planFormPanel.valid ? null : { planFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
