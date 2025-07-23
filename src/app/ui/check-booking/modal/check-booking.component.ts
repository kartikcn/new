import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { AppParamsService } from '../../app-params/services/app-params.service';
import { ReserveAttendeesDTO } from '../../booking/model/reserveAttendeesDTO';
import { ReserveDTO } from '../../booking/model/reserveDTO';
import { ReserveResourcesDTO } from '../../booking/model/reserveResourcesDTO';
import { BookingService } from '../../booking/services/booking.services';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-check-booking',
  templateUrl: './check-booking.component.html',
  styleUrls: ['./check-booking.component.scss'],
  providers: [MessageService]
})
export class CheckBookingComponent implements OnInit {
  reqReservationData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  loggedInUser!: number;
  isCheckInRequired : string = '';
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumStatusData: EnumList[] = [];
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["reserveId"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isFiltered:boolean = false;
  constructor(
    private bookingSrv: BookingService,
    private confirmationService: ConfirmationService,
    private authSrv: AuthService,
    private messageService: MessageService,
    private appParamsService : AppParamsService,
    private datePipe: DatePipe,
    private enumsrv: EnumService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authSrv.getLoggedInUserId();
    this.loadEnums();
    this.getIsCheckInRequired();
    this.loadReservationData();
  }
  loadReservationData() {
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.isFiltered= false;
    this.bookingSrv.getReqCheckBookingsPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.reqReservationData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      } else {
        this.reqReservationData = [];
      }
    })
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumStatusData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'reserve'.toLocaleUpperCase() &&
         t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
         this.enumStatusData.unshift(new EnumList(null, "", "", 'Make a selection',null));
      })
  }

  getIsCheckInRequired(){
    this.appParamsService.getAppParamByParamId("is_check_in_required").subscribe((res:any) => {
      this.isCheckInRequired = res.paramValue;
    })
  }

  displayButtonOption(data: any) {
    if (data.status == this.getIdByStatus("Approved") && this.isCheckInRequired.toLowerCase() == "yes") {
      return "Check In";
    } else if (data.status == this.getIdByStatus("Check In")) {
      return "Check Out";
    } else {
      return null;
    }
  }

  updateReservation(data: any, action:any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to '+ action +' the reservation?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateStatus(data);
      },
      key: "checkBookingGrid"
    });
  }

  updateStatus(data: any) {
    var curStatus!:any;
    var currTimeEnd: any;
    this.messageService.clear();
    if (data.status == this.getIdByStatus("Approved")) {
      curStatus = this.getIdByStatus("Check In");
      currTimeEnd = this.convertToTime(data.timeEnd);
    } else if (data.status == this.getIdByStatus("Check In")) {
      curStatus = this.getIdByStatus("Completed");
      currTimeEnd = this.convertToTime(new Date().toLocaleTimeString("en-GB"));
    } else {
      curStatus = data.status;
    }

    var reserveDTO: ReserveDTO = {
      reserveId: data.reserveId,
      loggedBy: this.loggedInUser,
      requestedBy: data.requestedBy,
      requestedFor: this.loggedInUser,
      status: curStatus,
      meetingName: data.meetingName,
      comments: data.comments,
      bookingType: data.bookingType,
      recurringRule: data.recurringRule,
      dateStart: this.datePipe.transform(data.dateStart, "yyyy-MM-dd HH:mm:ss"),
      dateEnd: this.datePipe.transform(data.dateEnd, "yyyy-MM-dd HH:mm:ss"),
      timeStart:this.convertToTime(data.timeStart),
      timeEnd: currTimeEnd,
      blId: data.blId,
      flId: data.flId,
      rmId: data.rmId,
      configId: data.configId,
      parentId:data.parentId,
      dateCreated: this.datePipe.transform(data.dateCreated, "yyyy-MM-dd HH:mm:ss"),
      timeCreated : this.convertToTime(data.timeCreated),
      approvedBy:data.approvedBy,
      dateApproved:this.datePipe.transform(data.dateApproved, "yyyy-MM-dd HH:mm:ss"),
      isDateOrTimeChanged : false,
      checkInNotifyCount : data.checkInNotifyCount
    }
    var reserveAttendeesDTO: ReserveAttendeesDTO[] = data.reserveAttendees.slice(0);

    var reserveResourcesDTO: ReserveResourcesDTO[] = [];

    var bookingData = {
      reserveDTO: reserveDTO,
      reserveAttendeesDTO: reserveAttendeesDTO,
      reserveResourcesDTO: reserveResourcesDTO
    }
    this.bookingSrv.saveBooking(bookingData).subscribe((res) => {
      if (res.status == this.getIdByStatus("Check In")) {
        this.loadReservationData();
        this.messageService.add({ key: 'checkBookingMsg', severity: 'success', summary: 'Record updated', detail: 'The reservation is Checked In' });
      } else if (res.status == this.getIdByStatus("Completed")) {
        this.loadReservationData();
        this.messageService.add({ key: 'checkBookingMsg', severity: 'success', summary: 'Record updated', detail: 'The reservation is Checked Out' });
      }
    });

  }
  formatDate(date: Date | null) {
    if (date != null) {
      var dateCreated = new Date(date);
      var userTimezoneOffset = dateCreated.getTimezoneOffset() * 60000;
      var a = new Date(dateCreated.getTime() - userTimezoneOffset);
      return a;
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
      return  this.datePipe.transform(currDate, "HH:mm:ss");;
    } else {
      return this.datePipe.transform(new Date(), "HH:mm:ss");
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

  getEnumByid(id: any) {
    return this.enumStatusData.find((t: any) => t.enumKey === id)?.enumValue
  }

  getIdByStatus(status: any) {
    return this.enumStatusData.find((t: any) => t.enumValue === status)?.enumKey
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadReservationData();
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
      this.loadReservationData();
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
