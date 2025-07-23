import { Component, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { Enums } from 'src/app/model/enums.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { CountryFilterInput } from '../../modal/countryFilterInput.model';
import { RegnFilterInput } from '../region-list/regnFilterInput.model';
import { StateFilterInput } from '../state-list/stateFilterInput.model';
import { CountryService } from '../../../../services/country.service';
import { RegnService } from '../../services/regn.service';
import { StateService } from '../../services/state.service';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-add-city-form',
  templateUrl: './add-city-form.component.html',
  styleUrls: ['./add-city-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddCityFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddCityFormComponent),
      multi: true
    }
  ]
})
export class AddCityFormComponent implements ControlValueAccessor, OnDestroy {

  cityFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumList: Enums[] = [];
  enumCntry: CountryFilterInput[] = [];
  enumRegn: any[] = [];
  enumState: any[] = [];

  enumAllState: any[] = [];  
  enumAllRegn: any[] = [];
  @Input() isNew!: boolean;
  previousCity:string = '';
  previousState:number = 0;
  previousRegn:number = 0;
  previousCtry:number = 0;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private cntrySrv: CountryService,
    private regnSrv: RegnService,
    private stateSrv: StateService,
    private citySrv:CityService
  ) {
    this.cityFormPanel = this.formBuilder.group({
      cityId: [null],
      cityCode: ['', [Validators.required]],
      cityName: [''],
      ctryId: ['', [Validators.required]],
      regnId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.cityFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadCntry();
    this.loadRegn();
    this.loadState();
  }

  loadCntry() {
    this.cntrySrv.getALLCountry().subscribe((res: any) => {
      this.enumCntry = res;
      this.enumCntry = res.map((i: any) => { i.name = i.ctryCode + ' - ' + i.name; return i; });
      this.enumCntry.unshift(new CountryFilterInput('', 'Make a selection'));
    });
  }

  loadRegn() {
    this.regnSrv.getALLRegn().subscribe((res: any) => {
      this.enumAllRegn = res;
      this.enumAllRegn = res.map((i: any) => { i.name = i.code + ' - ' + i.name; return i; });
      this.enumAllRegn.unshift(new RegnFilterInput('', 'Make a selection', ''));
      this.enumRegn = this.enumAllRegn;
    });
  }

  loadState() {
    this.stateSrv.getALLState().subscribe((res: any) => {
      this.enumAllState = res;
      this.enumAllState = res.map((i: any) => { i.name = i.stateCode + ' - ' + i.name; return i; });
      this.enumAllState.unshift(new StateFilterInput('', 'Make a selection', '', ''));
      this.enumState = this.enumAllState;

    });
  }

  onSelectCountry($event: any) {
    setTimeout(() => {
      this.cityFormPanel.patchValue({
        regnId: null,
        stateId: null,
      });
    }, 10);
    if ($event.id != null && $event.id) {
      this.loadRegionCode($event.id);
    }
    else {
      this.enumRegn = this.enumAllRegn;
      this.enumState = this.enumAllState;
    }

  }

  loadRegionCode(ctry_id: any) {
    if (ctry_id != null) {
      this.enumRegn = [];
      this.enumRegn = this.enumAllRegn.filter(t => t.cntryId == ctry_id)
        .map((i) => {
          if (!i.name.includes(i.id + ' - ')) { i.name =  i.name; }
          return i;
        });
      this.enumRegn.unshift(new RegnFilterInput('', 'Make a selection', ''));
    }
  }

  onSelectRegion($event: any) {
    if ($event.id != null && $event.id != "") {
      setTimeout(() => {
        this.cityFormPanel.patchValue({
          ctryId: $event.cntryId,
          stateId: null,
        });
        this.loadStateCode($event);
      }, 10);

    }
    else {
      setTimeout(() => {
        this.cityFormPanel.patchValue({
          stateId: null,
        });
      }, 10);
      this.enumState = this.enumAllState;
    }
  }

  loadStateCode(event: any) {
    if (event != "") {
      this.enumState = [];
      this.enumState = this.enumAllState.filter(t => t.regnId == event.id && t.ctryId == event.cntryId)
        .map((i) => {
          if (!i.name.includes(i.id + ' - ')) { i.name =  i.name; }
          return i;
        });
      this.enumState.unshift(new StateFilterInput('', 'Make a selection', '', ''));
    }
  }

  onSelectState($event: any) {
    if ($event.id != "") {
      setTimeout(() => {
        this.cityFormPanel.patchValue({
          ctryId: $event.ctryId,
          regnId: $event.regnId,
        });
      }, 10);

    }
    else {
    }

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
    const cityDetails: any = {
      cityId: this.cityFormPanel.controls.cityId.value,
      cityCode: this.cityFormPanel.controls.cityCode.value,
      cityName: this.cityFormPanel.controls.cityName.value,
      ctryId: this.cityFormPanel.controls.ctryId.value,
      regnId: this.cityFormPanel.controls.regnId.value,
      stateId: this.cityFormPanel.controls.stateId.value,
    };
    return cityDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.cityFormPanel.patchValue({
        cityId: value.cityId,
        cityCode: value.cityCode,
        cityName: value.cityName,
        ctryId: value.ctryId,
        regnId: value.regnId,
        stateId: value.stateId,
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
      this.cityFormPanel.reset();
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
    return this.cityFormPanel.valid ? null : { cityFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
