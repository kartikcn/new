import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { BuildingFilterInput } from 'src/app/ui/background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/flFilterInput.model';
import { BookingService } from '../../services/booking.services';
import { RmConfigService } from 'src/app/ui/rm-config/rm-config/services/rm-config.service';
import { RMFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/rmFilterInput.model';
import html2canvas from 'html2canvas';
import { UtilConstant } from 'src/common/UtilConstant';



@Component({
  selector: 'app-booking-reports-by-month',
  templateUrl: './booking-reports-by-month.component.html',
  styleUrls: ['./booking-reports-by-month.component.scss'],
  providers: [MessageService]
})
export class BookingReportsByMonthComponent implements OnInit {
  filterPanel: UntypedFormGroup;
  basicData: any;
  basicOptions: any;
  month!: any;
  enumBL: BuildingFilterInput[] = [];
  enumFL: FLFilterInputDTO[] = [];
  enumStatusData: Enums[] = [];
  years: any[] = [];
  filterArray: any;
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumStatusList: Enums[] = [];
  enumeStatus: Enums[] = [];
  enumAllFL: FLFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  req_array: any[] = [];
  allBl: any[] = [];
  req_data: any[] = [];
  displayList: boolean = false;
  requestData: any[] = [];
  rmFilter!: RMFilterInputDTO;
  loggedInUser: any;
  CurrentYear!: number;
  compId!: number;
  chartImg: any[] = [];
  title: any;
  monthBooking!: String;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private enumsrv: EnumService,
    private spinner: NgxSpinnerService,
    private bookingSrv: BookingService,
    private rmConfigSrv: RmConfigService,
    private messageService: MessageService,


  ) {
    this.filterPanel = this.formBuilder.group({
      blId: [null],
      flId: [null,],
      rmId: [null,],
      status: [null],
      year: [new Date().getFullYear()],
    });

  }

  ngOnInit(): void {
    this.spinner.hide();
    this.compId = this.authSrv.getLoggedInUserCompId();
    this.loggedInUser = this.authSrv.getLoggedInUserId();
    this.loadFilterPanelData();
    this.loadStatus();
    this.loadEnums();
    this.CurrentYear = new Date().getFullYear();
    const previousYear = this.CurrentYear - 1
    const nextYear = this.CurrentYear + 1
    this.years = [
      { name: previousYear, code: previousYear },
      { name: this.CurrentYear, code: this.CurrentYear },
      { name: nextYear, code: nextYear }
    ];
    this.onSearch();
  }

  onSearch() {
    this.spinner.show();
    var blId = this.filterPanel.controls.blId.value;
    var flId = this.filterPanel.controls.flId.value;
    var rmId = this.filterPanel.controls.rmId.value;
    var status = this.filterPanel.controls.status.value;
    var year = this.filterPanel.controls.year.value;
    this.spinner.hide();
    this.filterArray = {
      month: this.month,
      year: year,
      status: status,
      blId: blId,
      flId: flId,
      rmId: rmId,
      compId: this.compId
    }
    this.getBookingReportsByMonth(this.filterArray);
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

  onClick(event: any) {

    var index = event.element.index;
    this.month = index + 1;
    this.filterArray.month = this.month;
    this.monthBooking = this.basicData.labels[index];
    this.req_data = [];
    this.bookingSrv.getReservationRequestByMonth(this.filterArray).subscribe((res: any[]) => {
      this.req_data = res;
      this.getDestructuredData(this.req_data)
      this.displayList = true;
    },
      error => {
      }
    );

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

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumeStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'reserve'.toLocaleUpperCase());
        this.enumStatusList = this.enumeStatus.filter(t => t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
      },
      error => {
      }
    );
  }

  getEnumById(id: any) {
    return this.enumStatusList.find((t: any) => t.id === id)?.enumValue
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
  getBookingReportsByMonth(data: any) {
    this.bookingSrv.getCountByMonth(data).subscribe((res: any) => {
      var data = res;
      this.requestData = [];
      for (var i = 1; i <= 12; i++) {
        var cnt = data.find((t: number[]) => t[0] == i);
        cnt = cnt != null && cnt != 'undefined' ? cnt[1] : 0;
        this.requestData.push(cnt);
      }
      this.setChartData(this.requestData);
    },
      error => {
      }
    );
  }

  setChartData(dataList: any[]) {
    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Months',
          backgroundColor: '#42A5F5',
          data: dataList
        }
      ]
    };
  }

  exportChartToPDF(chartElement: any) {
    html2canvas(chartElement).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');
      this.chartImg = [];
      this.chartImg.push(imgData);
      this.printPDF();
    });
  }

  printPDF() {
    var reportDetails: any = {

      chartImg: this.chartImg,
      title: 'Monthly Booking-Report',
    }

    this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'reportBookingSer', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
        var file = new Blob([res], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
  }

}




