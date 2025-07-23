import { Component, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { EnumService } from 'src/app/services/enum.service';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { BuildingService } from '../../services/bl.service';
import { RmcatService } from '../../../../services/rmcat.service';
import { DivisionService } from 'src/app/ui/division-department/services/division.services';
import { DepartmentService } from 'src/app/ui/division-department/services/department.services';
import { BuildingFilterInputDTO } from '../../model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../../model/DTO/FloorFilterInputDTO.model';
import { RoomTypeFilterInputDTO } from 'src/app/ui/room category/model/DTO/RoomTypeFilterInputDTO.model';
import { RoomCategoryFilterInputDTO } from 'src/app/ui/rmcat/modal/RoomCategoryFilterInputDTO.model';
import { EnumList } from 'src/app/model/enum-list.model';
import { SubDepartmentService } from 'src/app/ui/division-department/services/subDepartment.services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-rm-form',
  templateUrl: './add-rm-form.component.html',
  styleUrls: ['./add-rm-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRmFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRmFormComponent),
      multi: true
    }
  ]
})
export class AddRmFormComponent implements ControlValueAccessor, OnDestroy {

  rmFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumList: any[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumComp: BuildingFilterInputDTO[] = [];
  enumRmCat: RoomCategoryFilterInputDTO[] = [];
  enumRmType: RoomTypeFilterInputDTO[] = [];
  enumAllRmType: RoomTypeFilterInputDTO[] = [];
  compId!: number;
  rm_img: any = "assets/images/blank-image.png";
  selectedFile!: any;
  isPhotoUploaded: boolean = false;
  @Input() isNew!: boolean;
  @Input() isView!: boolean;
  displayImage: boolean = false;
  reservableEnumList: EnumList[] = [];
  hotelableEnumList: EnumList[] = [];
  enumIdIsReservable!: number;
  enumIdIsUnReservable!: number;
  enumIdIsHotelable!: number;
  enumIdIsUnHotelable!: number;
  enumDivision: any[] = []
  enumAllDepartment: any[] = [];
  enumDepartment: any[] = [];
  commonareaEnumList: EnumList[] = [];
  spaceStandardEnumList: EnumList[]=[];
  rmUseEnumList: EnumList[]=[]
  imageerrorMsg: string = '';
  NotImage: boolean = false;
  enumAllSubDepartment: any[] = [];
  enumSubDepartment: any[] = [];
  limitBl:number = 0;
  offsetBl:number = 0;
  limitFl:number = 0;
  offsetFl:number = 0;
  prevBl:any;
  prevFl:any
  filterCriteria:any = {
    fieldName: null, value: null, matchMode: "contains",limit:0,offset:0
  };
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  selectedBl: any = {};
  selectedFl: any = {};
  constructor(
    private formBuilder: UntypedFormBuilder,
    private blSrv: BuildingService,
    private rmcatSrv: RmcatService,
    private enumsrv: EnumService,
    private divisionservice: DivisionService,
    private departmentservice: DepartmentService,
    private subDeptService:SubDepartmentService
  ) {
    this.rmFormPanel = this.formBuilder.group({
      blId: ['', [Validators.required]],
      flId: ['', [Validators.required]],
      rmId: [null],
      rmCode: ['', [Validators.required]],
      rmName: ['', [Validators.required]],
      rmInfo: [''],
      rmcatId: [null],
      rmtypeId: [null],
      rmArea: [null,[Validators.required]],
      rmPhoto1: [null],
      rmPhoto2: [null],
      isReservable: [null, [Validators.min(1)]],
      isHotelable: [null, [Validators.min(1)]],
      svgElementId: [null],
      divId: [null],
      depId: [null],
      commonAreaType: [null, [Validators.required,Validators.min(1)]],
      emCapacity: [null,[Validators.required]],
      rmAreaManual: [null],
      isOccupiable: [null],
      spaceStandard: [null ,[Validators.required]],
      rmUse: [null ,[Validators.required]],
      subDepId: [null]
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.rmFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  preview() {
    this.displayImage = true;
  }

  ngOnInit(): void {
    this.loadRmCatType();
    this.loadRmType();
    this.loadHotelableReservableCommonAreaEnums();
    this.loadDivision();
    this.loadDepartment();
    this.loadSubDepartment();
  }

 
  loadRmCatType() {
    this.rmcatSrv.getALLRmcats().subscribe((res: any[]) => {
      this.enumRmCat = res;
      this.enumRmCat.unshift(new RoomCategoryFilterInputDTO(null, 'Make a selection'));
    });
  }

  loadRmType() {
    this.rmcatSrv.getALLRmTypes().subscribe((res: any[]) => {
      this.enumAllRmType = res;
      this.enumAllRmType = res.map((i: any) => { i.name = i.rmCat + ' - ' + i.rmType; return i; });
      this.enumAllRmType.unshift(new RoomTypeFilterInputDTO(null, 'Make a selection', null));
      this.enumRmType = this.enumAllRmType;
    });
  }

  
  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.rmFormPanel.patchValue({
        flId: null,
      });
    }, 10);
    if ($event.blId != null) {
      this.selectedBl = $event;
      this.selectedFl = {};
      this.prevFl = {};
    }
    else {
      this.prevBl = {}
      this.prevFl = {};
     this.selectedBl= {};
     this.selectedFl = {};
    }

  }

  onSelectRmCat($event: any) {
    if ($event.rmcatId != null) {
      setTimeout(() => {
        this.rmFormPanel.patchValue({
          rmType: null,
        });
        this.loadRmTypeCode($event.rmcatId);
      }, 10);

    }
    else {
      this.enumRmType = this.enumAllRmType;
      //this.enumRmType.unshift(new RmTypeFilterInputDTO('', 'Make a selection', ''));
    }

  }

  loadRmTypeCode(rmcat: any) {
    if (rmcat != null) {
      this.enumRmType = [];
      this.enumRmType = this.enumAllRmType.filter(t => t.rmcatId == rmcat)
        // .map((i) => {
        //   if (!i.name.includes(i.id + ' - ')) { i.name = i.id + ' - ' + i.name; }
        //   return i;
        // });
      this.enumRmType.unshift(new RoomTypeFilterInputDTO(null, 'Make a selection', null));
    }
    else {
      this.enumRmType = this.enumAllRmType;
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
    const blDetails: any = {
      blId: this.rmFormPanel.controls.blId.value,
      flId: this.rmFormPanel.controls.flId.value,
      rmId: this.rmFormPanel.controls.rmId.value,
      rmCode: this.rmFormPanel.controls.rmCode.value,
      rmName: this.rmFormPanel.controls.rmName.value,
      rmInfo: this.rmFormPanel.controls.rmInfo.value,
      rmcatId: this.rmFormPanel.controls.rmcatId.value,
      rmtypeId: this.rmFormPanel.controls.rmtypeId.value,
      rmArea: this.rmFormPanel.controls.rmArea.value,
      rmPhoto1: this.rmFormPanel.controls.rmPhoto1.value,
      rmPhoto2: this.rmFormPanel.controls.rmPhoto2.value,
      isReservable: this.rmFormPanel.controls.isReservable.value,
      isHotelable: this.rmFormPanel.controls.isHotelable.value,
      svgElementId: this.rmFormPanel.controls.svgElementId.value,
      divId: this.rmFormPanel.controls.divId.value,
      depId: this.rmFormPanel.controls.depId.value,
      commonAreaType: this.rmFormPanel.controls.commonAreaType.value,
      emCapacity: this.rmFormPanel.controls.emCapacity.value,
      rmAreaManual: this.rmFormPanel.controls.rmAreaManual.value,
      isOccupiable: this.rmFormPanel.controls.isOccupiable.value,
      spaceStandard: this.rmFormPanel.controls.spaceStandard.value,
      rmUse: this.rmFormPanel.controls.rmUse.value,
      subDepId: this.rmFormPanel.controls.subDepId.value,
    };
    return blDetails;
  }

  set value(value: any) {
    if(value.blId) {
      this.prevBl = value.bl;
      this.setPrevBl(value.bl);
    }
    if(value.flId){
      this.prevFl = value.fl;
      this.setPrevFl(value.fl);
    }
    setTimeout(() => {
      this.rmFormPanel.patchValue({
        blId: value.blId,
        flId: value.flId,
        rmId: value.rmId,
        rmCode: value.rmCode,
        rmName: value.rmName,
        rmInfo: value.rmInfo,
        rmcatId: value.rmcatId,
        rmtypeId: value.rmtypeId,
        rmArea: value.rmArea,
        rmPhoto1: value.rmPhoto1,
        rmPhoto2: value.rmPhoto2,
        isReservable: value.isReservable,
        isHotelable: value.isHotelable,
        svgElementId: value.svgElementId,
        divId: value.divId,
        depId: value.depId,
        commonAreaType: value.commonAreaType,
        emCapacity: value.emCapacity,
        rmAreaManual: value.rmAreaManual,
        isOccupiable: value.isOccupiable,
        spaceStandard: value.spaceStandard,
        rmUse: value.rmUse,
        subDepId: value.subDepId
      });
      if (value.rmCat != null && value.rmType == null) {
        this.loadRmTypeCode(value.rmCat);
      }
      if (value.divId != null && value.depId == null) {
        this.loadDepartmentCode(value.divId);
        this.loadSubDepartmentCode(value.divId,null);
      }
      if (value.divId != null && value.depId != null) {
        this.loadDepartmentCode(value.divId);
        this.loadSubDepartmentCode(value.divId,value.depId);
      }
      if (value.blId != null && value.flId != null) {
        this.rmFormPanel.patchValue({
          flId: value.flId,
        })
      }
    });
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.rmFormPanel.reset();
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
    return this.rmFormPanel.valid ? null : { rmFormPanel: { valid: false } };
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
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
      var imgSize = event.target.files[0].size;
      if (imgSize > 1000000) {
        this.NotImage = true;
        this.imageerrorMsg = 'Image Size should not be greater than 1 MB';
      } else {
        this.NotImage = false;
        this.imageerrorMsg = '';
        me.isPhotoUploaded = true;
        fileReader.readAsDataURL(file);
        console.log(fileReader.result);
        fileReader.onload = function () {
          me.rm_img = fileReader.result;
        }
      }
    } else {
      this.NotImage = true;
      this.imageerrorMsg = 'Only jpg/jpeg and png files are allowed!';
    }
  }

  loadHotelableReservableCommonAreaEnums() {
    this.reservableEnumList = [];
    this.hotelableEnumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.reservableEnumList = res.filter(t =>
          t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase()
          && t.fieldName.toLocaleUpperCase() === 'is_reservable'.toLocaleUpperCase());
        this.reservableEnumList.map((item: any) => {
          if (item.enumValue == 'Yes') {
            this.enumIdIsReservable = item.enumKey;
          } else if (item.enumValue == 'No') {
            this.enumIdIsUnReservable = item.enumKey;
          }
        })
        this.reservableEnumList.unshift(new EnumList(null,'','','Make a selection',null));

        this.hotelableEnumList = res.filter(t =>
          t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase()
          && t.fieldName.toLocaleUpperCase() === 'is_hotelable'.toLocaleUpperCase());
        this.hotelableEnumList.map((item: any) => {
          if (item.enumValue == 'Yes') {
            this.enumIdIsHotelable = item.enumKey;
          } else if (item.enumValue == 'No') {
            this.enumIdIsUnHotelable = item.enumKey;
          }
        })
        this.hotelableEnumList.unshift(new EnumList(null,'','','Make a selection',null));

        this.commonareaEnumList = res.filter(t =>
          t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase() &&
          t.fieldName.toLocaleUpperCase() === 'common_area_type'.toLocaleUpperCase());
        this.commonareaEnumList.unshift(new EnumList(null,'','','Make a selection',null));

        this.spaceStandardEnumList = res.filter(t =>  t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase() &&
        t.fieldName.toLocaleUpperCase() === 'space_standard'.toLocaleUpperCase());
        this.spaceStandardEnumList.unshift(new EnumList(null,'','','Make a selection',null));

        this.rmUseEnumList = res.filter(t =>  t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase() &&
        t.fieldName.toLocaleUpperCase() === 'rm_use'.toLocaleUpperCase());
        this.rmUseEnumList.unshift(new EnumList(null,'','','Make a selection',null));
      }
    );
  }

  onSelectReservable($event: any) {
    if ($event.enumKey) {
      if ($event.enumKey == this.enumIdIsReservable) {
        setTimeout(() => {
          this.rmFormPanel.patchValue({
            isHotelable: this.enumIdIsUnHotelable,
          });
        }, 10);
      }
    }
  }

  onSelectHotelable($event: any) {
    if ($event.enumKey) {
      if ($event.enumKey == this.enumIdIsHotelable) {
        setTimeout(() => {
          this.rmFormPanel.patchValue({
            isReservable: this.enumIdIsUnReservable,
          });
        }, 10);
      }
    }
  }

  loadDivision() {
    this.enumDivision = []
    this.divisionservice.getAllDivisions().subscribe((res: any) => {
      if (res) {
        this.enumDivision = res;
        this.enumDivision.unshift({ divCode: 'Make a Selection', divId:null });
      }
    })
  }

  loadDepartment() {
    this.enumAllDepartment = []
    this.departmentservice.getAllDepartments().subscribe((res: any) => {
      if (res) {
        this.enumAllDepartment = res.map((each: any) => {
          return { depLabel: each.division.divCode + " - " + each.depCode, depId: each.depId, divId: each.divId };
        });
        this.enumAllDepartment.unshift({ depLabel: 'Make a Selection', depId:null, divId:null });
        this.enumDepartment = this.enumAllDepartment;
      }
    })
  }

  loadSubDepartment() {
    this.enumAllSubDepartment = [];
    this.subDeptService.getAllSubDepartments().subscribe((res: any) => {
      if (res) {
        this.enumAllSubDepartment = res.map((each: any) => {
          each.subDepLabel = each.divisionDivCode + " - " + each.departmentDepCode+ " - "+each.subDepCode;
          return each;
        });
        this.enumAllSubDepartment.unshift({ subDepLabel: 'Make a Selection', depId:null, divId:null, subDepId:null });
        this.enumSubDepartment = [...this.enumAllSubDepartment];
      }
    })
  }

  onSelectDivision(event: any) {
    if (event.divId != null) {
      setTimeout(() => {
        this.rmFormPanel.patchValue({
          depId: null,
          subDepId: null
        });
        this.loadDepartmentCode(event.divId);
        this.loadSubDepartmentCode(event.divId,null);
      }, 10);
    }
    else {
      this.enumDepartment = [...this.enumAllDepartment];
      this.enumSubDepartment = [...this.enumAllSubDepartment];
    }
  }

  loadDepartmentCode(divId: any) {
    if (divId != null) {
      this.enumDepartment = [];
      this.enumDepartment = this.enumAllDepartment.filter(t => t.divId == divId);
      this.enumDepartment.unshift({ depLabel: 'Make a Selection', depId: null, divId:null });
    }
  }

  loadSubDepartmentCode(divId:any,depId:any){
    this.enumSubDepartment = [];
    if(divId != null){
      this.enumSubDepartment = this.enumAllSubDepartment.filter(t => t.divId==divId);
    }
    if(depId != null){
      this.enumSubDepartment = this.enumSubDepartment.filter(t => t.depId==depId);
    }
    this.enumSubDepartment.unshift({ subDepLabel: 'Make a Selection', depId:null, divId:null, subDepId:null });
  }

  onSelectDepartment(event:any){
    if (event.depId != null) {
      setTimeout(() => {
        this.rmFormPanel.patchValue({
          subDepId: null
        });
        this.loadSubDepartmentCode(event.divId,event.depId);
      }, 10);
    }
    else {
      this.enumSubDepartment = [...this.enumAllSubDepartment];
    }
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blSrv.getALLBuildingByScroll(this.filterCriteria).subscribe((res:any) => {
     this.enumBL = res;
     this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
     this.setPrevBl(this.prevBl);
    })
   }

   scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blSrv.getALLFloorByScroll(this.filterCriteria).subscribe((res:any) => {
     this.enumFL = res;
     this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection',null));
     this.setPrevFl(this.prevFl);
    })
   }

   searchBl(event:any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
    this.scrollToEndBl();
   }

   searchFl(event:any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "flName", value: event.term, matchMode: "contains" };
    this.scrollToEndFl();
   }

   onSelectFlCode(event: any) {
    if (event.flId != null) {
      this.selectedFl = event;
      const blData:any = {
        blId:event.blId,
        blNameString:event.blNameString,
        site:null
      }
      this.selectedBl = blData;
     this.updateBlList(blData);
      setTimeout(() => {
        this.rmFormPanel.patchValue({
          blId: event.blId,
        });
      }, 10);
    }
    else {
     
    }
  }

  setPrevBl(prevBl:any) {
   if(prevBl) {
      const blData:any = {
        blId:prevBl.blId,
        blNameString:prevBl.blName != null ? prevBl.blCode + " - "+prevBl.blName : prevBl.blCode,
        site:null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
   }
   }

   setPrevFl(prevFl:any) {
   if(prevFl) {
      const flData:any = {
        flId:prevFl.flId,
        flNameString:prevFl.flName != null? prevFl.flCode+" - " +prevFl.flName :prevFl.flCode ,
        blId:prevFl.blId,
        blNameString:prevFl.bl.blName != null ? prevFl.bl.blCode + " - "+prevFl.bl.blName : prevFl.bl.blCode,
      }
      this.selectedFl = flData;
      this.updateFlList(flData);
   }
  }

  updateBlList(blData:any) {
    this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
      this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
   }

   updateFlList(flData:any) {
      this.enumFL = this.enumFL.filter(t => t.flId !== flData.flId);
      this.enumFL = this.enumFL.filter(t => t.flId !== null);
      this.enumFL.unshift(flData);
      this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection',null));
   }

   onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndBl();
  }

  onOpenFl() {
    this.limitFl = 0;
    this.offsetFl = 0;
    if (this.selectedBl.blId) {
      this.filterCriteria = { fieldName: "bl.blId", value: this.selectedBl.blId, matchMode: "equals", limit: 0, offset: 0 }
    } else {
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
    }
    this.scrollToEndFl();
  }
}
