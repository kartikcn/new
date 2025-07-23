import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { PpmPlanService } from '../../services/ppm-plan-services';

@Component({
  selector: 'app-add-plan-steps-form',
  templateUrl: './add-plan-steps-form.component.html',
  styleUrls: ['./add-plan-steps-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddPlanStepsFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddPlanStepsFormComponent),
      multi: true,
    },
  ],
})
export class AddPlanStepsFormComponent
  implements ControlValueAccessor, OnDestroy {
  planStepFormPanel: FormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  planList: any[] = [];
  errorMsg: string = '';
  prevPlanId: any = null;
  prevStepCode: string = '';

  @Input() isNew!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private ppmPlanService: PpmPlanService
  ) {
    this.planStepFormPanel = this.formBuilder.group({
      planStepId: [null],
      planId: [null, [Validators.required]],
      stepCode: [null, [Validators.required]],
      instructions: [null],
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.planStepFormPanel.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadPlansData();
  }

  loadPlansData() {
    this.ppmPlanService.getAllPlans().subscribe((res: any) => {
      if (res.status != 202) {
        this.planList = res;
      } else {
        this.planList = [];
      }
    });
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
      planStepId: this.planStepFormPanel.controls.planStepId.value,
      planId: this.planStepFormPanel.controls.planId.value,
      stepCode: this.planStepFormPanel.controls.stepCode.value,
      instructions: this.planStepFormPanel.controls.instructions.value,
    };
    return stateDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.planStepFormPanel.patchValue({
        planStepId: value.planStepId,
        planId: parseInt(value.planId),
        stepCode: value.stepCode,
        instructions: value.instructions,
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
      this.planStepFormPanel.reset();
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
    return this.planStepFormPanel.valid
      ? null
      : { planStepFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}
