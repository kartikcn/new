import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { EmployeeLocation } from '../../model/employee-location.model';
import { DivisionService } from 'src/app/ui/division-department/services/division.services';
import { DepartmentService } from 'src/app/ui/division-department/services/department.services';
import { EnumService } from 'src/app/services/enum.service';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/RoomFilterInputDTO.model';
import { SubDepartmentService } from 'src/app/ui/division-department/services/subDepartment.services';
import { MatDialogConfig } from '@angular/material/dialog';
import { BLModalDialogueProvider } from 'src/app/ui/background-loc/provider/bl.provider';
import { FLModalDialogueProvider } from 'src/app/ui/background-loc/provider/fl.provider';
import { RMModalDialogueProvider } from 'src/app/ui/background-loc/provider/rm.provider';
import { DivisionDialogueProvider } from 'src/app/ui/division-department/providers/division-provider';
import { DepartmentDialogueProvider } from 'src/app/ui/division-department/providers/department-provider';
import { SubDepartmentDialogueProvider } from 'src/app/ui/division-department/providers/sub-department-provider';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-employee-location',
  templateUrl: './employee-location.component.html',
  styleUrls: ['./employee-location.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmployeeLocationComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EmployeeLocationComponent),
      multi: true
    }
  ]
})
export class EmployeeLocationComponent implements ControlValueAccessor, OnDestroy {

  frmEmployeeLocation: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumRm: RoomFilterInputDTO[] = [];
  enumAllRm: RoomFilterInputDTO[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  @Input() isNew: boolean = false;
  @Input() isEdit: boolean = false;
  work_type = '';
  enumDivision: any[] = [];
  enumAllDepartment: any[] = [];
  enumDepartment: any[] = [];
  enumCommonAreaTypeNone!: number;
  enumAllSubDepartment: any[] = [];
  enumSubDepartment: any[] = [];
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  limitRm: number = 0;
  offsetRm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  btnDisable: boolean = false;
  selectedBl: any = {};
  selectedFl: any = {};
  selectedRm: any = {};
  constructor(
    private formBuilder: UntypedFormBuilder,
    private blSrv: BuildingService,
    private divisionservice: DivisionService,
    private departmentservice: DepartmentService,
    private enumservice: EnumService,
    private subDeptService: SubDepartmentService,
    private blProvider: BLModalDialogueProvider,
    private flProvider: FLModalDialogueProvider,
    private rmProvider: RMModalDialogueProvider,
    private divisionProvider: DivisionDialogueProvider,
    private departmentProvider: DepartmentDialogueProvider,
    private subDepartmentProvider: SubDepartmentDialogueProvider,
  ) {
    // this.currentDate = this.datePipe.transform(new Date(), "yyyy/MM/dd hh:mm:ss");
    /// Start Of Building Form 
    this.frmEmployeeLocation = this.formBuilder.group({
      blId: [null],
      flId: [null],
      rmId: [null],
      workType: [null, [Validators.required]],
      divId: [null],
      depId: [null],
      subDepId: [null]
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.frmEmployeeLocation.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }


  ngOnInit(): void {
    this.loadCommonAreaNoneEnum();
    this.checkFormMode();
    this.loadAllDivision();
    this.loadAllDepartment();
    this.loadSubDepartment();
  }

  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        flId: null,
        rmId: null,
      });
    }, 10);
    if ($event.blId != null) {
      this.selectedBl = $event;
      this.selectedFl = {};
    }
    else {
      this.selectedBl = {};
      this.selectedFl = {};
    }

  }

  onSelectFlCode(event: any) {
    if (event.flId != null) {
      this.selectedFl = event;
      const blData: any = {
        blId: event.blId,
        blNameString: event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.frmEmployeeLocation.patchValue({
          blId: event.blId,
          rmId: null,
        });
        this.selectedRm = {};
      }, 10);

    }
    else {
      this.selectedFl = {};
      this.selectedRm = {};
    }

  }

  onSelectRmCode($event: any) {
    if ($event.rmId != null) {
      this.selectedRm = $event;
      const blData: any = {
        blId: $event.blId,
        blNameString: $event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      const flData: any = {
        flId: $event.flId,
        flNameString: $event.flNameString,
        blId: $event.blId,
        blNameString: $event.blNameString,
      }
      this.selectedFl = flData;
      this.updateFlList(flData);
      setTimeout(() => {
        this.frmEmployeeLocation.patchValue({
          blId: $event.blId,
          flId: $event.flId,
        });
      }, 10);

    }
    else {
      
    }

  }

  /// Start Preparing Entered Data Model
  get value(): EmployeeLocation {
    const details: EmployeeLocation = {
      blId: this.frmEmployeeLocation.controls.blId.value,
      flId: this.frmEmployeeLocation.controls.flId.value,
      rmId: this.frmEmployeeLocation.controls.rmId.value,
      workType: this.frmEmployeeLocation.controls.workType.value,
      divId: this.frmEmployeeLocation.controls.divId.value,
      depId: this.frmEmployeeLocation.controls.depId.value,
      subDepId: this.frmEmployeeLocation.controls.subDepId.value,
    }
    return details;
  }

  set value(value: any) {
    value = value.em;
    if (value.blId) {
      const blData: any = {
        blId: value.blId,
        blNameString: value.bl.blName != null ? value.bl.blCode + " - " + value.bl.blName : value.bl.blCode,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData)
    }
    if (value.flId) {
      const flData: any = {
        flId: value.flId,
        flNameString: value.fl.flName != null ? value.fl.flCode + " - " + value.fl.flName : value.fl.flCode,
        blId: value.blId,
        blNameString: value.bl.blName != null ? value.bl.blCode + " - " + value.bl.blName : value.bl.blCode,
      }
      this.selectedFl = flData;
      this.updateFlList(flData);
    }
    if (value.rmId) {
      const rmData = {
        rmId: value.rmId,
        rmNameString: value.rm.rmName != null ? value.rm.rmCode + " - " + value.rm.rmName : value.rm.rmCode,
        flId: value.rm.flId,
        blId: value.rm.blId
      }
      this.selectedRm = rmData;
      this.updateRmList(rmData);
    }
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        blId: value.blId,
        workType: value.workType
      });
      // this.loadFloorCode(value.blId);
      this.frmEmployeeLocation.patchValue({
        flId: value.flId,
      });
      let data = {
        blId: value.blId,
        id: value.flId
      }
      this.frmEmployeeLocation.patchValue({
        rmId: value.rmId,
      });
      this.frmEmployeeLocation.patchValue({
        divId: value.divId,
      });
      this.loadDepartmentCode(value.divId);
      this.loadSubDepartmentCode(value.divId, null);
      this.frmEmployeeLocation.patchValue({
        depId: value.depId,
      });
      if (value.depId != null && value.divId != null) {
        this.loadSubDepartmentCode(value.divId, value.depId);
      }
      this.frmEmployeeLocation.patchValue({
        subDepId: value.subDepId,
      });
      this.work_type = value.workType != null ? value.workType.trim() : "";
      this.onSelectWorkType(this.work_type);
      this.onChange(value);
      this.onTouched();
    }, 0);
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.frmEmployeeLocation.reset();
    }
  }
  checkFormMode() {
    if (this.isEdit == false) {
      this.frmEmployeeLocation.disable();
      this.btnDisable = true;
    } else {
      this.frmEmployeeLocation.enable()
      this.btnDisable = false;
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
    return this.frmEmployeeLocation.valid ? null : { frmEmployeeLocation: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSelectWorkType(event: any) {
    if (event != null && event === "F") {
      for (var control in this.frmEmployeeLocation.controls) {
        if (control !== "workType")
          this.frmEmployeeLocation.controls[control].disable();
        this.btnDisable = true;
        setTimeout(() => {
          this.frmEmployeeLocation.patchValue({
            blId: null,
            flId: null,
            rmId: null
          });
        }, 0);
      }
    } else {
      this.btnDisable = false;
      for (var control in this.frmEmployeeLocation.controls) {
        if (control !== "workType" && this.isEdit)
          this.frmEmployeeLocation.controls[control].enable();
      }
    }
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        workType: event
      })
    }, 0);
  }

  loadAllDivision() {
    this.divisionservice.getAllDivisions().subscribe((res: any) => {
      this.enumDivision = res;
      this.enumDivision.unshift({ divId: null, divCode: 'Make a selection' });
    })
  };
  loadAllDepartment() {
    this.departmentservice.getAllDepartments().subscribe((res: any) => {
      this.enumAllDepartment = res;
      this.enumAllDepartment.unshift({ depId: null, depCode: 'Make a selection', divId: null });
      this.enumDepartment = this.enumAllDepartment;
    })
  };

  loadSubDepartment() {
    this.enumAllSubDepartment = [];
    this.subDeptService.getAllSubDepartments().subscribe((res: any) => {
      if (res) {
        this.enumAllSubDepartment = res;
        this.enumAllSubDepartment.unshift({ subDepCode: 'Make a Selection', depId: null, divId: null, subDepId: null });
        this.enumSubDepartment = [...this.enumAllSubDepartment];
      }
    })
  }

  onSelectDivision(event: any) {
    if (event.divId != null) {
      setTimeout(() => {
        this.frmEmployeeLocation.patchValue({
          depId: null,
          subDepId: null
        });
        this.loadDepartmentCode(event.divId);
        this.loadSubDepartmentCode(event.divId, null);
      }, 10);
    }
    else {
      this.enumDepartment = [...this.enumAllDepartment];
      this.enumSubDepartment = [...this.enumAllSubDepartment];
    }

  }
  onSelectDepartment(event: any) {
    if (event.depId != null) {
      setTimeout(() => {
        this.frmEmployeeLocation.patchValue({
          sunDepId: null,
        });
        this.loadSubDepartmentCode(event.divId, event.depId);
      }, 10);
    } else {
      this.enumSubDepartment = [];
      this.enumSubDepartment.unshift({ subDepCode: 'Make a Selection', depId: null, divId: null, subDepId: null });
    }
  }

  loadDepartmentCode(divId: any) {
    if (divId != null) {
      this.enumDepartment = [];
      this.enumDepartment = this.enumAllDepartment.filter(t => t.divId == divId);

    } else {
      this.enumDepartment = [...this.enumAllDepartment];
    }
    this.enumDepartment.unshift({ depId: null, depCode: 'Make a selection', divId: null });
  }

  loadSubDepartmentCode(divId: any, depId: any) {
    this.enumSubDepartment = [...this.enumAllSubDepartment];
    if (divId != null) {
      this.enumSubDepartment = this.enumSubDepartment.filter(t => t.divId == divId);
    }
    if (depId != null) {
      this.enumSubDepartment = this.enumSubDepartment.filter(t => t.depId == depId);
    }
    this.enumSubDepartment.unshift({ subDepCode: 'Make a Selection', depId: null, divId: null, subDepId: null });
  }


  loadCommonAreaNoneEnum() {
    this.enumservice.getEnums().subscribe((res: any) => {
      let commonAreaNoneList = res.filter((t: any) =>
        t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase() &&
        t.fieldName.toLocaleUpperCase() === 'common_area_type'.toLocaleUpperCase() &&
        t.enumValue.toLocaleUpperCase() === 'None'.toLocaleUpperCase());
      this.enumCommonAreaTypeNone = commonAreaNoneList[0].enumKey;
    })
  }

  onAddBuilding() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      bl_id: null,
      isEdit: true,
      newRecord: true
    };
    this.blProvider.openDialog(dialogConfig);
    this.blProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        const blData: any = this.createBlData(result[1]);
        this.selectedBl = blData;
        this.updateBlList(blData);
        this.onSelectBlCode(result[1]);
        this.setLatestBl(result[1].blId)
      }
    });
  };

  setLatestBl(blId: any) {
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        blId: blId
      })
    }, 100)
  }

  onAddFloor() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      fl_id: null,
      bl_id: null,
      isEdit: true,
      newRecord: true
    };
    this.flProvider.openDialog(dialogConfig);
    this.flProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        const blData: any = this.createBlData(result.bl);
        this.updateBlList(blData);
        const flData: any = this.createFlData(result)
        this.selectedFl = flData;
        this.updateFlList(flData);
        this.onSelectBlCode(result);
        this.onSelectFlCode(flData);
        this.setLatestFl(result.flId);
      }
    })
  }

  setLatestFl(flId: any) {
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        flId: flId
      })
    }, 100)
  }

  onAddRoom() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      bl_id: null,
      fl_id: null,
      rm_id: null,
      isEdit: true,
      newRecord: true
    };
    this.rmProvider.openDialog(dialogConfig);
    this.rmProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        const blData: any = this.createBlData(result.bl);
        this.updateBlList(blData);
        const flData: any = this.createFlData(result);
        this.selectedFl = flData;
        this.updateFlList(flData);
        const rmData = {
          rmId: result.rmId,
          rmNameString: result.rmName != null ? result.rmCode + " - " + result.rmName : result.rmCode,
          flId: result.flId,
          blId: result.blId
        }
        this.selectedRm = rmData;
        this.updateRmList(rmData);
        this.setLatestRm(result)
        this.onSelectBlCode(blData);
        this.onSelectFlCode(flData);
      }
    })
  }

  setLatestRm(event: any) {
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        flId: event.flId,
        rmId: event.rmId
      })
    }, 100)
  }

  onddDivision() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      newRecord: true
    };
    this.divisionProvider.openDialog(dialogConfig);
    this.divisionProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.loadAllDivision();
        this.setLatestDivision(result);
      }

    })
  }

  setLatestDivision(divId: any) {
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        divId: divId
      })
    }, 100)
  }

  onddDepartment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      newRecord: true
    };
    this.departmentProvider.openDialog(dialogConfig);
    this.departmentProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.loadAllDepartment();
        this.setLatestDepartment(result);
      }

    })
  }

  setLatestDepartment(depId: any) {
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        depId: depId
      })
    }, 100)
  }

  onddSubDepartment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      newRecord: true
    };
    this.subDepartmentProvider.openDialog(dialogConfig);
    this.subDepartmentProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.loadSubDepartment();
        this.setLatestSubDepartment(result);
      }
    })
  }

  setLatestSubDepartment(subDepId: any) {
    setTimeout(() => {
      this.frmEmployeeLocation.patchValue({
        subDepId: subDepId
      })
    }, 100)
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blSrv.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blSrv.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumFL = res;
      this.updateFlList(this.selectedFl);
    })
  }

  scrollToEndRm() {
    this.offsetRm = this.limitRm;
    this.limitRm += this.scrollLimit;
    this.filterCriteria.limit = this.limitRm;
    this.filterCriteria.offset = this.offsetRm;
    this.blSrv.getAllRmByCommonArea(this.filterCriteria).subscribe((res: any) => {
      //fetch all rooms having commonArea None
      //employee can assigned to the rooms which have common area "None"
      this.enumRm = res;
      this.updateRmList(this.selectedRm);
    })
  }

  searchBl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
    this.scrollToEndBl();
  }

  searchFl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "flName", value: event.term, matchMode: "contains" };
    this.scrollToEndFl();
  }

  searchRm(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "rmName", value: event.term, matchMode: "contains" };
    this.scrollToEndRm();
  }

  updateBlList(blData: any) {
    if (blData.blId) {
      this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
    }

    this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
  }

  updateFlList(flData: any) {
    if (flData.flId) {
      this.enumFL = this.enumFL.filter(t => t.flId !== flData.flId);
      this.enumFL = this.enumFL.filter(t => t.flId !== null);
      this.enumFL.unshift(flData);
    }
    this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection', null));
  }
  updateRmList(rmData: any) {
    if (rmData.rmId) {
      this.enumRm = this.enumRm.filter(t => t.rmId !== rmData.rmId);
      this.enumRm = this.enumRm.filter(t => t.rmId !== null);
      this.enumRm.unshift(rmData)
    }
    this.enumRm.unshift(new RoomFilterInputDTO(null, 'Make a selection', null, null));
  }

  createBlData(bl: any) {
    const blData: any = {
      blId: bl.blId,
      blNameString: bl.blName != null ? bl.blCode + " - " + bl.blName : bl.blCode,
      site: null
    }
    return blData;
  }

  createFlData(fl: any) {
    const flData: any = {
      flId: fl.flId,
      flNameString: fl.flName != null ? fl.flCode + " - " + fl.flName : fl.flCode,
      blId: fl.blId,
      blNameString: fl.bl.blName != null ? fl.bl.blCode + " - " + fl.bl.blName : fl.bl.blCode,
    }
    return flData;
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

  onOpenRm() {
    this.limitRm = 0;
    this.offsetRm = 0;
    if (this.selectedFl.flId) {
      this.filterCriteria = { fieldName: "fl.flId", value: this.selectedFl.flId, matchMode: "equals", limit: 0, offset: 0 }
    } else if (this.selectedBl.blId) {
      this.filterCriteria = { fieldName: "bl.blId", value: this.selectedBl.blId, matchMode: "equals", limit: 0, offset: 0 }
    } else {
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
    }
    this.scrollToEndRm();
  }
}
