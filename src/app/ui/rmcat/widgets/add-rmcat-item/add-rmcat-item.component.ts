import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS} from '@angular/forms';
import { EnumService } from 'src/app/services/enum.service';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { DatePipe } from '@angular/common';
import { forwardRef } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { CountryFilterInput } from 'src/app/ui/location/modal/countryFilterInput.model';
import { StateFilterInput } from 'src/app/ui/location/widgets/state-list/stateFilterInput.model';
import { CityFilterInput } from 'src/app/ui/location/widgets/city-list/cityFilterInput.model';
import { RegnFilterInput } from 'src/app/ui/location/widgets/region-list/regnFilterInput.model';
import { Input } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-add-rmcat-item',
  templateUrl: './add-rmcat-item.component.html',
  styleUrls: ['./add-rmcat-item.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRmcatItemComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRmcatItemComponent),
      multi: true
    }
  ]
})
export class AddRmcatItemComponent implements ControlValueAccessor, OnDestroy {

  rmcatFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord:boolean=true;
  //drop down code
  enumState: StateFilterInput[] = [];
  enumCntry: CountryFilterInput[] = [];
  enumCity: CityFilterInput[] = [];
  enumRegn: RegnFilterInput[] = [];
  
  currentDate: any;
  @Input() isNew!: boolean;
  constructor(
    private enumsrv: EnumService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe, 
  ) {
    this.currentDate = this.datePipe.transform(new Date(), "yyyy/MM/dd hh:mm:ss");
    /// Start Of Building Form 
    this.rmcatFormPanel = this.formBuilder.group({
      rmCat: ['', [Validators.required]],
      rmCatDesc: [''],
      highlightColor : ['#a6a6a6']
  });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.rmcatFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit() {
  
    this.loadEnums();
    
  }

  
    /// Start Of Form Validation Related Code
    public isValid() {
      return this.getValidationErrors().length === 0;
    }
    
    public getValidationErrors() {
      const me = this;
      const validationErros: VaildationError[] = [];
      // Object.keys(this.userFormPanel.controls).forEach(key => {
      //   let field = this.userFormPanel.get(key);
      //   const controlErrors: ValidationErrors = field?.er;
      //   if (controlErrors != null) {
      //         Object.keys(controlErrors).forEach(keyError => {
      //         validationErros.push(new VaildationError(key, keyError, controlErrors[keyError]));
      //       });
      //     }
      //   });
      return validationErros;
    }
    /// End Of Form Validation Related Code
  
    /// Start Of Reference Data Initiation
    loadEnums() {
      // this.enumList = [];
      // this.enumsrv.getEnums().subscribe(
      //   (res: Enums[]) => {
      //     this.enumList = res;
      //     this.enumClonedList =  this.enumList.map(x => Object.assign({}, x));
      //     this.enumCC = this.enumClonedList.filter(t => t.Table.toLocaleUpperCase() === 'Cost_centre'.toLocaleUpperCase());
      //     this.enumCCStatus = this.enumCC.filter(t => t.Type.toLocaleUpperCase() === 'CC_stat'.toLocaleUpperCase()).map((i) => { i.Name = i.Id + ' - ' + i.Name; return i; });;
  
      //     this.enumCCStatus.unshift(new Enums(null, 'Make a selection', null, null, null, null, null));
      //   },
      //   error => {
      //     // this.loginError = error.errorDesc;
      //   }
      // );
    }
  
  
    /// Start Preparing Entered Data Model
    get value(): any {
      const rmcatDetails: any = {
        rmCat: this.rmcatFormPanel.controls.rmCat.value,
        rmCatDesc: this.rmcatFormPanel.controls.rmCatDesc.value,
        highlightColor : this.rmcatFormPanel.controls.highlightColor.value,
      };
      return rmcatDetails;
    }
  
    set value(value: any) {
      setTimeout(() => {
        this.rmcatFormPanel.patchValue({
          rmCat: value.rmCat,
          rmCatDesc: value.rmCatDesc,
          highlightColor : value.highlightColor??'#a6a6a6',
        });
      });
      this.onChange(value);
      this.onTouched();
    }
    
  
    writeValue(value:any) {
      
      if (value) {
        this.value = value;
      }
      if (value === null) {
        this.rmcatFormPanel.reset();
      }
    }
    
  
    registerOnChange(fn:any) {
      this.onChange = fn;
    }
    registerOnTouched(fn: any) {
      this.onTouched = fn;
    }
    onChange: any = () => { };
    onTouched: any = () => { };
  
    // communicate the inner form validation to the parent form
    validate(_: UntypedFormControl) {
      return this.rmcatFormPanel.valid ? null : { rmcatFormPanel: { valid: false } };
    }
  
    ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
    }
  


}

