import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { ReserveAttendeesDTO } from '../../booking/model/reserveAttendeesDTO';
import { ReserveDTO } from '../../booking/model/reserveDTO';
import { ReserveResourcesDTO } from '../../booking/model/reserveResourcesDTO';
import { BookingService } from '../../booking/services/booking.services';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-approve-booking',
  templateUrl: './approve-booking.component.html',
  styleUrls: ['./approve-booking.component.scss'],
  providers: [MessageService]
})
export class ApproveBookingComponent implements OnInit {
  reqReservationData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedScreens: any[] = [];
  loggedInUser!: number;
  isApproved: boolean = false;
  isRejected: boolean = false;
  rejectBook!: UntypedFormGroup;
  editDialog: UntypedFormGroup;
  displayRejectScreen: boolean = false;
  rejectReason: string = '';
  rejectionData: any[] = [];
  upDateAll: boolean = false;
  reserveDataToUpdate: any[] = [];
  displayUpdateScreen: boolean = false;
  selectedReservation!:any;
  action!:string;
  reservationInputDTOList: any[] = [];
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
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private enumsrv: EnumService,
  ) {
    this.rejectBook = this.formBuilder.group({
      rejectionReason: [null, [Validators.required]],
    })
    this.editDialog = this.formBuilder.group({
      edit: ['updateOne'],
    })
  }

  ngOnInit(): void {
    this.loggedInUser = this.authSrv.getLoggedInUserId();
    this.loadEnums();
  }

  loadReservationData() {
    let enumWaitForAprvl = this.getIdByStatus("Waiting for Approval")
    let data ={
      filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList},
      status:enumWaitForAprvl
    }
    this.isFiltered= false;
    this.bookingSrv.getStatusReservationsPaginated(data).subscribe((res: any) => {
      if(res){
        this.isFiltered= false;
        this.reqReservationData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
    })
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumStatusData = this.enumClonedList.filter(t =>
          t.tableName.toLowerCase() === 'reserve' && t.fieldName.toLowerCase() === 'status'
        );
       //  this.enumStatusData.unshift(new Enums(0, "", "", 'Make a selection'));
         this.loadReservationData();
      })
  }


  ApproveReservation() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to approve the selected reservations?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateReservation(this.selectedScreens, "Approved");
      },
      key: "approveBookingGrid"
    });
  }

  RejectReservation() {
    this.rejectionData = this.selectedScreens;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to reject the selected reservations?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayRejectScreen = true;
      },
      key: "approveBookingGrid"
    });
  }

  appReserv(data: any) {
    this.selectedReservation = data;
    this.action = 'Approve'
    if (this.selectedReservation.bookingType.toLocaleUpperCase() === "Recurring".toLocaleUpperCase()) {
      this.displayUpdateScreen = true;
    } else {
      this.confirmDialog([this.selectedReservation],this.action);
    }
  }

  rejReserv(data: any) {
    this.selectedReservation = data;
    this.action = 'Reject';
    setTimeout(() => {
      this.rejectBook.patchValue({
        rejectionReason: null,
      });}, 10);
    this.displayRejectScreen = true;
  }

  saveRejectionReason() {
    this.rejectReason = this.rejectBook.controls.rejectionReason.value;
    this.displayRejectScreen = true;
    if (this.selectedReservation.bookingType.toLocaleUpperCase() === "Recurring".toLocaleUpperCase()) {
      this.displayUpdateScreen = true;
    } else {
      this.confirmDialog([this.selectedReservation],this.action);
    }
  }
  cancelRejectionReason() {
    this.rejectReason = '';
    this.displayRejectScreen = false;
  }

  updateReservation(screen: any[], statusText: string) {
    statusText = statusText == 'Approve'? 'Approved' : "Rejected";
    let statusId = this.getIdByStatus(statusText);
    this.isApproved = false;
    this.isRejected = false;
    this.reservationInputDTOList = [];
    screen.forEach(each => {
      var reserveDTO: ReserveDTO = {
        reserveId: each.reserveId,
        loggedBy: this.loggedInUser,
        requestedBy: each.requestedBy,
        requestedFor: this.loggedInUser,
        status: statusId,
        meetingName: each.meetingName,
        comments: each.comments,
        bookingType: each.bookingType,
        recurringRule: each.recurringRule,
        dateStart: this.datePipe.transform(each.dateStart, "yyyy-MM-dd HH:mm:ss"),
        dateEnd: this.datePipe.transform(each.dateEnd, "yyyy-MM-dd HH:mm:ss"),
        timeStart: this.convertToTime(each.timeStart),
        timeEnd: this.convertToTime(each.timeEnd),
        blId: each.blId,
        flId: each.flId,
        rmId: each.rmId,
        configId: each.configId,
        rejectionReason: statusText == "Rejected" ? this.rejectReason : null,
        rejectedBy: statusText == "Rejected" ? this.loggedInUser : null,
        dateRejected: statusText == "Rejected" ? this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss") : null,
        approvedBy: statusText == "Approved" ? this.loggedInUser : null,
        dateApproved: statusText == "Approved" ? this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss") : null,
        parentId: each.parentId,
        dateCreated: this.datePipe.transform(each.dateCreated, "yyyy-MM-dd HH:mm:ss"),
        timeCreated: this.convertToTime(each.timeCreated),
        isDateOrTimeChanged: false,
        checkInNotifyCount: each.checkInNotifyCount
      }

      var reserveAttendeesDTO: ReserveAttendeesDTO[] = each.reserveAttendees.slice(0);;

      var reserveResourcesDTO: ReserveResourcesDTO[] = [];
      var bookingData = {
        reserveDTO: reserveDTO,
        reserveAttendeesDTO: reserveAttendeesDTO,
        reserveResourcesDTO: reserveResourcesDTO
      }
      this.reservationInputDTOList.push(bookingData);
     })
     this.bookingSrv.updateRecurrenceBookings(this.reservationInputDTOList).subscribe((res) => {
        this.loadReservationData();
        setTimeout(() => {
          this.messageService.clear();
          this.messageService.add({ key: 'approveBookingMsg', severity: 'success', summary: 'Record updated', detail: 'The reservation is ' + statusText });  
        }, 1000)
    });
  }


  formatDate(date: Date | null) {
    if (date != null) {
      var dateCreated = new Date(date);
      return dateCreated;
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

  getDataToUpdate(reservation: any) {
    this.upDateAll = this.editDialog.controls.edit.value === 'updateAll';
    if (this.upDateAll) {
      this.reserveDataToUpdate = this.reqReservationData.filter((res: any) => res.reserveId >= reservation.reserveId && res.parentId === reservation.parentId);
    } else {
      this.reserveDataToUpdate = this.reqReservationData.filter((res: any) => res.reserveId === reservation.reserveId);
    }

    return this.reserveDataToUpdate;
  }

  confirmUpdateResevation(){
     this.displayUpdateScreen = false;
     var appData: any[] = [];
     if (this.selectedReservation.bookingType.toLocaleUpperCase() === "Recurring".toLocaleUpperCase()) {
       appData = this.getDataToUpdate(this.selectedReservation);
     } else {
       appData.push(this.selectedReservation);
     }
     this.confirmDialog(appData,this.action)
  }

  confirmDialog(data:any, action:any){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to '+ action + ' this reservation?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayRejectScreen = false;
        this.updateReservation(data, action);
      },
      reject:() => {
        if (this.selectedReservation.bookingType.toLocaleUpperCase() === "Recurring".toLocaleUpperCase()) {
          this.displayUpdateScreen = true;
        }
      },
      key: "approveBookingGrid"
    });
  }

  closeUpdateRecurrence(){
    this.displayUpdateScreen = false
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
          let filterCriteria ={};
          if(field=="blDataBlCode"){
            filterCriteria = { fieldName: "blData.blCode", value: filterValue, matchMode: matchMode };
          }else if(field=="flDataFlCode"){
            filterCriteria = { fieldName: "flData.flCode", value: filterValue, matchMode: matchMode };
          }else if(field=="rmDataRmCode"){
            filterCriteria = { fieldName: "rmData.rmCode", value: filterValue, matchMode: matchMode };
          }else if(field=="requestedByUserUserName"){
            filterCriteria = { fieldName: "requestedByUser.userName", value: filterValue, matchMode: matchMode };
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
