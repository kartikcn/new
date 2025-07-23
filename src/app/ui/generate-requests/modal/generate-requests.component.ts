import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BuildingService } from '../../background-loc/services/bl.service';
import { EquipmentService } from '../../Helpdesk/equipment/services/equipment.services';
import { DatePipe } from '@angular/common';
import { BuildingFilterInput } from '../../background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from '../../background-loc/model/DTO/flFilterInput.model';
import { Equipment } from '../../Helpdesk/equipment/modal/DTO/equipmentDto.modal';
import { RMFilterInputDTO } from '../../background-loc/model/DTO/rmFilterInput.model';
import { PpmPlanService } from '../../ppm-plan/services/ppm-plan-services';
import { UtilConstant } from 'src/common/UtilConstant';
import { PlanScheduleService } from '../../ppm-schedule/services/plan-schedule-services';
import { NgxSpinnerService } from 'ngx-spinner';
import { FloorFilterInputDTO } from '../../background-loc/model/DTO/FloorFilterInputDTO.model';
import { BuildingFilterInputDTO } from '../../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { RoomFilterInputDTO } from '../../background-loc/model/DTO/RoomFilterInputDTO.model';

@Component({
  selector: 'app-generate-requests',
  templateUrl: './generate-requests.component.html',
  styleUrls: ['./generate-requests.component.scss'],
  providers: [MessageService],
})
export class GenerateRequestsComponent {

  filterPanel!: FormGroup;
  enumBL: BuildingFilterInputDTO[] = [];
  enumAllBl: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumRM: RoomFilterInputDTO[] = [];
  enumAllEquipment: any[] = [];
  enumEquipment: Equipment[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  eqData: any[] = [];
  planList: any[] = [];
  maxDate!: Date;
  errorMsg: string = '';
  today: Date = new Date();
  requestsList: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  filterData: any;
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  limitRm: number = 0;
  offsetRm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedBl: any = {};
  selectedFl: any = {};
  selectedRm: any = {};
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private blService: BuildingService,
    private formBuilder: FormBuilder,
    private eqService: EquipmentService,
    private ppmPlanService: PpmPlanService,
    private datePipe: DatePipe,
    private planScheduleSrv: PlanScheduleService,
    private spinner: NgxSpinnerService,

  ) {
    this.filterPanel = this.formBuilder.group({
      blId: [null],
      flId: [null],
      rmId: [null],
      eqId: [null],
      planId: [null],
      fromDate: [null, [Validators.required, this.checkDateValidation()]],
      toDate: [null, [Validators.required, this.checkDateValidation()]],
    });


  }

  ngOnInit(): void {
    this.loadequipments();
    this.loadPlansData();
    let month = new Date().getMonth();
    this.maxDate = new Date(new Date().setMonth(month + 3));
    var date = new Date();
    var nextDate = new Date(new Date().setMonth(month + 1));
    this.setDefaultDates(date, nextDate);

  }

  setDefaultDates(fromDate: any, toDate: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        fromDate: fromDate,
        toDate: toDate,
      });
    }, 0);
  }

  onSelectBlCode($event: any) {
    if ($event.blId != null && $event.blId != '') {
      this.selectedBl = $event;
      this.filterPanel.patchValue({
        flId: null,
        rmId: null
      });
      this.selectedFl = {};
    } else {
      this.selectedBl = {};
      this.selectedFl = {};
    }
  }

  onSelectFlCode($event: any) {
    if ($event.flId != null && $event.flId != '') {
      this.selectedFl = $event;
      const blData: any = {
        blId: $event.blId,
        blNameString: $event.blNameString,
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      this.selectedRm = {};
      setTimeout(() => {
        this.filterPanel.patchValue({
          rmId: null,
        });
      }, 0);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
          rmId: null,
        });
      }, 10);
    }
    else {
     this.selectedFl = {};
     this.selectedRm = {};
    }
  }

  onSelectRmCode($event: any) {
    if ($event.rmId != null && $event.rmId != '') {
      this.selectedRm = $event;
      const blData:any = {
        blId:$event.blId,
        blNameString:$event.blNameString,
        site:null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);

      const flData:any = {
        flId:$event.flId,
        flNameString:$event.flNameString,
        blId:$event.blId,
        blNameString:$event.blNameString,
      }
      this.selectedFl = flData;
      this.updateFlList(flData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
          flId: $event.flId,
        });
      }, 0);
    } else {
    }
  }

  onSelectAsset($event: any) {
    if ($event.eqId != null && $event.eqId != '') {
      if($event.blId){
        this.getBlById($event.blId);
      if ($event.flId != null) {
        this.getFlById($event.flId);
      }
      if ($event != null) {
        this.getRmById($event.rmId);
      }
    }
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
          flId: $event.flId,
          rmId: $event.rmId
        });
      }, 0);
    } else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: null,
          flId: null,
          rmId: null,
        });
      }, 0);
    }
  }

  loadequipments() {
    this.eqService.getAllEquipments().subscribe((res: any) => {
      if (res.status != 202) {
        this.eqData = res;
        this.eqData.unshift(new Object({ eqCode: "Make a selection", description: '', eqId: null }))
      }
    });
  }

  loadPlansData() {
    this.ppmPlanService.getAllPlans().subscribe((res: any) => {
      if (res.status != 202) {
        this.planList = res;
        this.planList.unshift(new Object({ planId: null, planName: "Make a selection" }))
      } else {
        this.planList = [];
      }
    });
  }

  checkDateValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null) {
        if(this.filterPanel.controls['toDate'].value != null && this.filterPanel.controls['fromDate'].value != null){
          this.errorMsg = '';
          this.filterPanel.controls['fromDate'].setErrors(null);
          this.filterPanel.controls['toDate'].setErrors(null);
          this.filterPanel.clearAsyncValidators();
          this.filterPanel.updateValueAndValidity();
  
          var dateFrom = new Date(this.filterPanel.controls['fromDate'].value);
          var dateTo = new Date(this.filterPanel.controls['toDate'].value);
  
          if (dateFrom.getTime() >= dateTo.getTime() && this.filterPanel.controls['toDate'].value != null) {
            this.filterPanel.controls['fromDate'].setErrors({ 'incorrect': true });
            this.filterPanel.updateValueAndValidity();
            this.errorMsg = ' date end should be greater than date start.'
            return { 'incorrect': true };
          } 
        }
        return null;
      }
      return null
        
    };
  }

  onSearch() {
    this.spinner.show();
    this.filterData = {
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: this.filterPanel.controls.rmId.value,
      eqId: this.filterPanel.controls.eqId.value,
      planId: this.filterPanel.controls.planId.value ? this.filterPanel.controls.planId.value : 0,
      fromDate: this.datePipe.transform(this.filterPanel.controls.fromDate.value, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(this.filterPanel.controls.toDate.value, "yyyy-MM-dd"),
    }
    this.requestsList = [];
    this.planScheduleSrv.getRequestsList(this.filterData).subscribe((res: any) => {
      this.requestsList = res;
      this.spinner.hide();
    });
  }

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }

  onGenerate() {
    this.spinner.show();
    this.requestsList = [];
    this.filterData = {
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: this.filterPanel.controls.rmId.value,
      eqId: this.filterPanel.controls.eqId.value,
      planId: this.filterPanel.controls.planId.value ? this.filterPanel.controls.planId.value : 0,
      fromDate: this.datePipe.transform(this.filterPanel.controls.fromDate.value, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(this.filterPanel.controls.toDate.value, "yyyy-MM-dd"),
    }
    this.planScheduleSrv.generateRequests(this.filterData).subscribe((res: any) => {
      if (res.length) {
        this.requestsList = res;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }

    });
  }

  onClear() {
    this.filterPanel.reset();
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
   this.selectedBl = {};
   this.selectedFl = {};
   this.selectedRm = {};
    this.requestsList = [];
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blService.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blService.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumFL = res;
      this.updateFlList(this.selectedFl);
    })
  }

  scrollToEndRm() {
    this.offsetRm = this.limitRm;
    this.limitRm += this.scrollLimit;
    this.filterCriteria.limit = this.limitRm;
    this.filterCriteria.offset = this.offsetRm;
    this.blService.getALLRoomByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumRM = res;
      this.updateRmList(this.selectedRm);
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

   searchRm(event:any) {
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
    if(rmData.rmId) {
      this.enumRM = this.enumRM.filter(t => t.rmId !== rmData.rmId);
      this.enumRM = this.enumRM.filter(t => t.rmId !== null);
      this.enumRM.unshift(rmData)  
    }
    this.enumRM.unshift(new RoomFilterInputDTO(null, 'Make a selection', null, null));
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

  getBlById(blId: any) {
    this.blService.getBlById(blId).subscribe((res: any) => {
      const blData = this.createBlData(res.bl);
      this.selectedBl = blData;
      this.updateBlList(blData);
    })
  }

  getFlById(flId: any) {
    this.blService.getFlById(flId).subscribe((res: any) => {
      const flData = this.createFlData(res);
      this.selectedFl = flData;
      this.updateFlList(flData);
    })
  }

  getRmById(rmId: any) {
    this.blService.getRmById(rmId).subscribe((res: any) => {
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

}
