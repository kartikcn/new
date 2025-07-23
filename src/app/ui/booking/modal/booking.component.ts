import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { ResourcesService } from '../../resources/service/resources.service';
import { RmConfigService } from '../../rm-config/rm-config/services/rm-config.service';
import { RmResourcesService } from '../../rm-resources/service/rm-resources.service';
import { BookingDialogueProvider } from '../provider/booking-provider';
import { UtilConstant } from 'src/common/UtilConstant';
import { AppParamsService } from '../../app-params/services/app-params.service';
import { ArrangementService } from '../../arrangement/services/arrangement.service';
import { ArrangementFilterInputDTO } from '../../arrangement/model/arrangementFilterInput.model';
import { AddRecurrenceDialogueProvider } from '../provider/add-recurrence-dialog-provider';
import { RecurrencePattarnDTO } from '../model/recurrence-pattern.DTO';
import { DatePipe } from '@angular/common';
import { SvgViewComponent } from '../../svg-view/svg-view.component';
import { BuildingService } from '../../background-loc/services/bl.service';
import { SvgViewService } from '../../svg-view/services/svg-view.service';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { SvgRoomContentData } from 'src/app/model/svgroomcontentdata.model';
import { SvgElementIdType } from 'src/app/model/svgelementidtype.model';
import { SvgElementColorType } from 'src/app/model/svgelementcolortype.model';
import { EnumList } from 'src/app/model/enum-list.model';
import { BuildingFilterInputDTO } from '../../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../../background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomCategoryFilterInputDTO } from '../../rmcat/modal/RoomCategoryFilterInputDTO.model';
import { RoomTypeFilterInputDTO } from '../../room category/model/DTO/RoomTypeFilterInputDTO.model';
import { RoomFilterInputDTO } from '../../background-loc/model/DTO/RoomFilterInputDTO.model';
import { UsersFilterInputDTO } from '../../user/modal/UsersFilterInputDTO.model';
import { UsersService } from 'src/app/services/users.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { SvgElementOnClickData } from 'src/app/model/svgelementonclickdata.interface';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  providers: [MessageService]
})
export class BookingComponent implements OnInit,AfterViewInit {
  today: Date = new Date();
  enumClients!: any[];
  filterPanel!: UntypedFormGroup;
  allBl: any[] = [];
  allFl:any[]=[];
  allRm:any[]=[];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumRmCat: RoomCategoryFilterInputDTO[] = [];
  enumRmType: RoomTypeFilterInputDTO[] = [];
  enumAllRmType: RoomTypeFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  rmFilter!: RoomFilterInputDTO;
  bookingType: any[] = [{ type: "Regular" }, { type: "Recurring" }]
  data: any[] = [];
  blName?: string;
  errorMsg: string = '';
  selectedValue: string = '';
  resourcesData: any[] = [];
  selectedScreens: any[] = [];
  selectedResources: number[] = [];
  displayMaximizable: boolean = false;
  roomInfo: any = {};
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumRmConfig: any[] = [];
  enummTypeData: any[] = [];
  rmResources: any[] = [];
  resourcesList: any[] = [];
  filterData: any = {};
  defaultImg: any = "assets/images/default-room-img.png";
  displaySummary: boolean = false;
  summaryData: any = {};
  attendeesEmails: String = '';
  resourcesNames: string = '';
  resultData: any[] = [];
  defaultRecords: any = UtilConstant.DEFAULT_RECORDS;
  pageEvent: any;
  defaultCapacity: number = 0;
  enumArrangementType: any[] = [];
  times: any[] = [];
  fromTimes: any[] = [];
  toTimes: any[] = [];
  isNoRooms: boolean = false;
  recurrencePattern: string = '';
  recurrenceDetails!: RecurrencePattarnDTO;
  recurrenceDates: any[] = [];
  numberOfConflicts: number = 0;
  conflictDates: String = '';
  isSearchClicked = false;
  isSVGView: boolean = false;
  selectedRoomId: string = '';
  allRoomsList: any[] = [];
  allSVGElementsData: any[] = [];
  allSvgData:any[]=[];
  displayNoFloorPlanInfo: boolean = false;
  defaultLoadColor: string = "#00FF00";
  assignedColor: string = "#ff0000";
  elementIdName: string = "";
  isBookingSvg:boolean = true;
  isNormalView:boolean = false;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  svgRoomData : SvgRoomData = new SvgRoomData(null,null,"",[]);
  enumUsers: UsersFilterInputDTO[] = [];
  useTabletProtrait = false;
  useTabletLandscape = false;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private formBuilder: UntypedFormBuilder,
    private rmConfigSrv: RmConfigService,
    private resourceService: ResourcesService,
    private rmResourcesSrv: RmResourcesService,
    private enumsrv: EnumService,
    private bookingProvider: BookingDialogueProvider,
    private spinner: NgxSpinnerService,
    private apSrv: AppParamsService,
    private arrangeService: ArrangementService,
    private addRecurrenceDialogueProvider: AddRecurrenceDialogueProvider,
    private datePipe: DatePipe,
    private blServ: BuildingService,
    private svgViewSrv:SvgViewService,
    private cdr: ChangeDetectorRef,
    private userSrv: UsersService,
    private bps : BreakpointService
  ) {
    this.filterPanel = this.formBuilder.group({
      blId: [null, [Validators.required]],
      flId: [null,[Validators.required]],
      rmId: [null],
      arrangementType: [null],
      capacity: [null, [Validators.required]],
      date: [new Date(), [Validators.required]],
      fromTime: [null, [Validators.required]],
      toTime: [null, [Validators.required]],
      bookingType: ['Regular'],
      bookFor: ['Meeting'],
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.spinner.hide();
    this.getCapacity();
    this.loadFilterPanelData();
    this.loadResources();
    this.loadEnums();
    this.loadArrangementType();
    this.createTime();
    this.loadUsers();
  }

  ngAfterViewInit() {
    if(this.isSVGView){
      this.svgViewComp;
    }
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.useTabletLandscape = BreakpointService.useTabletLandscape;
  }

  getCapacity() {
    this.apSrv.getAppParamByParamId(UtilConstant.DEFAULT_CAPACITY).subscribe((res: any) => {
      this.defaultCapacity = res.paramValue
      setTimeout(() => {
        this.filterPanel.patchValue({
          capacity: this.defaultCapacity
        });
      });
    })
  }

  loadFilterPanelData() {
    this.rmConfigSrv.getAllFilterData().subscribe((res: any) => {
      this.allBl = res.blList;
      this.enumBL = res.blList;
      this.enumBL = res.blList.map((i: any) => { i.blNameString = i.blCode+(i.blName? ' - ' + i.blName : "");return i;});
      this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection',null));

      this.allFl = res.flList;
      this.enumAllFL = res.flList.map((i: any) => { i.flNameString = i.blCode + '-' + i.flCode + (i.flName ?  ' - ' + i.flName : '') ; return i; });
      this.enumAllFL.unshift(new FloorFilterInputDTO(null, 'Make a selection', null));
      this.enumFL = this.enumAllFL;

      this.allRm = res.rmList
      this.allRmDdata = res.rmList.map((i: any) => { i.rmNameString = i.blCode + '-' + i.flCode + ' - ' + i.rmCode + (i.rmName ?  ' - ' + i.rmName : ''); return i; });
      this.allRmDdata.unshift(new RoomFilterInputDTO(null, 'Make a selection',null,null))
      this.rm_data = this.allRmDdata;
    })
  }

  loadResources() {
    this.resourceService.getAllResources().subscribe((res: any) => {
      if (res.status != 202) {
        this.resourcesData = res
        this.resourcesData.forEach((item: any) => {
          item.requiredQuantity = '';
        })
      }
      else {
        this.resourcesData = [];
      }
    });
  }
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumRmConfig = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'rm_config'.toLocaleUpperCase());
        // this.enummTypeData = this.enumRmConfig.filter(t => t.fieldName.toLocaleUpperCase() === 'external_allowed'.toLocaleUpperCase());
        this.enummTypeData = this.enumClonedList.filter(t =>
          t.tableName.toLowerCase() === 'rm_config' && t.fieldName.toLowerCase() === 'external_allowed'
        );
        this.enummTypeData.unshift(new EnumList(null, "", "", 'Make a selection',null));
      },
      error => {
      });
  }

  onSelectBlCode($event: any) {
    if ($event.blId != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null
        });
        this.loadFloorCode($event.blId);
      }, 10);
    }
    else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null
        });
      }, 10);
      this.enumFL = this.enumAllFL;
      this.rm_data = this.allRmDdata;
    }
  }

  loadFloorCode(bl_id: any) {
    if (bl_id != null) {
      this.enumFL = [];
      this.enumFL = this.enumAllFL.filter(t => t.blId == bl_id);
      this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection', null));
      this.rm_data = this.allRmDdata.filter(t => t.blId == bl_id);
      this.rm_data.unshift(new RoomFilterInputDTO(null, 'Make a selection', null,null));
    }
  }

  onSelectFlCode(event: any) {
    if (event.flId != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
          rmId: null,
        });
        this.loadRmCode(event.flId, event.blId);
      }, 10);
    }
    else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          rmId: null
        });
      }, 10);
      this.rm_data = this.allRmDdata;
      this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection',null));
    }
  }

  loadRmCode(flId: any, blId: any) {
    if (flId != null) {
      this.rm_data = [];
      this.rm_data = this.allRmDdata.filter(t => t.blId == blId);
      this.rm_data = this.rm_data.filter(t => t.flId == flId)
      this.rm_data.unshift(new RoomFilterInputDTO(null, 'Make a selection', null,null));
    }
  }

  onSelectRmCode(event: any) {
    if (event.rmId != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
          flId: event.flId,
        });
      }, 10);
    }
  }

  setTimerFromTime() {
    var dayStartTime = this.filterPanel.controls['fromTime'].value;
    if (dayStartTime == "" || dayStartTime == null || dayStartTime == 'Make a selection') {
      return;
    }
    var dayEndTime = this.filterPanel.controls['toTime'].value;
    var array = dayStartTime.split(":");
    var hours = array[0];
    var mins = array[1];
    hours = hours <= 23 ? hours : 23;
    mins = mins <= 59 ? mins : 59;
    dayStartTime = hours + ":" + mins;
    this.filterPanel.patchValue({
      fromTime: dayStartTime,
    });
    this.toTimes = this.fromTimes.filter((item: any) => {
      if (this.getTime(item.time) > this.getTime(dayStartTime)) {
        return item.time
      }
    })
    if (dayEndTime && dayStartTime != "") {
      var start = this.getTime(dayStartTime);
      var end = this.getTime(dayEndTime);
      if (start >= end) {
        this.filterPanel.controls['toTime'].setErrors(null);
        this.filterPanel.controls['fromTime'].setErrors({ 'incorrect': true });
        this.filterPanel.updateValueAndValidity();
        this.errorMsg = "From time  must be less than  To time "
      } else {
        this.errorMsg = '';
        this.filterPanel.controls['toTime'].setErrors(null);
        this.filterPanel.controls['fromTime'].setErrors(null);
        this.filterPanel.updateValueAndValidity();
      }
    }
  }

  setTimerToTime() {
    var dayEndTime = this.filterPanel.controls['toTime'].value;
    if (dayEndTime == "" || dayEndTime == null || dayEndTime == 'Make a selection') {
      return;
    }
    var dayStartTime = this.filterPanel.controls['fromTime'].value;
    var array = dayEndTime.split(":");
    var hours = array[0];
    var mins = array[1];
    hours = hours <= 23 ? hours : 23;
    mins = mins <= 59 ? mins : 59;
    dayEndTime = hours + ":" + mins;
    this.filterPanel.patchValue({
      toTime: dayEndTime,
    });
    if (dayStartTime && dayStartTime != "") {
      var start = this.getTime(dayStartTime);
      var end = this.getTime(dayEndTime);
      if (start >= end) {
        this.filterPanel.controls['fromTime'].setErrors(null);
        this.filterPanel.controls['toTime'].setErrors({ 'incorrect': true });
        this.filterPanel.updateValueAndValidity();
        this.errorMsg = "To time must be greater than  From time"
      } else {
        this.errorMsg = '';
        this.errorMsg = '';
        this.filterPanel.controls['toTime'].setErrors(null);
        this.filterPanel.controls['fromTime'].setErrors(null);
        this.filterPanel.updateValueAndValidity();
      }
    }
  }
  convertToTime(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      currDate.setSeconds(0);
      currDate.setMilliseconds(0);
      return this.datePipe.transform(currDate, "HH:mm:ss");
    } else {
      return '';
    }
  }

  getTime(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      currDate.setSeconds(0);
      currDate.setMilliseconds(0);
      return currDate;
    } else{
      return new Date();
    }
  }

  getNameById(blId: any) {
    return blId ? this.allBl.find(t => t.blId == blId) != null ? this.allBl.find(t => t.blId == blId)?.blName : '' : '';
  }

  onSearch() {
    this.spinner.show();
    this.isSearchClicked = true;
    this.displayNoFloorPlanInfo = false;
    this.getAllRoomIds();
    var bookFor = this.filterPanel.controls.bookFor.value;
    var bookingType = this.filterPanel.controls.bookingType.value;
    var blId = this.filterPanel.controls.blId.value;
    var flId = this.filterPanel.controls.flId.value;
    var rmId = this.filterPanel.controls.rmId.value;
    var arrangementType = this.filterPanel.controls.arrangementType.value;
    var capacity = this.filterPanel.controls.capacity.value;
    var date = this.filterPanel.controls.date.value;
    var fromTime = this.filterPanel.controls.fromTime.value;
    var toTime = this.filterPanel.controls.toTime.value;
    this.filterData = {
      'bookFor': bookFor,
      'bookingType': bookingType,
      'blId': blId,
      'flId': flId,
      'rmId': rmId,
      'arrangementId': arrangementType,
      'capacity': capacity,
      'date': this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss"),
      'fromTime': this.convertToTime(fromTime),
      'toTime': this.convertToTime(toTime),
      'resourceIdList': this.selectedScreens.length > 0 ? this.selectedResources : []
    };
    this.blName = this.getNameById(blId);
    if (bookingType === "Regular") {
      this.rmConfigSrv.getAvailableRooms(this.filterData).subscribe((res: any) => {
        this.spinner.hide();
        // this.isNormalView = true;
        this.data = res;
        this.data.map((rm: any) => {
          if (rm.rmPhoto != null) {
            rm.rmPhoto = "data:image/png;base64," + rm.rmPhoto;
          } else {
            rm.rmPhoto = this.defaultImg;
          }
        })
        this.resultData = this.data.slice(0, this.defaultRecords);
        if (this.resultData.length > 0) {
          this.isNoRooms = false;
          if(this.isSVGView){
            this.isNormalView = false;
          }else{
            this.isNormalView = true;
          }
        } else {
          this.isNoRooms = true;
          this.isNormalView = false;
          this.isSVGView = false;
        }
      });
    } else {
      var data = {
        bookingFilterDTO: this.filterData,
        recurrenceDates: this.recurrenceDates
      }
      this.rmConfigSrv.getAvailableRoomsForRecurrence(data).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res.map((each: any) => each.bookingOutPutDTO);
        this.data.sort((a, b) => a.conflicts - b.conflicts);
        this.data.map((rm: any) => {
          if (rm.rmPhoto != null) {
            rm.rmPhoto = "data:image/png;base64," + rm.rmPhoto;
          } else {
            rm.rmPhoto = this.defaultImg;
          }
        })
        this.resultData = this.data.slice(0, this.defaultRecords);
        if (this.resultData.length > 0) {
          this.isNoRooms = false;
          if(this.isSVGView){
            this.isNormalView = false;
          }else{
            this.isNormalView = true;
          }
        } else {
          this.isNoRooms = true;
          this.isNormalView = false;
          this.isSVGView = false;
        }
      })
    }
  }

  onDetails(event: any, item: any) {
    if (event.target == event.currentTarget) {
      this.roomInfo = item;
      let data = {
        blId: item.blId,
        flId: item.flId,
        rmId: item.rmId,
      }
      this.rmResourcesSrv.getAssignedResources(data).subscribe((res: any) => {
        this.rmResources = res;
      })
      this.displayMaximizable = true;
      event.stopPropagation();
    }

  }
  selectRoom(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      roomDetails: data,
      filterData: this.filterData,
      resourcesList: this.resourcesList,
      recurrenceDetails: this.recurrenceDetails,
      recurringRule: this.recurrencePattern,
      newRecord: true
    };
    this.bookingProvider.openDialog(dialogConfig);
    this.bookingProvider.onDialogueClosed.subscribe((result: any) => {
      this.attendeesEmails = '';
      this.resourcesNames = '';
      if (result[0]) {
        this.summaryData = result[0];
        result[1].forEach((element: any) => {
          this.attendeesEmails = `${`${this.attendeesEmails + element.attendeeName} (${element.email})`} , `
        });
        this.attendeesEmails = this.attendeesEmails.slice(0, this.attendeesEmails.lastIndexOf(","));
        result[2].forEach((element: any) => {
          this.resourcesNames = `${this.resourcesNames + element.title}, `
        });
        this.resourcesNames = this.resourcesNames.slice(0, this.resourcesNames.lastIndexOf(","));
        this.conflictDates = result[3];
        this.displaySummary = true;
      } else {
        this.onSearch();
      }
      if (this.isSVGView) {
          this.onSearch();
          setTimeout(() => {
            // this.svgViewComp.loadRoomColors();
            // this.svgViewComp.loadRoomText();
            this.getRmConfigsForAllRooms();
            //this.updateSvgRoomData();
            this.cdr.detectChanges();
            // setTimeout(()=>{
            //   this.svgViewComp.loadSvgFile();
            // },0);
          }, 100)
        }
    });
  }
  closeBookDetails() {
    this.displaySummary = false;
    this.onSearch();
  }
  saveResources(event: any) {
    this.resourcesList = [];
    this.selectedResources = [];
    this.selectedScreens.forEach((item: any) => {
      this.resourcesData = this.resourcesData.filter(val => val !== item)
      this.resourcesData.unshift(item);
      var record = {
        resourcesId: item.id,
        resourceTitle: item.title,
        requiredQuantity: item.requiredQuantity
      }
      this.resourcesList.push(record);
      this.selectedResources.indexOf(item.id) === -1 ? this.selectedResources.push(item.id) : '';
    })
  }

  onEditReqQuantity(requiredQuantity: any, quanity: any) {
    if (quanity < requiredQuantity) {
      this.errorMsg = "Not Available";
    }
  }

  onPaginateChange(d: any) {
    if (d.previousPageIndex > d.pageIndex) {
      this.resultData = this.data.slice(d.pageIndex * d.pageSize, d.previousPageIndex * d.pageSize);
      this.resultData;
    } else if (d.previousPageIndex < d.pageIndex) {
      this.resultData = this.data.slice(d.pageIndex * d.pageSize, (d.pageIndex + 1) * d.pageSize);
      this.resultData;
    } else {
      this.resultData = this.data.slice(0, d.pageSize);
      this.resultData;
    }
  }

  onClear() {
    this.filterPanel.patchValue({
      blId: null,
      flId: null,
      rmId: null,
      arrangementType: null,
      capacity: this.defaultCapacity,
      date: new Date(),
      fromTime: null,
      toTime: null,
      bookingType: 'Regular',
      bookFor: 'Meeting',
    });
    this.data = [];
    this.resultData = [];
    this.selectedScreens = [];
    this.selectedResources = [];
    this.isSearchClicked = false;
    this.data = [];
    this.isSVGView = false;
    this.isNormalView= false;
    this.displayNoFloorPlanInfo = false;
    this.recurrencePattern = '';
  }

  loadArrangementType() {
    this.arrangeService.getAllArrangements().subscribe(res => {
      this.enumArrangementType = res.map((i: any) => { i.name = i.arrangementType; return i; });
      this.enumArrangementType.unshift(new ArrangementFilterInputDTO('', '','Make a selection',null));
    });
  }

  createTime() {
    var timeGap = 15;
    this.times = [{ time: "Make a selection" }];
    var timeStart = 0;
    for (var i = 1; timeStart < 24 * 60; i++) {
      var hh = Math.floor(timeStart / 60);
      var mm = (timeStart % 60);
      this.times[i] = { time: ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2) };
      timeStart = timeStart + timeGap;
    }
    this.fromTimes = this.times;
    this.toTimes = this.times;
  }
  
  onRecurring() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      newRecord: true,
      dateStart: this.filterPanel.controls.date.value
    };
    this.addRecurrenceDialogueProvider.openDialog(dialogConfig);
    this.addRecurrenceDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if(result != false){
        this.recurrenceDates = result[3];
        this.filterPanel.patchValue({
          date: result[0].dateStart,
        });
        this.recurrenceDetails = result[0];
        switch (result[0].type) {
          case "daily": {
            this.recurrencePattern = result[1] + " from " + this.datePipe.transform(result[0].dateStart, "dd MMM yyyy") + " to " + this.datePipe.transform(result[0].dateEnd, "dd MMM yyyy");
            break;
          }
          case "weekly": {
            this.recurrencePattern = result[1] + " from " + this.datePipe.transform(result[0].dateStart, "dd MMM yyyy") + " to " + this.datePipe.transform(result[0].dateEnd, "dd MMM yyyy");
            break;
          }
          case "monthly": {
            this.recurrencePattern = result[1] + " from " + this.datePipe.transform(result[0].dateStart, "dd MMM yyyy") + " to " + this.datePipe.transform(result[0].dateEnd, "dd MMM yyyy");
            break;
          }
          case "monthly": {
            this.recurrencePattern = result[1] + " from " + this.datePipe.transform(result[0].dateStart, "dd MMM yyyy") + " to " + this.datePipe.transform(result[0].dateEnd, "dd MMM yyyy");
            break;
          }
          case "annually": {
            this.recurrencePattern = result[1] + " from " + this.datePipe.transform(result[0].dateStart, "dd MMM yyyy") + " to " + this.datePipe.transform(result[0].dateEnd, "dd MMM yyyy");
            break;
          }
          default: {
            break;
          }
        }
      }else{
        this.filterPanel.patchValue({
          bookingType: 'Regular',
        });
      }
    });
  }

  onRegular() {
    this.recurrenceDetails!;
    this.recurrencePattern = '';
  }

  viewSvgLook() {
    if (this.allRoomsList.length > 0) {
      this.svgRoomData.content=[];
      this.isSVGView = true;
      this.displayNoFloorPlanInfo = false;
      this.getRmConfigsForAllRooms();
    } else {
      this.isSVGView = false;
      this.displayNoFloorPlanInfo = true;
      this.isNormalView = false;
    }
  }
  viewNormalLook() {
    this.isSVGView = false;
    this.displayNoFloorPlanInfo = false;
    this.isNormalView = true;
  }

  getRmConfigsForAllRooms() {
    this.allSVGElementsData = [];
    this.allSvgData = [];
    const data = this.allRoomsList.map(({ blId, flId, rmId}) => ({ blId, flId,rmId}))
    this.rmConfigSrv.getRmConfigsByIds(data).subscribe((res:any)=> {
      if(res!= null){
        res.forEach( (each:any) => {
          this.allSvgData.push(each[0]);
        })
        this.allSVGElementsData = this.mergeArrays(this.allSvgData,this.data);
        if (this.allRoomsList.length > 0) {
          this.isNormalView = false;
          this.updateSvgRoomData();
          this.svgInputData = new SvgRoomDataInput(this.filterPanel.controls.blId.value,this.filterPanel.controls.flId.value,null,false,false,false,true,false,"",null,"","booking",null,this.svgRoomData);
          this.cdr.detectChanges();
        } 
      }
    })
  }

  getAllRoomIds() {
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    let data = {
      id: '',
      name: '',
      blId: blId,
      flId: flId,
      svgElementId: '',
    }
    this.blServ.getRmList(data).subscribe((res: any) => {
      this.allRoomsList = res.filter((each: any) => each.svgElementId != null);
    })
  }

  roomOnClickListener(dataEl: SvgElementOnClickData) {
    if(dataEl.elementIdName!=null && dataEl.elementIdName!=""){
      if(dataEl.elementIdName.startsWith("label")){
        this.elementIdName = dataEl.elementIdName.substring("label_".length)
      }else{
        this.elementIdName = dataEl.elementIdName;
      }
      let svgElementIdName = this.elementIdName;
      let blId = this.filterPanel.controls.blId.value;
      let flId = this.filterPanel.controls.flId.value;
      let data = {
        id: '',
        name: '',
        blId: blId,
        flId: flId,
        svgElementId: svgElementIdName,
      }
      let rmId = '';
      let selectedRoom = []
      this.blServ.getRmList(data).subscribe((res: any) => {
        if (res != null) {
          rmId = res[0].rmId;
          selectedRoom = this.data.filter(val => val.blId == blId && val.flId == flId && val.rmId == rmId);
          if (selectedRoom[0]) {
            this.selectRoom(selectedRoom[0]);
          }
        }
      })
    }
  }

  mergeArrays(array1:any[], array2:any[]){
    array2.forEach(obj2 => {
      const obj1 = array1.find(obj => obj.blId == obj2.blId && obj.flId == obj2.flId && obj.rmId == obj2.rmId );
      if (obj1) {
        Object.keys(obj2).forEach(key => {
          if (!obj1.hasOwnProperty(key)) {
            obj1[key] = obj2[key];
          }
        });
      }
    });
    return array1;
  };

  updateSvgRoomData(){
    this.svgRoomData  = new SvgRoomData(null,null,"",[]);
    let blId =this.filterPanel.controls.blId.value;
    let flId =this.filterPanel.controls.flId.value;
    let bookingType = this.filterPanel.controls.bookingType.value;
    this.allSVGElementsData.forEach((room:any)=>{
      let colorVal = "";
      let contains = this.data.some((each: any) => each.blId == room.blId && each.flId == room.flId && each.rmId == room.rmId);
      if(contains){
        colorVal="#00FF00";
      }else{
        colorVal="#ff0000";
      }
      let labelVal:string[]=[];
      if(bookingType=="Regular"){
        labelVal =[`Room Code : ${room.rmRmCode}`,`Max Cap : ${room.maxCapacity}`]
      }
      else if (bookingType=="Recurring"){
        if(room.conflicts!= undefined){
          labelVal =[`Room Code : ${room.rmRmCode}`,`Max Cap : ${room.maxCapacity}`,`Conflicts : ${room.conflicts}`]
        }else{
          labelVal =[`Room Code : ${room.rmRmCode}`,`Max Cap : ${room.maxCapacity}`]
        }
      }
      let idObj:SvgElementIdType ={
        roomElementId:room.rmSvgElementId,
        assetElementId :null
      }
      let colorObj: SvgElementColorType ={
        roomColor:colorVal,
        assetColor: null
      }
      let contentData:SvgRoomContentData ={
        blId:room.blId,
        flId:room.flId,
        rmId:room.rmId,
        label:[...labelVal],
        showLabel:true,
        highlightRoom:true,
        svgElementId : idObj,
        color:colorObj,
        rmCode:'',
        zoomAtRoom : false
      }
      this.svgRoomData.content.push(contentData);
    })
    this.svgRoomData.blId = blId;
    this.svgRoomData.flId = flId;
    this.svgRoomData.locate = "room";
  }

  getEnumByEnumId(id: any) {
    return this.enummTypeData.find((t: any) => t.enumKey === id)?.enumValue
  }

  loadUsers() {
    this.userSrv.getALLUsers().subscribe((res: any) => {
      this.enumUsers = res;
    });
  }

  getUsernameFromId(id:any){
    return this.enumUsers.find((t: any) => t.id === id)?.userName;
  }

  getBlCodeFromBlId(id:any){
    return this.allBl.find((t:any)=> t.blId===id)?.blCode;
  }
  getFlCodeFromFlId(flId:any,blId:any){
    return this.allFl.find((t:any)=> t.flId===flId&&t.blId===blId)?.flCode;
  }
  getRmCodeFromRmId(rmId:any,flId:any,blId:any){
    return this.allRm.find((t:any)=> t.rmId===rmId&&t.flId===flId&&t.blId===blId)?.rmCode;
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }
}

