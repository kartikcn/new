import { Component, Input, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/RoomFilterInputDTO.model';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-link-new-location-plan-form',
  templateUrl: './link-new-location-plan-form.component.html',
  styleUrls: ['./link-new-location-plan-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LinkNewLocationPlanFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LinkNewLocationPlanFormComponent),
      multi: true
    }
  ]
})
export class LinkNewLocationPlanFormComponent {
  locationPlanFormPanel: FormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumAllRm: RoomFilterInputDTO[] = [];
  enumRm: RoomFilterInputDTO[] = [];
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  limitRm: number = 0;
  offsetRm: number = 0;
  limitEm: number = 0;
  offsetEm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedBl: any = {};
  selectedFl: any = {};
  selectedRm: any = {};
  selectedEm: any = {};
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;

  @Input() isNew!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private blSrv: BuildingService,
  ) {
    this.locationPlanFormPanel = this.formBuilder.group({
      planLocEqId: [null],
      planId: [null],
      blId: [null, [Validators.required]],
      flId: [null],
      rmId: [null],

    });

    this.subscriptions.push(
      this.locationPlanFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnInit(): void {

  }


  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.locationPlanFormPanel.patchValue({
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
        this.locationPlanFormPanel.patchValue({
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
        this.locationPlanFormPanel.patchValue({
          blId: $event.blId,
          flId: $event.flId,
        });
      }, 10);

    }
    else {

    }

  }


  get value(): any {
    const blDetails: any = {
      planLocEqId: this.locationPlanFormPanel.controls.planLocEqId.value,
      planId: this.locationPlanFormPanel.controls.planId.value,
      blId: this.locationPlanFormPanel.controls.blId.value,
      flId: this.locationPlanFormPanel.controls.flId.value,
      rmId: this.locationPlanFormPanel.controls.rmId.value,
    };
    return blDetails;
  }

  set value(value: any) {
    if (value.blId !== null) {
      this.getBlById(value.blId);
      if (value.flId != null) {
        this.getFlById(value.flId);
      }
      if (value.rmId != null) {
        this.getRmById(value.rmId);
      }
    }
    setTimeout(() => {
      this.locationPlanFormPanel.patchValue({
        planLocEqId: value.planLocEqId,
        planId: value.planId,
        blId: value.blId,
        flId: value.flId,
        rmId: value.rmId,
      });
      if (value.blId != null && value.flId != null && value.rmId != null) {
        setTimeout(() => {
          this.locationPlanFormPanel.patchValue({
            rmId: value.rmId,
          })
        }, 100)
      }
    }, 100);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.locationPlanFormPanel.reset();
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
  validate(_: FormControl) {
    return this.locationPlanFormPanel.valid ? null : { locationPlanFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];

    return validationErros;
  }

  getBlById(blId: any) {
    this.blSrv.getBlById(blId).subscribe((res: any) => {
      const blData = this.createBlData(res.bl);
      this.selectedBl = blData;
      this.updateBlList(blData);
    })
  }

  getFlById(flId: any) {
    this.blSrv.getFlById(flId).subscribe((res: any) => {
      const flData = this.createFlData(res);
      this.selectedFl = flData;
      this.updateFlList(flData);
    })
  }

  getRmById(rmId: any) {
    this.blSrv.getRmById(rmId).subscribe((res: any) => {
      const rmData = this.createRmData(res.rm);
      this.selectedRm = rmData;
      this.updateRmList(rmData);
    })
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

  createRmData(rm: any) {
    const rmData = {
      rmId: rm.rmId,
      rmNameString: rm.rmName != null ? rm.rmCode + " - " + rm.rmName : rm.rmCode,
      flId: rm.flId,
      blId: rm.blId
    }
    return rmData;
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
