import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { TradesService } from 'src/app/ui/Helpdesk/trades/services/trades.services';
import { PpmPlanService } from 'src/app/ui/ppm-plan/services/ppm-plan-services';
import { PlanTradeService } from '../../services/plan-trade-services';
import { CraftspersonService } from 'src/app/ui/Helpdesk/craftsperson/services/craftsperson.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-addd-plan-trade',
  templateUrl: './addd-plan-trade.component.html',
  styleUrls: ['./addd-plan-trade.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdddPlanTradeComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AdddPlanTradeComponent),
      multi: true,
    },
  ],
})
export class AdddPlanTradeComponent implements ControlValueAccessor, OnDestroy {
  planTradeFormPanel: FormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  planStepList: any[] = [];
  tradeList: any[] = [];
  errorMsg: string = '';
  prevPlanId: any = null;
  prevStepCode: string = '';
  prevTradeCode: any
  isTradeExists: boolean = false;
  showDetails: boolean = false;
  enableDetailsBtn: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedTrade:any;
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private ppmPlanService: PpmPlanService,
    private tradeService: TradesService,
    private planTradeService: PlanTradeService,
    private cfService: CraftspersonService,
  ) {
    this.planTradeFormPanel = this.formBuilder.group({
      planTradeId: [null],
      planStepId: [null, [Validators.required]],
      tradeId: [null, [Validators.required]],
      hoursRequired: [null, [Validators.required]],
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.planTradeFormPanel.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadPlansTepsData();
    this.loadTrades();
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

  loadTrades() {
    this.tradeService.getAllTrades().subscribe((res: any) => {
      this.tradeList = res;
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
      planTradeId: this.planTradeFormPanel.controls.planTradeId.value,
      planStepId: this.planTradeFormPanel.controls.planStepId.value,
      tradeId: this.planTradeFormPanel.controls.tradeId.value,
      hoursRequired: this.planTradeFormPanel.controls.hoursRequired.value,
    };
    return stateDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.planTradeFormPanel.patchValue({
        planTradeId: value.planTradeId,
        planStepId: value.planStepId,
        tradeId: value.tradeId,
        hoursRequired: value.hoursRequired,
      });
      this.prevTradeCode = value.tradeId;
      if (value.tradeId) {
        this.enableDetailsBtn = true;
        this.prevTradeCode = value.tradeId;
        var trade = this.getSelectedTrade(value.partId);
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
      this.planTradeFormPanel.reset();
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
    return this.planTradeFormPanel.valid
      ? null
      : { planTradeFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  selectTrade(event: any) {
    this.enableDetailsBtn = true;
    if (this.prevTradeCode != event.tradeId) {
      let planStepId = this.planTradeFormPanel.controls.planStepId.value;
      let tradeId = event.tradeId;
      this.planTradeService.checkIsPlanTradeExists(planStepId, tradeId).subscribe((res: any) => {
        this.isTradeExists = false;
        if (res) {
          this.isTradeExists = true;
          this.planTradeFormPanel.controls['tradeId'].setErrors({ 'incorrect': true });
          this.planTradeFormPanel.updateValueAndValidity();
        } else {
          this.isTradeExists = false;
          this.planTradeFormPanel.controls['tradeId'].setErrors(null);
          this.planTradeFormPanel.updateValueAndValidity();
        }
      })
    }
  }

  showTradeDetails() {
   // this.tradeFormPanel.disable();
    this.selectedTrade = this.getSelectedTrade(this.planTradeFormPanel.controls.tradeId.value);
    this.showDetails = true;
  }

  getSelectedTrade(tradeId: any) {
    let selectedTrade = this.tradeList.find((t: any) => t.tradeId === tradeId);
    if (selectedTrade) {
      return selectedTrade;
    }
  }

 }

