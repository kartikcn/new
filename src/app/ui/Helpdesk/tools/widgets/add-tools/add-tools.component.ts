import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { ToolTypeDTO } from '../../../tool-type/model/toolTypeDTO';
import { ToolTypeService } from '../../../tool-type/services/tool-type.service';
import { ToolsService } from '../../services/tools.services';
import { ToolTypeDialogueProvider } from '../../../tool-type/providers/tool-type.oroviders';
import { MatDialogConfig } from '@angular/material/dialog';


@Component({
  selector: 'app-add-tools',
  templateUrl: './add-tools.component.html',
  styleUrls: ['./add-tools.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddToolsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddToolsComponent),
      multi: true
    }
  ]
})
export class AddToolsComponent implements OnInit {

  toolsFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  presentTool: string = '';
  toolTypeData: any[] = [];
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private toolTypeSrv: ToolTypeService,
    private toolTypeProvider: ToolTypeDialogueProvider,

  ) {
    this.toolsFormPanel = this.formBuilder.group({
      toolsId: [null],
      tool: [null, [Validators.required]],
      toolTypeId: [null, [Validators.required]],
      hourlyRate: [null, [Validators.required]],
      overTimeRate: [null, [Validators.required]],
      standardAvalTime: [null, [Validators.required]],
      doubleRate:[null, [Validators.required]],
      description: ['',],
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.toolsFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadToolTypes()
  }

  loadToolTypes() {
    this.toolTypeSrv.getAllToolTypes().subscribe((res: any) => {
      this.toolTypeData = res;
      this.toolTypeData = res.map((t: any) => { t.displayName = t.description != null ? t.toolType + " - " + t.description : t.toolType; return t })
      this.toolTypeData.unshift(new ToolTypeDTO("Make a Selection", '', '', 0))
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
      tool: this.toolsFormPanel.controls.tool.value,
      toolsId:  this.toolsFormPanel.controls.toolsId.value,
      toolTypeId: this.toolsFormPanel.controls.toolTypeId.value,
      hourlyRate: this.toolsFormPanel.controls.hourlyRate.value,
      overTimeRate: this.toolsFormPanel.controls.overTimeRate.value,
      standardAvalTime: this.toolsFormPanel.controls.standardAvalTime.value,
      doubleRate: this.toolsFormPanel.controls.standardAvalTime.value,
      description: this.toolsFormPanel.controls.description.value,

    };
    return toolsDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.toolsFormPanel.patchValue({
        tool: value.tool,
        toolsId: value.toolsId,
        toolTypeId: parseInt(value.toolTypeId),
        hourlyRate: value.hourlyRate,
        overTimeRate: value.overTimeRate,
        standardAvalTime: value.standardAvalTime,
        doubleRate:value.doubleRate,
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
      this.toolsFormPanel.reset();
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
    return this.toolsFormPanel.valid ? null : { toolsFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onAddToolType() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      toolTypeId: null,
      isEdit: true,
      newRecord: true
    };
    this.toolTypeProvider.openDialog(dialogConfig);
    this.toolTypeProvider.onDialogueClosed.subscribe((result: any) => {
      if(result) {
        this.loadToolTypes();
        this.setLatestToolType(result);
      }  
    });
  }

  setLatestToolType(toolTypeId: any) {
    setTimeout(() => {
      this.toolsFormPanel.patchValue({
        toolTypeId: toolTypeId
      })
    }, 100)
  }

 
}
