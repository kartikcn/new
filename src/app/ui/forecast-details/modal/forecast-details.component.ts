import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { Equipment } from '../../Helpdesk/equipment/modal/DTO/equipmentDto.modal';
import { BuildingFilterInput } from '../../background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from '../../background-loc/model/DTO/flFilterInput.model';
import { BuildingService } from '../../background-loc/services/bl.service';
import { EquipmentService } from '../../Helpdesk/equipment/services/equipment.services';
import { PpmPlanService } from '../../ppm-plan/services/ppm-plan-services';
import { DatePipe } from '@angular/common';
import { PlanScheduleService } from '../../ppm-schedule/services/plan-schedule-services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { RMFilterInputDTO } from '../../background-loc/model/DTO/rmFilterInput.model';
import { CraftspersonService } from '../../Helpdesk/craftsperson/services/craftsperson.service';
import { TradesService } from '../../Helpdesk/trades/services/trades.services';
import { PartsService } from '../../Helpdesk/parts/services/parts.service';
import { ToolsService } from '../../Helpdesk/tools/services/tools.services';

@Component({
  selector: 'app-forecast-details',
  templateUrl: './forecast-details.component.html',
  styleUrls: ['./forecast-details.component.scss'],
  providers: [MessageService],
})
export class ForecastDetailsComponent {

  filterPanel!: FormGroup;
  frmToolsDetail!: FormGroup
  enumBL: BuildingFilterInput[] = [];
  enumAllBl: BuildingFilterInput[] = [];
  enumFL: FLFilterInputDTO[] = [];
  enumRM: BuildingFilterInput[] = [];
  enumAllEquipment: any[] = [];
  enumEquipment: Equipment[] = [];
  enumAllFL: FLFilterInputDTO[] = [];
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
  tradeHoursMap: { [key: string]: number } = {};
  toolHoursMap: { [key: string]: number } = {};
  partQuantityMap: { [key: string]: number } = {};
  displayRequestList: boolean = false;
  showTradeDetails: boolean = false;
  selectedTrade: any;
  tradeList: any[] = [];
  showPartDetails: boolean = false;
  selectedPart: any;
  partsList: any[] = [];
  showToolDetails: boolean = false;
  toolsList: any[] = [];
  cardTitles: any[] = [{ id: "Trades" }, { id: "Tools" }, { id: "Parts" }];
  cardData: any[] = [];
  finalObject: any;
  isReload: boolean = false;
  planData: any = [];
  showPlanDetails: boolean = false;
  constructor(
    private blService: BuildingService,
    private formBuilder: FormBuilder,
    private eqService: EquipmentService,
    private ppmPlanService: PpmPlanService,
    private datePipe: DatePipe,
    private planScheduleSrv: PlanScheduleService,
    private spinner: NgxSpinnerService,
    private tradeService: TradesService,
    private partsService: PartsService,
    private toolsService: ToolsService,
    private confirmationService: ConfirmationService,
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

    this.frmToolsDetail = this.formBuilder.group({
      toolsFormPanel: []
    });
  }

  ngOnInit(): void {
    this.loadBuilding();
    this.loadFloors();
    this.loadRooms();
    this.loadequipments();
    this.loadPlansData();
    let month = new Date().getMonth();
    this.maxDate = new Date(new Date().setMonth(month + 6));
    var date = new Date();
    var nextDate = new Date(new Date().setMonth(month + 1));
    this.setDefaultDates(date, nextDate);
    this.loadTrades();
    this.loadParts();
    this.loadTools();
  }

  setDefaultDates(fromDate: any, toDate: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        fromDate: fromDate,
        toDate: toDate,
      });
    }, 0);
  }

  loadBuilding() {
    this.blService.getALLBuilding().subscribe((res: any) => {
      this.enumAllBl = res;
      this.enumAllBl = res.map((i: any) => { i.name = i.blNameString; return i; });
      this.enumAllBl.unshift(new BuildingFilterInput('', 'Make a selection', '', 0));
      this.enumBL = this.enumAllBl;
    });
  }

  loadFloors() {
    this.blService.getALLFloor().subscribe((res: any) => {
      this.enumAllFL = res;
      this.enumAllFL = res.map((i: any) => { i.name = i.flNameString; return i; });
      this.enumAllFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', 0));
      this.enumFL = this.enumAllFL;

    });
  }

  loadRooms() {
    this.blService.getALLRoom().subscribe((res: any[]) => {
      this.allRmDdata = res;
      this.allRmDdata = res.map((i: any) => { i.name = i.rmNameString; return i; });
      this.allRmDdata.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', 0));
      this.rm_data = this.allRmDdata;
    });
  }

  loadTrades() {
    this.tradeService.getAllTrades().subscribe((res: any) => {
      this.tradeList = res;
    })
  }

  loadParts() {
    this.partsService.getAllParts().subscribe((res: any) => {
      this.partsList = res;
    })
  }

  loadTools() {
    this.toolsService.getAllTools().subscribe((res: any) => {
      this.toolsList = res;
    })
  }

  onSelectBlCode($event: any) {
    if ($event.id != null && $event.id != '') {
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null,
          siteId: $event.siteId,
          eqId: null
        });
        this.filterFloorCode($event.id);
        this.filterAssets($event.id, null, null);
      }, 0);
    } else {
      this.enumFL = this.enumAllFL
      this.filterAssets(null, null, null);
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null,
          blId: null,
          eqId: null
        });
      }, 0);
    }
    this.enumBL.unshift(new BuildingFilterInput('Make a selection', '', '', 0));
  }

  filterFloorCode(bl_id: any) {
    if (bl_id != null) {
      this.enumFL = [];
      this.enumFL = this.enumAllFL.filter(t => t.blId == bl_id)
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', 0));
      this.rm_data = this.allRmDdata.filter(t => t.blId == bl_id)
      this.rm_data.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', 0));
    }
  }

  onSelectFlCode($event: any) {
    if ($event.id != null && $event.id != '') {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
          rmId: null,
          eqId: null
        });
        this.filterRmCode($event.id, $event.blId);
        this.filterAssets($event.blId, $event.id, null);
      }, 10);
    }
    else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          rmId: null,
          flId: null,
          eqId: null
        });
      }, 0);
      this.enumFL = this.enumAllFL;
      this.filterAssets(null, null, null);
    }
    this.rm_data = this.allRmDdata;
  }

  filterRmCode(flId: any, blId: any) {
    if (flId != null) {
      this.rm_data = [];
      this.rm_data = this.allRmDdata.filter(t => t.blId == blId);
      this.rm_data = this.rm_data.filter(t => t.flId == flId)
      this.rm_data.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', 0));
    }
  }

  onSelectRmCode($event: any) {
    if ($event.id != null && $event.id != '') {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
          flId: $event.flId,
          eqId: null
        });
      }, 0);
      this.filterAssets($event.blId, $event.flId, $event.id);
    } else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          rmId: null,
          eqId: null
        });
        this.filterAssets(null, null, null);
      }, 0);
    }
  }

  onSelectAsset($event: any) {
    if ($event.eqId != null && $event.eqId != '') {
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

  filterAssets(blId: any, flId: any, rmId: any) {
    this.enumEquipment = this.enumAllEquipment;
    blId ? this.enumEquipment = this.enumAllEquipment.filter(asset => asset.blId == blId) : '';
    flId ? this.enumEquipment = this.enumEquipment.filter(asset => asset.blId == blId && asset.flId == flId) : '';
    rmId ? this.enumEquipment = this.enumEquipment.filter(asset => asset.blId == blId && asset.flId == flId && asset.rmId == rmId) : '';
    //this.enumEquipment.unshift(new Object({ eqId: "Make a selection", description: '', compId: 1 }))
  }

  loadequipments() {
    this.eqService.getAllEquipments().subscribe((res: any) => {
      if (res.status != 202) {
        this.enumAllEquipment = res;
        this.enumEquipment = this.enumAllEquipment;
        this.enumEquipment.unshift(new Object({ eqId: "Make a selection", description: '', compId: 1 }))
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
        this.errorMsg = '';
        this.filterPanel.controls['fromDate'].setErrors(null);
        this.filterPanel.controls['toDate'].setErrors(null);
        this.filterPanel.clearAsyncValidators();
        this.filterPanel.updateValueAndValidity();
        var dateFrom = new Date(this.filterPanel.controls['fromDate'].value);
        var dateTo = new Date(this.filterPanel.controls['toDate'].value);
        if (dateFrom.getTime() > dateTo.getTime() && this.filterPanel.controls['toDate'].value != null) {
          this.filterPanel.controls['fromDate'].setErrors({ 'incorrect': true });
          this.filterPanel.updateValueAndValidity();
          this.errorMsg = ' date end should be greater than date start.'
          return { 'incorrect': true };
        } else {
          return null;
        }
      }
      return null;
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
    this.isReload = false;
    this.planScheduleSrv.getForecastDetails(this.filterData).subscribe((res: any) => {

     
      // if (res.forecastDetails.length == 0) {
      //   this.noRequestsFoundAlert();
      // } else {
      //   this.requestsList = res.forecastDetails;
      //   this.getCompleteDetails(res);
      // }
      this.requestsList = res.requestsList;
      this.finalObject = res;
      this.isReload = true;
      this.spinner.hide();
    });
  }

  onClickRequest() {
    this.displayRequestList = true;
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

  onClickDetails(type: any, title: any) {
    if (title == "Trades") {
      this.selectedTrade = this.getSelectedTrade(type.id);
      this.showTradeDetails = true;
    } else if (title == "Parts") {
      this.selectedPart = this.getSelectedPart(type.id);
      this.showPartDetails = true;
    } else {
      let selectedTool = this.getSelectedTool(type.id);
      this.setToolForm(selectedTool);
      this.showToolDetails = true;
    }

  }


  getSelectedTrade(tradeId: any) {
    let selectedTrade = this.tradeList.find((t: any) => t.tradeId === tradeId);
    if (selectedTrade) {
      return selectedTrade;
    }
  }

  getSelectedPart(partCode: any) {
    let selectedPart = this.partsList.find((t: any) => t.partCode === partCode);
    if (selectedPart) {
      return selectedPart;
    }
  }

  getSelectedTool(toolId: any) {
    let selectedTool = this.toolsList.find((t: any) => t.tool === toolId);
    if (selectedTool) {
      return selectedTool;
    }
  }

  setToolForm(value: any) {
    setTimeout(() => {
      this.frmToolsDetail.patchValue({
        toolsFormPanel: value
      });
    }, 0);
  }


  getCompleteDetails(data: any) {
    const trades: Record<string, { id: string, requiredHours: number; hoursInUse: number; availableHours: number }> = {};
    const parts: Record<string, { id: string, requiredQuantity: number; inUseQuantity: number; availableQuantity: number }> = {};
    const tools: Record<string, { id: string, requiredHours: number; hoursInUse: number; availableHours: number }> = {};
    // Aggregate forecastDetails for trades, parts, and tools
    data.forecastDetails.forEach((forecast: any) => {
      forecast.planTradeList.forEach((trade: any) => {
        trades[trade.tradeId] = trades[trade.tradeId] || { id: trade.tradeId, requiredHours: 0, hoursInUse: 0, availableHours: 0 };
        trades[trade.tradeId].requiredHours += trade.hoursRequired;
      });

      forecast.planToolList.forEach((tool: any) => {
        tools[tool.toolId] = tools[tool.toolId] || { id: tool.toolId, requiredHours: 0, hoursInUse: 0, availableHours: 0 };
        tools[tool.toolId].requiredHours += tool.hoursRequired;

      });

      forecast.planPartsList.forEach((part: any) => {
        parts[part.partId] = parts[part.partId] || { id: part.partId, requiredQuantity: 0, inUseQuantity: 0, availableQuantity: 0 };
        parts[part.partId].requiredQuantity += part.qunatityRequired;
      });
    });

    // Aggregate actualDetails for trades, parts, and tools
    data.actualDetails.forEach((each: any) => {
      each.trade.forEach((trade: any) => {
        trades[trade.id] = trades[trade.id] || { id: trade.id, requiredHours: 0, hoursInUse: 0, availableHours: 0 };
        trades[trade.id].availableHours += parseFloat(trade.availableCount);
        trades[trade.id].hoursInUse += parseFloat(trade.count);
      });

      each.part.forEach((part: any) => {
        parts[part.id] = parts[part.id] || { id: part.id, requiredQuantity: 0, inUseQuantity: 0, availableQuantity: 0 };
        parts[part.id].availableQuantity += parseFloat(part.availableCount);
        parts[part.id].inUseQuantity += parseFloat(part.count);
      });

      each.tool.forEach((tool: any) => {
        tools[tool.id] = tools[tool.id] || { id: tool.id, requiredHours: 0, hoursInUse: 0, availableHours: 0 };
        tools[tool.id].availableHours += parseFloat(tool.availableCount);
        tools[tool.id].hoursInUse += parseFloat(tool.count);
      });
    })


    // Construct the final object
    this.finalObject = {
      Trades: Object.entries(trades).map(([name, { id, requiredHours, hoursInUse, availableHours }]) => ({
        name,
        id,
        requiredHours,
        hoursInUse,
        availableHours
      })),
      Parts: Object.entries(parts).map(([name, { id, requiredQuantity, inUseQuantity, availableQuantity }]) => ({
        name,
        id,
        requiredQuantity,
        inUseQuantity,
        availableQuantity
      })),
      Tools: Object.entries(tools).map(([name, { id, requiredHours, hoursInUse, availableHours }]) => ({
        name,
        id,
        requiredHours,
        hoursInUse,
        availableHours
      }))
    };
    this.isReload = true;
    this.spinner.hide();
    console.log(this.finalObject);
  }

  noRequestsFoundAlert() {
    this.confirmationService.confirm({
      message: UtilConstant.NO_REQUESTS_FOUND,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'noReqFound',
      accept: () => {
        this.onClear();
      }
    });
  }

  onClear() {
    this.filterPanel.reset();
    this.requestsList = [];
    this.tradeHoursMap = {};
    this.toolHoursMap = {};
    this.partQuantityMap = {};
    this.isReload = false;
  }


  onTabOpen(event: any) {

    this.cardData = [];
    var selectedTab = this.cardTitles[event.index];
    switch (selectedTab.id) {
      case 'Trades':
        this.cardData = this.finalObject.Trades.map((trade: any) => {
          
            // this.selectedTrade = this.getSelectedTrade(trade.id);
            trade.availableHours = trade.standardHours
            return trade;
      
        });
        break;
      case 'Parts':
        this.cardData = this.finalObject.Parts.map((part: any) => {
          this.selectedPart = this.getSelectedPart(part.id);
          part.availableQuantity = this.selectedPart.qutOnHand
          return part;
        });
        break;
      case 'Tools':
        this.cardData = this.finalObject.Tools.map((tool: any) => {
            let selectedTool = this.getSelectedTool(tool.id);
            tool.availableHours = selectedTool.standardAvalTime * this.getNumberOfDays(this.filterData.fromDate, this.filterData.toDate);
            return tool;
        });
        break;
      default:
        this.cardData = [];
        break;
    }
  }

  getNumberOfDays(from: Date, to: Date) {
    var date1 = new Date(from);
    var date2 = new Date(to);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days+1;//return including both days
  }

  getPlanDetails() {
    this.showPlanDetails = false;
    this.planScheduleSrv.getForecastPlanDetails(this.filterData).subscribe((res:any) => {
      this.planData = res;
      this.showPlanDetails = true;
    })
  }

}
