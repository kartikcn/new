import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { UsersService } from 'src/app/services/users.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { ResourcesService } from 'src/app/ui/resources/service/resources.service';
import { RmResourcesService } from 'src/app/ui/rm-resources/service/rm-resources.service';
import { UserFilterInput } from 'src/app/ui/user/modal/usersFilterInput.model';
import { VisitorsService } from 'src/app/ui/visitors/services/visitors.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-booking-details-view',
  templateUrl: './booking-details-view.component.html',
  styleUrls: ['./booking-details-view.component.scss']
})
export class BookingDetailsViewComponent implements OnInit {
  confirmBookingForm: UntypedFormGroup;
  addOrEdit: string = "Add";
  location: string = '';
  enumUsers: UserFilterInput[] = [];
  deletedAttendeesIdList: any[] = [];
  resourcesToDisplay: any[] = [];
  em_data: any[] = [];
  today: Date = new Date();
  upDateAll: boolean = false;
  errorMsg: string = '';
  loggedInUser: string = '';
  rmResourcesList: any[] = [];
  selectedAttendees: any[] = [];
  savedAttendees: any[] = [];
  reservationForUpdate: any[] = [];
  attendeesList: any[] = [];
  attendeesData: any[] = [];
  isVisitorAallowed: boolean = false;
  resourceExistErr: string = '';
  fixedResources: string = '';
  isView: boolean = true;
  isEditResource: boolean = false;
  displayResources: boolean = false;
  displayAttendees: boolean = false;
  resourcesData: any[] = [];
  selectedResourcesData: any[] = [];
  visitorsData: any[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumStatusData: Enums[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private userSrv: UsersService,
    private resourceService: ResourcesService,
    private rmResourcesSrv: RmResourcesService,
    public dialogRef: MatDialogRef<BookingDetailsViewComponent>,
    private confirmationService: ConfirmationService,
    private emSrv: EmployeeService,
    private visitorService: VisitorsService,
    private enumsrv: EnumService,


  ) {
    this.confirmBookingForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      comments: [null],
      status:[null],
      dateStart: [null],
      timeStart: [null],
      timeEnd: [null]
    });
  }
  ngOnInit(): void {
    this.loggedInUser = this.authSrv.getLoggedInUserId();
    this.loadUsers();
    var roomData = {
      blId: this.data.roomDetails.blId,
      flId: this.data.roomDetails.flId,
      rmId: this.data.roomDetails.rmId,
      compId: this.data.roomDetails.compId
    };
    this.selectedAttendees = this.data.roomDetails.reserveAttendees
    this.resourcesToDisplay = this.data.roomDetails.reserveRs
    setTimeout(() => {
      this.setFormData();
      this.loadFixedResources(roomData);
    }, 10);
    this.loadEmployees();
    this.loadVisitors();
    this. loadResources();
  }
  setFormData() {
    this.confirmBookingForm.patchValue({
      title: this.data.roomDetails.meetingName,
      userId: this.loggedInUser,
      comments: this.data.roomDetails.comments,
      status:this.data.roomDetails.status,
      dateStart: this.formatDate(this.data.roomDetails.dateStart),
      timeStart: this.convertToDisplayTime(this.data.roomDetails.timeStart),
      timeEnd: this.convertToDisplayTime(this.data.roomDetails.timeEnd)
    });
    this.location = "Building -" + this.data.roomDetails.blId + " | " + "Floor -" + this.data.roomDetails.flId + " | " + "Room -" + this.data.roomDetails.rmId;
  }
 

  formatDate(date: Date | null) {
    if (date != null) {
      var dateCreated = new Date(date);
      return dateCreated;
    } else {
      return null;
    }
  }

  loadStatus() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumStatusData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'reserve'.toLocaleUpperCase() &&
         t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
         this.enumStatusData.unshift(new Enums(0, "", "", 'Make a selection'));
      })
  }

  loadEmployees() {
    this.em_data = [];
    this.emSrv.getAllEmployeeList().subscribe((res: any) => {
      if (res.status != 202) {
        this.em_data = res;
        this.em_data = this.em_data.map((i: any) => { i.atId = i.emId; return i; });
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

  loadAttendies() {
    if (this.data.roomDetails.rmConfig[0].externalAllowed == 'Yes') {
      this.isVisitorAallowed = false;
      this.attendeesData = this.em_data.concat(this.visitorsData)
    } else {
      this.isVisitorAallowed = true;
      this.attendeesData = this.em_data;
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

  loadUsers() {
    this.userSrv.getALLUsers().subscribe((res: any) => {
      this.enumUsers = res;
      this.enumUsers = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumUsers.unshift(new UserFilterInput('', 'Make a selection', '', null));
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

  getEnumByid(id: any) {
    return this.enumStatusData.find((t: any) => t.id === id)?.enumValue
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

  loadPresentAttendees(oldAttendees: any) {
    this.attendeesList = [];
    this.selectedAttendees = oldAttendees;
    this.selectedAttendees = this.selectedAttendees.map((i: any) => { i.atId = i.visitorId ? i.visitorId : i.emId; return i; });
    this.selectedAttendees = this.selectedAttendees.map((i: any) => { i.attendeeId = i.id; return i; });
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

  loadVisitors() {
    this.visitorService.getAllVisitors().subscribe((res: any) => {
      if (res.status != 202) {
        this.visitorsData = res;
        this.visitorsData = this.visitorsData.map((i: any) => { i.atId = i.visitorsId; return i; });
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
}




