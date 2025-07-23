import { Component, forwardRef, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { Enums } from 'src/app/model/enums.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { BuildingService } from '../../services/bl.service';
import { BuildingFilterInput } from '../../model/DTO/blFilterInput.model';
import { SiteService } from '../../../../services/site.service';
import { SiteFilterInput } from '../../../site/modal/siteFilterInput.model';
import { AuthService } from '../../../../services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { EmpFilterInput } from 'src/app/ui/employee/model/em-filter-input-dto';

@Component({
  selector: 'app-add-bl-form',
  templateUrl: './add-bl-form.component.html',
  styleUrls: ['./add-bl-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddBlFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddBlFormComponent),
      multi: true
    }
  ]
})
export class AddBlFormComponent implements ControlValueAccessor, OnDestroy {

  blFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumList: Enums[] = [];
  enumComp: BuildingFilterInput[] = [];
  bl_img: any = "assets/images/blank-image.png";
  selectedFile!: any;
  isPhotoUploaded: boolean = false;
  @Input() isNew!: boolean;
  @Input() isView!: boolean;
  enumSites: SiteFilterInput[] = [];
  blContact:boolean =false;
  enumBlContactName: any[] =[];
  displayImage: boolean = false;
  timeZoneData: any[] = [];
  imageerrorMsg:string ='';
  NotImage:boolean = false;
  limitSite: number = 0;
  offsetSite: number = 0;
  limitEm: number = 0;
  offsetEm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  prevSite:any = {};
  selectedEm:any = {};
  constructor(
    private formBuilder: UntypedFormBuilder,
    private blSrv: BuildingService,
    private siteSrv: SiteService,
    private authSrv: AuthService,
    private cdr: ChangeDetectorRef,
    private emService: EmployeeService
  ) {
    this.blFormPanel = this.formBuilder.group({
      blId: [''],
      blCode: ['', [Validators.required ]],
      blName: [''],
      siteId: ['', [Validators.required]],
      blInfo: [''],
      longitude: [''],
      latitude: [''],
      blContactName: [''],
      blContactPhone: [''],
      blPhoto: [''],
      timeZoneId:[[Validators.required]],
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.blFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    // this.loadCompany();
    //this.loadSites();
   /// this.scrollToEndEm();
    this.loadTimeZones();
  }

  preview() {
    this.displayImage = true;
  }

  loadSites() {
    this.siteSrv.getALLSites().subscribe((res: any[]) => {
      this.enumSites = res;
      this.enumSites = res.map((i: any) => { i.siteName = i.siteNameString; return i; });
      this.enumSites.unshift(new SiteFilterInput('', 'Make a selection',0));
    });
  }

  
  loadEmployeeContact():void{
    this.blContact = true;
    this.emService.getAllEmployeeList().subscribe((res: any[]) => {
      this.blContact = false;
      this.enumBlContactName = res;
      this.enumBlContactName.unshift(new EmpFilterInput('', 'Make a selection'));
    },error=>{
      this.blContact = false;
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
    const blDetails: any = {
      blId: this.blFormPanel.controls.blId.value,
      blCode: this.blFormPanel.controls.blCode.value,
      siteId: this.blFormPanel.controls.siteId.value,
      blName: this.blFormPanel.controls.blName.value,
      blInfo: this.blFormPanel.controls.blInfo.value,
      longitude: this.blFormPanel.controls.longitude.value,
      latitude: this.blFormPanel.controls.latitude.value,
      blContactName: this.blFormPanel.controls.blContactName.value,
      blContactPhone: this.blFormPanel.controls.blContactPhone.value,
      blPhoto: 2,
      timeZoneId: this.blFormPanel.controls.timeZoneId.value
    };
    return blDetails;
  }

  set value(value: any) {
    if(value.siteId) {
      const siteData:any = {
        siteId:value.siteId,
        siteName:value.site.siteName,
      }
      this.prevSite = siteData;
      this.addPrevSite(this.prevSite);
    }
    if(value.blContactName) {
      this.selectedEm = value.blContactName;
      this.updateEmList(value.blContactName);
    }
    setTimeout(() => {
      this.blFormPanel.patchValue({
        blId: value.blId,
        blCode: value.blCode,
        siteId: value.siteId,
        blName: value.blName,
        blInfo: value.blInfo,
        longitude: value.longitude,
        latitude: value.latitude,
        blContactName: value.blContactName,
        blContactPhone: value.blContactPhone,
        timeZoneId: value.timeZoneId
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
      this.blFormPanel.reset();
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
    return this.blFormPanel.valid ? null : { blFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
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
          me.bl_img = fileReader.result;
        }} 
    }else{
        this.NotImage = true;
        this.imageerrorMsg = 'Only jpg/jpeg and png files are allowed!';
    }
  }

  loadTimeZones(){
    this.blSrv.getAllTimeZones().subscribe((res:any) => {
      this.timeZoneData = res.map((t:any) => {t.displayName = t.timeZoneId + " - " + t.description; return t})

    })
  }

  scrollToEndSite() {
    this.offsetSite = this.limitSite;
    this.limitSite += this.scrollLimit;
    this.filterCriteria.limit = this.limitSite;
    this.filterCriteria.offset = this.offsetSite;
    this.siteSrv.getAllSiteByScroll(this.filterCriteria).subscribe((res:any) => {
     this.enumSites = res;
     this.addPrevSite(this.prevSite);
    })
   }

   searchSite(event:any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "siteName", value: event.term, matchMode: "contains" };
    this.scrollToEndSite();
   }

   addPrevSite(prevSite:any) {
    if(prevSite) {
      if(!this.isNew && prevSite.siteId){
        this.enumSites = this.enumSites.filter(t => t.siteId !== prevSite.siteId);
        this.enumSites = this.enumSites.filter(t => t.siteId !== null);
        this.enumSites.unshift(prevSite);
       
     }
     this.enumSites.unshift(new SiteFilterInput(null,'Make a selection',0));
    }
   }

   scrollToEndEm() {
    this.offsetEm = this.limitEm;
    this.limitEm += this.scrollLimit;
    this.filterCriteria.limit = this.limitEm;
    this.filterCriteria.offset = this.offsetEm;
    this.emService.getALLmployeeByScroll(this.filterCriteria).subscribe((res:any) => {
      this.enumBlContactName = res;
      this.enumBlContactName.unshift({emId:null, firstName:'Make a selection',emCode:null});
      this.updateEmList(this.selectedEm);
    })
  }

  searchEm(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "firstName", value: event.term, matchMode: "contains" };
    this.scrollToEndEm();
  }

  updateEmList(emData:any) {
   if(emData) {
    this.enumBlContactName = this.enumBlContactName.filter(e => e.firstName != emData);
    this.enumBlContactName = this.enumBlContactName.filter(e => e.emId != null);
    this.enumBlContactName.unshift(emData);
   }
    this.enumBlContactName.unshift({emId:null, firstName:'Make a selection',emCode:null});
  }

  onOpenSite() {
    this.limitSite = 0;
    this.offsetSite = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndSite();
  }

  onOpenEm() {
    this.limitEm = 0;
    this.offsetEm = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndEm();
  }

}
