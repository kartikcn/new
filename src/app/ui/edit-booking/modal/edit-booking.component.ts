import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { RmConfigService } from '../../rm-config/rm-config/services/rm-config.service';
import { EditBookingDialogueProvider } from '../provider/edit-booking-provider';
import { UtilConstant } from 'src/common/UtilConstant';
import { UsersService } from 'src/app/services/users.service';
import { BookingIdFilterInput } from '../model/bookingIdFilterInput.model';
import { Menu } from 'primeng/menu';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { BookingService } from '../../booking/services/booking.services';
import { ReserveDTO } from '../../booking/model/reserveDTO';
import { ReserveAttendeesDTO } from '../../booking/model/reserveAttendeesDTO';
import { ReserveResourcesDTO } from '../../booking/model/reserveResourcesDTO';
import { EnumService } from 'src/app/services/enum.service';
import { DatePipe } from '@angular/common';
import { EnumList } from 'src/app/model/enum-list.model';
import { FloorFilterInputDTO } from '../../background-loc/model/DTO/FloorFilterInputDTO.model';
import { BuildingFilterInputDTO } from '../../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { RoomFilterInputDTO } from '../../background-loc/model/DTO/RoomFilterInputDTO.model';
import { UsersFilterInputDTO } from '../../user/modal/UsersFilterInputDTO.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.scss'],
  providers: [MessageService]
})
export class EditBookingComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  cancelBook!: UntypedFormGroup;
  editDialog: UntypedFormGroup;
  allBl: any[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumReservationIds: BookingIdFilterInput[] = [];
  enumRequestedBy: UsersFilterInputDTO[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  rmFilter!: RoomFilterInputDTO;
  errorMsg: string = '';
  displayMaximizable: boolean = false;
  reservationData: any[] = [];
  reqitems: MenuItem[] = [];
  isErr: boolean = false;
  loggedInUser!: number;
  displayCancelScreen: boolean = false;
  cancelReservationData: any[] = [];
  cancelReservationRec!: any;
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumStatusList: EnumList[] = [];
  enumStatusData: EnumList[] = [];
  displayStatusData: any[] = [];
  presentDate: Date = new Date();
  firstDate: Date = new Date();
  lastDate: Date = new Date(this.presentDate.getFullYear(), this.presentDate.getMonth() + 1, 0);
  reserveDataToUpdate: any[] = [];
  reserveDataList: any[] = [];
  reservationInputDTOList: any[] = [];
  displayCancelRecurrence: boolean = false;
  upDateAll: boolean = false;
  reserveStatus: EnumList[] = [];
  useTabletProtrait = false;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["reserveId"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isFiltered:boolean = false;
  serachFilterData:any={};
  constructor(
    private formBuilder: UntypedFormBuilder,
    private rmConfigSrv: RmConfigService,
    private authSrv: AuthService,
    private bookingProvider: EditBookingDialogueProvider,
    private spinner: NgxSpinnerService,
    private bookingSrv: BookingService,
    private userSrv: UsersService,
    private confirmationService: ConfirmationService,
    private enumsrv: EnumService,
    private datePipe: DatePipe,
    private bps : BreakpointService
  ) {
    this.filterPanel = this.formBuilder.group({
      requestedBy: [null],
      reserveId: [null],
      blId: [null],
      flId: [null,],
      rmId: [null,],
      dateStart: [null, [this.checkDateValidation()]],
      dateEnd: [null, [this.checkDateValidation()]],
      status: [null]
    });

    this.editDialog = this.formBuilder.group({
      edit: ['updateOne'],
    })

    this.reqitems = [
      {
        icon: 'pi-ellipsis-v',
        items: [
        ]
      }
    ];
    this.cancelBook = this.formBuilder.group({
      cancelledReason: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.spinner.hide();
    this.loadFilterPanelData();
    this.loadEnumRequestedBy();
    this.loadEnumId();
    this.loadStatus();
    this.loggedInUser = this.authSrv.getLoggedInUserId();
    this.setStartAndEndDates();
    this.loadReservationData();
    this.loadReserveDataToUpdate();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }

  loadReservationData() {
    setTimeout(() => {
      this.onSearch();
    }, 100);
  }

  loadEnumRequestedBy() {
    this.userSrv.getALLUsers().subscribe((res: any) => {
      this.enumRequestedBy = res;
      this.enumRequestedBy.unshift(new UsersFilterInputDTO(null, 'Make a selection', '', ''));
    });
  }

  loadEnumId() {
    this.bookingSrv.getAllBookingIds().subscribe((res: any) => {
      this.enumReservationIds = res;
      this.enumReservationIds = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumReservationIds.unshift(new BookingIdFilterInput(0, 'Make a selection'));
    })
  }

  loadFilterPanelData() {
    this.rmConfigSrv.getAllFilterData().subscribe((res: any) => {
      this.allBl = res.blList;
      this.enumBL = res.blList;
      this.enumBL = res.blList.map((i: any) => { i.blNameString = i.blCode+(i.blName? ' - ' + i.blName : "");return i;});
      this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection',null));

      this.enumAllFL = res.flList;
      this.enumAllFL = res.flList.map((i: any) => { i.flNameString = i.blCode + '-' + i.flCode + (i.flName ?  ' - ' + i.flName : '') ; return i; });
      this.enumAllFL.unshift(new FloorFilterInputDTO(null, 'Make a selection',null));
      this.enumFL = this.enumAllFL;

      this.allRmDdata = res.rmList
      this.allRmDdata = res.rmList.map((i: any) => { i.rmNameString = i.blCode + '-' + i.flCode + ' - ' + i.rmCode + (i.rmName ?  ' - ' + i.rmName : ''); return i; });
      this.allRmDdata.unshift(new RoomFilterInputDTO(null, 'Make a selection', null,null));
      this.rm_data = this.allRmDdata;
    })
  }

  loadStatus() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumStatusData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'reserve'.toLocaleUpperCase() &&
          t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        this.reserveStatus = this.enumStatusData;
        this.enumStatusData.unshift(new EnumList(null, "", "", 'Make a selection',null));
        // this.displayStatusData = this.enumStatusData.map((each: any) => ({ ...each, status: each.enumValue }));
        // this.displayStatusData.unshift({ compId: this.compId, enumValue: 'Make a selection', fieldName: 'status', id: 0, status: '', tableName: '' });
      })
  }

  setMenuList(event: any, menu: Menu, record: any) {
    this.reqitems[0].items = [];
    this.reqitems[0].items?.push({
      'label': 'Details',
      'icon': 'pi pi-info-circle',
      command: (event) => {
        this.openDetails(record);
      }
    });
    var currentStage = this.getEnumByid(record.status);
    if (currentStage!.toLowerCase() === 'waiting for approval' || currentStage!.toLowerCase() === 'approved') {
      this.reqitems[0].items?.push({
        'label': 'Edit',
        'icon': 'pi pi-pencil',
        command: (event) => {
          this.editDetails(record);
        }
      });
      this.reqitems[0].items?.push({
        'label': 'Cancel',
        'icon': 'pi pi-times',
        command: (event) => {
          this.cancelReservation(record);
        }
      });
    }
    menu.toggle(event);
  }

  openDetails(rec: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      roomDetails: rec,
      isView: true,
      isEdit: false,
    };
    this.bookingProvider.openDialog(dialogConfig);
    this.bookingProvider.onDialogueClosed.subscribe((result: any) => {
      //this.loadReservationData();
    });
  }

  editDetails(rec: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      roomDetails: rec,
      isView: false,
      isEdit: true,
    };
    this.bookingProvider.openDialog(dialogConfig);
    this.bookingProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.loadReservationData();
      }
    });
  }

  cancelReservation(record: any) {
    this.cancelReservationRec = record;
    if (record.bookingType.toLocaleUpperCase() === "Recurring".toLocaleUpperCase()) {
      this.displayCancelRecurrence = true
    } else {
      this.displayCancelRecurrence = false;
      this.reserveDataToUpdate = [record];
      this.displayCancelScreen = true;
    }
  }

  confirmCancelResevation() {
    this.upDateAll = this.editDialog.controls.edit.value === 'updateAll';
    if (this.upDateAll) {
      this.reserveDataToUpdate = this.reserveDataList.filter((res: any) => res.reserveId >= this.cancelReservationRec.reserveId
        && res.parentId === this.cancelReservationRec.parentId && (this.getEnumByid(res.status) == 'Waiting for Approval' || this.getEnumByid(res.status) == 'Approved'));
    } else {
      this.reserveDataToUpdate = this.reserveDataList.filter((res: any) => res.reserveId === this.cancelReservationRec.reserveId);
    }
    this.displayCancelScreen = true;
  }

  saveCancellationReason() {
    this.confirmationService.confirm({
      message: "Are you sure that you want to cancel the booking ",
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cancellationProcess();
      }
    });
  }

  cancellationProcess() {
    var cancel = this.cancelBook.controls.cancelledReason.value;
    this.reservationInputDTOList = [];
    this.reserveDataToUpdate.map(each => {
      each.status = this.getIdByStatus("Cancelled");
      each.cancelledReason = cancel;
      each.cancelledBy = this.loggedInUser;
      each.dateCancelled = new Date();
      each.timeCancelled = this.convertToTime(new Date().toLocaleTimeString("en-GB"));

      var reserveDTO: ReserveDTO = this.createReserveDto(each)

      var reserveAttendeesDTO: ReserveAttendeesDTO[] = each.reserveAttendees.slice(0);

      var reserveResourcesDTO: ReserveResourcesDTO[] = [];

      var bookingData = {
        reserveDTO: reserveDTO,
        reserveAttendeesDTO: reserveAttendeesDTO,
        reserveResourcesDTO: reserveResourcesDTO
      }
      this.reservationInputDTOList.push(bookingData);
    })
    this.bookingSrv.updateRecurrenceBookings(this.reservationInputDTOList).subscribe((res) => {
      this.displayCancelScreen = false;
      this.displayCancelRecurrence = false;
      this.loadReservationData();
    })

  }

  cancelCancellationReason() {
    setTimeout(() => {
      this.cancelBook.patchValue({
        cancelledReason: null,
      });
    }, 10);
    this.displayCancelScreen = false;
    if (this.cancelReservationRec.bookingType.toLocaleUpperCase() === "Recurring".toLocaleUpperCase()) {
      this.displayCancelRecurrence = true
    }
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
      this.enumFL = this.enumAllFL.filter(t => t.blId == bl_id)

      this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection',null));

      this.rm_data = this.allRmDdata.filter(t => t.blId == bl_id)

      this.rm_data.unshift(new RoomFilterInputDTO(null, 'Make a selection',null,null));
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
      this.rm_data.unshift(new RoomFilterInputDTO(null, 'Make a selection',null,null));
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

  formatDate(date: Date) {
    if (date != null) {
      var date = new Date(date);
      var userTimezoneOffset = date.getTimezoneOffset() * 60000;
      var a = new Date(date.getTime() - userTimezoneOffset);
      return a;
    } else {
      return null;
    }
  }

  setFromateDate(date: Date) {
    if (date != null) {
      var date = new Date(date);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss");
    } else {
      return null;
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
      return null;
    }
  }

  convertTimeCreated(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      currDate.setSeconds(data[2]);
      currDate.setMilliseconds(0);
      return currDate;
    } else {
      return null;
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

  onSearch() {
    this.spinner.show();
    var requestedBy = this.filterPanel.controls.requestedBy.value;
    var id = this.filterPanel.controls.reserveId.value;
    var blId = this.filterPanel.controls.blId.value;
    var flId = this.filterPanel.controls.flId.value;
    var rmId = this.filterPanel.controls.rmId.value;
    var dateStart = this.setFromateDate(this.filterPanel.controls.dateStart.value);
    var dateEnd = this.setFromateDate(this.filterPanel.controls.dateEnd.value);
    var status = this.filterPanel.controls.status.value;
    var filterValueData = {
      'requestedBy': requestedBy,
      'reserveId': id,
      'blId': blId,
      'flId': flId,
      'rmId': rmId,
      'dateStart': dateStart,
      'dateEnd': dateEnd,
      'status': status,
      'filterDto' : {paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList}
    };
    this.serachFilterData={...filterValueData};
    this.getAllBookingData();
  }

  getAllBookingData(){
    this.isFiltered= false;
    this.bookingSrv.SearchBookingsByFilterPaginated(this.serachFilterData).subscribe((res: any) => {
      this.spinner.hide();
      if(res){
        this.isFiltered= false;
        this.reservationData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }     
    });
  }

  onClear() {
    this.filterPanel.patchValue({
      requestedBy: null,
      reserveId: null,
      blId: null,
      flId: null,
      rmId: null,
      dateStart: null,
      dateEnd: null,
      status: null
    });
    this.reservationData = [];
    this.serachFilterData={};
  }

  checkDateValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null) {
        this.filterPanel.controls['dateStart'].setErrors(null);
        this.filterPanel.controls['dateEnd'].setErrors(null);
        this.filterPanel.clearAsyncValidators();
        this.filterPanel.updateValueAndValidity();
        var dateFrom = new Date(this.filterPanel.controls['dateStart'].value);
        var dateTo = new Date(this.filterPanel.controls['dateEnd'].value);
        if (dateFrom.getTime() > dateTo.getTime() && this.filterPanel.controls['dateEnd'].value != null) {
          this.isErr = true;
          this.filterPanel.controls['dateStart'].setErrors({ 'incorrect': true });
          this.filterPanel.updateValueAndValidity();
          this.errorMsg = 'From date should be less than To date.'
          return { 'incorrect': true };
        }
        else {
          this.isErr = false
          return null;
        }
      }
      return null;
    };
  }

  setStartAndEndDates() {
    this.filterPanel.patchValue({
      dateStart: this.firstDate,
      dateEnd: this.lastDate,
    })
  }

  loadReserveDataToUpdate() {
    this.bookingSrv.getAllBookings().subscribe((res: any) => {
      this.reserveDataList = res;
    })
  }

  createReserveDto(reserveation: any) {
    let reserveDTO: ReserveDTO = {
      reserveId: reserveation.reserveId,
      loggedBy: this.loggedInUser,
      requestedBy: reserveation.requestedBy,
      requestedFor: this.loggedInUser,
      status: reserveation.status,
      meetingName: reserveation.meetingName,
      comments: reserveation.comments,
      bookingType: reserveation.bookingType,
      recurringRule: reserveation.recurringRule,
      dateStart: this.datePipe.transform(reserveation.dateStart, "yyyy-MM-dd HH:mm:ss"),
      dateEnd: this.datePipe.transform(reserveation.dateEnd, "yyyy-MM-dd HH:mm:ss"),
      timeStart: this.convertToTime(reserveation.timeStart),
      timeEnd: this.convertToTime(reserveation.timeEnd),
      blId: reserveation.blId,
      flId: reserveation.flId,
      rmId: reserveation.rmId,
      configId: reserveation.configId,
      cancelledReason: reserveation.cancelledReason,
      cancelledBy: reserveation.cancelledBy,
      dateCancelled: this.datePipe.transform(reserveation.dateCancelled, "yyyy-MM-dd HH:mm:ss"),
      timeCancelled: reserveation.timeCancelled,
      parentId: reserveation.parentId,
      dateCreated: this.datePipe.transform(reserveation.dateCreated, "yyyy-MM-dd HH:mm:ss"),
      timeCreated: this.convertToTime(reserveation.timeCreated),
      approvedBy: reserveation.approvedBy,
      dateApproved: this.datePipe.transform(reserveation.dateApproved, "yyyy-MM-dd HH:mm:ss"),
      checkInNotifyCount: reserveation.checkInNotifyCount
    }
    return reserveDTO

  }

  closeCancelRecurrence() {
    this.displayCancelRecurrence = false;
  }

  getEnumByid(id: any) {
    return this.enumStatusData.find((t: any) => t.enumKey === id)?.enumValue
  }

  getIdByStatus(status: any) {
    return this.enumStatusData.find((t: any) => t.enumValue === status)?.enumKey
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.getAllBookingData();
  }

  onInnerFilter(event: any) {
    if(this.isFiltered){
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
          let filterCriteria={};
          if(field=="blDataBlCode"){
            filterCriteria = { fieldName: "B.bl_code", value: filterValue, matchMode: matchMode };
          }else if(field=="flDataFlCode"){
            filterCriteria = { fieldName: "F.fl_code", value: filterValue, matchMode: matchMode };
          }else if(field=="rmDataRmCode"){
            filterCriteria = { fieldName: "RM.rm_code", value: filterValue, matchMode: matchMode };
          }else if(field=="requestedByUserUserName"){
            filterCriteria = { fieldName: "U.user_name", value: filterValue, matchMode: matchMode };
          }else if(field=="bookingType"){
            filterCriteria = { fieldName: "type", value: filterValue, matchMode: matchMode };
          }else{
            filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      this.paginationObj.pageNo = 0;
      this.getAllBookingData();
    }
    this.isFiltered = true;
  }

  updateFilterCriteriaList(filterCriteria:any){
    let index = this.filterCriteriaList.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if(filterCriteria['value']==null){
      if(index !==-1){
        this.filterCriteriaList.splice(index, 1);
      }
    }else {
      if (index !== -1) {
        this.filterCriteriaList[index] = filterCriteria;
      } else {
        this.filterCriteriaList.push(filterCriteria);
      }
    }
  }


}
