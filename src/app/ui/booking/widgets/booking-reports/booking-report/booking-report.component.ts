import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Enums } from 'src/app/model/enums.model';
import { UsersService } from 'src/app/services/users.service';
import { BuildingFilterInput } from 'src/app/ui/background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/flFilterInput.model';
import { RMFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/rmFilterInput.model';
import { BookingIdFilterInput } from 'src/app/ui/edit-booking/model/bookingIdFilterInput.model';
import { UserFilterInput } from 'src/app/ui/user/modal/usersFilterInput.model';
import { UtilConstant } from 'src/common/UtilConstant';
import { DatePipe } from '@angular/common';
import { BookingService } from '../../../services/booking.services';
import { EditBookingDialogueProvider } from 'src/app/ui/edit-booking/provider/edit-booking-provider';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { RmConfigService } from 'src/app/ui/rm-config/rm-config/services/rm-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { BookingDetailsViewDialogueProvider } from '../../../provider/booking-details-view';
import { JSON2SheetOpts } from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss'],
})

export class BookingReportComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  enumRequestedBy: UserFilterInput[] = [];
  enumReservationIds: BookingIdFilterInput[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  enumAllFL: FLFilterInputDTO[] = [];
  enumBL: BuildingFilterInput[] = [];
  enumStatusData: Enums[] = [];
  compId!: number;
  reservationData: any[] = [];
  enumFL: FLFilterInputDTO[] = [];
  errorMsg: string = '';
  isErr: boolean = false;
  presentDate: Date = new Date();
  firstDate: Date = new Date(this.presentDate.getFullYear(), this.presentDate.getMonth(), 1, 0);
  lastDate: Date = new Date(this.presentDate.getFullYear(), this.presentDate.getMonth() + 1, 0);
  allBl: any[] = [];
  rmFilter!: RMFilterInputDTO;
  reqitems: MenuItem[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumStatusList: Enums[] = [];
  enumeStatus: Enums[] = [];
  displayStatusData: any[] = [];
  reserveDataList: any[] = [];
  reservationInputDTOList: any[] = [];
  req_array: any[] = [];
  upDateAll: boolean = false;
  loggedInUser: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private userSrv: UsersService,
    private bookingProvider: EditBookingDialogueProvider,
    private spinner: NgxSpinnerService,
    private bookingSrv: BookingService,
    private datePipe: DatePipe,
    private rmConfigSrv: RmConfigService,
    private enumsrv: EnumService,
    private authSrv: AuthService,
    private bookingDetailsView: BookingDetailsViewDialogueProvider

  ) {
    this.filterPanel = this.formBuilder.group({
      requestedBy: [null],
      id: [null],
      blId: [null],
      flId: [null,],
      rmId: [null,],
      dateStart: [null, [this.checkDateValidation()]],
      dateEnd: [null, [this.checkDateValidation()]],
      status: [null]
    });
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.compId = this.authSrv.getLoggedInUserCompId();
    this.loadEnums();
    this.loadEnumRequestedBy();
    this.setStartAndEndDates();
    this.loadFilterPanelData();
    this.loadEnumId();
    this.loadStatus();
    this.loggedInUser = this.authSrv.getLoggedInUserId();
  }

  loadEnumRequestedBy() {
    this.userSrv.getALLUsers().subscribe((res: any) => {
      this.enumRequestedBy = res;
      this.enumRequestedBy = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumRequestedBy.unshift(new UserFilterInput('', 'Make a selection', '', null));
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

  onRowSelect(event: any) {
    if (event != null && event.data != null) {
      this.openBookingDetails(event.data)
    }
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumeStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'reserve'.toLocaleUpperCase());
        this.enumStatusList = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'reserve'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        this.loadReservationData();
      },
      error => {
      }
    );
  }

  getEnumById(id: any) {
    return this.enumStatusList.find((t: any) => t.id === id)?.enumValue
  }

  openBookingDetails(res: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '850px';
    dialogConfig.minHeight = '300px';
    res.status = this.getEnumById(res.status);
    dialogConfig.data = {
      roomDetails: res,
    };
    this.bookingDetailsView.openDialog(dialogConfig);
    this.bookingDetailsView.onDialogueClosed.subscribe((result: any) => {
      () => { }
    });
  }

  loadFloorCode(bl_id: any) {
    if (bl_id != null) {
      this.enumFL = [];
      this.enumFL = this.enumAllFL.filter((t: { blId: any; }) => t.blId == bl_id)
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.rm_data = this.allRmDdata.filter((t: { blId: any; }) => t.blId == bl_id)
      this.rm_data.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId));
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

  onClear() {
    this.filterPanel.patchValue({
      requestedBy: null,
      id: null,
      blId: null,
      flId: null,
      rmId: null,
      dateStart: null,
      dateEnd: null,
      status: null,
    });
    this.reservationData = [];
  }

  onSearch() {
    this.spinner.show();
    var requestedBy = this.filterPanel.controls.requestedBy.value;
    var id = this.filterPanel.controls.id.value;
    var blId = this.filterPanel.controls.blId.value;
    var flId = this.filterPanel.controls.flId.value;
    var rmId = this.filterPanel.controls.rmId.value;
    var dateStart = this.setFromateDate(this.filterPanel.controls.dateStart.value);
    var dateEnd = this.setFromateDate(this.filterPanel.controls.dateEnd.value);
    var status = this.filterPanel.controls.status.value;
    var filterValueData = {
      'requestedBy': requestedBy,
      'id': id,
      'blId': blId,
      'flId': flId,
      'rmId': rmId,
      'dateStart': dateStart,
      'dateEnd': dateEnd,
      'compId': this.compId,
      'status': status
    };
    this.reservationData = [];
    this.bookingSrv.SearchBookingsByFilter(filterValueData).subscribe((res: any) => {
      this.spinner.hide();
      this.reservationData = res;
    })
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
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
    }
  }

  loadRmCode(flId: any, blId: any) {
    if (flId != null) {
      this.rm_data = [];
      this.rm_data = this.allRmDdata.filter((t: { blId: any; }) => t.blId == blId);
      this.rm_data = this.rm_data.filter((t: { flId: any; }) => t.flId == flId)
      this.rm_data.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId));
    }
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

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }

  setStartAndEndDates() {
    this.filterPanel.patchValue({
      dateStart: this.firstDate,
      dateEnd: this.lastDate,
    })
  }

  loadReservationData() {
    this.onSearch();
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

  loadFilterPanelData() {
    this.rmConfigSrv.getAllFilterData().subscribe((res: any) => {
      this.allBl = res.blList;
      this.enumBL = res.blList;
      this.enumBL = res.blList.map((i: any) => { i.name = i.blId + (i.blName  ? ' - ' + i.blName : "");return i;});
      this.enumBL.unshift(new BuildingFilterInput('', 'Make a selection', '', this.compId));
      this.enumAllFL = res.flList;
      this.enumAllFL = res.flList.map((i: any) => { i.name = i.blId + '-' + i.flId + (i.flName ?  ' - ' + i.flName : '') ; return i; });
      this.enumAllFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.enumFL = this.enumAllFL;
      this.allRmDdata = res.rmList
      this.allRmDdata = res.rmList.map((i: any) => { i.name = i.blId + '-' + i.flId + ' - ' + i.rmId + (i.rmName ?  ' - ' + i.rmName : ''); return i; });
      this.allRmDdata.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId))
      this.rm_data = this.allRmDdata;
    })
  }

  loadEnumId() {
    this.bookingSrv.getAllBookingIds().subscribe((res: any) => {
      this.enumReservationIds = res;
      this.enumReservationIds = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumReservationIds.unshift(new BookingIdFilterInput(0, 'Make a selection'));
    })
  }

  exportExcel() {
    this.getDestructuredData(this.reservationData);
    var excelHeaders: string[] = ["Type", "Meeting Id", "Building", "Floor", "Room", "Date", "From Time", "To Time", "Status", "Meeting Name", "Requested By"];
    let options: JSON2SheetOpts = { header: excelHeaders };
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.req_array);

      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ]
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "booking");
    });
  }

  getDestructuredData(req_data: any) {
    this.req_array = req_data.map((item: any) => {
      return {
        "Type": item['bookingType'],
        "Meeting Id ": item['id'],
        "Building": item['blId'],
        "Floor": item['flId'],
        "Room": item['rmId'],
        "Date": item['dateStart'],
        "From Time": item['timeStart'],
        "To Time": item['timeEnd'],
        "status": this.getEnumById(item['status']),
        "Meeting Name": item['meetingName'],
        "Requested By": item['requestedBy']
      }
    })
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
