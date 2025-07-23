import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { PartsService } from 'src/app/ui/Helpdesk/parts/services/parts.service';
import { PpmPlanService } from 'src/app/ui/ppm-plan/services/ppm-plan-services';
import { PlanPartService } from '../../services/plan-part-services';

@Component({
  selector: 'app-add-plan-part',
  templateUrl: './add-plan-part.component.html',
  styleUrls: ['./add-plan-part.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddPlanPartComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddPlanPartComponent),
      multi: true,
    },
  ],
})
export class AddPlanPartComponent implements ControlValueAccessor, OnDestroy {
  planPartFormPanel: FormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  planStepList: any[] = [];
  partsList: any[] = [];
  errorMsg: string = '';
  showDetails: boolean = false;
  enableDetailsBtn: boolean = false;
  previousPartQnty: any = 0;
  partExist: boolean = false;
  previousPart: String = '';
  requiredQtyError: boolean = false;
  actualQtyError: boolean = false;
  selectedPart: any;
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private ppmPlanService: PpmPlanService,
    private partsService: PartsService,
    private enumsrv: EnumService,
    private planPartService: PlanPartService
  ) {
    this.planPartFormPanel = this.formBuilder.group({
      planPartId: [null],
      planStepId: [null, [Validators.required]],
      partId: [null, [Validators.required]],
      qunatityRequired: [null, [Validators.required]],
      avalQuantity: [null]
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.planPartFormPanel.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadPlansTepsData();
    this.loadParts();
  }

  loadPlansTepsData() {
    this.ppmPlanService.getAllPlanSteps(0).subscribe((res: any) => {
      if (res.status != 202) {
        this.planStepList = res;
      } else {
        this.planStepList = [];
      }
    });
  }

  loadParts() {
    this.partsService.getAllParts().subscribe((res: any) => {
      this.partsList = res;
    })
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
      planPartId: this.planPartFormPanel.controls.planPartId.value,
      planStepId: this.planPartFormPanel.controls.planStepId.value,
      partId: this.planPartFormPanel.controls.partId.value,
      qunatityRequired: this.planPartFormPanel.controls.qunatityRequired.value,
      avalQuantity: this.planPartFormPanel.controls.avalQuantity.value,
    };
    return stateDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.planPartFormPanel.patchValue({
        planPartId: value.planPartId,
        planStepId: value.planStepId,
        partId: value.partId,
        qunatityRequired: value.qunatityRequired,
        avalQuantity: value.qunatityRequired ? this.getAvalQuantity(value.partId) + parseInt(value.qunatityRequired) : null,
      });
      if (value.partId) {
        this.enableDetailsBtn = true;
        this.previousPart = value.partId;
        this.selectedPart = this.getSelectedPart(value.partId);
      }
    });
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.planPartFormPanel.reset();
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
    return this.planPartFormPanel.valid
      ? null
      : { planPartFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  showPartDetails() {
    //this.frmPartsDetail.disable();
    this.selectedPart = this.getSelectedPart(this.planPartFormPanel.controls.partId.value);

    this.showDetails = true;
  }



  getSelectedPart(partCode: any) {
    let selectedPart = this.partsList.find((t: any) => t.partId === partCode);
    if (selectedPart) {
      return selectedPart;
    }
  }

  selectPartCode(event: any) {
    this.enableDetailsBtn = true;

    if (this.previousPart != event.partId) {
      let planStepId = this.planPartFormPanel.controls.planStepId.value;
      this.planPartService.checkIsPlanPartExists(planStepId, event.partId).subscribe((res: any) => {
        this.partExist = false;
        if (res) {
          this.partExist = true;
          this.planPartFormPanel.controls['partId'].setErrors({ 'incorrect': true });
          this.planPartFormPanel.updateValueAndValidity();
        } else {
          this.partExist = false;
          this.planPartFormPanel.controls['partId'].setErrors(null);
          this.planPartFormPanel.updateValueAndValidity();
        }
      })
    }
    setTimeout(() => {
      this.planPartFormPanel.patchValue({
        avalQuantity: event.qutOnHand,
        qunatityRequired: null
      });
    });

  }

  getAvalQuantity(partCode: any) {
    let selectedPart = this.partsList.find((t: any) => t.partId === partCode);
    if (selectedPart) {
      return selectedPart.qutOnHand
    }
  }

  changeReqQuantity(event: any, inputField: any) {
    let userInput = event.target.value;
    this.errorMsg = '';
    let actlQty = this.planPartFormPanel.controls.avalQuantity.value;
    if (actlQty - userInput < 0) {
      this.errorMsg = `${inputField} can not be greater than Available Quantity.`;
      inputField === 'Required Quantity' ? this.requiredQtyError = true : this.actualQtyError = true;
    } else if (userInput != '' && userInput <= 0) {
      this.errorMsg = `${inputField} can not be less than one`;
      inputField === 'Required Quantity' ? this.requiredQtyError = true : this.actualQtyError = true;
    } else {
      this.errorMsg = '';
      this.requiredQtyError = false;
      this.actualQtyError = false;
    }

  }

}

