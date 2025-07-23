import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { ToolsService } from 'src/app/ui/Helpdesk/tools/services/tools.services';
import { TradesService } from 'src/app/ui/Helpdesk/trades/services/trades.services';
import { PpmPlanService } from 'src/app/ui/ppm-plan/services/ppm-plan-services';
import { PlanToolService } from '../../services/plan-tool-services';

@Component({
  selector: 'app-add-plan-tool',
  templateUrl: './add-plan-tool.component.html',
  styleUrls: ['./add-plan-tool.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddPlanToolComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddPlanToolComponent),
      multi: true,
    },
  ],
})
export class AddPlanToolComponent implements ControlValueAccessor, OnDestroy
{
  planToolFormPanel: FormGroup;
  frmToolsDetail!: FormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  planStepList: any[] = [];
  toolsList:any[]= [];
  errorMsg: string = '';
  previousTools: any;
  toolsExist: boolean = false;
  showDetails: boolean = false;
  enableDetailsBtn:boolean = false;

  @Input() isNew!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private ppmPlanService:PpmPlanService,
    private toolsService:ToolsService,
    private planToolsService: PlanToolService
  ) {
    this.planToolFormPanel = this.formBuilder.group({
      planToolId: [null],
      planStepId: [null, [Validators.required]],
      toolId: [null, [Validators.required]],
      hoursRequired: [null, [Validators.required]],
    });

    this.frmToolsDetail = this.formBuilder.group({
      toolsFormPanel: []
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.planToolFormPanel.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadPlansTepsData();
    this.loadTools();
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

  loadTools() {
    this.toolsService.getAllTools().subscribe((res:any) => {
      this.toolsList = res;
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
      planToolId: this.planToolFormPanel.controls.planToolId.value,
      planStepId: this.planToolFormPanel.controls.planStepId.value,
      toolId: this.planToolFormPanel.controls.toolId.value,
      hoursRequired: this.planToolFormPanel.controls.hoursRequired.value,
    };
    return stateDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.planToolFormPanel.patchValue({
        planToolId: value.planToolId,
        planStepId: value.planStepId,
        toolId: value.toolId,
        hoursRequired: value.hoursRequired,
      });
      if(value.toolId) {
        this.enableDetailsBtn = true;
        this.previousTools = value.toolId;
        var tool=this.getSelectedTool(value.toolId);
        this.setToolForm(tool);
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
      this.planToolFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => {};
  onTouched: any = () => {};

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.planToolFormPanel.valid
      ? null
      : { planToolFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  selectTool(event: any) {
    this.enableDetailsBtn = true;
    if (this.previousTools != event.toolsId) {
      let planStepId = this.planToolFormPanel.controls.planStepId.value;
      let toolId = event.toolsId;
      this.planToolsService.checkIsPlanToolExists(planStepId, toolId).subscribe((res: any) => {
        this.toolsExist = false;
        if (res) {
          this.toolsExist = true;
          this.planToolFormPanel.controls['toolId'].setErrors({ 'incorrect': true });
          this.planToolFormPanel.updateValueAndValidity();
        } else {
          this.toolsExist = false;
          this.planToolFormPanel.controls['toolId'].setErrors(null);
          this.planToolFormPanel.updateValueAndValidity();
        }
      })
    }
  }

  showPartDetails() {
   let selectedTool = this.getSelectedTool(this.planToolFormPanel.controls.toolId.value);
   this.setToolForm(selectedTool);
    this.showDetails = true;
  }

  getSelectedTool(toolId: any) {
    let selectedTool = this.toolsList.find((t: any) => t.toolsId === toolId);
    if (selectedTool) {
      return selectedTool;
    }
  }

  setToolForm(value: any) {
    setTimeout(() => {
      this.frmToolsDetail.patchValue({
        toolsFormPanel: value
      });
    }, 0);
  }

}

