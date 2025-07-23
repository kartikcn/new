import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from '../background-loc/services/bl.service';
import { PlanScheduleService } from '../ppm-schedule/services/plan-schedule-services';
import { Equipment } from '../Helpdesk/equipment/modal/DTO/equipmentDto.modal';
import { PartsService } from '../Helpdesk/parts/services/parts.service';
import { ToolsService } from '../Helpdesk/tools/services/tools.services';
import { TradesService } from '../Helpdesk/trades/services/trades.services';
import { EquipmentService } from '../Helpdesk/equipment/services/equipment.services';
import { PpmPlanService } from '../ppm-plan/services/ppm-plan-services';
import { ReportBarChartModel } from '../view-employee-report/model/report-bar-chart.model';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingFilterInputDTO } from '../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from '../background-loc/model/DTO/RoomFilterInputDTO.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';

interface ForecastPlannerObject {
  request: { count: number; };
  trade: { id: string; name: string; requiredHours: number; availableHours: number; }[];
  tool: { id: string; name: string; requiredHours: number; availableHours: number; }[];
  part: { id: string; name: string; requiredQuantity: number; availableQuantity: number; }[];
}

@Component({
  selector: 'app-forecast-reports',
  templateUrl: './forecast-reports.component.html',
  styleUrls: ['./forecast-reports.component.scss'],
  providers: [MessageService]
})
export class ForecastReportsComponent {
  filterPanel!: UntypedFormGroup;
  frmToolsDetail!: FormGroup;
  enumBL: BuildingFilterInputDTO[] = [];
  enumAllBl: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumRm: RoomFilterInputDTO[] = [];
  enumAllEquipment: any[] = [];
  enumEquipment: Equipment[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  eqData: any[] = [];
  planList: any[] = [];
  tradeList: any[] = [];
  partsList: any[] = [];
  toolsList: any[] = [];
  maxDate!: Date;
  showCard: boolean = false;
  showCardGrid: boolean = true;
  showCardChart: boolean = false;
  filterData: any;
  dateErrorMsg: string = '';
  showByData: any[] = [
    {
      "id": 0,
      "label": 'Daily',
      "value": "daily"
    },
    {
      "id": 1,
      "label": 'Weekly',
      "value": "weekly"
    },
    {
      "id": 2,
      "label": 'Monthly',
      "value": "monthly"
    }
  ];
  titleString: string = "";
  today: Date = new Date();
  rowCount: number = UtilConstant.ROW_COUNT;
  forcastplannerData: any;
  forecastDisplayData!: ForecastPlannerObject;
  requestsList: any[] = [];
  displayRequestList: boolean = false;
  showTradeDetails: boolean = false;
  selectedTrade: any;
  showPartDetails: boolean = false;
  selectedPart: any;
  showToolDetails: boolean = false;
  showPlanDetails: boolean = false;
  planData: any = [];
  keyPmPlannerList: string[] = [];
  openAccordionTabs: string[] = [];
  monthStart = new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1);
  monthEnd = new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0);
  showByValue: string = 'daily';
  selectedDisplayParameters: string[] = [];
  showSpinner: boolean = false;
  showNext: boolean = true;
  showPrevious: boolean = true;
  view: any[] = [900, 295];
  showXAxis: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  barchartData: ReportBarChartModel[] = [];
  showYAxis = true;
  showLegend = false;
  showGridLines: boolean = false;
  showYAxisLabel = true;
  gradient = false;
  yAxisLabel: string = '';
  colorScheme = {
    domain: ['#5AA454', '#C7B42C']
  };
  chartImg: any[] = [];
  legendItems: any[] = [];
  dialogWidth: any;
  dialogHeight: any;
  key: any;
  isChartButton: boolean = false;
  isGridButton: boolean = true;
  @ViewChild('contentArea') contentArea!: ElementRef;
  useTabletProtrait = false;
  tradeDetailsDialogWidth = '40vw';
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
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private datePipe: DatePipe,
    private blService: BuildingService,
    private tradeService: TradesService,
    private partsService: PartsService,
    private toolsService: ToolsService,
    private eqService: EquipmentService,
    private ppmPlanService: PpmPlanService,
    private planscheduleSrv: PlanScheduleService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private bps: BreakpointService
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
    this.bps.register(this);
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

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.updateTradeDetailsDialog();
  }

  setDefaultDates(fromDate: any, toDate: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        fromDate: fromDate,
        toDate: toDate,
      });
    }, 0);
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
    this.filterPanel.patchValue({
      flId: null,
      rmId: null,
      eqId: null
    });
    if ($event.blId != null && $event.blId != '') {
      this.selectedBl = $event;
      this.selectedFl = {};

      this.filterAssets($event.blId, null, null);
    } else {
      this.selectedFl = {};
      this.selectedBl = {};
      this.filterAssets(null, null, null);

    }
  }

  onSelectFlCode($event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        rmId: null,
      });
    }, 0);
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
          blId: $event.blId,
          rmId: null,
          eqId: null
        });
        this.filterAssets($event.blId, $event.flId, null);
      }, 10);
    }
    else {
      this.selectedRm = {};
    }

  }

  onSelectRmCode($event: any) {
    if ($event.rmId != null && $event.rmId != '') {
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
        this.filterPanel.patchValue({
          blId: $event.blId,
          flId: $event.flId,
          eqId: null
        });
      }, 0);
      this.filterAssets($event.blId, $event.flId, $event.rmId);
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

  filterAssets(blId: any, flId: any, rmId: any) {
    this.enumEquipment = this.enumAllEquipment;
    blId ? this.enumEquipment = this.enumAllEquipment.filter(asset => asset.blId == blId) : '';
    flId ? this.enumEquipment = this.enumEquipment.filter(asset => asset.blId == blId && asset.flId == flId) : '';
    rmId ? this.enumEquipment = this.enumEquipment.filter(asset => asset.blId == blId && asset.flId == flId && asset.rmId == rmId) : '';
  }

  loadequipments() {
    this.eqService.getAllEquipments().subscribe((res: any) => {
      if (res.status != 202) {
        this.enumAllEquipment = res;
        this.enumEquipment = this.enumAllEquipment;
        this.enumEquipment.unshift(new Object({ eqCode: "Make a selection", description: '', eqId: 1 }))
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
        this.dateErrorMsg = '';
        this.filterPanel.controls['fromDate'].setErrors(null);
        this.filterPanel.controls['toDate'].setErrors(null);
        this.filterPanel.clearAsyncValidators();
        this.filterPanel.updateValueAndValidity();
        var dateFrom = new Date(this.filterPanel.controls['fromDate'].value);
        var dateTo = new Date(this.filterPanel.controls['toDate'].value);
        if (dateFrom.getTime() > dateTo.getTime() && this.filterPanel.controls['toDate'].value != null) {
          this.filterPanel.controls['fromDate'].setErrors({ 'incorrect': true });
          this.filterPanel.updateValueAndValidity();
          this.dateErrorMsg = 'Date End should be greater than Date Start.'
          return { 'incorrect': true };
        } else {
          return null;
        }
      }
      return null;
    };
  }

  getProperty(key: keyof ForecastPlannerObject, data: ForecastPlannerObject): any {
    if (data) {
      return data[key];
    } else {
      return 0;
    }
  }

  onShowByChange(event: any) {
    this.showCard = false;
    this.onSearch();
  }

  onTabOpen(event: any) {
    this.key = this.keyPmPlannerList[event.index];
    if (!this.openAccordionTabs.includes(this.key)) {
      this.openAccordionTabs.push(this.key);
    }
    this.refreshBarChartData();

  }

  onClickGridButton() {
    this.showCardChart = false;
    this.showCardGrid = false;
    let presentOpenAccordions = [...this.openAccordionTabs];
    this.openAccordionTabs = [];
    this.openAccordionTabs = [...presentOpenAccordions];
    this.showCardGrid = true;
  }

  onClickChartButton() {
    this.showCardChart = false;
    this.showCardGrid = false;
    let presentOpenAccordions = [...this.openAccordionTabs];
    this.openAccordionTabs = [];
    this.openAccordionTabs = [...presentOpenAccordions];
    this.showCardChart = true;
    this.refreshBarChartData();
  }

  checkboxSelected(event: any) {
    this.keyPmPlannerList = [];
    this.openAccordionTabs = [];
    event.checked.forEach((key: string) => {
      this.keyPmPlannerList.push(key);
    })
  }

  getPlanDetails() {
    this.showPlanDetails = false;
    const contentAreaWidth = this.contentArea.nativeElement.offsetWidth;
    const contentAreaHeight = this.contentArea.nativeElement.offsetHeight;
    if (this.useTabletProtrait) {
      this.dialogHeight = contentAreaHeight * 0.75 + 'px';
    } else {
      this.dialogHeight = contentAreaHeight * 1.2 + 'px';
    }
    this.dialogWidth = contentAreaWidth + 'px';
    this.planscheduleSrv.getForecastPlanDetails(this.filterData).subscribe((res: any) => {
      this.planData = res;
      this.showPlanDetails = true;
    })
  }

  onClickDetails(key: any, id: any) {
    this.showTradeDetails = false;
    this.showPartDetails = false;
    this.showToolDetails = false;
    if (key == "trade") {
      this.selectedTrade = this.tradeList.find((t: any) => t.tradeId === parseInt(id) || t.tradeCode == id);
      this.showTradeDetails = true;
    } else if (key == "part") {
      this.selectedPart = this.partsList.find((t: any) => t.partId === parseInt(id) || t.partCode == id);
      this.showPartDetails = true;
    } else {
      let selectedTool = this.toolsList.find((t: any) => t.toolsId === parseInt(id) || t.tool == id);
      this.setToolForm(selectedTool);
      this.showToolDetails = true;
    }
  }

  setToolForm(value: any) {
    setTimeout(() => {
      this.frmToolsDetail.patchValue({
        toolsFormPanel: value
      });
    }, 0);
  }

  onSearch() {
    this.requestsList = [];
    this.openAccordionTabs = [];
    this.showSpinner = true;
    this.spinner.show();
    this.showCard = true;
    this.keyPmPlannerList = ['trade', 'part', 'tool'];
    this.selectedDisplayParameters = ['trade', 'part', 'tool'];
    let fromDate = this.setTimeToZero(this.filterPanel.controls.fromDate.value);
    let toDate = this.setTimeToZero(this.filterPanel.controls.toDate.value);
    let dateObject = {
      fromDate: '',
      toDate: ''
    }
    if (this.showByValue == "daily") {
      dateObject.fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd")!;
      dateObject.toDate = this.datePipe.transform(fromDate, "yyyy-MM-dd")!;
      this.titleString = this.datePipe.transform(fromDate, "dd MMM yyyy")!
    } else if (this.showByValue == "weekly") {
      let weekdateobj = this.getWeekFirstAndLastDateforDate(fromDate);
      if (toDate > weekdateobj.lastDate) {
        dateObject.toDate = this.datePipe.transform(weekdateobj.lastDate, "yyyy-MM-dd")!;
      } else {
        dateObject.toDate = this.datePipe.transform(toDate, "yyyy-MM-dd")!;
      }
      if (fromDate < weekdateobj.firstDate) {
        dateObject.fromDate = this.datePipe.transform(weekdateobj.firstDate, "yyyy-MM-dd")!;
      } else {
        dateObject.fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd")!;
      }
      this.titleString = `${weekdateobj.lastDate.getFullYear()}: Week - ${(this.getWeekNumber(fromDate)).toString()} (${this.datePipe.transform(weekdateobj.firstDate, "dd MMM yyyy")} - ${this.datePipe.transform(weekdateobj.lastDate, "dd MMM yyyy")})`;
    } else if (this.showByValue == "monthly") {
      let monthdateobj = this.getMonthFirstAndLastDateforDate(fromDate);
      if (toDate > monthdateobj.lastDate) {
        dateObject.toDate = this.datePipe.transform(monthdateobj.lastDate, "yyyy-MM-dd")!;
      } else {
        dateObject.toDate = this.datePipe.transform(toDate, "yyyy-MM-dd")!;
      }
      if (fromDate < monthdateobj.firstDate) {
        dateObject.fromDate = this.datePipe.transform(monthdateobj.firstDate, "yyyy-MM-dd")!;
      } else {
        dateObject.fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd")!;
      }
      this.titleString = this.datePipe.transform(fromDate, "MMMM yyyy")!;
    }
    this.disableCheckNextAndPrevious();
    this.filterData = {
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: this.filterPanel.controls.rmId.value,
      eqId: this.filterPanel.controls.eqId.value,
      planId: this.filterPanel.controls.planId.value ? this.filterPanel.controls.planId.value : 0,
      fromDate: dateObject.fromDate,
      toDate: dateObject.toDate
    };
    this.refreshForecastDetails();
  }

  onNext() {
    this.requestsList = [];
    this.showSpinner = true;
    this.spinner.show();
    let previousFirstDate: Date;
    let fromDate = this.setTimeToZero(this.filterPanel.controls.fromDate.value);
    let toDate = this.setTimeToZero(this.filterPanel.controls.toDate.value);
    let dateObject = {
      fromDate: '',
      toDate: ''
    }
    if (this.showByValue == "daily") {
      previousFirstDate = this.getDateFromDateString(this.titleString);
      let nextDate = this.calculateNextDate(previousFirstDate, 1);
      dateObject.fromDate = this.datePipe.transform(nextDate, "yyyy-MM-dd")!;
      dateObject.toDate = this.datePipe.transform(nextDate, "yyyy-MM-dd")!;
      this.titleString = this.datePipe.transform(nextDate, "dd MMM yyyy")!;
    } else if (this.showByValue == "weekly") {
      previousFirstDate = this.getDateFromWeekString(this.titleString)!;
      let datestartvalue = this.calculateNextDate(previousFirstDate, 7);
      let dateendvalue = (this.calculateNextDate(datestartvalue, 6));
      if (fromDate < datestartvalue) {
        dateObject.fromDate = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      } else {
        dateObject.fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd")!;
      }
      if (toDate > dateendvalue) {
        dateObject.toDate = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
      } else {
        dateObject.toDate = this.datePipe.transform(toDate, "yyyy-MM-dd")!;
      }
      this.titleString = `${dateendvalue.getFullYear()}: Week - ${(this.getWeekNumber(datestartvalue)).toString()} (${this.datePipe.transform(datestartvalue, "dd MMM yyyy")} - ${this.datePipe.transform(dateendvalue, "dd MMM yyyy")})`;
    } else if (this.showByValue == "monthly") {
      previousFirstDate = this.getDateFromMonthString(this.titleString)!;
      let monthObj = this.getMonthFirstAndLastDateforDate(this.calculateNextMonth(previousFirstDate, 1));
      dateObject.fromDate = this.datePipe.transform(monthObj.firstDate, "yyyy-MM-dd")!;
      if (fromDate < monthObj.firstDate) {
        dateObject.fromDate = this.datePipe.transform(monthObj.firstDate, "yyyy-MM-dd")!;
      } else {
        dateObject.fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd")!;
      }
      if (toDate > monthObj.lastDate) {
        dateObject.toDate = this.datePipe.transform(monthObj.lastDate, "yyyy-MM-dd")!;
      } else {
        dateObject.toDate = this.datePipe.transform(toDate, "yyyy-MM-dd")!;
      }
      this.titleString = this.datePipe.transform(monthObj.firstDate, "MMMM yyyy")!;
    }
    this.disableCheckNextAndPrevious();
    this.filterData = {
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: this.filterPanel.controls.rmId.value,
      eqId: this.filterPanel.controls.eqId.value,
      planId: this.filterPanel.controls.planId.value ? this.filterPanel.controls.planId.value : 0,
      fromDate: dateObject.fromDate,
      toDate: dateObject.toDate,
    }
    this.spinner.show();
    this.showSpinner = true;
    this.refreshForecastDetails();

  }

  onPrevious() {
    this.showSpinner = true;
    this.spinner.show();
    let previousFirstDate: Date;
    let fromDate = this.setTimeToZero(this.filterPanel.controls.fromDate.value);
    let toDate = this.setTimeToZero(this.filterPanel.controls.toDate.value);
    let dateObject = {
      fromDate: '',
      toDate: ''
    }
    if (this.showByValue == "daily") {
      previousFirstDate = this.getDateFromDateString(this.titleString);
      let nextDate = this.calculateNextDate(previousFirstDate, -1);
      dateObject.fromDate = this.datePipe.transform(nextDate, "yyyy-MM-dd")!;
      dateObject.toDate = this.datePipe.transform(nextDate, "yyyy-MM-dd")!;
      this.titleString = this.datePipe.transform(nextDate, "dd MMM yyyy")!;
    } else if (this.showByValue == "weekly") {
      previousFirstDate = this.getDateFromWeekString(this.titleString)!;
      let datestartvalue = this.calculateNextDate(previousFirstDate, -7);
      let dateendvalue = this.calculateNextDate(datestartvalue, 6);
      if (fromDate < datestartvalue) {
        dateObject.fromDate = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      } else {
        dateObject.fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd")!;
      }
      if (toDate > dateendvalue) {
        dateObject.toDate = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
      } else {
        dateObject.toDate = this.datePipe.transform(toDate, "yyyy-MM-dd")!;
      }
      this.titleString = `${dateendvalue.getFullYear()}: Week - ${(this.getWeekNumber(datestartvalue)).toString()} (${this.datePipe.transform(datestartvalue, "dd MMM yyyy")} - ${this.datePipe.transform(dateendvalue, "dd MMM yyyy")})`;
    } else if (this.showByValue == "monthly") {
      previousFirstDate = this.getDateFromMonthString(this.titleString)!;
      let monthObj = this.getMonthFirstAndLastDateforDate(this.calculateNextMonth(previousFirstDate, -1));
      if (fromDate < monthObj.firstDate) {
        dateObject.fromDate = this.datePipe.transform(monthObj.firstDate, "yyyy-MM-dd")!;
      } else {
        dateObject.fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd")!;
      }
      if (toDate > monthObj.lastDate) {
        dateObject.toDate = this.datePipe.transform(monthObj.lastDate, "yyyy-MM-dd")!;
      } else {
        dateObject.toDate = this.datePipe.transform(toDate, "yyyy-MM-dd")!;
      }
      this.titleString = this.datePipe.transform(monthObj.firstDate, "MMMM yyyy")!;
    }
    this.disableCheckNextAndPrevious();
    this.filterData = {
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: this.filterPanel.controls.rmId.value,
      eqId: this.filterPanel.controls.eqId.value,
      planId: this.filterPanel.controls.planId.value ? this.filterPanel.controls.planId.value : 0,
      fromDate: dateObject.fromDate,
      toDate: dateObject.toDate,
    }
    this.spinner.show();
    this.showSpinner = true;
    this.refreshForecastDetails();

  }

  onClear() {
    this.showCard = false;
    let month = new Date().getMonth();
    var date = new Date();
    var nextDate = new Date(new Date().setMonth(month + 1));
    this.setDefaultDates(date, nextDate);
    this.filterPanel.patchValue({
      blId: null,
      flId: null,
      rmId: null,
      eqId: null,
      planId: null,
    });
    this.titleString = "";
    this.showSpinner = false;
    this.selectedDisplayParameters = [];
    this.filterData = {};
    this.showCardGrid = true;
    this.showCardChart = false;
    this.requestsList = [];
    this.dateErrorMsg = '';
    this.titleString = "";
    this.displayRequestList = false;
    this.showTradeDetails = false;
    this.showPartDetails = false;
    this.showToolDetails = false;
    this.showPlanDetails = false;
    this.planData = [];
    this.openAccordionTabs = [];
    this.keyPmPlannerList = [];
    this.showByValue = 'daily';
    this.showSpinner = false;
    this.showNext = true;
    this.showPrevious = true;
    this.barchartData = [];
    this.chartImg = [];
    this.legendItems = [];
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.limitBl = 0;
    this.offsetBl = 0;
    this.limitFl = 0;
    this.offsetFl = 0;
    this.limitRm = 0;
    this.offsetRm = 0;
    this.scrollToEndBl();
    this.scrollToEndFl();
    this.scrollToEndRm();
  }

  onClickRequest() {
    this.displayRequestList = true;
  }

  onSelectBarChart(event: any, key: any) {
    if (event.label == "Available Hours" || event.label == "Available Quantity") {
      this.onClickDetails(key, event.series);
    }
    else if (event.label == "Required Hours" || event.label == "Required Quantity") {
      this.getPlanDetails();
    }
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

  setTimeToZero(date: Date) {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  changeDisplayType(event: any) {
    this.showCardChart = false;
    this.showCardGrid = false;
    this.openAccordionTabs = [];
    if (event.value == "bar_chart") {
      this.showCardChart = true;
    } else if (event.value == "grid") {
      this.showCardGrid = true;
    }
  }

  generatePlannerObject() {
    this.forecastDisplayData = { request: { count: 0 }, trade: [], tool: [], part: [] };
    let requestCount: { count: number; } = { count: this.forcastplannerData.requestsList.length };
    let tradeHoursMap: { id: string; name: string; requiredHours: number; availableHours: number; }[] = [];
    let toolHoursMap: { id: string; name: string; requiredHours: number; availableHours: number; }[] = [];
    let partQuantityMap: { id: string; name: string; requiredQuantity: number; availableQuantity: number; }[] = [];
    if (this.forcastplannerData.requestsList.length > 0) {
      tradeHoursMap = this.forcastplannerData.Trades.map((each: any) => ({
        id: each.id,
        name: each.name,
        requiredHours: each.requiredHours,
        availableHours: each.standardHours - each.hoursInUse
      }));
      toolHoursMap = this.forcastplannerData.Tools.map((each: any) => ({
        id: each.id,
        name: each.name,
        requiredHours: each.requiredHours,
        availableHours: each.standardHours - each.hoursInUse
      }))
      partQuantityMap = this.forcastplannerData.Parts.map((each: any) => ({
        id: each.id,
        name: each.name,
        requiredQuantity: each.requiredQuantity,
        availableQuantity: each.standardQuantity
      }))
    }
    this.forecastDisplayData = {
      request: requestCount,
      trade: tradeHoursMap,
      tool: toolHoursMap,
      part: partQuantityMap
    }
  }

  generateBarChartData(list: any[], isPartList: boolean) {
    this.barchartData = [];
    const barChartData: any[] = [];
    list.forEach((each: any, index: number) => {
      if (isPartList) {
        let series = [{ "name": "Available Quantity", "value": each.availableQuantity }, { "name": "Required Quantity", "value": each.requiredQuantity }];
        let dataobj = {
          name: each.name,
          series: series,
        }
        barChartData.push(dataobj);
      } else {
        let series = [{ "name": "Available Hours", "value": each.availableHours }, { "name": "Required Hours", "value": each.requiredHours }];
        let dataobj = {
          name: each.name,
          series: series,
        }
        barChartData.push(dataobj);
      }
    })
    if (barChartData.length < 5) {
      let empty = '  ';
      for (let i = 0; i < 5 - barChartData.length; i++) {
        const emptySeries = isPartList
          ? [{ "name": "Required Quantity", "value": 0 }, { "name": "Available Quantity", "value": 0 }]
          : [{ "name": "Required Hours", "value": 0 }, { "name": "Available Hours", "value": 0 }];
        barChartData.push({
          name: empty.repeat(i + 1),
          series: emptySeries,
        })
      }
    }
    this.barchartData = barChartData;
    this.cdr.detectChanges();
  }

  disableCheckNextAndPrevious() {
    if (this.titleString != '') {
      this.showPrevious = true;
      this.showNext = true;
      let fromDate = this.setTimeToZero(this.filterPanel.controls.fromDate.value);
      let toDate = this.setTimeToZero(this.filterPanel.controls.toDate.value);
      if (this.showByValue == "daily") {
        let presentDate = this.getDateFromDateString(this.titleString);
        if (presentDate >= toDate) {
          this.showNext = false;
        }
        if (presentDate <= fromDate) {
          this.showPrevious = false;
        }
      } else if (this.showByValue == "weekly") {
        let weekFirstDate = this.getDateFromWeekString(this.titleString);
        let weekLastDate = this.calculateNextDate(weekFirstDate, 6);
        if (weekLastDate >= toDate) {
          this.showNext = false;
        }
        if (weekFirstDate <= fromDate) {
          this.showPrevious = false;
        }
      } else if (this.showByValue == "monthly") {
        let monthObj = this.getMonthFirstAndLastDateforDate(this.getDateFromMonthString(this.titleString));
        if (monthObj.lastDate >= toDate) {
          this.showNext = false;
        }
        if (monthObj.firstDate <= fromDate) {
          this.showPrevious = false;
        }
      }
    }
  }

  getDateFromDateString(date: string) {
    const dateString = date;
    const dateParts = dateString.split(' ');
    const year = parseInt(dateParts[2], 10);
    const month = new Date(Date.parse(dateParts[1] + ' 1, 2023')).getMonth();
    const day = parseInt(dateParts[0], 10);
    const dateObject = new Date(year, month, day);
    dateObject.setHours(0, 0, 0, 0);
    return dateObject;
  }

  getDateFromWeekString(weekString: string) {
    const parts = weekString.split(':');
    const yearString = parts[0].trim();
    const weekPart = parts[1].trim();
    const year = parseInt(yearString, 10);
    const weekMatch = weekPart.match(/\d+/);
    const weekNumber = weekMatch ? parseInt(weekMatch[0], 10) : 1;
    const startOfWeekDay = 1;
    const date = new Date(year, 0, 1);
    const daysToMonday = (7 - (date.getDay() - startOfWeekDay)) % 7;
    date.setDate(date.getDate() + daysToMonday);
    const daysToAdd = (weekNumber - 1) * 7;
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  getDateFromMonthString(monthString: string) {
    const dateParts = monthString.split(' ');
    const month = dateParts[0];
    const year = parseInt(dateParts[1], 10);
    const dateObject = new Date(year, this.getMonthNumber(month), 1);
    dateObject.setHours(0, 0, 0, 0);
    return dateObject;
  }

  getMonthNumber(month: string): number {
    const months: string[] = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(month);
  }

  getWeekFirstAndLastDateforDate(date: Date) {
    const result = {
      firstDate: new Date(date),
      lastDate: new Date(date),
    };
    result.firstDate.setDate(date.getDate() - date.getDay() + (date.getDay() == 0 ? -6 : 1));
    result.firstDate.setHours(0, 0, 0, 0);
    result.lastDate.setDate(date.getDate() - date.getDay() + (date.getDay() == 0 ? 0 : 7));
    result.lastDate.setHours(23, 59, 59, 999);
    return result;
  }

  getMonthFirstAndLastDateforDate(date: Date) {
    const result = {
      firstDate: new Date(date),
      lastDate: new Date(date),
    };
    result.firstDate.setDate(1);
    result.firstDate.setHours(0, 0, 0, 0);
    result.lastDate.setMonth(date.getMonth() + 1, 0);
    result.lastDate.setHours(23, 59, 59, 999);
    return result;
  }

  getWeekNumber(date: Date): number {
    let currentDate: any = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 4 - (currentDate.getDay() || 7));
    let yearStart: any = new Date(currentDate.getFullYear(), 0, 1);
    let weekNumber = Math.ceil(((currentDate - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  }

  calculateNextDate(currentDate: Date, daysToAdd: number): Date {
    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate;
  }

  calculateNextMonth(currentDate: Date, monthsToAdd: number): Date {
    let date = new Date(currentDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    return date;
  }

  getDisplayKey(key: string) {
    let displayKey = "";
    if (key == "request") {
      displayKey = "Request";
    } else if (key == "trade") {
      displayKey = "Trade";
    } else if (key == "tool") {
      displayKey = "Tool";
    } else if (key == "part") {
      displayKey = "Part";
    } else if (key == "technician") {
      displayKey = "Technician";
    }
    return displayKey;
  }

  onCloseDetails() {
    this.spinner.show();
    this.showSpinner = true;
    this.refreshForecastDetails();
    this.showPlanDetails = false;
  }

  refreshForecastDetails() {
    this.planscheduleSrv.getForecastDetails(this.filterData).subscribe((res: any) => {
      this.forcastplannerData = res;
      this.requestsList = res.requestsList;
      this.generatePlannerObject();
      this.refreshBarChartData();
      this.spinner.hide();
      this.showSpinner = false;
    });
  }

  refreshBarChartData() {
    if (this.showCardChart) {
      if (this.key == "tool") {
        this.legendItems = [
          { name: "Available Hours", color: "#5AA454" },
          { name: "Required Hours", color: "#C7B42C" }
        ]
        this.generateBarChartData(this.forecastDisplayData.tool, false);
      } else if (this.key == "trade") {
        this.legendItems = [
          { name: "Available Hours", color: "#5AA454" },
          { name: "Required Hours", color: "#C7B42C" }

        ]
        this.generateBarChartData(this.forecastDisplayData.trade, false);
      } else if (this.key == "part") {
        this.legendItems = [
          { name: "Available Quantity", color: "#5AA454" },
          { name: "Required Quantity", color: "#C7B42C" }
        ]
        this.generateBarChartData(this.forecastDisplayData.part, true);
      }
    }
  }

  updateTradeDetailsDialog() {
    if (this.useTabletProtrait) {
      this.tradeDetailsDialogWidth = '60vw';
    } else {
      this.tradeDetailsDialogWidth = '40vw';
    }
    if (this.showTradeDetails) {
      this.showTradeDetails = false;
      setTimeout(() => {
        this.showTradeDetails = true;
        this.cdr.detectChanges();
      }, 100);
    }
  }

  ngOnDestroy() {
    this.bps.unregister(this);
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

  createRmData(rm: any) {
    const rmData = {
      rmId: rm.rmId,
      rmNameString: rm.rmName != null ? rm.rmCode + " - " + rm.rmName : rm.rmCode,
      flId: rm.flId,
      blId: rm.blId
    }
    return rmData;
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
