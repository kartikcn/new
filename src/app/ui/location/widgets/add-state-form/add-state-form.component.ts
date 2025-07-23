import { Component, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { Enums } from 'src/app/model/enums.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { CountryService } from '../../../../services/country.service';
import { RegnService } from '../../services/regn.service';
import { CountryFilterInput } from '../../modal/countryFilterInput.model';
import { RegnFilterInput } from '../region-list/regnFilterInput.model';
import { StateService } from '../../services/state.service';

declare var $: any;
@Component({
  selector: 'app-add-state-form',
  templateUrl: './add-state-form.component.html',
  styleUrls: ['./add-state-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddStateFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddStateFormComponent),
      multi: true
    }
  ]
})
export class AddStateFormComponent implements ControlValueAccessor, OnDestroy {

  stateFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumList: Enums[] = [];
  enumCntry: CountryFilterInput[] = [];
  enumRegn: any[] = [];
  enumAllRegn: any[] = [];
  previousState:string = '';
  previousRegn:number = 0;
  previousCtry:number = 0;
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private cntrySrv: CountryService,
    private regnSrv: RegnService,
    private stateSrv:StateService
  ) {
    this.stateFormPanel = this.formBuilder.group({
      stateId: [null],
      stateCode: ['', [Validators.required]],
      stateName: [''],
      ctryId: ['', [Validators.required]],
      regnId: ['', [Validators.required]],
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.stateFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadCntry();
    this.loadRegn();
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

  onSelectCountry($event: any) {
    setTimeout(() => {
      this.stateFormPanel.patchValue({
        regnId: null,
      });
      
    }, 10);
    if ($event.id != null && $event.id != "") {
      this.loadRegionCode($event.id);
    }
    else {
      this.enumRegn = this.enumAllRegn;
      //this.enumRegn.unshift(new RegnFilterInput('', 'Make a selection', ''));
    }

  }

  loadRegionCode(ctry_id: any) {
    if (ctry_id != null) {
      this.enumRegn = [];
      this.enumRegn = this.enumAllRegn.filter(t => t.cntryId == ctry_id)
        .map((i) => {
          if (!i.name.includes(i.code + ' - ')) { i.name = i.ctryCode + ' - ' + i.name; }
          return i;
        });
      this.enumRegn.unshift(new RegnFilterInput('', 'Make a selection', ''));
    }
  }

  onSelectRegion($event: any) {
    if ($event.id != null && $event.id != "") {
      setTimeout(() => {
        this.stateFormPanel.patchValue({
          ctryId: $event.cntryId,
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
    const stateDetails: any = {
      stateId: this.stateFormPanel.controls.stateId.value,
      stateCode : this.stateFormPanel.controls.stateCode.value,
      stateName: this.stateFormPanel.controls.stateName.value,
      ctryId: this.stateFormPanel.controls.ctryId.value,
      regnId: this.stateFormPanel.controls.regnId.value,
    };
    return stateDetails;
  }

  set value(value: any) {
    this.previousState = value.stateCode;
    this.previousCtry = value.ctryId;
    this.previousRegn = value.regnId;
    setTimeout(() => {
      this.stateFormPanel.patchValue({
        stateId: value.stateId,
        stateCode: value.stateCode,
        stateName: value.stateName,
        ctryId: value.ctryId,
        regnId: value.regnId,
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
      this.stateFormPanel.reset();
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
    return this.stateFormPanel.valid ? null : { stateFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
