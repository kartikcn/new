import { Component, OnInit, Input } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS} from '@angular/forms';
import { EnumService } from 'src/app/services/enum.service';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { DatePipe } from '@angular/common';
import { forwardRef } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';
import { CountryFilterInput } from 'src/app/ui/location/modal/countryFilterInput.model';
import { StateFilterInput } from 'src/app/ui/location/widgets/state-list/stateFilterInput.model';
import { StateService } from 'src/app/ui/location/services/state.service';
import { CityService } from 'src/app/ui/location/services/city.service';
import { CityFilterInput } from 'src/app/ui/location/widgets/city-list/cityFilterInput.model';
import { RegnService } from 'src/app/ui/location/services/regn.service';
import { RegnFilterInput } from 'src/app/ui/location/widgets/region-list/regnFilterInput.model';
import { AuthService } from 'src/app/services/auth.service';
import { SiteService } from 'src/app/services/site.service';
import { SiteFilterInput } from '../../modal/siteFilterInput.model';

declare var $: any;
@Component({
  selector: 'app-add-site-item',
  templateUrl: './add-site-item.component.html',
  styleUrls: ['./add-site-item.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddSiteItemComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddSiteItemComponent),
      multi: true
    }
  ]
})
export class AddSiteItemComponent implements ControlValueAccessor, OnDestroy {

  siteFormPanel: UntypedFormGroup;
  uploadedFiles: any[] = [];
  subscriptions: Subscription[] = [];
  newRecord:boolean=true;
  enumState: StateFilterInput[] = [];
  enumAllState: StateFilterInput[] = [];
  enumCntry: CountryFilterInput[] = [];
  enumCity: CityFilterInput[] = [];
  enumAllCity: CityFilterInput[] = [];
  enumRegn: RegnFilterInput[] = [];
  enumAllRegn: RegnFilterInput[] = [];
  currentDate: any;
  site_img: any = "assets/images/blank-image.png";
  selectedFile!: any;
  isPhotoUploaded: boolean = false;
  displayImage: boolean = false;
  @Input() isNew!: boolean;
  @Input() isView!:boolean;
  compId!: number;
  imageerrorMsg:string ='';
  NotImage:boolean = false;
  constructor(
    private enumsrv: EnumService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private cntrySrv: CountryService,
    private stateSrv: StateService,
    private citySrv: CityService,
    private regnSrv: RegnService,
    private authSrv: AuthService,
    private siteSrv: SiteService,
    
  ) {
    this.currentDate = this.datePipe.transform(new Date(), "yyyy/MM/dd hh:mm:ss");
    /// Start Of Building Form 
    this.siteFormPanel = this.formBuilder.group({
      siteId: [null],
      siteCode: ['', [Validators.required ]],
      siteName: [''],
      siteInfo: [''],
      sitePhoto: [''],
      ctryId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      regnId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      longitude:[''],
      latitude:['']

     
    });
    
   
    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.siteFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  preview() {
    this.displayImage = true;
  }

  fileChangeEvent(event: any) {
    let me = this;
    let fileReader = new FileReader();
    var file = event.target.files[0];
    this.selectedFile = file;
    let filename = file.name;
    var extFile = filename.substr(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
    if (extFile=="jpg" || extFile=="jpeg" || extFile=="png"){
      var imgSize = event.target.files[0].size;
        if(imgSize > 1000000) {
          this.NotImage = true;
          this.imageerrorMsg = 'Image Size should not be greater than 1 MB';
        }else{
          this.NotImage = false;
          this.imageerrorMsg = '';
          me.isPhotoUploaded = true;
          fileReader.readAsDataURL(file);
          console.log(fileReader.result);
          fileReader.onload = function () {
          me.site_img = fileReader.result;
        }} 
    }else{
        this.NotImage = true;
        this.imageerrorMsg = 'Only jpg/jpeg and png files are allowed!';
    }
  }
  
  ngOnInit() {
    this.loadGeoLocation();
  }

  loadGeoLocation() {
    const calls = [];
    calls.push(this.cntrySrv.getALLCountry());
    calls.push(this.regnSrv.getALLRegn());
    calls.push(this.stateSrv.getALLState());
    calls.push(this.citySrv.getALLCity());

    forkJoin(...calls).subscribe(results => {

      if (results[0] != null) {
        setTimeout(() => {
          this.enumCntry = results[0];
          this.enumCntry = results[0].map((i: any) => { i.name = i.ctryCode + ' - ' + i.name; return i; });
          this.enumCntry.unshift(new CountryFilterInput('', 'Make a selection'));
        }, 0);
      }

      if (results[1] != null) {
        setTimeout(() => {
          this.enumAllRegn = results[1];
          this.enumAllRegn = results[1].map((i: any) => { i.name = i.code + ' - ' + i.name; return i; });
          this.enumAllRegn.unshift(new RegnFilterInput('', 'Make a selection', ''));
          this.enumRegn = this.enumAllRegn;
        }, 0);
      }
      if (results[2] != null) {
        setTimeout(() => {
          this.enumAllState = results[2];
          this.enumAllState = results[2].map((i: any) => { i.name = i.stateCode + ' - ' + i.name; return i; });
          this.enumAllState.unshift(new StateFilterInput('', 'Make a selection', '', ''));
          this.enumState = this.enumAllState;
        }, 0);
      }
      if (results[3] != null) {
        setTimeout(() => {
          this.enumAllCity = results[3];
          this.enumAllCity = results[3].map((i: any) => { i.name = i.cityCode + ' - ' + i.name; return i; });
          this.enumAllCity.unshift(new CityFilterInput('', 'Make a selection', '', '', ''));
          this.enumCity = this.enumAllCity;
        }, 0);
      }
    });
  }

  
  onUpload(event:any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    //this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  onSelectCountry($event: any) {
    setTimeout(() => {
      this.siteFormPanel.patchValue({
        regnId: null,
        stateId: null,
        cityId: null,
      });
    }, 10);
    if ($event.id != null && $event.id != "") {
      this.loadRegionCode($event.id);
    }
    else {
      this.enumRegn = this.enumAllRegn;
      this.enumState = this.enumAllState;
      this.enumCity = this.enumAllCity;
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
        this.siteFormPanel.patchValue({
          ctryId: $event.cntryId,
          stateId: null,
          cityId: null,
        });
        this.loadStateCode($event);
      }, 10);

    }
    else {
      setTimeout(() => {
        this.siteFormPanel.patchValue({
          stateId: null,
          cityId: null,
        });
      }, 10);
      this.enumState = this.enumAllState;
      this.enumCity = this.enumAllCity;
      /*this.enumState.unshift(new StateFilterInput('', 'Make a selection', '', ''));
      this.enumCity.unshift(new CityFilterInput('', 'Make a selection', '', '', ''));*/
    }
  }

  loadStateCode(event: any) {
    if (event != "") {
      this.enumState = [];
      this.enumState = this.enumAllState.filter(t => t.regnId == event.id && t.cntryId == event.ctryId)
        .map((i) => {
          if (!i.name.includes(i.id + ' - ')) { i.name =  i.name; }
          return i;
        });
      this.enumState.unshift(new StateFilterInput('', 'Make a selection', '',''));
    }
  }

  onSelectState($event: any) {
    if ($event.id != "") {
      setTimeout(() => {
        this.siteFormPanel.patchValue({
          ctryId: $event.ctryId,
          regnId: $event.regnId,
          cityId: null,
        });
        this.loadCityCode($event);
      }, 10);

    }
    else {
      setTimeout(() => {
        this.siteFormPanel.patchValue({
          cityId: null,
        });
      }, 10);
      this.enumCity = this.enumAllCity;
      //this.enumCity.unshift(new CityFilterInput('', 'Make a selection', '', '', ''));
    }

  }

  loadCityCode(event: any) {
    if (event != "") {
      this.enumCity = [];
      this.enumCity = this.enumAllCity.filter(t => t.stateId == event.stateId && t.regnId == event.regnId && t.cntryId == event.ctryId )
        .map((i) => {
          if (!i.name.includes(i.id + ' - ')) { i.name =  i.name; }
          return i;
        });
      this.enumCity.unshift(new CityFilterInput('', 'Make a selection', '', '',''));
    }
  }

  onSelectCity($event: any) {
    if ($event.id != "") {
      setTimeout(() => {
        this.siteFormPanel.patchValue({
          ctryId: $event.cntryId,
          regnId: $event.regnId,
          stateId: $event.stateId
        });
      }, 10);

    }

  }

    /// Start Of Form Validation Related Code
    public isValid() {
      return this.getValidationErrors().length === 0;
    }
    
    public getValidationErrors() {
      const me = this;
      const validationErros: VaildationError[] = [];
      return validationErros;
    }

    /// Start Preparing Entered Data Model
    get value(): any {
      const siteDetails: any = {
        siteId: this.siteFormPanel.controls.siteId.value,
        siteCode: this.siteFormPanel.controls.siteCode.value,
        siteName: this.siteFormPanel.controls.siteName.value,
        longitude: this.siteFormPanel.controls.longitude.value,
        latitude: this.siteFormPanel.controls.latitude.value,
        siteInfo: this.siteFormPanel.controls.siteInfo.value,
        sitePhoto : this.siteFormPanel.controls.sitePhoto.value,
        ctryId : this.siteFormPanel.controls.ctryId.value,
        stateId:this.siteFormPanel.controls.stateId.value,
        regnId:this.siteFormPanel.controls.regnId.value,
        cityId:this.siteFormPanel.controls.cityId.value,
      };
      return siteDetails;
    }
  
  set value(value: any) {
    this.loadGeoLocation();
      setTimeout(() => {
        this.siteFormPanel.patchValue({
          siteId: parseInt(value.siteId),
          siteCode: value.siteCode,
          siteName: value.siteName,
          longitude:value.longitude,
          latitude:value.latitude,
          siteInfo:value.siteInfo,
          sitePhoto:value.sitePhoto,
          ctryId:parseInt(value.ctryId),
          stateId:parseInt(value.stateId),
          regnId:parseInt(value.regnId),
          cityId:parseInt(value.cityId),
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
        this.siteFormPanel.reset();
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
      return this.siteFormPanel.valid ? null : { siteFormPanel: { valid: false } };
    }
  
    ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
    }

}
