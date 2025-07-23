import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { CostTypeService } from 'src/app/ui/Helpdesk/costtype/services/costtype.service';
import { RequestOtherCostService } from '../../services/request-other-cost-services';

@Component({
  selector: 'app-add-request-other-cost',
  templateUrl: './add-request-other-cost.component.html',
  styleUrls: ['./add-request-other-cost.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRequestOtherCostComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRequestOtherCostComponent),
      multi: true
    }
  ]
})
export class AddRequestOtherCostComponent implements OnInit {
  requestOtherCostForm: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  costTypeData: any[] = [];
  errorMsg: String = '';
  previousCostType:any
  costTypeExist:boolean = false;

  @Input() New: boolean = false;
  @Input() isView: boolean = false;
  @Input() showActualCost: boolean = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private costTypeService: CostTypeService,
    private requestOtherCostService: RequestOtherCostService
  ) {
    this.requestOtherCostForm = this.formBuilder.group({
      requestOtherCostId: [null,],
      enteredBy: [null,],
      costTypeId: [null, [Validators.required]],
      estimatedCost: [null, [Validators.required, Validators.min(1)] ],
      actualCost: [null],
      requestId: [null,],
      dateEntered: [null],
      timeEntered: [null],
      description:[null]
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.requestOtherCostForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadCostType();
    if(this.isView) {
      this.requestOtherCostForm.disable();
    }
  }

  loadCostType() {
    this.costTypeService.getAllCostTypes().subscribe((res: any) => {
      if (res.status != 202) {
        this.costTypeData = res;
      }
      else {
        this.costTypeData = [];
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
    const toolsDetails: any = {
      requestOtherCostId: this.requestOtherCostForm.controls.requestOtherCostId.value,
      enteredBy: this.requestOtherCostForm.controls.enteredBy.value,
      costTypeId: this.requestOtherCostForm.controls.costTypeId.value,
      estimatedCost: this.requestOtherCostForm.controls.estimatedCost.value,
      actualCost: this.requestOtherCostForm.controls.actualCost.value,
      requestId: this.requestOtherCostForm.controls.requestId.value,
      dateEntered: this.requestOtherCostForm.controls.dateEntered.value,
      timeEntered: this.requestOtherCostForm.controls.timeEntered.value,
      description: this.requestOtherCostForm.controls.description.value,
    };
    return toolsDetails;
  }

  set value(value: any) {

    setTimeout(() => {
      this.requestOtherCostForm.patchValue({
        requestOtherCostId: value.requestOtherCostId,
        enteredBy: value.enteredBy,
        costTypeId: value.costTypeId,
        estimatedCost: value.estimatedCost,
        actualCost : value.actualCost,
        requestId: value.requestId,
        dateEntered: value.dateEntered,
        timeEntered: value.timeEntered,
        description:value.description
      });
    });
    this.onChange(value);
    this.onTouched();
  }
   

  selectCostType(event: any) {
    if (this.previousCostType != event.costTypeId) {
      let requestId = this.requestOtherCostForm.controls.requestId.value;
      this.requestOtherCostService.checkCostExist(requestId,event.costTypeId).subscribe((res: any) => {
        this.costTypeExist = false;
        if (res) {
          this.costTypeExist = true;
        } else {
          this.costTypeExist = false;
        }
      })
    }

  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.requestOtherCostForm.reset();
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
  validate(_: UntypedFormControl) {
    return this.requestOtherCostForm.valid ? null : { requestOtherCostForm: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
