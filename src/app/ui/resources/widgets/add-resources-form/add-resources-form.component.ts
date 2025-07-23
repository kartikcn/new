import { CurrencyPipe } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR,Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { EnumList } from 'src/app/model/enum-list.model';

declare var $: any;
@Component({
  selector: 'app-add-resources-form',
  templateUrl: './add-resources-form.component.html',
  styleUrls: ['./add-resources-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddResourcesFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddResourcesFormComponent),
      multi: true
    }
  ]

})
export class AddResourcesFormComponent implements OnInit {
  resourcesFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumList: EnumList[] = [];
  enumClonedList :EnumList[] = [];
  enumUsers: EnumList[] = [];
  enummTypeData: EnumList[] = [];
  tempTitle: string = '';
  enumIsReusable: any[] = [];
  @Input() isNew!: boolean;
  @Input() isView!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private enumsrv: EnumService,
    private currencyPipe: CurrencyPipe,
  ) {
    this.resourcesFormPanel = this.formBuilder.group({
      resourcesId: [null,[Validators.required]],
      title: ['', [Validators.required]],
      description: [''],
      type: ['', [Validators.required,Validators.min(1)]],
      quanity: [null, [Validators.required, Validators.min(1)]],
      costPerUnit: [null, [Validators.required]],
      isReusable:['',[Validators.required,Validators.min(1)]],
    });
    this.subscriptions.push(
      this.resourcesFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  ngOnInit(): void {
    if (this.isView) {
      this.resourcesFormPanel.disable();
    }
    this.loadEnums();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumUsers = this.enumList.filter(t => t.tableName.toLocaleUpperCase() === 'resources'.toLocaleUpperCase());
        this.enummTypeData = this.enumUsers.filter(t => t.fieldName.toLocaleUpperCase() === 'resources_type'.toLocaleUpperCase());
        this.enummTypeData.unshift(new EnumList(null, "", "", 'Make a selection',null));
        // this.enumIsReusable = this.enumClonedList.map((t:any) =>{t.displayName = t.enumValue; return t} )
        this.enumIsReusable = this.enumUsers.filter(t => t.fieldName.toLocaleUpperCase() === 'is_reusable'.toLocaleUpperCase());
        this.enumIsReusable.unshift(new EnumList(null, "", "", 'Make a selection',null));
      },
    );
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const resourcesDetails: any = {
      resourcesId: this.resourcesFormPanel.controls.resourcesId.value,
      title: this.resourcesFormPanel.controls.title.value,
      description: this.resourcesFormPanel.controls.description.value,
      type: this.resourcesFormPanel.controls.type.value,
      quanity: this.resourcesFormPanel.controls.quanity.value,
      costPerUnit: this.resourcesFormPanel.controls.costPerUnit.value,
      isReusable: this.resourcesFormPanel.controls.isReusable.value,
    };
    return resourcesDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.resourcesFormPanel.patchValue({
        resourcesId: value.resourcesId,
        title: value.title,
        description: value.description,
        type: value.type,
        quanity: value.quanity,
        costPerUnit: this.formatValue(value.costPerUnit, 'GBP', 2),
        isReusable:value.isReusable,
      });
    });
    this.onChange(value);
    this.onTouched();
  }

  formatDate(date: Date) {
    if (date != null) {
      var date = new Date(date);
      var userTimezoneOffset = date.getTimezoneOffset() * 60000;
      var a = new Date(date.getTime() - userTimezoneOffset);
      return a;
    } else {
      return null;
    }
  }
  convertToTime(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      return currDate;
    } else {
      return null;
    }

  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.resourcesFormPanel.reset();
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
    return this.resourcesFormPanel.valid ? null : { resourcesFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  formatValue(value: any, symbol: any, decimal_pt: any) {
    if (value !== 'undefined' && value != null) {
      const temp = `${value}`.replace(/\,/g, "");
      var digit_format = "1." + decimal_pt + "-" + decimal_pt;
      return this.currencyPipe.transform(temp, symbol, 'symbol-narrow', digit_format);
    }
    else {
      return '';
    }
  }

  deformatValue(value: any) {
    return value.replace(/[\n\£\,]+/g, '');
  }



  setCostPerUnitCurrenyFormat() {
    var costPerReq = this.deformatValue(this.resourcesFormPanel.controls.costPerUnit.value);
    setTimeout(() => {
      this.resourcesFormPanel.patchValue({
        costPerUnit: this.formatValue(costPerReq, 'GBP', 2),
      });
    }, 10);
  }

}
