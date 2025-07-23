import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumList } from 'src/app/model/enum-list.model';
import { Enums } from 'src/app/model/enums.model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { UsersService } from 'src/app/services/users.service';
import { ReserveAttendeesDTO } from 'src/app/ui/booking/model/reserveAttendeesDTO';
import { ReserveDTO } from 'src/app/ui/booking/model/reserveDTO';
import { ReserveResourcesDTO } from 'src/app/ui/booking/model/reserveResourcesDTO';
import { BookingService } from 'src/app/ui/booking/services/booking.services';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { ResourcesService } from 'src/app/ui/resources/service/resources.service';
import { RmResourcesService } from 'src/app/ui/rm-resources/service/rm-resources.service';
import { UsersFilterInputDTO } from 'src/app/ui/user/modal/UsersFilterInputDTO.model';
import { UserFilterInput } from 'src/app/ui/user/modal/usersFilterInput.model';
import { VisitorsService } from 'src/app/ui/visitors/services/visitors.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BreakpointService } from 'src/app/services/breakpoint.service';


@Component({
  selector: 'app-view-booking-details',
  templateUrl: './view-booking-details.component.html',
  styleUrls: ['./view-booking-details.component.scss'],
  providers: [MessageService]
})
export class ViewBookingDetailsComponent implements OnInit {

  confirmBookingForm: UntypedFormGroup;
  addResourcesForm: UntypedFormGroup;
  editDialog: UntypedFormGroup;
  attendeesData: any[] = [];
  selectedAttendees: any[] = [];
  em_data: any[] = [];
  visitorsData: any[] = [];
  displayAttendees: boolean = false;
  enumUsers: UsersFilterInputDTO[] = [];
  attendeesList: any[] = [];
  oldAttendeesList: any[] = [];
  location: string = '';
  atndDetails: string = '';
  loggedInUser!:number;
  reserveRsList: any[] = [];
  resourcesList: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  isVisitorAallowed: boolean = false;
  title: String = "View";
  isEdit: boolean = false;
  isView: boolean = true;
  checkCap: boolean = false;
  errorMsg: string = '';
  isDateTimeChanged: boolean = false;
  isAttendeesListChanged: boolean = false;
  deletedAttendeesIdList: any[] = [];
  today: Date = new Date();
  selectedResource: any = {};
  quantityErr: boolean = false;
  enumList: EnumList[] = [];
  resources: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enummTypeData: EnumList[] = [];
  resourcesData: any[] = [];
  selectedResourcesData: any[] = [];
  isLimited: boolean = true;
  isEditResource: boolean = false;
  displayResources: boolean = false;
  fixedResources: string = '';
  greaterThanZero: boolean = true;
  deletedResourcesIdList: any[] = [];
  quantityInUse: number = 0;
  resourceExistErr: string = '';
  upDateAll: boolean = false;
  reservationData: any[] = [];
  reservationForUpdate: any[] = [];
  rmResourcesList: any[] = [];
  savedResourcesList: any[] = [];
  reservationInputDTOList: any[] = [];
  resourcesToDisplay: any[] = [];
  savedAttendees: any[] = [];
  displayEditRecurrence: boolean = false;
  selectedReservation!: any;
  addOrEdit:string = "Add";
  addAttendeeDialogWidth='45vw';
  useTabletProtrait = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewBookingDetailsComponent>,
    private confirmationService: ConfirmationService,
    private userSrv: UsersService,
    private authSrv: AuthService,
    private emSrv: EmployeeService,
    private visitorService: VisitorsService,
    private bookingSrv: BookingService,
    private resourceService: ResourcesService,
    private currencyPipe: CurrencyPipe,
    private enumsrv: EnumService,
    private rmResourcesSrv: RmResourcesService,
    private datePipe: DatePipe,
    private bps : BreakpointService
  ) {
    this.confirmBookingForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      comments: [null],
      dateStart: [null],
      timeStart: [null],
      timeEnd: [null]
    });
    this.addResourcesForm = this.formBuilder.group({
      resource: [null, [Validators.required]],
      quanity: [null, [Validators.required]],
      costPerUnit: [0, [Validators.required]],
      requiredQuantity: [null, [Validators.required]],
      totalCost: [0, [Validators.required]],
      type: [],
      status: [null]
    })
    this.editDialog = this.formBuilder.group({
      edit: ['updateOne'],
    })
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loggedInUser = this.authSrv.getLoggedInUserId();
    this.loadReserveData()
    this.data.isEdit ? this.confirmEditAllRecurrence(this.data.roomDetails) : '';
    this.checkType();
    this.loadUsers();
    var roomData = {
      blId: this.data.roomDetails.blId,
      flId: this.data.roomDetails.flId,
      rmId: this.data.roomDetails.rmId,
    };
    setTimeout(() => {
      this.setFormData();
      this.loadFixedResources(roomData);
    }, 10);
    this.loadEmployees();
    this.loadVisitors();
    this.loadReserveRs(this.data.roomDetails.reserveRs);
    this.loadResources();
    this.loadEnums();
    this.loadResourcesToDisplay();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    if(this.useTabletProtrait){
      this.addAttendeeDialogWidth='65vw';
    }else{
      this.addAttendeeDialogWidth='45vw';
    }
  }

  setFormData() {
    this.confirmBookingForm.patchValue({
      title: this.data.roomDetails.meetingName,
      userId: this.loggedInUser,
      comments: this.data.roomDetails.comments,
      dateStart: this.formatDate(this.data.roomDetails.dateStart),
      timeStart: this.convertToDisplayTime(this.data.roomDetails.timeStart),
      timeEnd: this.convertToDisplayTime(this.data.roomDetails.timeEnd)
    });
    this.location = "Building -" + this.data.roomDetails.blDataBlCode + " | " + "Floor -" + this.data.roomDetails.flDataFlCode + " | " + "Room -" + this.data.roomDetails.rmDataRmCode;
  }

  checkType() {
    if (this.data.isView) {
      this.isView = true;
      this.isEdit = false;
      this.title = "View";
      this.confirmBookingForm.disable();
    }
    else if (this.data.isEdit) {
      this.isView = false;
      this.isEdit = true;
      this.title = "Edit"
    }
  }

  loadReserveData() {
    this.bookingSrv.getAllBookings().subscribe((res: any) => {
      this.reservationData = res;
    })
  }

  loadReserveRs(reserveRsList: any) {
    this.reserveRsList = [];
    this.selectedResourcesData = [];
    if (reserveRsList != null) {
      reserveRsList.forEach((eachRes: any) => this.reserveRsList.push(eachRes));
      this.reserveRsList.forEach((each: any) => {
        each.resources.forEach((eachRes: any) => {
          eachRes.requiredQuantity = each.qty;
          eachRes.totalCost = each.totalCost;
          eachRes.reserveRsId = each.reserveRsId;
          eachRes.resourcesId = each.resourcesId;
          this.selectedResourcesData.push(eachRes);
        })
      })
      return this.selectedResourcesData;
    }
    return null;
  }

  loadResourcesToDisplay() {
    if (this.savedResourcesList.length > 0) {
      this.savedResourcesList.forEach((newResource: any) => {
        if (this.selectedResourcesData.length) {
          this.selectedResourcesData.map((resource: any) => {
            if (resource.resourcesId != newResource.resourcesId) {
              this.resourcesToDisplay.indexOf(newResource) === -1 ? this.resourcesToDisplay.push(newResource) : '';
            } else {
              resource.requiredQuantity = newResource.requiredQuantity;
              resource.totalCost = newResource.totalCost;
              return resource;
            }
          });
        } else {
          this.resourcesToDisplay.push(newResource)
        }
      })
    } else {
      this.resourcesToDisplay = this.selectedResourcesData;
    }
  }

  loadUsers() {
    this.userSrv.getALLUsers().subscribe((res: any) => {
      this.enumUsers = res;
      // this.enumUsers = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumUsers.unshift(new UsersFilterInputDTO(null, 'Make a selection', '', ''));
    });
  }

  addAttendies() {
    this.displayAttendees = true;
  }

  loadPresentAttendees(oldAttendees: any) {
    this.attendeesList = [];
    this.selectedAttendees = oldAttendees;
    this.selectedAttendees = this.selectedAttendees.map((i: any) => { i.atId = i.visitorId ? i.visitorId+'-'+i.email: i.emId+'-'+i.email; return i; });
    this.selectedAttendees = this.selectedAttendees.map((i: any) => { i.attendeeId = i.reserveAttendeesId; return i; });
    this.selectedAttendees = this.selectedAttendees.map((i: any) => { i.name = i.attendeeName; return i; });
    this.selectedAttendees = this.selectedAttendees.map((i: any) => { i.email = i.email; return i; });
    this.selectedAttendees = this.selectedAttendees.map((i: any) => { i.category = i.visitorId ? "Visitor" : "Employee"; return i; });

    this.selectedAttendees.forEach((item: any) => {
      this.attendeesData = this.attendeesData.filter(val => val.atId !== item.atId);
      this.attendeesData.unshift(item);
      var record = {
        id: item.attendeeId == null ? 0 : item.attendeeId,
        name: item.name,
        email: item.email,
        category: item.category,
        visitorId: item.category == 'Visitor' ? item.visitorId : null,
        emId: item.category == 'Employee' ? item.emId : null,
        isVisitor: item.category == 'Visitor' ? 'Yes' : 'No',
        atId: item.atId
      }
      this.attendeesList.push(record);
    });
    return this.attendeesList;
  }

  loadEmployees() {
    this.em_data = [];
    this.emSrv.getAllEmployeeList().subscribe((res: any) => {
      if (res.status != 202) {
        this.em_data = res;
        this.em_data = this.em_data.map((i: any) => { i.atId = i.emId+'-'+i.email; return i; });
        this.em_data = this.em_data.map((i: any) => { i.attendeeId = null; return i; });
        this.em_data = this.em_data.map((i: any) => { i.name = i.firstName + '  ' + i.lastName; return i; });
        this.em_data = this.em_data.map((i: any) => { i.email = i.email; return i; });
        this.em_data = this.em_data.map((i: any) => { i.category = "Employee"; return i; });
        this.loadAttendies();
      }
      else {
        this.em_data = [];
      }
    }
    );
  }

  loadVisitors() {
    this.visitorService.getAllVisitors().subscribe((res: any) => {
      if (res.status != 202) {
        this.visitorsData = res;
        this.visitorsData = this.visitorsData.map((i: any) => { i.atId = i.visitorsId+'-'+i.email; return i; });
        this.visitorsData = this.visitorsData.map((i: any) => { i.attendeeId = null; return i; });
        this.visitorsData = this.visitorsData.map((i: any) => { i.name = i.firstName + '  ' + i.lastName; return i; });
        this.visitorsData = this.visitorsData.map((i: any) => { i.email = i.email; return i; });
        this.visitorsData = this.visitorsData.map((i: any) => { i.category = "Visitor"; return i; });
        this.loadAttendies();
        this.loadPresentAttendees(this.data.roomDetails.reserveAttendees);
      }
      else {
        this.visitorsData = [];
      }
    }
    );
  }

  loadAttendies() {
    if (this.data.roomDetails.rmConfig[0].externalAllowed == 'Yes') {
      this.isVisitorAallowed = false;
      this.attendeesData = this.em_data.concat(this.visitorsData)
    } else {
      this.isVisitorAallowed = true;
      this.attendeesData = this.em_data;
    }
  }

  saveAttendies() {
    this.savedAttendees = [];
    this.selectedAttendees.forEach((item: any) => {
      this.selectedAttendees = this.selectedAttendees.filter(val => val.atId !== item.atId);
      this.attendeesData = this.attendeesData.filter(val => val.atId !== item.atId);
      this.attendeesData.unshift(item);
      var record = {
        id: item.attendeeId == null ? 0 : item.attendeeId,
        name: item.name,
        email: item.email,
        category: item.category,
        visitorId: item.category == 'Visitor' ? item.visitorsId ? item.visitorsId : item.visitorId: null,
        emId: item.category == 'Employee' ? item.emId : null,
        isVisitor: item.category == 'Visitor' ? 'Yes' : 'No',
        atId: item.atId
      }
      this.savedAttendees.push(record);
      this.selectedAttendees.indexOf(item.id) === -1 ? this.selectedAttendees.push(item) : '';
    })
    this.displayAttendees = false;
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

  formatDate(date: Date | null) {
    if (date != null) {
      var dateCreated = new Date(date);
      return dateCreated;
    } else {
      return null;
    }
  }

  confirmBooking() {
    this.checkForChanges();
    if (this.upDateAll) {
      this.reservationInputDTOList = [];
      this.reservationForUpdate.forEach(reservation => {
        var reserveDTO = this.createReserveDTO(reservation);
        var reserveAttendeesDTO = this.createReserveAttendeesDTO(reservation.selectedAttendees);
        var reserveResourcesDTO = this.createReserveRsDTO(reservation.selectedResources);
        var bookingData = {
          reserveDTO: reserveDTO,
          reserveAttendeesDTO: reserveAttendeesDTO,
          reserveResourcesDTO: reserveResourcesDTO
        }
        this.reservationInputDTOList.push(bookingData);
      })
      var reservationInputDTOList = this.reservationInputDTOList
      this.bookingSrv.updateRecurrenceBookings(reservationInputDTOList).subscribe((res: any) => {
        if (res.length == 0) {
          this.confirmBookingDialog();
        } else {
          this.conflectsDialog(res)
        }
      })
    } else {
      var reserveDTO = this.createReserveDTO(this.data.roomDetails);
      var reserveAttendeesDTO = this.createReserveAttendeesDTO(this.attendeesList);
      var reserveResourcesDTO = this.createReserveRsDTO(this.selectedResourcesData);
      var bookingData = {
        reserveDTO: reserveDTO,
        reserveAttendeesDTO: reserveAttendeesDTO,
        reserveResourcesDTO: reserveResourcesDTO
      }
      this.bookingSrv.saveBooking(bookingData).subscribe((res: any) => {
        if (!(res.text == 'Booking already exists')) {
          this.confirmBookingDialog();
        } else {
          this.failedBookingDialog();
        }

      })
    }
  }

  createReserveDTO(reserveData: any) {
    var reserveDTO: ReserveDTO = {
      reserveId: reserveData.reserveId,
      loggedBy: this.loggedInUser,
      requestedBy: this.confirmBookingForm.controls.userId.value,
      requestedFor: this.loggedInUser,
      status: reserveData.status,
      meetingName: this.confirmBookingForm.controls.title.value,
      comments: this.confirmBookingForm.controls.comments.value,
      bookingType: reserveData.bookingType,
      recurringRule: reserveData.recurringRule,
      dateStart: this.upDateAll ? this.datePipe.transform(reserveData.dateStart, "yyyy-MM-dd HH:mm:ss") : this.datePipe.transform(this.confirmBookingForm.controls.dateStart.value, "yyyy-MM-dd HH:mm:ss"),
      dateEnd: this.datePipe.transform(reserveData.dateEnd, "yyyy-MM-dd HH:mm:ss"),
      timeStart: this.getTime(this.confirmBookingForm.controls.timeStart.value),
      timeEnd: this.getTime(this.confirmBookingForm.controls.timeEnd.value),
      blId: reserveData.blId,
      flId: reserveData.flId,
      rmId: reserveData.rmId,
      configId: reserveData.configId,
      parentId: reserveData.parentId,
      dateCreated: this.datePipe.transform(reserveData.dateCreated, "yyyy-MM-dd HH:mm:ss"),
      timeCreated: this.getTime(reserveData.timeCreated),
      isDateOrTimeChanged: this.isDateTimeChanged,
      deletedAttendeesIdList: this.deletedAttendeesIdList,
      approvedBy: reserveData.approvedBy,
      dateApproved: this.datePipe.transform(reserveData.dateApproved, "yyyy-MM-dd HH:mm:ss"),
      checkInNotifyCount: this.data.roomDetails.checkInNotifyCount,
      deletedResourcesIdList: this.deletedResourcesIdList
    }
    return reserveDTO;
  }

  createReserveAttendeesDTO(oldAttendees: any) {
    var reserveAttendeesDTO: ReserveAttendeesDTO[] = [];
    var finalAttendees: any[] = oldAttendees.concat(this.savedAttendees)
    this.savedAttendees.forEach(newAttendee => {
      oldAttendees.map((oldAttendee: any) => {
        if (newAttendee.emId === oldAttendee.emId || newAttendee.visitorId === oldAttendee.emIdvisitorId) {
          finalAttendees.indexOf(oldAttendee) === -1 ? finalAttendees.push(oldAttendee) : '';
        } else {
          finalAttendees.indexOf(newAttendee) === -1 ? finalAttendees.push(newAttendee) : '';
        }
      })
    })
    finalAttendees.forEach((item: any) => {
      var reserveAttendeesDTOItem: ReserveAttendeesDTO = {
        reserveAttendeesId: item.id,
        reserveId: 0,
        email: item.email,
        attendeeName: item.name,
        isVisitor: item.isVisitor,
        emId: item.emId,
        visitorId: item.visitorId,
      }
      reserveAttendeesDTO.push(reserveAttendeesDTOItem)
    })
    return reserveAttendeesDTO;
  }
  createReserveRsDTO(selectedResources: any) {
    var reserveResourcesDTO: ReserveResourcesDTO[] = [];
    var finalesources: any[] = [];
    this.savedResourcesList.forEach((newResource: any) => {
      if (selectedResources.length) {
        selectedResources.map((resource: any) => {
          if (resource.resourcesId != newResource.resourcesId) {
            finalesources.indexOf(newResource) === -1 ? finalesources.push(newResource) : '';
          } else {
            resource.requiredQuantity = newResource.requiredQuantity;
            resource.totalCost = newResource.totalCost;
            finalesources.push(resource);
          }
        });
      } else {
        finalesources.push(newResource);
      }
    })

    finalesources.forEach((item: any) => {
      var reserveResourcesDTOItem: ReserveResourcesDTO = {
        reserveRsId: item.reserveRsId ? item.reserveRsId : 0,
        reserveId: item.reserveId,
        blId: this.data.roomDetails.blId,
        flId: this.data.roomDetails.flId,
        rmId: this.data.roomDetails.rmId,
        qty: item.requiredQuantity,
        comments: item.description,
        resourcesId: item.resourcesId ? item.resourcesId : item.id,
        costPerUnit: item.costPerUnit,
        totalCost: item.totalCost,
        type: this.getEnumById(item.type),
      }
      reserveResourcesDTO.push(reserveResourcesDTOItem);
    });
    return reserveResourcesDTO;
  }
  onDeleteAttendee(attendee: any) {
    this.savedAttendees = this.savedAttendees.filter(atnd => atnd.atId !== attendee.atId);
    if (this.upDateAll) {
      this.reservationForUpdate.forEach(reserve => {
        var afterDeleteAtnd = this.deleteAttendee(attendee, reserve.selectedAttendees);
        reserve.selectedAttendees = afterDeleteAtnd;
      })
    } else {
      this.deleteAttendee(attendee, this.attendeesList);
    }
  }

  deleteAttendee(attendee: any, attendeesList: any) {
    this.selectedAttendees = this.selectedAttendees.filter(val => val.atId !== attendee.atId);
    this.attendeesList = attendeesList.filter((val: any) => val.atId !== attendee.atId);
    // this.bookingSrv.deleteAttendeById(attendee.id).subscribe((res: any) => { });
    if (this.upDateAll) {
      attendeesList.map((t: any) => {
        t.attendeeId === attendee.attendeeId || t.atId === attendee.atId ? this.deletedAttendeesIdList.push(t.attendeeId) : '';
      })
    } else {
      attendee.attendeeId != null ? this.deletedAttendeesIdList.push(attendee.attendeeId) : '';
    }
    return this.attendeesList;
  }
  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      }

    });
  }
  confirmBookingDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.BOOKING_UPDATED_SUCCESSFUL,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'confirmBook',
      accept: () => {
        this.dialogRef.close(true);
      },

    });
  }
  failedBookingDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.UNABLE_TO_PROCESS_BOOKING,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'failedBook',
      accept: () => {
        this.dialogRef.close();
      }
    });
  }
  checkMaxCapacity() {
    this.checkCap = parseInt(this.data.roomDetails.rmConfig[0].maxCapacity) < this.selectedAttendees.length;
  }

  setTimerFromTime() {
    var dayStartTime = this.confirmBookingForm.controls['timeStart'].value;
    if (dayStartTime == "" || dayStartTime == null) {
      return;
    }
    var dayEndTime = this.confirmBookingForm.controls['timeEnd'].value;
    var array = dayStartTime.split(":");
    var hours = array[0];
    var mins = array[1];
    hours = hours <= 23 ? hours : 23;
    mins = mins <= 59 ? mins : 59;
    dayStartTime = hours + ":" + mins;
    this.confirmBookingForm.patchValue({
      timeStart: dayStartTime,
    });

    if (dayEndTime && dayStartTime != "") {
      var start = this.convertToTime(dayStartTime);
      var end = this.convertToTime(dayEndTime);
      if (start! >= end!) {
        this.confirmBookingForm.controls['timeEnd'].setErrors(null);
        this.confirmBookingForm.controls['timeStart'].setErrors({ 'incorrect': true });
        this.confirmBookingForm.updateValueAndValidity();
        this.errorMsg = "Start time  must be less than  End time "
      } else {
        this.errorMsg = '';
        this.confirmBookingForm.controls['timeStart'].setErrors(null);
        this.confirmBookingForm.controls['timeEnd'].setErrors(null);
        this.confirmBookingForm.updateValueAndValidity();
      }
    }
  }

  setTimerToTime() {
    var dayEndTime = this.confirmBookingForm.controls['timeEnd'].value;
    if (dayEndTime == "" || dayEndTime == null) {
      return;
    }
    var dayStartTime = this.confirmBookingForm.controls['timeStart'].value;
    var array = dayEndTime.split(":");
    var hours = array[0];
    var mins = array[1];
    hours = hours <= 23 ? hours : 23;
    mins = mins <= 59 ? mins : 59;
    dayEndTime = hours + ":" + mins;
    this.confirmBookingForm.patchValue({
      timeEnd: dayEndTime,
    });
    if (dayStartTime && dayStartTime != "") {
      var start = this.convertToTime(dayStartTime);
      var end = this.convertToTime(dayEndTime);
      if (start! >= end!) {
        this.confirmBookingForm.controls['timeStart'].setErrors(null);
        this.confirmBookingForm.controls['timeEnd'].setErrors({ 'incorrect': true });
        this.confirmBookingForm.updateValueAndValidity();
        this.errorMsg = "End time must be greater than  Start time"
      } else {
        this.errorMsg = '';
        this.confirmBookingForm.controls['timeEnd'].setErrors(null);
        this.confirmBookingForm.controls['timeStart'].setErrors(null);
        this.confirmBookingForm.updateValueAndValidity();
      }
    }
  }

  checkForChanges() {
    var dateStartCheck = (this.setDateForCheck(this.confirmBookingForm.controls.dateStart.value))?.getTime() != (this.setDateForCheck(this.formatDate(this.data.roomDetails.dateStart)))?.getTime();
    var timeStartCheck = (this.convertToTime(this.confirmBookingForm.controls.timeStart.value))?.getTime() != (this.convertToTime(this.data.roomDetails.timeStart))?.getTime();
    var timeEndCheck = (this.convertToTime(this.confirmBookingForm.controls.timeEnd.value))?.getTime() != (this.convertToTime(this.data.roomDetails.timeEnd))?.getTime();

    if (dateStartCheck || timeStartCheck || timeEndCheck) {
      this.isDateTimeChanged = true;
    }
  }

  setDateForCheck(date: any) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  conflectsDialog(data: any): void {
    var dates = '';
    data.forEach((date: any) => {
      dates = dates + this.datePipe.transform(date, "dd MMM yyyy") + " ";
    });
    this.confirmationService.confirm({
      message: `${UtilConstant.BOOKING_UPDATED_SUCCESSFUL} and 
      un changed booking date(s) : ${dates}`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'conflicts',
      accept: () => {
        this.dialogRef.close();
      }
    });
  }

  loadFixedResources(data: any) {
    this.rmResourcesList = [];
    this.rmResourcesSrv.getAssignedResources(data).subscribe((res: any) => {
      this.rmResourcesList = res;
      this.rmResourcesList.forEach(i => {
        this.fixedResources = this.fixedResources + i.resourceTitle + ", ";
      })
      this.fixedResources = this.fixedResources.slice(0, this.fixedResources.lastIndexOf(','));
    })

  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.resources = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'resources'.toLocaleUpperCase());
        this.enummTypeData = this.resources.filter(t => t.fieldName.toLocaleUpperCase() === 'resources_type'.toLocaleUpperCase());
        this.enummTypeData.unshift(new EnumList(null, "", "", 'Make a selection',null));
      },
      error => {
      }
    );
  }


  loadResources() {
    this.resourceService.getAllResources().subscribe((res: any) => {
      if (res.status != 202) {
        this.resourcesData = res
        this.resourcesData.forEach(t => t.requiredQuantity = 0);
      }
      else {
        this.resourcesData = [];
      }
    });

  }

  addResources() {
    this.resourceExistErr = '';
    this.addOrEdit = "Add"
    this.addResourcesForm.reset();
    this.isEditResource = false;
    this.displayResources = true;
  }

  onEditResource(resource: any) {
    this.resourceExistErr = '';
    this.addOrEdit = "Edit"
    this.selectedResource = resource;
    this.isEditResource = true;
    let type = this.getEnumById(resource.type);
    if (type != "Unlimited") {
      this.isLimited = true;
    } else {
      this.isLimited = false;
    }
    let data = {
      date: this.datePipe.transform(this.confirmBookingForm.controls.dateStart.value, "yyyy-MM-dd HH:mm:ss"),
      timeStart: this.getTime(this.confirmBookingForm.controls.timeStart.value),
      timeEnd: this.getTime(this.confirmBookingForm.controls.timeEnd.value),
      resourcesId: resource.resourcesId,
      reserveRsId: 0,
    }
    this.bookingSrv.getReserveRsQtnInUse(data).subscribe((res: any) => {
      this.quantityInUse = res;
      let avlQtn = parseInt(resource.quanity) - this.quantityInUse + parseInt(resource.requiredQuantity)
      setTimeout(() => {
        this.addResourcesForm.patchValue({
          resource: resource.resourcesId,
          costPerUnit: this.formatValue(resource.costPerUnit, 'GBP', 2),
          quanity: resource.quanity > avlQtn ? avlQtn : resource.quanity,
          type: resource.type,
          requiredQuantity: resource.requiredQuantity,
          totalCost: resource.totalCost,
          status: type == "Unlimited" ? "Aavailable" : avlQtn > 0 ? "Available" : "Not Available",
        });
      }, 10);
      this.displayResources = true;
    });

  }

  onDeleteResource(resource: any, resourcesData: any) {
    this.selectedResourcesData = resourcesData.filter((t: any) => t.resourcesId !== resource.resourcesId);
    this.resourcesToDisplay = this.resourcesToDisplay.filter((t: any) => t.resourcesId !== resource.resourcesId);
    this.savedResourcesList = this.savedResourcesList.filter((t: any) => t.resourcesId !== resource.resourcesId);
    if (this.upDateAll) {
      resourcesData.map((t: any) => {
        if (t.resourcesId === resource.resourcesId) {
          this.deletedResourcesIdList.push(t.reserveRsId);
        }
      })
    } else {
      resource.reserveRsId ? this.deletedResourcesIdList.push(resource.reserveRsId) : '';
    }
    return this.selectedResourcesData;
  }

  getEnumById(id: any) {
    return this.enummTypeData.find((t: any) => t.enumKey === id)?.enumValue
  }

  saveReqResources() {
    this.selectedResource.requiredQuantity = this.addResourcesForm.controls.requiredQuantity.value;
    var totalCostStr: any = this.addResourcesForm.controls.totalCost.value;
    var deftotalCost = this.deformatValue(totalCostStr.slice(1,));
    this.selectedResource.totalCost = deftotalCost;
    this.savedResourcesList = this.savedResourcesList.filter(t => t.resourcesId != this.selectedResource.resourcesId)
    this.savedResourcesList.push(this.selectedResource);
    this.loadResourcesToDisplay();
    this.displayResources = false;

  }
  cancelReqQuantity() {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.addResourcesForm.reset();
        this.displayResources = false;
      }
    });

  }
  formatValue(value: any, symbol: any, decimal_pt: any) {
    if (value !== 'undefined' && value != null) {
      const temp = `${value}`.replace(/\,/g, "");
      var digit_format = "1." + decimal_pt + "-" + decimal_pt;
      return this.currencyPipe.transform(temp, symbol, 'symbol-narrow', digit_format);
    }
    else {
      return '';
    }
  }

  deformatValue(value: any) {
    return value.replace(/£/g, '').replaceAll(',','');
  }

  setCostPerUnitCurrenyFormat() {
    let costPerUnit = this.deformatValue(this.addResourcesForm.controls.costPerUnit.value);
    setTimeout(() => {
      this.addResourcesForm.patchValue({
        costPerUnit: this.formatValue(costPerUnit, 'GBP', 2),

      });
    }, 10);
  }
  selectResource($event: any) {
    this.resourceExistErr = '';
    let existRecord = this.resourcesToDisplay.find(resource => resource.resourcesId === $event.resourcesId);
    if (existRecord) {
      this.resourceExistErr = "Resource already exists";
      return;
    }
    this.selectedResource = $event;
    var type = this.getEnumById($event.type);
    if (type != "Unlimited") {
      this.isLimited = true;
    } else {
      this.isLimited = false;
    }
    let data = {
      date: this.datePipe.transform(this.confirmBookingForm.controls.dateStart.value, "yyyy-MM-dd HH:mm:ss"),
      timeStart: this.getTime(this.confirmBookingForm.controls.timeStart.value),
      timeEnd: this.getTime(this.confirmBookingForm.controls.timeEnd.value),
      resourcesId: $event.resourcesId,
      reserveRsId: 0,
    }
    this.bookingSrv.getReserveRsQtnInUse(data).subscribe((res: any) => {
      this.quantityInUse = res;
      setTimeout(() => {
        this.addResourcesForm.patchValue({
          costPerUnit: this.formatValue($event.costPerUnit, 'GBP', 2),
          quanity: type != "Unlimited" ? $event.quanity - this.quantityInUse : $event.quanity,
          type: $event.type,
          requiredQuantity: '',
          totalCost: '',
          status: type == "Unlimited" ? "Aavailable" : ($event.quanity - this.quantityInUse) > 0 ? "Available" : "Not Available",

        });
      }, 10);
    })
  }

  getTotalCost() {
    let reqQuantity = parseInt(this.addResourcesForm.controls.requiredQuantity.value);
    if (reqQuantity <= 0 ) {
      this.greaterThanZero = false;
      this.quantityErr = false;
    } else {
      this.greaterThanZero = true;
      let quanity = this.addResourcesForm.controls.quanity.value;
      const costPerUnit = this.deformatValue(this.addResourcesForm.controls.costPerUnit.value);
      let totalCost = parseFloat(costPerUnit) * reqQuantity;
      let enumId = this.addResourcesForm.controls.type.value;
      let type = this.getEnumById(enumId);
      if (reqQuantity > quanity && type == "Limited") {
        this.quantityErr = true;
        setTimeout(() => {
          this.addResourcesForm.patchValue({
            status: "Not Available",
          });
        }, 10);
      } else {
        this.quantityErr = false;
        setTimeout(() => {
          this.addResourcesForm.patchValue({
            totalCost: this.formatValue(totalCost, 'GBP', 2),
            status: "Available",
          });
        }, 10);
      }
    }

  }

  onDelete(resource: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.upDateAll) {
          this.reservationForUpdate.forEach(reservation => {
            var dataAfterDelete = this.onDeleteResource(resource, reservation.selectedResources);
            reservation.selectedResources = dataAfterDelete;
          })
        } else {
          this.onDeleteResource(resource, this.selectedResourcesData);
        }

      },
      key: "delete"
    });
  }

  confirmEditAllRecurrence(reservation: any) {
    this.upDateAll = false;
    if (reservation.bookingType.toLocaleUpperCase() === "Recurring".toLocaleUpperCase()) {
      this.editRecurrenceBooking(reservation);
    } else {
      this.upDateAll = false;
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
      return this.datePipe.transform(currDate, "HH:mm:ss");
    } else {
      return '';
    }
  }

  editRecurrenceBooking(reservation: any) {
    this.displayEditRecurrence = true;
    this.selectedReservation = reservation;

  }

  confirmEditRecurrence() {
    this.upDateAll = this.editDialog.controls.edit.value === 'updateAll';
    this.reservationForUpdate = this.reservationData.filter((res: any) => res.reserveId >= this.selectedReservation.reserveId 
    && res.parentId == this.data.roomDetails.parentId && (res.status == 'Waiting for Approval' || res.status == 'Approved'));
    if (this.upDateAll) {
      this.reservationForUpdate.forEach(reservation => {
        var resourcesData = this.loadReserveRs(reservation.reserveRs);
        resourcesData != null ? reservation.selectedResources = resourcesData : '';
        var attendeesData = this.loadPresentAttendees(reservation.reserveAttendees);
        attendeesData != null ? reservation.selectedAttendees = attendeesData : '';

      })
    }
    this.displayEditRecurrence = false;
  }
  
  ngOnDestroy() {
    this.bps.unregister(this);
  }
  
}
