import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { EqStdDTO } from 'src/app/ui/Helpdesk/eq-std/model/eqStdDto';
import { EqStdService } from 'src/app/ui/Helpdesk/eq-std/services/eq-std.services';
import { EnumList } from 'src/app/model/enum-list.model';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/RoomFilterInputDTO.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { EqStdDialogueProvider } from 'src/app/ui/Helpdesk/eq-std/providers/eq-std.provider';
import { BLModalDialogueProvider } from 'src/app/ui/background-loc/provider/bl.provider';
import { FLModalDialogueProvider } from 'src/app/ui/background-loc/provider/fl.provider';
import { RMModalDialogueProvider } from 'src/app/ui/background-loc/provider/rm.provider';
import { UtilConstant } from 'src/common/UtilConstant';
import { SelectAssetClassificationDialogueProvider } from '../../../providers/select-asset-classification.provider';
import { DepartmentDialogueProvider } from 'src/app/ui/division-department/providers/department-provider';
import { DivisionDialogueProvider } from 'src/app/ui/division-department/providers/division-provider';
import { DepartmentService } from 'src/app/ui/division-department/services/department.services';
import { DivisionService } from 'src/app/ui/division-department/services/division.services';

@Component({
  selector: 'app-add-eq-form',
  templateUrl: './add-eq-form.component.html',
  styleUrls: ['./add-eq-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEqFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddEqFormComponent),
      multi: true
    }
  ]
})
export class AddEqFormComponent implements OnInit {
  eqFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumList: EnumList[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumAllRm: RoomFilterInputDTO[] = [];
  enumRm: RoomFilterInputDTO[] = []
  eqStdData: any[] = [];
  enumClonedList: any[] = []; //Enums
  enumEq: any[] = [];
  enumStatus: any[] = [];
  enumStatusData: any[] = [];
  presentEquipment: string = '';
  docBucketId: number = 0;
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
  enumResApprovalReq: EnumList[] = [];
  enumDepreciationType: EnumList[] = [];
  enumOwnerShipType: EnumList[] = [];
  displayAssetClass: string = '';
  enumDivision: any[] = [];
  enumAllDepartment: any[] = [];
  enumDepartment: any[] = [];
  selectedBl: any = {};
  selectedFl: any = {};
  selectedRm: any = {};
  @Input() isNew!: boolean;
  constructor(
    private blSrv: BuildingService,
    private formBuilder: UntypedFormBuilder,
    private eqStdService: EqStdService,
    private enumsrv: EnumService,
    private eqStdProvider: EqStdDialogueProvider,
    private blProvider: BLModalDialogueProvider,
    private flProvider: FLModalDialogueProvider,
    private rmProvider: RMModalDialogueProvider,
    private divisionProvider: DivisionDialogueProvider,
    private departmentProvider: DepartmentDialogueProvider,
    private divisionservice: DivisionService,
    private departmentservice: DepartmentService,

  ) {
    this.eqFormPanel = this.formBuilder.group({
      eqId: [null],
      eqCode: [null, [Validators.required]],
      eqStdId: [null, [Validators.required]],
      status: [null, [Validators.required]],
      description: [''],
      svgElementId: [null],
      docBucketId: [null],
      depreciationType: [null, [Validators.required]],
      stock: [null, [Validators.required]],
      isReusable: [null],
      resApprovalReq: [null],
      ownershipType: [null, [Validators.required]],
      minStockReq: [null, [Validators.required]],
      blId: [null],
      flId: [null],
      rmId: [null],
      divId: [null],
      depId: [null],
    });
    this.subscriptions.push(
      this.eqFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  ngOnInit(): void {
    this.loadAllDivision();
    this.loadAllDepartment();
    this.loadEqStandard();
    this.loadEnums();
  }

  loadEqStandard() {
    this.eqStdService.getAllEqStds().subscribe((res: any) => {
      this.eqStdData = res;
      this.eqStdData.unshift(new EqStdDTO('', "Make a Selection", '', 0))
    })
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumEq = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'eq'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'eq'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'eq'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        this.enumResApprovalReq = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'eq'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'res_approval_req'.toLocaleUpperCase());
        this.enumDepreciationType = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'eq'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'depreciation_type'.toLocaleUpperCase());
        this.enumOwnerShipType = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'eq'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'ownership_type'.toLocaleUpperCase());
        this.enumStatusData = this.enumStatus;
        this.enumStatusData.unshift(new EnumList(null, "", "", 'Make a selection', null));
      },
      error => {
      });
  }

  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.eqFormPanel.patchValue({
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
        this.eqFormPanel.patchValue({
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
        this.eqFormPanel.patchValue({
          blId: $event.blId,
          flId: $event.flId,
        });
      }, 10);

    }
    else {

    }

  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const eqDetails: any = {
      eqId: this.eqFormPanel.controls.eqId.value,
      eqCode: this.eqFormPanel.controls.eqCode.value,
      eqStdId: this.eqFormPanel.controls.eqStdId.value,
      status: this.eqFormPanel.controls.status.value,
      description: this.eqFormPanel.controls.description.value,
      svgElementId: this.eqFormPanel.controls.svgElementId.value,
      docBucketId: this.eqFormPanel.controls.docBucketId.value,
      depreciationType: this.eqFormPanel.controls.depreciationType.value,
      stock: this.eqFormPanel.controls.stock.value,
      isReusable: this.eqFormPanel.controls.isReusable.value,
      resApprovalReq: this.eqFormPanel.controls.resApprovalReq.value,
      ownershipType: this.eqFormPanel.controls.ownershipType.value,
      minStockReq: this.eqFormPanel.controls.minStockReq.value,
      blId: this.eqFormPanel.controls.blId.value,
      flId: this.eqFormPanel.controls.flId.value,
      rmId: this.eqFormPanel.controls.rmId.value,
      divId: this.eqFormPanel.controls.divId.value,
      depId: this.eqFormPanel.controls.depId.value,
    };
    return eqDetails;
  }

  set value(value: any) {
    this.docBucketId = value.docBucketId ? value.docBucketId : 0;
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
      this.eqFormPanel.patchValue({
        eqId: value.eqId,
        eqCode: value.eqCode,
        eqStdId: value.eqStdId,
        status: value.status ? value.status : "In Service",
        description: value.description,
        svgElementId: value.svgElementId,
        docBucketId: value.docBucketId,
        soldPrice: value.soldPrice,
        costToReplace: value.costToReplace,
        lifeExpectancy: value.lifeExpectancy,
        depreciationType: value.depreciationType ? value.depreciationType : "Straight-Line",
        stock: value.stock ? value.stock : 0,
        isReusable: value.isReusable ? value.isReusable : "Yes",
        resApprovalReq: value.resApprovalReq ? value.resApprovalReq : "No",
        ownershipType: value.ownershipType ? value.ownershipType : "Owned",
        minStockReq: value.minStockReq ? value.minStockReq : 0,
        blId: value.blId,
        flId: value.flId,
        rmId: value.rmId,
        divId: value.divId,
        depId: value.depId,
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
      this.eqFormPanel.reset();
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
    return this.eqFormPanel.valid ? null : { eqFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onAddEqStandard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      isEdit: false,
      eqStdId: null,
      newRecord: true
    };
    this.eqStdProvider.openDialog(dialogConfig);
    this.eqStdProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.loadEqStandard();
        this.setLatestEqStd(result)
      }
    });
  }

  setLatestEqStd(eqStdId: any) {
    setTimeout(() => {
      this.eqFormPanel.patchValue({
        eqStdId: eqStdId
      })
    }, 100)
  }

  formatDate(date: any) {
    if (date != null) {
      var dateCreated = new Date(date);
      return dateCreated;
    } else {
      return null;
    }
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

  onSelectDivision(event: any) {
    if (event.divId != null) {
      setTimeout(() => {
        this.eqFormPanel.patchValue({
          depId: null,
        });
        this.loadDepartmentCode(event.divId);
      }, 10);
    }
    else {
      this.enumDepartment = [...this.enumAllDepartment];
    }

  }
  onSelectDepartment(event: any) {
    if (event.depId != null) {
      setTimeout(() => {
        this.eqFormPanel.patchValue({
          divId: event.divId,
        });
      }, 10);
    } else {
    }
  }

  loadDepartmentCode(divId: any) {
    if (divId != null) {
      this.enumDepartment = [];
      this.enumDepartment = this.enumAllDepartment.filter(t => t.divId == divId);
      this.enumDepartment.unshift({ depId: null, depCode: 'Make a selection', divId: null });
    }
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
      this.eqFormPanel.patchValue({
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
        this.selectedBl = blData;
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
      this.eqFormPanel.patchValue({
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
        this.selectedBl = blData;
        this.updateBlList(blData);
        const flData: any = this.createFlData(result)
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
      this.eqFormPanel.patchValue({
        flId: event.flId,
        rmId: event.rmId
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
    this.blSrv.getALLRoomByScroll(this.filterCriteria).subscribe((res: any) => {
      
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
      this.eqFormPanel.patchValue({
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
      this.eqFormPanel.patchValue({
        depId: depId
      })
    }, 100)
  }


}
