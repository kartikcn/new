import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormControl, ControlValueAccessor, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EnumList } from 'src/app/model/enum-list.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EquipmentService } from '../../services/equipment.services';
import { EnumService } from 'src/app/services/enum.service';

@Component({
  selector: 'app-asset-location',
  templateUrl: './asset-location.component.html',
  styleUrls: ['./asset-location.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AssetLocationComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AssetLocationComponent),
      multi: true
    }
  ]
})
export class AssetLocationComponent implements ControlValueAccessor, OnDestroy {
  eqLocationForm: FormGroup;
  subscriptions: Subscription[] = [];
  enumList: EnumList[] = [];
  eqData: any[] = [];
  enumClonedList: any[] = []; //Enums
  enumDisposeType: EnumList[] = [];
  @Input() isNew: boolean = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private eqService: EquipmentService,
    private enumsrv: EnumService,

  ) {
    this.eqLocationForm = this.formBuilder.group({
      dateInstalled: [null],
      modelNum: [null],
      serialNum: [null],
      manfName: [null],
      manfPhone: [null],
      manfEmail: [null, [Validators.email]],
      manfDate: [null],
      datePurchase: [null],
      purchaseCost: [null],
      dateSold: [null],
      soldPrice: [null],
      costToReplace: [null],
      lifeExpectancy: [null],
      subcomponentId: [null],
      disposeType: [null],
      dateDisposed: [null],
    });
    this.subscriptions.push(
      this.eqLocationForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  ngOnInit(): void {
    this.loadEquipments()
    this.loadEnums();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumDisposeType = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'eq'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'dispose_type'.toLocaleUpperCase());
        this.enumDisposeType.unshift(new EnumList(null, "", "", 'Make a selection', null));
      },
      error => {
      });
  }

  loadEquipments() {
    this.eqService.getAllEquipments().subscribe((res: any) => {
      if (res.status != 202) {
        this.eqData = res;
      }
      else {
        this.eqData = [];
      }
    });
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const eqLocationDetails: any = {
      dateInstalled: this.eqLocationForm.controls.dateInstalled.value,
      modelNum: this.eqLocationForm.controls.modelNum.value,
      serialNum: this.eqLocationForm.controls.serialNum.value,
      manfName: this.eqLocationForm.controls.manfName.value,
      manfPhone: this.eqLocationForm.controls.manfPhone.value,
      manfEmail: this.eqLocationForm.controls.manfEmail.value,
      manfDate: this.eqLocationForm.controls.manfDate.value,
      datePurchase: this.eqLocationForm.controls.datePurchase.value,
      purchaseCost: this.eqLocationForm.controls.purchaseCost.value,
      soldPrice: this.eqLocationForm.controls.soldPrice.value,
      costToReplace: this.eqLocationForm.controls.costToReplace.value,
      lifeExpectancy: this.eqLocationForm.controls.lifeExpectancy.value,
      dateSold: this.eqLocationForm.controls.dateSold.value,
      subcomponentId: this.eqLocationForm.controls.subcomponentId.value,
      dateDisposed: this.eqLocationForm.controls.dateDisposed.value,
      disposeType: this.eqLocationForm.controls.disposeType.value,

    };
    return eqLocationDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.eqLocationForm.patchValue({
        dateInstalled: value.dateInstalled ? this.formatDate(value.dateInstalled) : null,
        modelNum: value.modelNum,
        serialNum: value.serialNum,
        manfName: value.manfName,
        manfPhone: value.manfPhone,
        manfEmail: value.manfEmail,
        manfDate: value.manfDate ? this.formatDate(value.manfDate) : null,
        datePurchase: value.datePurchase ? this.formatDate(value.datePurchase) : null,
        purchaseCost: value.purchaseCost,
        dateSold: value.dateSold ? this.formatDate(value.dateSold) : null,
        soldPrice: value.soldPrice,
        costToReplace: value.costToReplace,
        lifeExpectancy: value.lifeExpectancy,
        subcomponentId: value.subcomponentId,
        dateDisposed: value.dateDisposed ? this.formatDate(value.dateDisposed) : null,
        disposeType: value.disposeType,
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
      this.eqLocationForm.reset();
    }
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { }

  validate(_: FormControl) {
    return this.eqLocationForm.valid ? null : { eqFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  formatDate(date: any) {
    if (date != null) {
      var dateCreated = new Date(date);
      return dateCreated;
    } else {
      return null;
    }
  }

}
