import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BuildingFilterInput } from 'src/app/ui/background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/flFilterInput.model';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { AddWorkRequestService } from '../../../work-request/service/add-work-request.services';
import { BookingService } from 'src/app/ui/booking/services/booking.services';
import html2canvas from 'html2canvas';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';

@Component({
  selector: 'app-sla-escalated-summary-reports',
  templateUrl: './sla-escalated-summary-reports.component.html',
  styleUrls: ['./sla-escalated-summary-reports.component.scss'],
  providers: [MessageService]
})
export class SlaEscalatedSummaryReportsComponent implements OnInit {

  filterPanel!: UntypedFormGroup;
  allSitesData: any[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumAllBl: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumRM: BuildingFilterInput[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  data: any;
  options: any;
  compId: number = 1;
  chartType: String = 'pie';
  allRequestList: any[] = [];
  esctdResponseData: any[] = [];
  esctdCompleteData: any[] = [];
  esctdCompleteAndResponseData: any[] = [];
  noEsctdData: any[] = [];
  displayData: any[] = [];
  labels: any[] = ['Escalated For Response', 'Escalated For Complete', 'Escalated For Response and Complete', 'Not Escalated'];
  isShowDialog: boolean = false;
  isShowGrid: boolean = false;
  //isShowCharts: boolean = false;
  esctdGridData: any[] = [];
  chartData: any[] = [];
  chartImg: any[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumWr: Enums[] = [];
  enumStatus: Enums[] = [];
  title: any;
  viewForEscalation: boolean = true;
  displayTypeData: any = [
    { "id": 1, "lable": 'Pie Chart', "value": "pie" },
    { "id": 2, "lable": 'Bar Chart', "value": "bar" },
    // { "id": 2, "lable": 'Doughnut', "value": "doughnut" },
    { "id": 4, "lable": 'Grid', "value": "grid" },
  ]
  pieChartData: any[] = [];
  dynamicColors: any[] = [];
  customScheme = {
    domain: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'] // define your custom colors here
  };
  showRequestsTypeList:any[] = [{label:"Preventive Maintenance",value:"ppm"},
                                {label:"Facilities Helpdesk",value:"facilities"},
                                {label:"All",value:"all"}]
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input()showType:string = "facilities";
  useTabletProtrait = false;
  useTabletLandscape = false;
  pieChartView:any[]=[1000, 500];
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedBl: any = {};
  selectedFl: any = {};
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private messageService: MessageService,
    private blService: BuildingService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private wrServ: AddWorkRequestService,
    private bookingSrv: BookingService,
    private enumsrv: EnumService,
    private bps : BreakpointService
  ) {

    this.filterPanel = this.formBuilder.group({
      siteId: [null],
      blId: [null],
      flId: [null],
      dateRequestedFrom: [null],
      dateRequestedTo: [null],
      chartType: ['bar'],
      showType : [this.showType]
    });
  }

  ngOnInit() {
    this.bps.register(this);
    this.viewForEscalation = true;
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.loadEnums();
    setTimeout(() => {
      this.filterPanel.patchValue({
        dateRequestedFrom: firstDay,
        dateRequestedTo: lastDay,
        showType: this.showType
      });
      this.onSearch();
    });
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.useTabletLandscape = BreakpointService.useTabletLandscape;
    this.updatePieChartView();
  }

  onSearch() {
    const filterData = {
      dateRequestedFrom: this.datePipe.transform(this.filterPanel.controls.dateRequestedFrom.value, "yyyy-MM-dd"),
      dateRequestedTo: this.datePipe.transform(this.filterPanel.controls.dateRequestedTo.value, "yyyy-MM-dd"),
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      showRequestType:this.filterPanel.controls.showType.value,
    }
    this.loadRecords(filterData);
    this.chartType = this.filterPanel.controls.chartType.value;
    this.updatePieChartView();
  }

  loadRecords(filterData: any) {
    this.allRequestList = [];
    this.esctdResponseData = [];
    this.esctdCompleteData = [];
    this.esctdCompleteAndResponseData = [];
    this.noEsctdData = [];
    this.wrServ.getAllWrByFilter(filterData).subscribe((res: any) => {
      this.allRequestList = res.map((each: any) => {
        return {
          ...each,
          formatedDateRequested: this.datePipe.transform(each.dateRequested, 'dd MMM yyyy'),
          fromatedDateToRespond: each.escDateResponded ? this.datePipe.transform(each.escDateResponded, 'dd MMM yyyy') + " " + this.convertToDisplayTime(each.escTimeResponded) : '',
          formatedDateResponded: each.dateResponded ? this.datePipe.transform(each.dateResponded, 'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.timeResponded) : '',
          formatedDateToComplete: each.escDateCompleted ? this.datePipe.transform(each.escDateCompleted, 'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.escTimeCompleted) : '',
          formatedDateCompleted: each.dateCompleted ? this.datePipe.transform(each.dateCompleted, 'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.timeCompleted) : '',
        }
      });
      const currentDate = new Date(); // Assuming the current date is obtained correctly
      this.allRequestList.forEach((item) => {
        const { dateResponded, escDateResponded, dateCompleted, escDateCompleted, timeResponded, timeCompleted, escTimeResponded, escTimeCompleted, status } = item;

        const isEscalatedForResponse =
          (dateResponded && new Date(dateResponded + 'T' + timeResponded).getTime() > new Date(escDateResponded + 'T' + escTimeResponded).getTime()) ||
          (!dateResponded && currentDate.getTime() > new Date(escDateResponded + 'T' + escTimeResponded).getTime());

        const isEscalatedForComplete =
          (dateCompleted && new Date(dateCompleted + 'T' + timeCompleted).getTime() > new Date(escDateCompleted + 'T' + escTimeCompleted).getTime()) ||
          (!dateCompleted && currentDate.getTime() > new Date(escDateCompleted + 'T' + escTimeCompleted).getTime());

        const statusEnum = this.getEnumById(status);

        if (isEscalatedForResponse && !isEscalatedForComplete && statusEnum !== "Cancelled") {
          this.esctdResponseData.push(item);
        }

        if (isEscalatedForComplete && !isEscalatedForResponse && statusEnum !== "Cancelled" && statusEnum !== "Rejected") {
          this.esctdCompleteData.push(item);
        }

        if (isEscalatedForResponse && isEscalatedForComplete && statusEnum !== "Cancelled") {
          this.esctdCompleteAndResponseData.push(item);
        }

        if (!isEscalatedForResponse && !isEscalatedForComplete) {
          this.noEsctdData.push(item);
        }
      });
      this.chartData = [];
      this.chartData = [this.esctdResponseData.length, this.esctdCompleteData.length, this.esctdCompleteAndResponseData.length, this.noEsctdData.length];
      this.setChartData(this.chartData);
      this.setPieChartData(this.chartData);
      this.setGridData();
    })

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

  setChartData(data: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.dynamicColors = [];
    for (let i = 0; i < this.labels.length; i++) {
      let color = '';
      do {
        color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      } while (color === 'rgba(255, 255, 255, 1)' || this.isWhiteColorShade(color)) { // Regenerate color if it is white
        color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      };
      this.dynamicColors.push(color);
    }
    this.customScheme = { domain: [...this.dynamicColors] }
    this.data = {
      labels: this.labels,
      datasets: [
        {
          label: 'Requests',
          data: data,
          backgroundColor: this.dynamicColors,
          borderColor: this.dynamicColors,
          borderWidth: 1
        },

      ]
    };

    if (this.chartType === 'bar') {
      this.setBarChartOptions();
    } else {
      this.options = {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            generateLabels: (chart: any) => {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label: any, i: number) => {
                  const dataset = data.datasets[0];
                  const meta = chart.getDatasetMeta(0);
                  const style = meta.controller.getStyle(i);

                  const count = dataset.data[i];

                  return {
                    text: `${label}: ${count}`,
                    fillStyle: style.backgroundColor,
                    hidden: isNaN(count) || meta.data[i].hidden,
                    index: i
                  };
                });
              }
              return [];
            }
          },
         
        },
        elements: {
          arc: {
            borderWidth: 1,
            borderColor: '#fff'
          }
        }
      };


    }
  }

  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        flId: null,
      });
    }, 0);
    if ($event.blId != null && $event.blId != '') {
      this.selectedBl = $event;
      this.selectedFl = {};
    } else {
      this.selectedBl = {};
      this.selectedFl = {};
    }
  }

  onSelectFlCode($event: any) {
    if ($event.flId != null && $event.flId != '') {
      this.selectedFl = $event;
      const blData: any = {
        blId: $event.blId,
        blNameString: $event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
        });
      }, 10);
    }
  }

  onClear() {
    this.selectedBl = {};
    this.selectedFl = {};
    this.isShowGrid = false;
    this.filterPanel.patchValue({
      siteId: null,
      blId: null,
      flId: null,
      dateRequestedFrom: null,
      dateRequestedTo: null,
      chartType: this.displayTypeData[0].value,
      showType: this.showType
    });
  }

  onClick(event: any) {
    this.isShowDialog = false;
    this.displayData = [];
    let index = event.element ? event.element.index : null;
    let label = index >= 0 ? this.labels[index] : event.name;
    if (label === 'Escalated For Response') {
      this.displayData = this.esctdResponseData;
    } else if (label === 'Escalated For Complete') {
      this.displayData = this.esctdCompleteData;
    } else if (label === 'Not Escalated') {
      this.displayData = this.noEsctdData;
    } else {
      this.displayData = this.esctdCompleteAndResponseData;
    }
    this.isShowDialog = true;
  }

  onSelectDisplayType(event: any) {
    this.setChartData(this.chartData);
    this.isShowGrid = false;
    this.chartType = event.value;
    if (this.chartType === 'pie' || this.chartType === 'doughnut') {
      this.setOtherChartOptions();
    } else if (this.chartType === 'bar') {
      this.setBarChartOptions();
    } else {
      this.setGridData();
      this.isShowGrid = true;
    }
    this.updatePieChartView();
  }

  updatePieChartView(){
    if (this.chartType === 'pie' || this.chartType === 'doughnut') {
      if(this.useTabletProtrait){
        this.pieChartView=[300,250];
      }else if(this.useTabletLandscape){
        this.pieChartView=[750,400];
      }else{
        this.pieChartView=[1000,500];
      }
    } 
  }

  setGridData() {
    this.esctdGridData = [{ label: 'Escalated For Response', reqCount: this.esctdResponseData.length }
      , { label: 'Escalated For Complete', reqCount: this.esctdCompleteData.length },
    { label: 'Escalated For Response and Complete', reqCount: this.esctdCompleteAndResponseData.length },
    { label: 'Not Escalated', reqCount: this.noEsctdData.length }]
  }

  onRowSelect(label: any) {
    this.isShowDialog = false;
    if (label === 'Escalated For Response') {
      this.displayData = this.esctdResponseData;
    } else if (label === 'Escalated For Complete') {
      this.displayData = this.esctdCompleteData;
    } else if (label === 'Not Escalated') {
      this.displayData = this.noEsctdData;
    } else {
      this.displayData = this.esctdCompleteAndResponseData;
    }
    this.isShowDialog = true;
  }

  exportChartToPDF() {
    const htmlRef :HTMLElement= this.chartContainer.nativeElement;
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
      title: 'SLA Escalated Summary Reports',
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

  setBarChartOptions() {
    this.options = {
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
            text: 'Escalated Type',
            fontStyle: 'bold',
          },
          grid: {
            display: false,
            drawOnChartArea: false
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
          },
          grid: {
            display: false,
            drawOnChartArea: false
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
      plugins:{
        legend:{
          display:false
        }
      }
    };

  }

  setOtherChartOptions() {
    this.options.scales = {};
    this.options.legend = {
      position: 'right',
      labels: {
        generateLabels: (chart: any) => {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label: any, i: number) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);

              return {
                text: `${label}: ${data.datasets[0].data[i]}`,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                index: i
              };
            });
          }
          return [];
        }
      }
    }
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t =>  t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());

      }
    );
  }

  getEnumById(id: any) {
    return this.enumStatus.find((t: any) => t.id === id)?.enumValue;
  };

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }

  setPieChartData(chartData: any[]) {
    this.pieChartData = [];
    this.pieChartData.push({label: this.labels[0], name: this.labels[0] + " " + chartData[0], value: chartData[0] });
    this.pieChartData.push({label: this.labels[1], name: this.labels[1] + " " + chartData[1], value: chartData[1] });
    this.pieChartData.push({label: this.labels[2], name: this.labels[2] + " " + chartData[2], value: chartData[2] });
    this.pieChartData.push({label: this.labels[3], name: this.labels[3] + " " + chartData[3], value: chartData[3] });
  }

  selectChartData(event: any) {
    const isChartSelected = event.hasOwnProperty('name');
    // Stop event propagation if the legend is selected
    if (!isChartSelected) {
      // event.preventDefault();
      // event.stopPropagation();
      return
    } else {
      this.isShowDialog = false;
      this.displayData = [];
      let label = event.name;
      if (label === `${this.labels[0]} ${this.chartData[0]}`) {
        this.displayData = this.esctdResponseData;
      } else if (label === `${this.labels[1]} ${this.chartData[1]}`) {
        this.displayData = this.esctdCompleteData;
      } else if (label === `${this.labels[2]} ${this.chartData[2]}`) {
        this.displayData = this.esctdCompleteAndResponseData;
      } else if (label === `${this.labels[3]} ${this.chartData[3]}`) {
        this.displayData = this.noEsctdData;
      }
      this.isShowDialog = true;
    }
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blService.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blService.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumFL = res;
      this.updateFlList(this.selectedFl);
    })
  }

  searchBl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
    this.scrollToEndBl();
  }

  searchFl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "flName", value: event.term, matchMode: "contains" };
    this.scrollToEndFl();
  }

  updateBlList(blData: any) {
    if (blData.blId) {
      this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
    }
    this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
  }

  updateFlList(flData: any) {
    if (flData.flId) {
      this.enumFL = this.enumFL.filter(t => t.flId !== flData.flId);
      this.enumFL = this.enumFL.filter(t => t.flId !== null);
      this.enumFL.unshift(flData);
    }
    this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection', null));
  }

  onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndBl();
  }

  onOpenFl() {
    this.limitFl = 0;
    this.offsetFl = 0;
    if (this.selectedBl.blId) {
      this.filterCriteria = { fieldName: "bl.blId", value: this.selectedBl.blId, matchMode: "equals", limit: 0, offset: 0 }
    } else {
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
    }
    this.scrollToEndFl();
  }

}