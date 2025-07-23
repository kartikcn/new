import { ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { BuildingService } from '../background-loc/services/bl.service';
import { PlanScheduleService } from '../ppm-schedule/services/plan-schedule-services';
import { AddWorkRequestService } from '../Helpdesk/work-request/service/add-work-request.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingFilterInputDTO } from '../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../background-loc/model/DTO/FloorFilterInputDTO.model';

interface PmPlannerData {
  request: { count: number; };
  trade: { name: string; count: number; id: string; availableCount: number; }[];
  tool: { name: string; count: number; id: string; availableCount: number; }[];
  part: { name: string; count: number; id: string; availableCount: number;units: string }[];
  technician: { name: string; count: number; id: string; availableCount: number; }[];
}

@Component({
  selector: 'app-pm-planner',
  templateUrl: './pm-planner.component.html',
  styleUrls: ['./pm-planner.component.scss'],
  providers: [MessageService]
})
export class PmPlannerComponent {
  filterPanel!: UntypedFormGroup;
  enumBL: any[] = [];
  enumFL: any[] = [];
  enumAllFL: any[] = [];
  showCardGrid: boolean = false;
  viewByData: any[] = [
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
  firstListTitle: string = "firstList";
  secondListTitle: string = "secondList";
  thirdListTitle: string = "thirdList";
  fourthListTitle: string = "fourthList";
  titleStringList: string[] = [];
  currentDate = new Date();
  pmplannerData: PmPlannerData[] = [];
  keyPmPlannerList: string[] = [];
  monthStart = new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1);
  monthEnd = new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0);
  i!: number;
  viewByValue: string = 'daily';
  selectedDisplayParameters: string[] = [];
  selectedRowCardTableName: string = '';
  selectedRowCard: any;
  showRequestPopUpGrid: boolean = false;
  showOtherPopUpGrid: boolean = false;
  popUpTableData: any[] = [];
  myRequestsData: any[] = [];
  pmplannerFilter: any;
  pmplannerRoomFilter: any;
  showSpinner: boolean = false;
  selectedDateTitle: string = '';
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };

  selectedBl: any = {};
  selectedFl: any = {};
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private datePipe: DatePipe,
    private blServ: BuildingService,
    private planscheduleSrv: PlanScheduleService,
    private wrServ: AddWorkRequestService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
  ) {

    this.filterPanel = this.formBuilder.group({
      blId: [null],
      flId: [null],
    });
  }

  ngOnInit(): void {
    this.currentDate.setHours(0, 0, 0, 0);
    this.filterPanel.patchValue({
      dateFrom: this.monthStart,
      dateTo: this.monthEnd
    })
   
  }

  onSelectBlCode($event: any) {
    this.filterPanel.patchValue({
      flId: null,
    });
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
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
        });
      }, 10);
    }
    else {
   
    }
  }

  getProperty(key: keyof PmPlannerData, data: PmPlannerData): any {
    return data[key];
  }

  onViewByChange(event: any) {
    this.showCardGrid = false;
    this.onSearch();
  }

  onSearch() {
    this.pmplannerData = [];
    this.showCardGrid = true;
    let viewByValue = this.viewByValue;
    this.keyPmPlannerList = ['request', 'trade', 'tool', 'part', 'technician'];
    this.selectedDisplayParameters = ['trade', 'tool', 'part', 'technician'];
    this.showSpinner = true;
    this.spinner.show();
    let dateStart = '';
    let dateEnd = '';
    if (viewByValue == 'daily') {
      dateStart = this.datePipe.transform(this.currentDate, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(this.calculateNextDate(this.currentDate, 3), "yyyy-MM-dd")!;
    } else if (viewByValue == 'weekly') {
      let datestartvalue = this.getWeekFirstAndLastDateforDate(this.currentDate).firstDate;
      let dateendvalue = this.calculateNextDate(datestartvalue, 27);
      dateStart = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    } else if (viewByValue == 'monthly') {
      let datestartvalue = this.getMonthFirstAndLastDateforDate(this.currentDate).firstDate;
      let dateendvalue = this.getMonthFirstAndLastDateforDate(this.calculateNextMonth(this.currentDate, 3)).lastDate
      dateStart = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    }
    this.pmplannerFilter = {
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: null,
      eqId: null,
      dateRequestedFrom: dateStart,
      dateRequestedTo: dateEnd,
      viewByValue: viewByValue
    }
    this.planscheduleSrv.getPmPlannerData(this.pmplannerFilter).subscribe((res: any) => {
      this.pmplannerData = res;
      if (viewByValue == 'daily') {
        this.firstListTitle = this.datePipe.transform(this.currentDate, "dd MMM yyyy")!;
        this.secondListTitle = this.datePipe.transform(this.calculateNextDate(this.currentDate, 1), "dd MMM yyyy")!;
        this.thirdListTitle = this.datePipe.transform(this.calculateNextDate(this.currentDate, 2), "dd MMM yyyy")!;
        this.fourthListTitle = this.datePipe.transform(this.calculateNextDate(this.currentDate, 3), "dd MMM yyyy")!;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      } else if (viewByValue == 'weekly') {
        let secondTitleDate = this.calculateNextDate(this.currentDate, 7);
        let thirdTitleDate = this.calculateNextDate(this.currentDate, 14);
        let fourthTitleDate = this.calculateNextDate(this.currentDate, 21);
        this.firstListTitle = `${this.getWeekFirstAndLastDateforDate(this.currentDate).lastDate.getFullYear()}: Week - ${this.getWeekNumber(this.currentDate).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(this.currentDate).firstDate, "dd MMM yyyy")})`;
        this.secondListTitle = `${this.getWeekFirstAndLastDateforDate(secondTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(secondTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(secondTitleDate).firstDate, "dd MMM yyyy")})`;
        this.thirdListTitle = `${this.getWeekFirstAndLastDateforDate(thirdTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(thirdTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(thirdTitleDate).firstDate, "dd MMM yyyy")})`;
        this.fourthListTitle = `${this.getWeekFirstAndLastDateforDate(fourthTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(fourthTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(fourthTitleDate).firstDate, "dd MMM yyyy")})`;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      } else if (viewByValue == 'monthly') {
        this.firstListTitle = this.datePipe.transform(this.currentDate, "MMMM yyyy")!;
        this.secondListTitle = this.datePipe.transform(this.calculateNextMonth(this.currentDate, 1), "MMMM yyyy")!;
        this.thirdListTitle = this.datePipe.transform(this.calculateNextMonth(this.currentDate, 2), "MMMM yyyy")!;
        this.fourthListTitle = this.datePipe.transform(this.calculateNextMonth(this.currentDate, 3), "MMMM yyyy")!;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      }
      this.spinner.hide();
      this.showSpinner = false;
    })

  }

  onNext() {
    this.pmplannerData = [];
    let viewByValue = this.viewByValue;
    let dateStart = '';
    let dateEnd = '';
    this.showSpinner = true;
    this.spinner.show();
    let previousFirstDate: Date;
    if (viewByValue == 'daily') {
      previousFirstDate = this.getDateFromDateString(this.firstListTitle);
      dateStart = this.datePipe.transform(this.calculateNextDate(previousFirstDate, 4), "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(this.calculateNextDate(previousFirstDate, 7), "yyyy-MM-dd")!;
    } else if (viewByValue == 'weekly') {
      previousFirstDate = this.getDateFromWeekString(this.firstListTitle)!;
      let datestartvalue = this.calculateNextDate(previousFirstDate, 28);
      let dateendvalue = (this.calculateNextDate(datestartvalue, 27));
      dateStart = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    } else if (viewByValue == 'monthly') {
      previousFirstDate = this.getDateFromMonthString(this.firstListTitle)!;
      let datestartvalue = this.getMonthFirstAndLastDateforDate(this.calculateNextMonth(previousFirstDate, 4)).firstDate;
      let dateendvalue = this.getMonthFirstAndLastDateforDate(this.calculateNextMonth(previousFirstDate, 7)).lastDate
      dateStart = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    }
    this.pmplannerFilter = {
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: null,
      eqId: null,
      dateRequestedFrom: dateStart,
      dateRequestedTo: dateEnd,
      viewByValue: viewByValue
    }
    this.planscheduleSrv.getPmPlannerData(this.pmplannerFilter).subscribe((res: any) => {
      this.pmplannerData = res;
      if (viewByValue == 'daily') {
        this.firstListTitle = this.datePipe.transform(this.calculateNextDate(previousFirstDate, 4), "dd MMM yyyy")!;
        this.secondListTitle = this.datePipe.transform(this.calculateNextDate(previousFirstDate, 5), "dd MMM yyyy")!;
        this.thirdListTitle = this.datePipe.transform(this.calculateNextDate(previousFirstDate, 6), "dd MMM yyyy")!;
        this.fourthListTitle = this.datePipe.transform(this.calculateNextDate(previousFirstDate, 7), "dd MMM yyyy")!;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      }
      else if (viewByValue == 'weekly') {
        let firstTitleDate = this.calculateNextDate(previousFirstDate, 28);
        let secondTitleDate = this.calculateNextDate(previousFirstDate, 35);
        let thirdTitleDate = this.calculateNextDate(previousFirstDate, 42);
        let fourthTitleDate = this.calculateNextDate(previousFirstDate, 49);
        this.firstListTitle = `${this.getWeekFirstAndLastDateforDate(firstTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(firstTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(firstTitleDate).firstDate, "dd MMM yyyy")})`;
        this.secondListTitle = `${this.getWeekFirstAndLastDateforDate(secondTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(secondTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(secondTitleDate).firstDate, "dd MMM yyyy")})`;
        this.thirdListTitle = `${this.getWeekFirstAndLastDateforDate(thirdTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(thirdTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(thirdTitleDate).firstDate, "dd MMM yyyy")})`;
        this.fourthListTitle = `${this.getWeekFirstAndLastDateforDate(fourthTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(fourthTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(fourthTitleDate).firstDate, "dd MMM yyyy")})`;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      } else if (viewByValue == 'monthly') {
        this.firstListTitle = this.datePipe.transform(this.calculateNextMonth(previousFirstDate, 4), "MMMM yyyy")!;
        this.secondListTitle = this.datePipe.transform(this.calculateNextMonth(previousFirstDate, 5), "MMMM yyyy")!;
        this.thirdListTitle = this.datePipe.transform(this.calculateNextMonth(previousFirstDate, 6), "MMMM yyyy")!;
        this.fourthListTitle = this.datePipe.transform(this.calculateNextMonth(previousFirstDate, 7), "MMMM yyyy")!;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      }
      this.spinner.hide();
      this.showSpinner = false;
    })
  }

  onPrevious() {
    this.pmplannerData = [];
    let viewByValue = this.viewByValue;
    let dateStart = '';
    let dateEnd = '';
    this.showSpinner = true;
    this.spinner.show();
    let previousFirstDate: Date;
    if (viewByValue == 'daily') {
      previousFirstDate = this.getDateFromDateString(this.firstListTitle);
      dateStart = this.datePipe.transform(this.calculateNextDate(previousFirstDate, -4), "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(this.calculateNextDate(previousFirstDate, -1), "yyyy-MM-dd")!;
    } else if (viewByValue == 'weekly') {
      previousFirstDate = this.getDateFromWeekString(this.firstListTitle)!;
      let datestartvalue = this.calculateNextDate(previousFirstDate, -28);
      let dateendvalue = this.calculateNextDate(previousFirstDate, -1);
      dateStart = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    } else if (viewByValue == 'monthly') {
      previousFirstDate = this.getDateFromMonthString(this.firstListTitle)!;
      let datestartvalue = this.getMonthFirstAndLastDateforDate(this.calculateNextMonth(previousFirstDate, -4)).firstDate;
      let dateendvalue = this.getMonthFirstAndLastDateforDate(this.calculateNextMonth(previousFirstDate, -1)).lastDate
      dateStart = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    }
    this.pmplannerFilter = {
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: null,
      eqId: null,
      dateRequestedFrom: dateStart,
      dateRequestedTo: dateEnd,
      viewByValue: viewByValue
    }
    this.planscheduleSrv.getPmPlannerData(this.pmplannerFilter).subscribe((res: any) => {
      this.pmplannerData = res;
      if (viewByValue == 'daily') {
        this.firstListTitle = this.datePipe.transform(this.calculateNextDate(previousFirstDate, -4), "dd MMM yyyy")!;
        this.secondListTitle = this.datePipe.transform(this.calculateNextDate(previousFirstDate, -3), "dd MMM yyyy")!;
        this.thirdListTitle = this.datePipe.transform(this.calculateNextDate(previousFirstDate, -2), "dd MMM yyyy")!;
        this.fourthListTitle = this.datePipe.transform(this.calculateNextDate(previousFirstDate, -1), "dd MMM yyyy")!;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      }
      else if (viewByValue == 'weekly') {
        let firstTitleDate = this.calculateNextDate(previousFirstDate, -28);
        let secondTitleDate = this.calculateNextDate(previousFirstDate, -21);
        let thirdTitleDate = this.calculateNextDate(previousFirstDate, -14);
        let fourthTitleDate = this.calculateNextDate(previousFirstDate, -7);
        this.firstListTitle = `${this.getWeekFirstAndLastDateforDate(firstTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(firstTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(firstTitleDate).firstDate, "dd MMM yyyy")})`;
        this.secondListTitle = `${this.getWeekFirstAndLastDateforDate(secondTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(secondTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(secondTitleDate).firstDate, "dd MMM yyyy")})`;
        this.thirdListTitle = `${this.getWeekFirstAndLastDateforDate(thirdTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(thirdTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(thirdTitleDate).firstDate, "dd MMM yyyy")})`;
        this.fourthListTitle = `${this.getWeekFirstAndLastDateforDate(fourthTitleDate).lastDate.getFullYear()}: Week - ${(this.getWeekNumber(fourthTitleDate)).toString()} (${this.datePipe.transform(this.getWeekFirstAndLastDateforDate(fourthTitleDate).firstDate, "dd MMM yyyy")})`;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      } else if (viewByValue == 'monthly') {
        this.firstListTitle = this.datePipe.transform(this.calculateNextMonth(previousFirstDate, -4), "MMMM yyyy")!;
        this.secondListTitle = this.datePipe.transform(this.calculateNextMonth(previousFirstDate, -3), "MMMM yyyy")!;
        this.thirdListTitle = this.datePipe.transform(this.calculateNextMonth(previousFirstDate, -2), "MMMM yyyy")!;
        this.fourthListTitle = this.datePipe.transform(this.calculateNextMonth(previousFirstDate, -1), "MMMM yyyy")!;
        this.titleStringList = [this.firstListTitle, this.secondListTitle, this.thirdListTitle, this.fourthListTitle];
      }
      this.spinner.hide();
      this.showSpinner = false;
    })
  }

  loadForPmPlannerDataCurrentSelection() {
    this.showCardGrid = false;
    this.cdr.detectChanges();
    this.showSpinner = true;
    this.spinner.show();
    this.planscheduleSrv.getPmPlannerData(this.pmplannerFilter).subscribe((res: any) => {
      this.pmplannerData = res;
      this.showCardGrid = true;
      this.cdr.detectChanges();
      this.showOtherPopUpGrid = false;
      this.cdr.detectChanges();
      this.popUpTableData = [];
      this.planscheduleSrv.getPmPlannerRequestDetails(this.pmplannerRoomFilter).subscribe((res: any) => {
        setTimeout(() => {
          this.popUpTableData = res;
          this.showOtherPopUpGrid = true;
          this.cdr.detectChanges();
          this.spinner.hide();
          this.showSpinner = false;
        }, 1000);

      })

    });
  }

  onClear() {
    this.showCardGrid = false;
    this.filterPanel.patchValue({
      dateFrom: this.monthStart,
      dateTo: this.monthEnd,
      blId: null,
      flId: null,
    });
    this.titleStringList = [];
    this.viewByValue = 'daily';
    this.pmplannerData = [];
    this.showSpinner = false;
    this.selectedDisplayParameters = [];
    this.selectedRowCardTableName = '';
    this.selectedRowCard = {};
    this.showRequestPopUpGrid = false;
    this.showOtherPopUpGrid = false;
    this.popUpTableData = [];
    this.myRequestsData = [];
    this.pmplannerFilter = {};
    this.pmplannerRoomFilter = {};
    this.selectedDateTitle = '';
    this.selectedBl = {};
    this.selectedFl = {};
  }

  checkboxSelected(event: any) {
    this.keyPmPlannerList = [];
    this.keyPmPlannerList.unshift('request');
    event.checked.forEach((key: string) => {
      this.keyPmPlannerList.push(key);
    })
  }

  onClickRowCard(key: any, item: any, title: string) {
    this.showRequestPopUpGrid = false;
    this.showOtherPopUpGrid = false;
    this.popUpTableData = [];
    this.myRequestsData = [];
    this.selectedRowCardTableName = `${this.getDisplayKey(key)} Details`;
    this.selectedRowCard = {key:key,rowDetails:item};
    let dateStart: Date;
    let dateEnd: Date;
    this.selectedDateTitle = title;
    if (this.viewByValue == 'daily') {
      dateStart = this.getDateFromDateString(title);
      dateEnd = new Date(dateStart);
    } else if (this.viewByValue == 'weekly') {
      let dateResult = this.getWeekFirstAndLastDateforDate(this.getDateFromWeekString(title));
      dateStart = dateResult.firstDate;
      dateEnd = dateResult.lastDate;
    } else if (this.viewByValue == 'monthly') {
      let dateResult = this.getMonthFirstAndLastDateforDate(this.getDateFromMonthString(title));
      dateStart = dateResult.firstDate;
      dateEnd = dateResult.lastDate;
    } else {
      dateStart = new Date();
      dateEnd = new Date();
    }
    if (key != 'request') {
      let tableName = '';
      if (key == 'trade') {
        tableName = 'request_trade';
      } else if (key == 'part') {
        tableName = 'request_parts';
      } else if (key == 'tool') {
        tableName = 'request_tools';
      } else if (key == 'technician') {
        tableName = 'request_technician';
      }
      this.pmplannerRoomFilter = {
        blId: this.filterPanel.controls.blId.value,
        flId: this.filterPanel.controls.flId.value,
        fromDate: this.datePipe.transform(dateStart, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(dateEnd, "yyyy-MM-dd"),
        tableName: tableName,
        fieldName: item.id
      }
      this.planscheduleSrv.getPmPlannerRequestDetails(this.pmplannerRoomFilter).subscribe((res: any) => {
        this.popUpTableData = res;
        this.showOtherPopUpGrid = true;
      })
    } else {
      let filterData = {
        blId: this.filterPanel.controls.blId.value,
        flId: this.filterPanel.controls.flId.value,
        dateRequestedFrom: this.datePipe.transform(dateStart, "yyyy-MM-dd"),
        dateRequestedTo: this.datePipe.transform(dateEnd, "yyyy-MM-dd"),
        showRequestType: "pmPlanner"
      }
      this.wrServ.getAllWrByFilter(filterData).subscribe((res: any) => {
        this.myRequestsData = res;
        this.showRequestPopUpGrid = true;
      })
    }
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

  getWeekNumber(date: Date): number {
    let currentDate: any = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 4 - (currentDate.getDay() || 7));
    let yearStart: any = new Date(currentDate.getFullYear(), 0, 1);
    let weekNumber = Math.ceil(((currentDate - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  }

  getWeekFirstAndLastDateforDate(date: Date) {
    const result = {
      firstDate: new Date(date),
      lastDate: new Date(date),
    };
    result.firstDate.setDate(date.getDate() - date.getDay() + (date.getDay() ==0 ? -6 : 1));
    result.firstDate.setHours(0, 0, 0, 0);
    result.lastDate.setDate(date.getDate() - date.getDay() +  (date.getDay() == 0 ? 0 : 7));
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

  getMonthNumber(month: string): number {
    const months: string[] = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(month);
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

  reloadComponent(reload: boolean) {
    if (reload) {
      this.loadForPmPlannerDataCurrentSelection()
    }
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blServ.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blServ.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumFL = res;
      this.updateFlList(this.selectedFl);
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
