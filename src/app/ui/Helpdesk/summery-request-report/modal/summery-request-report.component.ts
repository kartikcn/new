import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SiteService } from 'src/app/services/site.service';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { SummeryRequestReportsService } from '../services/summery-request-report.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { AddWorkRequestService } from '../../work-request/service/add-work-request.services';
import { MessageService } from 'primeng/api';
import { BookingService } from 'src/app/ui/booking/services/booking.services';
import html2canvas from 'html2canvas';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { SiteFilterInputDTO } from 'src/app/ui/site/modal/SiteFilterInputDTO.model';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';

@Component({
  selector: 'app-summery-request-report',
  templateUrl: './summery-request-report.component.html',
  styleUrls: ['./summery-request-report.component.scss'],
  providers: [MessageService]
})
export class SummeryRequestReportsComponent implements OnInit {

  filterPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumAllSites: SiteFilterInputDTO[] = [];
  enumAllBl: BuildingFilterInputDTO[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  isErr: boolean = false;
  errorMsg: string = '';
  reportData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  displayGridLabel: any;
  showPopUpGrid: boolean = false;
  isGridType: boolean = false;
  chartData: any = [];
  chartImg: any[] = [];
  title: any;
  requestTitle: any;
  requestData: any[] = [];
  chartTitle: string = 'Status';
  allEmployees: any[] = []
  enumEm: any[] = [];
  fullName: any;
  groupByData: any[] = [
    {
      "id": 0,
      "lable": 'Status',
      "value": "status"
    },
    {
      "id": 1,
      "lable": 'Problem Type',
      "value": "prob_type_id"
    },
    {
      "id": 2,
      "lable": 'Site',
      "value": "site_id"
    },
    {
      "id": 3,
      "lable": 'Building',
      "value": "bl_id"
    },
    {
      "id": 4,
      "lable": 'Asset',
      "value": "eq_id"
    },
    {
      "id": 5,
      "lable": 'Technician',
      "value": "technician_id"
    },
    {
      "id": 6,
      "lable": 'Employee',
      "value": "requested_for"
    },
    {
      "id": 6,
      "lable": 'Team',
      "value": "team_id"
    }
  ];

  displayTypeData: any = [
    {
      "id": 1,
      "lable": 'Grid',
      "value": "grid"
    },
    {
      "id": 2,
      "lable": 'Bar Chart',
      "value": "bar_char"
    },
  ]

  basicOptions = {
    title: {
      display: false,
      text: 'Bar Chart',
      fontSize: 18
    },
    legend: {
      display: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: this.chartTitle,
          fontStyle: 'bold',
        },
        ticks: {
          display: true,
        },
        grid: {
          display: false,
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Request Count',
          fontStyle: 'bold',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          display: true
        },
        grid: {
          display: false,
        }
      },
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (tooltipItem: any) {
          return "Requests: " + tooltipItem.formattedValue;
        }
      }
    },
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutBounce'
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  filterData: any = {
    siteId: null,
    blId: null,
    flId: null,
    rmId: null,
    eqId: null,
    wrId: null,
    requestedFor: null,
    status: null,
    problemType: null,
    dateRequestedFrom: null,
    dateRequestedTo: null,
    technicianId: null,
    teamId: null,
    showRequestType: null
  }

  showRequestsTypeList: any[] = [{ label: "Preventive Maintenance", value: "ppm" },
  { label: "Facilities Helpdesk", value: "facilities" },
  { label: "All", value: "all" }]

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input() showType: string = "facilities";
  limitSite: number = 0;
  offsetSite: number = 0;
  limitBl: number = 0;
  offsetBl: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedSite: any = {};
  selectedBl: any = {};
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private blSrv: BuildingService,
    private siteServ: SiteService,
    private datePipe: DatePipe,
    private reportsServ: SummeryRequestReportsService,
    private summeryReportServ: SummeryRequestReportsService,
    private wrServ: AddWorkRequestService,
    private messageService: MessageService,
    private bookingSrv: BookingService,
    private employeeService: EmployeeService
  ) {

    this.filterPanel = this.formBuilder.group({
      dateRequestedFrom: [new Date(new Date().getFullYear(), new Date().getMonth(), 1)],
      dateRequestedTo: [new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
      blId: [null],
      siteId: [null],
      groupBy: [null, [Validators.required]],
      displayType: [null],
      showType: [this.showType]
    })

  }

  ngOnInit(): void {
    this.chartTitle = this.groupByData[0].lable;
    this.filterPanel.patchValue({
      groupBy: this.groupByData[0].value,
      displayType: this.displayTypeData[1].value,
      showType: this.showType
    })
    this.isGridType = false;
    this.loadRecords();
    this.loadAllEmployee();
  }

  setShowType() {
    setTimeout(() => {
      this.filterPanel.patchValue({
        showType: this.showType
      });
    })
  }

  setChartData() {
    let initialChartData: any = {
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }
      ]
    }
    const dynamicColors: any[] = [];
    for (let i = 0; i < this.reportData.length; i++) {
      let color = '';
      do {
        color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      } while (color === 'rgba(255, 255, 255, 1)' || this.isWhiteColorShade(color)) { // Regenerate color if it is white
        color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      };

      dynamicColors.push(color);
    }

    this.reportData.length > 0 && this.reportData.forEach((each: any, index: number) => {
      initialChartData.labels.push(each.value);
      initialChartData.datasets[0].data.push(each.count);
      initialChartData.datasets[0].backgroundColor.push(dynamicColors[index % dynamicColors.length]);
      initialChartData.datasets[0].borderColor.push(dynamicColors[index % dynamicColors.length]);
    });
    if (initialChartData.datasets[0].data.length < 5) {
      let empty = '  ';
      for (let i = 0; i < 5 - initialChartData.datasets[0].data.length; i++) {
        initialChartData.datasets[0].data.push(0);
        initialChartData.labels.push(empty.repeat(i + 1));
        initialChartData.datasets[0].backgroundColor.push('');
        initialChartData.datasets[0].borderColor.push('');
      }
    }
    const label = this.groupByData.filter((each: any) => each.value === this.filterPanel.controls.groupBy.value);
    //this.basicOptions.scales.xAxes[0].scaleLabel.labelString = label[0].lable;
    this.chartData = initialChartData;
  }

  isWhiteColorShade(color: any) {
    // Extract RGB values from the color string
    const rgbValues = color.match(/\d+/g);
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);

    // Check if all RGB values are close to 255 (white)
    const threshold = 50; // Adjust this threshold as needed
    const average = (r + g + b) / 3;
    return average > threshold;
  }

  checkDateValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null) {
        this.filterPanel.controls['dateRequestedFrom'].setErrors(null);
        this.filterPanel.controls['dateRequestedTo'].setErrors(null);
        this.filterPanel.clearAsyncValidators();
        this.filterPanel.updateValueAndValidity();

        var dateFrom = new Date(this.filterPanel.controls['dateRequestedFrom'].value);
        var dateTo = new Date(this.filterPanel.controls['dateRequestedTo'].value);

        if (dateFrom.getTime() >= dateTo.getTime() && this.filterPanel.controls['dateRequestedFrom'].value != null) {
          this.isErr = true;
          this.filterPanel.controls['dateFrom'].setErrors({ 'incorrect': true });
          this.filterPanel.updateValueAndValidity();
          this.errorMsg = 'Date requested to should be greater than date requested from.'
          return { 'incorrect': true };
        } else {
          this.isErr = false
          return null;
        }
      }
      return null;
    };
  }

  loadAllEmployee() {
    this.employeeService.getAllEmployeeList().subscribe((res: any) => {
      if (res) {
        this.allEmployees = res;
      }
      else {
        this.allEmployees = [];
      }
    })
  }

  onSelectSite(event: any) {
    this.filterPanel.patchValue({
      blId: null
    })
    if (event.siteId !== null && event.siteId !== '') {
      this.selectedSite = event;
      this.selectedBl = {};
    } else {
      this.selectedSite = {};
      this.selectedBl = {};
    }
  }

  onSelectBuilding(event: any) {
    if (event.blId !== null && event.blId !== '') {
      this.selectedBl = event;
      const siteData = {
        siteId: event.siteId,
        siteName: event.siteNameString,
      }
      this.selectedSite = siteData;
      this.updateSiteList(siteData);
      this.filterPanel.patchValue({
        siteId: event.siteId
      })
    } else {

    }
  }

  onSelectDisplayType(event: any) {
    if (event.value === 'grid') {
      this.isGridType = true;
    } else {
      this.isGridType = false;
      this.loadRecords();
    }
  }

  onClickFilter() {
    this.loadRecords();
  }

  loadRecords() {
    var dateRequestedFrom = this.filterPanel.controls.dateRequestedFrom.value;
    var dateRequestedTo = this.filterPanel.controls.dateRequestedTo.value;
    var blId = this.filterPanel.controls.blId.value;
    var siteId = this.filterPanel.controls.siteId.value;
    var groupBy = this.filterPanel.controls.groupBy.value;
    this.basicOptions.scales.x.title.text = this.chartTitle;
    this.showType = this.filterPanel.controls.showType.value;
    var filterData = {
      "dateRequestedFrom": this.datePipe.transform(dateRequestedFrom, "yyyy-MM-dd"),
      "dateRequestedTo": this.datePipe.transform(dateRequestedTo, "yyyy-MM-dd"),
      "blId": blId,
      "siteId": siteId,
      "groupBy": groupBy,
      "showRequestType": this.showType
    };

    this.reportsServ.getReportsByFilter(filterData).subscribe((res: any) => {
      if (res.length > 0) {
        this.reportData = res;
        this.displayGridLabel = this.reportData && this.reportData[0].lable;
        this.setChartData();
      } else {
        const label = this.groupByData.filter((each: any) => each.value === this.filterPanel.controls.groupBy.value);
        this.displayGridLabel = label[0].lable;
        this.reportData = []
        this.setChartData()
      }
    })
  }

  onClickCount(data: any) {
    const dateRequestedFrom = this.filterPanel.controls.dateRequestedFrom.value;
    const dateRequestedTo = this.filterPanel.controls.dateRequestedTo.value;
    this.requestData = [];
    this.filterData = {
      ...this.filterData,
      siteId: this.filterPanel.controls.siteId.value,
      blId: this.filterPanel.controls.blId.value,
      dateRequestedFrom: this.datePipe.transform(dateRequestedFrom, "yyyy-MM-dd"),
      dateRequestedTo: this.datePipe.transform(dateRequestedTo, "yyyy-MM-dd"),
      showRequestType: this.showType
    }
    if (data.lable === "Problem Type") {
      this.filterData = {
        ...this.filterData,
        flId: null,
        rmId: null,
        eqId: null,
        wrId: null,
        requestedFor: null,
        status: null,
        technicianId: null,
        teamId: null,
        problemTypeId: data.probType,
        showRequestType: this.showType
      }
      this.loadRequestData(this.filterData);
    } else if (data.lable === "Status") {
      this.filterData = {
        ...this.filterData,
        flId: null,
        rmId: null,
        eqId: null,
        wrId: null,
        requestedFor: null,
        status: data.status,
        technicianId: null,
        teamId: null,
        problemTypeId: null,
        showRequestType: this.showType
      }
      this.loadRequestData(this.filterData);
    }
    else if (data.lable === "Site") {
      this.filterData = {
        ...this.filterData,
        flId: null,
        rmId: null,
        eqId: null,
        wrId: null,
        requestedFor: null,
        status: null,
        problemTypeId: null,
        blId: null,
        technicianId: null,
        teamId: null,
        siteId: data.site,
        showRequestType: this.showType
      }
      this.loadRequestData(this.filterData);
    } else if (data.lable === "Building") {
      this.filterData = {
        ...this.filterData,
        flId: null,
        rmId: null,
        eqId: null,
        wrId: null,
        requestedFor: null,
        status: null,
        problemTypeId: null,
        siteId: null,
        technicianId: null,
        teamId: null,
        blId: data.bl,
        showRequestType: this.showType
      }
      this.loadRequestData(this.filterData);
    } else if (data.lable === "Employee") {
      this.filterData = {
        ...this.filterData,
        flId: null,
        rmId: null,
        eqId: null,
        wrId: null,
        status: null,
        problemTypeId: null,
        siteId: null,
        blId: null,
        technicianId: null,
        teamId: null,
        requestedFor: data.emId,
        showRequestType: this.showType
      }
      this.loadRequestData(this.filterData);
    } else if (data.lable === "Asset") {
      this.filterData = {
        ...this.filterData,
        flId: null,
        rmId: null,
        wrId: null,
        requestedFor: null,
        status: null,
        problemTypeId: null,
        siteId: null,
        blId: null,
        technicianId: null,
        teamId: null,
        eqId: data.eq,
        showRequestType: this.showType
      }
      this.loadRequestData(this.filterData);
    } else if (data.lable === "Technician") {
      this.filterData = {
        ...this.filterData,
        flId: null,
        rmId: null,
        eqId: null,
        wrId: null,
        requestedFor: null,
        status: null,
        problemTypeId: null,
        siteId: null,
        blId: null,
        teamId: null,
        techncianId: data.cfId,
        showRequestType: this.showType
      }
      this.loadRequestTechncianOrTeamReport(this.filterData);
    } else if (data.lable === "Team") {
      this.filterData = {
        ...this.filterData,
        flId: null,
        rmId: null,
        eqId: null,
        wrId: null,
        requestedFor: null,
        status: null,
        problemTypeId: null,
        siteId: null,
        blId: null,
        techncianId: null,
        teamId: data.team,
        showRequestType: this.showType
      }
      this.loadRequestTechncianOrTeamReport(this.filterData);
    }
  }

  loadRequestData(filterData: any) {
    this.wrServ.getAllWrByFilter(filterData).subscribe((res: any) => {
      if (res.length > 0) {
        this.requestData = res.map((each: any) => {
          return {
            ...each,
            formatedDateRequested: this.datePipe.transform(each.dateRequested, 'dd MMM yyyy'),
            formatedRequestedFor: this.getEmployeeFullName(each.requestedFor)
          }
        })
        this.showPopUpGrid = true;
      } else {
        this.requestData = [];
      }
    })
  }

  loadRequestTechncianOrTeamReport(data: any) {
    this.summeryReportServ.getRequestTechncianOrTeamReport(data).subscribe((res: any) => {
      if (res.length > 0) {
        this.requestData = res;
        this.showPopUpGrid = true;
      } else {
        this.requestData = [];
      }
    })
  }

  onClickBarChart(event: any) {
    const index = event.element.index;
    const data = this.reportData[index];
    this.onClickCount(data);
  }

  changeGroupBy(event: any) {
    this.chartTitle = event.lable;
  }

  exportChartToPDF() {
    const htmlRef = this.chartContainer.nativeElement.querySelector('canvas');
    html2canvas(htmlRef).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');
      this.chartImg = [];
      this.chartImg.push(imgData);
      this.printPDF();
    });
  }

  printPDF() {
    var reportDetails: any = {

      chartImg: this.chartImg,
      title: 'Requests By ' + this.chartTitle,
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

  onClear() {
    // this.enumBL = [...this.enumAllBl];
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.selectedBl = {};
    this.selectedSite = {};
    this.filterPanel.patchValue({
      groupBy: this.groupByData[0].value,
      displayType: this.displayTypeData[1].value,
      dateRequestedFrom: null,
      dateRequestedTo: null,
      blId: null,
      siteId: null,
      showType: this.showType
    })
    this.isGridType = false;
  }

  getEmployeeFullName(id: any) {
    if (this.allEmployees) {
      this.enumEm = this.allEmployees.filter(em => em.emId === id);
      this.fullName = this.enumEm.map(em => {
        if (em.firstName.length > 0 && em.lastName.length > 0) {
          return em.firstName + " " + em.lastName + ' - ' + em.emCode;
        } else {
          return em.firstName + ' - ' + em.emCode;
        }
      })
    }
    return this.fullName[0];
  }

  scrollToEndSite() {
    this.offsetSite = this.limitSite;
    this.limitSite += this.scrollLimit;
    this.filterCriteria.limit = this.limitSite;
    this.filterCriteria.offset = this.offsetSite;
    this.siteServ.getAllSiteByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumAllSites = res;
      this.updateSiteList(this.selectedSite);
    })
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blSrv.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  searchSite(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "siteName", value: event.term, matchMode: "contains" };
    this.scrollToEndSite();
  }

  searchBl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
    this.scrollToEndBl();
  }

  updateSiteList(siteData: any) {
    if (siteData.siteId) {
      this.enumAllSites = this.enumAllSites.filter(t => t.siteId !== siteData.siteId);
      this.enumAllSites = this.enumAllSites.filter(t => t.siteId !== null);
      this.enumAllSites.unshift(siteData);

    }
    this.enumAllSites.unshift(new SiteFilterInputDTO(null, 'Make a selection'));
  }

  updateBlList(blData: any) {
    if(blData.blId) {
      this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
    }
   
    this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
  }

  onOpenSite() {
    this.limitSite = 0;
    this.offsetSite = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndSite();
  }

  onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    if (this.selectedSite.siteId) {
      this.filterCriteria = { fieldName: "site.siteId", value: this.selectedSite.siteId, matchMode: "equals", limit: 0, offset: 0 }
    } else {
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
    }

    this.scrollToEndBl();
  }

}