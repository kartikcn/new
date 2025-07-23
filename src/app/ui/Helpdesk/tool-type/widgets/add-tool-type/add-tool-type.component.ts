import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { ToolTypeService } from '../../services/tool-type.service';

@Component({
  selector: 'app-add-tool-type',
  templateUrl: './add-tool-type.component.html',
  styleUrls: ['./add-tool-type.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddToolTypeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddToolTypeComponent),
      multi: true
    }
  ]
})
export class AddToolTypeComponent implements OnInit {
  toolTypeFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  presentToolType: string = '';
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: ToolTypeService
  ) {
    this.toolTypeFormPanel = this.formBuilder.group({
      toolTypeId:[null],
      toolType: [null, [Validators.required]],
      description: ['',],

    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.toolTypeFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
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
    const toolTypeDetails: any = {
      toolTypeId: this.toolTypeFormPanel.controls.toolTypeId.value,
      toolType: this.toolTypeFormPanel.controls.toolType.value,
      description: this.toolTypeFormPanel.controls.description.value,

    };
    return toolTypeDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.toolTypeFormPanel.patchValue({
        toolTypeId: value.toolTypeId,
        toolType: value.toolType,
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
      this.toolTypeFormPanel.reset();
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
    return this.toolTypeFormPanel.valid ? null : { toolTypeFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
