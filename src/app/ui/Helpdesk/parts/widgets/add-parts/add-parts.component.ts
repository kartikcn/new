import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { Parts } from '../../model/parts.model';
import { PartsService } from '../../services/parts.service';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';

@Component({
  selector: 'app-add-parts',
  templateUrl: './add-parts.component.html',
  styleUrls: ['./add-parts.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddPartsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddPartsComponent),
      multi: true
    }
  ]
})
export class AddPartsComponent implements OnInit {
  partsFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumMeasurment:any[]=[];
  enumConsumable:any[]=[];
  enumList: any[] = [];
  enumClonedList: any[] = [];
  enumPartsData: any[] = [];
  newRecord: boolean = true;
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private partsService: PartsService,
    private enumsrv: EnumService,
  ) {
    this.partsFormPanel = this.formBuilder.group({
      partId: [null],
      partCode: ['', [Validators.required]],
      description: [null],
      modelNo:[null],
      qutMinHand:[null],
      qutOnHand:[null,[Validators.required]],
      consumable:[null, [Validators.required]],
      qutOnOrder:[null],
      unitOfMeasurement:[null,[Validators.required]],
      ratePerUnit:[null]
    });

    this.subscriptions.push(
      this.partsFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );

  }

  ngOnInit(): void {
    this.loadEnums();
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {//Parts
    const parts: any = {
      partCode: this.partsFormPanel.controls.partCode.value,
      description: this.partsFormPanel.controls.description.value,
      partId: this.partsFormPanel.controls.partId.value,
      modelNo: this.partsFormPanel.controls.modelNo.value,
      qutMinHand: this.partsFormPanel.controls.qutMinHand.value,
      qutOnHand: this.partsFormPanel.controls.qutOnHand.value,
      consumable: this.partsFormPanel.controls.consumable.value,
      qutOnOrder: this.partsFormPanel.controls.qutOnOrder.value,
      unitOfMeasurement: this.partsFormPanel.controls.unitOfMeasurement.value,
      ratePerUnit: this.partsFormPanel.controls.ratePerUnit.value
    };
    return parts;
  }

  set value(value: any) {//Parts
    setTimeout(() => {
      this.partsFormPanel.patchValue({
        partCode: value.partCode,
        description: value.description,
        partId: value.partId,
        modelNo: value.modelNo,
        qutMinHand: value.qutMinHand,
        qutOnHand: value.qutOnHand,
        consumable: value.consumable,
        qutOnOrder: value.qutOnOrder,
        unitOfMeasurement: value.unitOfMeasurement,
        ratePerUnit: value.ratePerUnit
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
      this.partsFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: UntypedFormControl) {
    return this.partsFormPanel.valid ? null : { partsFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: any[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumPartsData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase());
        this.enumConsumable = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'consumable'.toLocaleUpperCase());
        this.enumMeasurment = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'unit_of_measurement'.toLocaleUpperCase());
        this.enumMeasurment.unshift(new Enums(null, "", "", 'Make a selection'));
        },
     error => {
     }
    );
  }
}