import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { UsersService } from 'src/app/services/users.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { ResourcesService } from 'src/app/ui/resources/service/resources.service';
import { RmResourcesService } from 'src/app/ui/rm-resources/service/rm-resources.service';
import { VisitorsService } from 'src/app/ui/visitors/services/visitors.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { RecurrencePattarnDTO } from '../../model/recurrence-pattern.DTO';
import { ReserveAttendeesDTO } from '../../model/reserveAttendeesDTO';
import { ReserveDTO } from '../../model/reserveDTO';
import { ReserveResourcesDTO } from '../../model/reserveResourcesDTO';
import { BookingService } from '../../services/booking.services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EnumList } from 'src/app/model/enum-list.model';
import { UsersFilterInputDTO } from 'src/app/ui/user/modal/UsersFilterInputDTO.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-confirm-booking-page',
  templateUrl: './confirm-booking-page.component.html',
  styleUrls: ['./confirm-booking-page.component.scss'],
  providers: [MessageService]
})
export class ConfirmBookingPageComponent implements OnInit {
  confirmBookingForm: UntypedFormGroup;
  addResourcesForm: UntypedFormGroup;
  attendeesData: any[] = [];
  selectedAttendies: any[] = [];
  em_data: any[] = [];
  visitorsData: any[] = [];
  loading: boolean = false;
  isEmList: boolean = true;
  displayAttendees: boolean = false;
  enumUsers: UsersFilterInputDTO[] = [];
  attendeesList: any[] = [];
  location: string = '';
  atndDetails: string = '';
  loggedInUser!: number ;
  rmResourcesList: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  isVisitorAallowed: boolean = false;
  recurrenceDetails!: RecurrencePattarnDTO;
  displayResources: boolean = false;
  resourcesData: any[] = [];
  selectedResources: any[] = [];
  fixedResources: string = '';
  isResourceAvlMsg: string = '';
  selectedResourcesData: any[] = [];
  displayAddQuan: boolean = false;
  selectedResource: any = {};
  isErr: boolean = false;
  quantityErr: boolean = false;
  enumList: EnumList[] = [];
  resources: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enummTypeData: EnumList[] = [];
  isLimited: boolean = true;
  isEditResource:boolean = false;
  greaterThanZero:boolean = true;
  quantityInUse:number = 0;
  resourceExistErr:string = '';
  addOrEdit:string = "Add"
  enumReserve: EnumList[] = [];
  enumStatusData: EnumList[] = [];
  enumRmConfig: EnumList[] = [];
  enumIsAppReqData: EnumList[] = [];
  enumExternalAlwd:EnumList[] = [];
  addAttendeeDialogWidth='45vw';
  useTabletProtrait = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmBookingPageComponent>,
    private confirmationService: ConfirmationService,
    private userSrv: UsersService,
    private authSrv: AuthService,
    private emSrv: EmployeeService,
    private visitorService: VisitorsService,
    private bookingSrv: BookingService,
    private rmResourcesSrv: RmResourcesService,
    private datePipe: DatePipe,
    private resourceService: ResourcesService,
    private currencyPipe: CurrencyPipe,
    private enumsrv: EnumService,
    private bps : BreakpointService
  ) {
    this.confirmBookingForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      comments: [null],
    });
    this.addResourcesForm = this.formBuilder.group({
      resource: [null, [Validators.required]],
      quanity: [null, [Validators.required]],
      costPerUnit: [0, [Validators.required]],
      requiredQuantity: [null, [Validators.required]],
      totalCost: [0, [Validators.required]],
      type: [],
      status:[null]
    })
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loggedInUser = this.authSrv.getLoggedInUserId()
    this.loadUsers();
    setTimeout(() => {
      this.confirmBookingForm.patchValue({
        userId: this.loggedInUser,
      });
      this.location = "Building -" + this.data.roomDetails.blBlCode + " | " + "Floor -" + this.data.roomDetails.flFlCode + " | " + "Room -" + this.data.roomDetails.rmRmCode
      var roomData = {
        blId: this.data.roomDetails.blId,
        flId: this.data.roomDetails.flId,
        rmId: this.data.roomDetails.rmId,
      }
      this.loadRmResources(roomData);
    }, 10);
    this.loadEmployees();
    this.loadVisitors();
    this.loadResources()
    this.loadEnums()
    this.recurrenceDetails = this.data.recurrenceDetails;
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    if(this.useTabletProtrait){
      this.addAttendeeDialogWidth='65vw';
    }else{
      this.addAttendeeDialogWidth='45vw';
    }
  }

  loadRmResources(data: any) {
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
        // this.resources = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'resources'.toLocaleUpperCase());
        this.enummTypeData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'resources'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'resources_type'.toLocaleUpperCase());

        // this.enumReserve = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'reserve'.toLocaleUpperCase());
        this.enumStatusData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'reserve'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());

        // this.enumRmConfig = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'rm_config'.toLocaleUpperCase());
        this.enumIsAppReqData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'rm_config'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'is_approval_req'.toLocaleUpperCase());
        this.enumExternalAlwd = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'rm_config'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'external_allowed'.toLocaleUpperCase());

        this.enummTypeData.unshift(new EnumList(null, "", "", 'Make a selection',null));
      },
    );
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

  loadEmployees() {
    this.loading = true;
    this.isEmList = true;
    this.em_data = [];
    this.emSrv.getAllEmployeeList().subscribe((res: any) => {
      if (res.status != 202) {
        this.isEmList = false;
        this.em_data = res;
        this.em_data = this.em_data.map((i: any) => { i.id = i.emId; return i; });
        this.em_data = this.em_data.map((i: any) => { i.name = i.firstName + ' ' + i.lastName; return i; });
        this.em_data = this.em_data.map((i: any) => { i.email = i.email; return i; });
        this.em_data = this.em_data.map((i: any) => { i.category = "Employee"; return i; });
        this.loadAttendies();
      }
      else {
        this.isEmList = true;
        this.em_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  loadVisitors() {
    this.loading = true;
    this.visitorService.getAllVisitors().subscribe((res: any) => {
      if (res.status != 202) {
        this.visitorsData = res;
        this.visitorsData = this.visitorsData.map((i: any) => { i.id = i.visitorsId; return i; });
        this.visitorsData = this.visitorsData.map((i: any) => { i.name = i.firstName + ' ' + i.lastName; return i; });
        this.visitorsData = this.visitorsData.map((i: any) => { i.email = i.email; return i; });
        this.visitorsData = this.visitorsData.map((i: any) => { i.category = "Visitor"; return i; });
        this.loadAttendies();
      }
      else {
        this.visitorsData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  loadAttendies() {
    if (this.data.roomDetails.externalAllowed == this.getIdByExtrnlAlwd('Yes')) {
      this.isVisitorAallowed = false;
      this.attendeesData = this.em_data.concat(this.visitorsData)
    } else {
      this.isVisitorAallowed = true;
      this.attendeesData = this.em_data;
    }
  }
  saveAttendies() {
    parseInt(this.data.roomDetails.maxCapacity) < this.selectedAttendies.length ? 'x' : 'y';
    this.attendeesList = [];
    this.atndDetails = '';
    this.selectedAttendies.forEach((item: any) => {
      this.selectedAttendies = this.selectedAttendies.filter(val => val !== item);
      this.attendeesData = this.attendeesData.filter(val => val !== item);
      this.attendeesData.unshift(item);
      var record = {
        id: item.id+"-"+item.email,
        name: item.name,
        email: item.email,
        category: item.category,
        visitorId: item.category == 'Visitor' ? item.id : null,
        emId: item.category == 'Employee' ? item.id : null,
        isVisitor: item.category == 'Visitor' ? 'Yes' : 'No',
      }
      this.attendeesList.push(record);
      this.selectedAttendies.indexOf(item.id) === -1 ? this.selectedAttendies.push(item) : '';
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

  confirmBooking() {
    var reserveDTO: ReserveDTO = {
      reserveId: 0,
      loggedBy: this.loggedInUser,
      requestedBy: this.confirmBookingForm.controls.userId.value,
      requestedFor: this.loggedInUser,
       status: this.getEnumByEnumId(this.data.roomDetails.isApprovalRequired)=="Yes"?this.getIdByStatus("Waiting for Approval"):this.getIdByStatus("Approved"),
      meetingName: this.confirmBookingForm.controls.title.value,
      comments: this.confirmBookingForm.controls.comments.value,
      bookingType: this.data.filterData.bookingType,
      recurringRule: this.data.recurringRule,
      dateStart: this.data.filterData.date,
      dateEnd: this.data.filterData.date,
      timeStart: this.data.filterData.fromTime,
      timeEnd: this.data.filterData.toTime,
      blId: this.data.roomDetails.blId,
      flId: this.data.roomDetails.flId,
      rmId: this.data.roomDetails.rmId,
      configId : this.data.roomDetails.configId, 
    }

    var reserveAttendeesDTO: ReserveAttendeesDTO[] = [];
    this.attendeesList.forEach((item: any) => {
      var reserveAttendeesDTOItem: ReserveAttendeesDTO = {
        reserveAttendeesId: 0,
        reserveId: 0,
        email: item.email,
        attendeeName: item.name,
        isVisitor: item.isVisitor,
        emId: item.emId,
        visitorId: item.visitorId,
      }
      reserveAttendeesDTO.push(reserveAttendeesDTOItem)
    })

    var reserveResourcesDTO: ReserveResourcesDTO[] = [];
    this.selectedResourcesData.forEach((item: any) => {
      var reserveResourcesDTOItem: ReserveResourcesDTO = {
        reserveRsId: 0,
        reserveId: 0,
        blId: this.data.roomDetails.blId,
        flId: this.data.roomDetails.flId,
        rmId: this.data.roomDetails.rmId,
        qty: item.requiredQuantity,
        comments: item.description,
        resourcesId: item.resourcesId,
        isReusable:item.isReusable,
        costPerUnit:item.costPerUnit,
        totalCost:item.totalCost,
        type: this.getEnumById(item.type),
      }
      reserveResourcesDTO.push(reserveResourcesDTOItem);
    })
    var bookingData = {
      reserveDTO: reserveDTO,
      reserveAttendeesDTO: reserveAttendeesDTO,
      reserveResourcesDTO: reserveResourcesDTO
    }
    var recurrenceBookingData = {
      reserveDTO: reserveDTO,
      reserveAttendeesDTO: reserveAttendeesDTO,
      reserveResourcesDTO: reserveResourcesDTO,
      recurrencePatternDTO: this.recurrenceDetails
    }
    if (this.data.filterData.bookingType == "Regular") {
      this.bookingSrv.saveBooking(bookingData).subscribe((res: any) => {
        if (!(res.text == 'Booking already exists')) {
          this.confirmBookingDialog(res, reserveAttendeesDTO, this.selectedResourcesData);
        } else {
          this.failedBookingDialog();
        }
      })
    } else {
      this.bookingSrv.saveRecurrenceBookings(recurrenceBookingData).subscribe((res: any) => {
        console.log(res);
        if (res.length > 0) {
          this.conflectsDialog(res, reserveDTO, reserveAttendeesDTO, this.selectedResourcesData);
        } else {
          this.confirmBookingDialog(reserveDTO, reserveAttendeesDTO, this.selectedResourcesData);
        }
      })
    }


  }

  onDeleteAttendee(attendee: any) {
    this.attendeesList = this.attendeesList.filter(val => val !== attendee);
    this.selectedAttendies = this.selectedAttendies.filter(val => val.id+"-"+val.email !== attendee.id);
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close([false]);
      }
    });
  }

  confirmBookingDialog(reserveData: any, reserveAttendeesDTO: any, reserveResourcesDTO: any): void {
    var reservationData = [reserveData, reserveAttendeesDTO, reserveResourcesDTO, ""]
    this.confirmationService.confirm({
      message: UtilConstant.BOOKING_SUCCESSFUL,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'confirmBook',
      accept: () => {
        this.dialogRef.close(reservationData);
      }
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
    this.data.roomDetails.maxCapacity < this.selectedAttendies.length ? 'x' : 'y';
  }

  conflectsDialog(data: any, reserveData: any, reserveAttendeesDTO: any, reserveResourcesDTO: any): void {
    var dates = '';
    data.forEach((date: any) => {
      dates = dates + this.datePipe.transform(date, "dd MMM yyyy") + " ";
    });
    this.confirmationService.confirm({
      message: `${UtilConstant.BOOKING_SUCCESSFUL} and 
      number of conflicts : ${data.length}`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'conflicts',
      accept: () => {
        var reservationData = [reserveData, reserveAttendeesDTO, reserveResourcesDTO, dates];
        this.dialogRef.close(reservationData);
      }
    });
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
    let data = {
      date: this.data.filterData.date,
      timeStart: this.data.filterData.fromTime,
      timeEnd: this.data.filterData.toTime,
      resourcesId: resource.resourcesId,
      reserveRsId:0,
    }
    this.bookingSrv.getReserveRsQtnInUse(data).subscribe((res:any) => {
      this.quantityInUse = res;
      setTimeout(() => {
        this.addResourcesForm.patchValue({
          resource: resource.resourcesId,
          costPerUnit: this.formatValue(resource.costPerUnit, 'GBP', 2),
          quanity: type != "Unlimited" ?resource.quanity - this.quantityInUse : resource.quanity,
          type: resource.type,
          requiredQuantity: resource.requiredQuantity,
          totalCost: resource.totalCost,
          status: type == "Unlimited" ? "Aavailable" : (resource.quanity - this.quantityInUse) > 0 ? "Available":"Not Available",
        });
      }, 10);
      this.displayResources = true;
    })
    if (type != "Unlimited") {
      this.isLimited = true;
    } else {
      this.isLimited = false;
    }
  }

  onDeleteResource(id: any) {
    this.selectedResourcesData = this.selectedResourcesData.filter(t => t.resourcesId !== id);
  }

  getEnumById(id: any) {
    return this.enummTypeData.find((t: any) => t.enumKey === id)?.enumValue
  }

  saveReqResources() {
    this.selectedResource.requiredQuantity = this.addResourcesForm.controls.requiredQuantity.value;
    var totalCostStr:any = this.addResourcesForm.controls.totalCost.value;
    var deftotalCost =  this.deformatValue(totalCostStr.slice(1,));
    this.selectedResource.totalCost = deftotalCost;
    this.selectedResourcesData = this.selectedResourcesData.filter(t => t.resourcesId != this.selectedResource.resourcesId)
    this.selectedResourcesData.push(this.selectedResource);
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
    let existRecord = this.selectedResourcesData.find(resource => resource.resourcesId === $event.resourcesId);
    if(existRecord){
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
      date: this.data.filterData.date,
      timeStart: this.data.filterData.fromTime,
      timeEnd: this.data.filterData.toTime,
      resourcesId: $event.resourcesId,
      reserveRsId:0,
    }
    this.bookingSrv.getReserveRsQtnInUse(data).subscribe((res:any) => {
      this.quantityInUse = res;
      setTimeout(() => {
        this.addResourcesForm.patchValue({
          costPerUnit: this.formatValue($event.costPerUnit, 'GBP', 2),
          quanity: type != "Unlimited" ?$event.quanity - this.quantityInUse:$event.quanity,
          type: $event.type,
          requiredQuantity:'',
          totalCost:'',
          status: type == "Unlimited" ? "Aavailable" : ($event.quanity - this.quantityInUse) > 0 ? "Available":"Not Available",
        });
      }, 10);
    })
  }

  getTotalCost() {
    let reqQuantity = this.addResourcesForm.controls.requiredQuantity.value;
    if(reqQuantity <= 0 && reqQuantity != ""){
      this.greaterThanZero = false;
      this.quantityErr = false;
    }else{
      this.greaterThanZero = true;
      let quanity = this.addResourcesForm.controls.quanity.value;
      const  costPerUnit =this.addResourcesForm.controls.costPerUnit.value;
      let totalCost = parseFloat(costPerUnit.replace(/£/g, "")) * parseInt(reqQuantity);
      let enumId = this.addResourcesForm.controls.type.value;
      let type = this.getEnumById(enumId);
      if (reqQuantity > quanity && type == "Limited") {
        this.quantityErr = true;
        setTimeout(() => {
          this.addResourcesForm.patchValue({
            status:"Not Available",
          });
        }, 10);
      } else {
        this.quantityErr = false;
        setTimeout(() => {
          this.addResourcesForm.patchValue({
            totalCost: this.formatValue(totalCost, 'GBP', 2),
            status:"Available",
          });
        }, 10);
      }
    } 
  }

  onDelete(id:any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDeleteResource(id);
      },
    });
  }

  getIdByStatus(status: any) {
    return this.enumStatusData.find((t: any) => t.enumValue === status)?.enumKey
  }

  getEnumByEnumId(id: any) {
    return this.enumIsAppReqData.find((t: any) => t.enumKey === id)?.enumValue
  }

  getIdByExtrnlAlwd(status: any) {
    return this.enumExternalAlwd.find((t: any) => t.enumValue === status)?.enumKey
  }
  
  ngOnDestroy() {
    this.bps.unregister(this);
  }
}
