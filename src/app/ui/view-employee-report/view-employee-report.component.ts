import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilConstant } from 'src/common/UtilConstant';
import { EmployeeService } from '../employee/services/employee.service';
import html2canvas from 'html2canvas';
import { BookingService } from '../booking/services/booking.services';
import { MessageService } from 'primeng/api';
import { ReportBarChartModel } from './model/report-bar-chart.model';
import { BuildingService } from '../background-loc/services/bl.service';
import * as FileSaver from 'file-saver';
import { SpaceReportFilterModel } from 'src/app/model/space-report-filter.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';
import { BuildingFilterInputDTO } from '../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../background-loc/model/DTO/FloorFilterInputDTO.model';

@Component({
  selector: 'app-view-employee-report',
  templateUrl: './view-employee-report.component.html',
  styleUrls: ['./view-employee-report.component.scss'],
  providers: [MessageService]
})
export class ViewEmployeeReportComponent {
  filterPanel!: UntypedFormGroup;
  rowCount: number = UtilConstant.ROW_COUNT;
  displayGridLabel: any;
  isGridType: boolean = false;
  showPopUpGrid: boolean = false;
  chartTitle: string = 'Building';
  reportData: any[] = [];
  gridReportData: any[] = [];
  chartReportData: any[] = [];
  employeeData: any[] = [];
  legendItems: any[] = [];
  chartImg: any[] = [];
  view: any[] = [1010, 530];
  showXAxis: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  barchartData: ReportBarChartModel[] = [];
  customColor: any;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showYAxisLabel = true;
  yAxisLabel = 'Number of Employees';
  showGridLines: boolean = false;
  showSecondParam: boolean = false;
  secondParamName: string = '';
  showThirdParam: boolean = false;
  thirdParamName: string = '';
  enumBL: any[] = [];
  enumFL: any[] = [];
  enumAllFL: any[] = [];
  grid_array: any[] = [];
  viewByData: any[] = [
    {
      "id": 0,
      "lable": 'Building',
      "value": "bl_id"
    },
    {
      "id": 1,
      "lable": 'Floor',
      "value": "fl_id"
    },
    {
      "id": 2,
      "lable": 'Division',
      "value": "div_id"
    },
    {
      "id": 3,
      "lable": 'Department',
      "value": "dep_id"
    },
    {
      "id": 4,
      "lable": 'Sub Department',
      "value": "sub_dep_id"
    },
    {
      "id": 5,
      "lable": 'Team',
      "value": "team_id"
    },

  ];

  displayTypeData: any = [
    {
      "id": 0,
      "lable": 'Bar Chart',
      "value": "bar_chart"
    },
    {
      "id": 1,
      "lable": 'Grid',
      "value": "grid"
    }
  ]
  useTabletProtrait = false;
  paginationObj: PaginationObj = {
    pageNo: 0,
    pageSize: this.rowCount,
    sortBy: [],
    sortOrder: "ASC"
  }
  totalElements: number = 0;
  pagfilterCriteriaList: any[] = [];
  isFiltered: boolean = false;

  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedBl: any = {};
  selectedFl: any = {};
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private emService: EmployeeService,
    private bookingSrv: BookingService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private blServ: BuildingService,
    private bps: BreakpointService
  ) {

    this.filterPanel = this.formBuilder.group({
      viewBy: [null, [Validators.required]],
      displayType: [null],
      blId: [null],
      flId: [null],
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.chartTitle = this.viewByData[0].lable;
    this.xAxisLabel = this.viewByData[0].lable;
    this.filterPanel.patchValue({
      viewBy: this.viewByData[0].value,
      displayType: this.displayTypeData[1].value
    })
    this.isGridType = true;
    this.loadRecords();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }

  loadRecords() {
    this.filterCriteria = {};
    let viewBy = this.filterPanel.controls.viewBy.value;
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    let data = {
      viewBy: viewBy,
      blId: blId,
      flId: flId
    }
    let displayType = this.filterPanel.controls.displayType.value;
    this.xAxisLabel = this.chartTitle;
    if (displayType == 'bar_chart') {
      this.emService.getReportsByFilter(data).subscribe((res: any) => {
        if (res) {
          this.chartReportData = res;
          this.displayGridLabel = this.getViewByLable(viewBy);
          this.setChartData();
        }
      })
    } else {
      this.getReportGridData();
    }
  }

  getReportGridData() {
    let data = {
      viewBy: this.filterPanel.controls.viewBy.value,
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      filterDto: { paginationDTO: this.paginationObj, filterCriteria: this.pagfilterCriteriaList }
    }
    this.isFiltered = false;
    this.emService.getReportsByFilterPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered = false;
        let content = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
        this.reportData = content.map((each: any) => ({ ...each }));
        this.displayGridLabel = this.getViewByLable(this.filterPanel.controls.viewBy.value);
        this.updateGridData(this.chartTitle);
      }
    })
  }

  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        flId: null,
      });
    }, 10);
    if ($event.blId != null) {
      this.selectedBl = $event;
      this.selectedFl = {};
    }
    else {
      this.selectedBl = {};
      this.selectedFl = {};
    }
  }

  onSelectFlCode(event: any) {
    if (event.flId != null) {
      const blData: any = {
        blId: event.blId,
        blNameString: event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
        });
      }, 10);
    }
    else {

    }
  }

  setChartData() {
    this.barchartData = [];
    const barChartData: any[] = [];
    this.generateColors();
    Object.values(this.chartReportData).forEach((each: any, index: number) => {
      if (each.value > 0) {
        let dataobj = {
          name: each.name,
          value: each.value
        }
        barChartData.push(dataobj);
      }
    })
    if (barChartData.length < 5) {
      let empty = '  ';
      for (let i = 0; i < 5 - barChartData.length; i++) {
        barChartData.push({
          name: empty.repeat(i + 1),
          value: 0
        })
      }
    }
    this.barchartData = barChartData;
    this.legendItems = this.barchartData.filter((item: any) => item.value > 0);
    this.cdr.detectChanges();
  }

  generateColors() {
    const dynamicColors: any[] = [];
    Object.values(this.chartReportData).forEach((each: any, index: number) => {
      if (each.value > 0) {
        let color = '';
        do {
          color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        } while (color === 'rgba(255, 255, 255, 1)' || this.isWhiteColorShade(color)) {
          color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        };
        dynamicColors.push(color);
      }
    });
    this.customColor = {
      domain: [...dynamicColors]
    }
  }

  isWhiteColorShade(color: any) {
    const rgbValues = color.match(/\d+/g);
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);
    const threshold = 50;
    const average = (r + g + b) / 3;
    return average > threshold;
  }

  onSelectBarChart(event: any) {
    this.onClickCount(event);
  }

  onClickFilter() {
    this.loadRecords();
  }

  onClear() {
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.chartTitle = this.viewByData[0].lable;
    this.filterPanel.patchValue({
      viewBy: this.viewByData[0].value,
      displayType: this.displayTypeData[1].value,
      blId: null,
      flId: null
    })
    this.isGridType = true;
    this.showSecondParam = false;
    this.showThirdParam = false;
    this.gridReportData = [];
    this.chartReportData = [];
    this.barchartData = [];
    this.reportData = [];
    this.employeeData = [];
    this.legendItems = [];
    this.chartImg = [];
    this.loadRecords();
    this.selectedBl = {};
    this.selectedFl = {};
  }

  exportChartToPDF() {
    const divElement: HTMLElement = this.chartContainer.nativeElement;
    html2canvas(divElement).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');
      this.chartImg = [];
      this.chartImg.push(imgData);
      this.printPDF();
    });
  }

  printPDF() {
    this.messageService.clear();
    var reportDetails: any = {
      chartImg: this.chartImg,
      title: 'Employees By ' + this.chartTitle,
    }
    this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'reportEmployee', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
        var file = new Blob([res], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
  }

  changeViewBy(event: any) {
    this.chartTitle = event.lable;
  }

  onSelectDisplayType(event: any) {
    if (event.value === 'grid') {
      this.isGridType = true;
      this.loadRecords();
    } else {
      this.isGridType = false;
      this.loadRecords();
    }
  }

  updateGridData(grid: string) {
    this.gridReportData = [];
    if (grid == 'Building' || grid == 'Division' || grid == 'Team') {
      this.showSecondParam = false;
      this.showThirdParam = false;
      this.gridReportData = this.reportData.map((each: any) => ({ ...each, firstParamValue: each.name }));
    } else if (grid == 'Floor') {
      this.showSecondParam = true;
      this.showThirdParam = false;
      this.secondParamName = 'Building';
      this.gridReportData = this.reportData.map((each: any) => (
        { firstParamValue: each.flCode, secondParamValue: each.blCode, ...each }
      ))
    } else if (grid == 'Department') {
      this.showSecondParam = true;
      this.showThirdParam = false;
      this.secondParamName = 'Division';
      this.gridReportData = this.reportData.map((each: any) => (
        { firstParamValue: each.depCode, secondParamValue: each.divCode, ...each }
      ))
    } else if (grid == 'Sub Department') {
      this.showSecondParam = true;
      this.showThirdParam = true;
      this.secondParamName = 'Department';
      this.thirdParamName = 'Division';
      this.gridReportData = this.reportData.map((each: any) => (
        { firstParamValue: each.subDepCode, secondParamValue: each.depCode, thirdParamValue: each.divCode, ...each }
      ))
    }
  }

  onClickCount(data: any) {
    this.employeeData = [];
    let filterdata = new SpaceReportFilterModel(null, null, null, null, null, null, null, null, null, null);
    if (this.chartTitle == "Building") {
      if (typeof data === "string") {
        filterdata.blId = this.getBlId(data);
      } else if (typeof data === "object" && data !== null) {
        if (!this.isGridType) {
          filterdata.blId = this.getBlId(data.name);
        } else {
          filterdata.blId = data.blId;
        }
      }
    }
    else if (this.chartTitle == "Floor") {
      if (typeof data === "string") {
        let parts = data.split(/-(.+)/);
        let searchResultObj = this.getFlAndBlId(parts[0], parts[1]);
        filterdata.blId = searchResultObj.blId;
        filterdata.flId = searchResultObj.flId;
      } else if (typeof data === "object" && data !== null) {
        if (!this.isGridType) {
          let parts = data.name.split(/-(.+)/);
          let searchResultObj = this.getFlAndBlId(parts[0], parts[1]);
          filterdata.blId = searchResultObj.blId;
          filterdata.flId = searchResultObj.flId;
        } else {
          filterdata.blId = data.blId;
          filterdata.flId = data.flId;
        }
      }
    }
    else if (this.chartTitle == "Division") {
      if (typeof data === "string") {
        filterdata.divId = this.getDivId(data);
      } else if (typeof data === "object" && data !== null) {
        if (!this.isGridType) {
          filterdata.divId = this.getDivId(data.name);
        } else {
          filterdata.divId = data.divId;
        }
      }
    }
    else if (this.chartTitle == "Department") {
      if (typeof data === "string") {
        let parts = data.split(/-(.+)/);
        let searchResultObj = this.getDivAndDepId(parts[0], parts[1]);
        filterdata.divId = searchResultObj.divId;
        filterdata.depId = searchResultObj.depId;
      } else if (typeof data === "object" && data !== null) {
        if (!this.isGridType) {
          let parts = data.name.split(/-(.+)/);
          let searchResultObj = this.getDivAndDepId(parts[0], parts[1]);
          filterdata.divId = searchResultObj.divId;
          filterdata.depId = searchResultObj.depId;
        } else {
          filterdata.divId = data.divId;
          filterdata.depId = data.depId;
        }
      }
    }
    else if (this.chartTitle == "Team") {
      if (typeof data === "string") {
        filterdata.teamId = this.getTeamId(data);
      } else if (typeof data === "object" && data !== null) {
        if (!this.isGridType) {
          filterdata.teamId = this.getTeamId(data.name);
        } else {
          filterdata.teamId = data.teamId;
        }
      }
    }
    else if (this.chartTitle == "Sub Department") {
      if (typeof data === "string") {
        let parts = data.split('-');
        filterdata.subDepId = this.getSubDepartmentId(parts[0], parts[1], parts[2]);
      } else if (typeof data === "object" && data !== null) {
        if (!this.isGridType) {
          let parts = data.name.split('-');
          let result = this.getSubDepartmentId(parts[0], parts[1], parts[2]);
          filterdata.subDepId = result;
        } else {
          filterdata.subDepId = data.subDepId;
        }
      }
    }
    if (!!this.filterPanel.controls.blId.value) {
      filterdata.blId = this.filterPanel.controls.blId.value;
    }
    if (!!this.filterPanel.controls.flId.value) {
      filterdata.flId = this.filterPanel.controls.flId.value;
    }
    this.emService.getEmployeeByFilter(filterdata).subscribe((res: any) => {
      this.employeeData = res;
      this.showPopUpGrid = true;
    })
  }

  formatYAxisTickLabel(value: number): string {
    if (value % 1 === 0) {
      return value.toLocaleString();
    } else {
      return '';
    }
  }

  exportExcel() {
    this.getDestructuredData(this.gridReportData);
    var excelHeaders: string[] = [];
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.grid_array);
      if (this.showSecondParam) {
        worksheet['!cols'] = [
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
        ];
        excelHeaders = [this.secondParamName, this.displayGridLabel, "Number of Employees"]
      } else if (this.showThirdParam) {
        worksheet['!cols'] = [
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
        ];
        excelHeaders = [this.thirdParamName, this.secondParamName, this.displayGridLabel, "Number of Rooms"]
      } else {
        worksheet['!cols'] = [
          { wch: 20 },
          { wch: 20 },
        ];
        excelHeaders = [this.displayGridLabel, "Number of Employees"]
      }
      const headers = excelHeaders.map((header, index) => ({ v: header, position: String.fromCharCode(65 + index) + 1 }));
      headers.forEach(header => {
        worksheet[header.position] = { v: header.v };
      });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "employee");
    });
  }

  getDestructuredData(data: any) {
    this.grid_array = data.map((item: any) => {
      if (this.showSecondParam) {
        return {
          [this.secondParamName]: item['secondParamValue'],
          [this.displayGridLabel]: item['firstParamValue'],
          "Number of Employees": item['value'],
        }
      } else if (this.showThirdParam) {
        return {
          [this.thirdParamName]: item['thirdParamValue'],
          [this.secondParamName]: item['secondParamValue'],
          [this.displayGridLabel]: item['firstParamValue'],
          "Number of Rooms": item['value'],
        }
      } else {
        return {
          [this.displayGridLabel]: item['firstParamValue'],
          "Number of Employees": item['value'],
        }
      }
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  onLegendItemClick(item: any) {
    this.employeeData = [];
    let filterdata = new SpaceReportFilterModel(null, null, null, null, null, null, null, null, null, null);
    let parts = item.name.split(/-(.+)/);
    if (this.chartTitle == "Building") {
      filterdata.blId = this.getBlId(parts[0]);
    }
    else if (this.chartTitle == "Floor") {
      let searchResultObj = this.getFlAndBlId(parts[0], parts[1]);
      filterdata.blId = searchResultObj.blId;
      filterdata.flId = searchResultObj.flId;
    }
    else if (this.chartTitle == "Division") {
      filterdata.divId = this.getDivId(parts[0]);
    }
    else if (this.chartTitle == "Department") {
      let searchResultObj = this.getDivAndDepId(parts[0], parts[1]);
      filterdata.divId = searchResultObj.divId;
      filterdata.depId = searchResultObj.depId;
    }
    else if (this.chartTitle == "Team") {
      filterdata.teamId = this.getTeamId(parts[0]);
    }
    else if (this.chartTitle == "Sub Department") {
      let resParts = item.name.split('-');
      let searchResultObj = this.getSubDepartmentId(resParts[0], resParts[1], resParts[2]);
      filterdata.subDepId = searchResultObj;
    }
    if (!!this.filterPanel.controls.blId.value) {
      filterdata.blId = this.filterPanel.controls.blId.value;
    }
    if (!!this.filterPanel.controls.flId.value) {
      filterdata.flId = this.filterPanel.controls.flId.value;
    }
    this.emService.getEmployeeByFilter(filterdata).subscribe((res: any) => {
      this.employeeData = res;
      this.showPopUpGrid = true;
    })
  }

  getBlId(blCode: any) {
    return this.chartReportData.find((each: any) => each.blCode == blCode)?.blId;
  }
  getFlAndBlId(blCode: any, flCode: any) {
    let returnData = {
      blId: null, flId: null
    }
    returnData.blId = this.chartReportData.find(each => each.blCode == blCode)?.blId;
    if (flCode != null) {
      returnData.flId = this.chartReportData.find(each => each.blCode == blCode && each.flCode == flCode)?.flId;
    }
    return returnData;
  }
  getDivId(divCode: any) {
    return this.chartReportData.find((each: any) => each.divCode == divCode)?.divId;
  }
  getDivAndDepId(divCode: any, depCode: any) {
    let returnData = {
      divId: null, depId: null
    }
    returnData.divId = this.chartReportData.find(each => each.divCode == divCode)?.divId;
    if (depCode != null) {
      returnData.depId = this.chartReportData.find(each => each.divCode == divCode && each.depCode == depCode)?.depId;
    }
    return returnData;
  }

  getTeamId(teamCode: any) {
    return this.chartReportData.find((each: any) => each.teamCode == teamCode)?.teamId;
  }

  getSubDepartmentId(divCode: any, depCode: any, subDepCode: any) {
    return this.chartReportData.find((each: any) => each.divCode == divCode && each.depCode == depCode && each.subDepCode == subDepCode)?.subDepId;
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.getReportGridData();
  }

  onInnerFilter(event: any) {
    if (this.isFiltered) {

      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined) {
          let pagfilterCriteria = { fieldName: this.getPaginationFilterField(field), value: filterValue, matchMode: matchMode };
          this.updateFilterCriteriaList(pagfilterCriteria);
        }
      });
      this.paginationObj.pageSize = 0;
      setTimeout(() => {
        this.getReportGridData();
      }, 100);
    }
    this.isFiltered = true;
  }

  updateFilterCriteriaList(filterCriteria: any) {
    let index = this.pagfilterCriteriaList.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if (filterCriteria['value'] == null) {
      if (index !== -1) {
        this.pagfilterCriteriaList.splice(index, 1);
      }
    } else {
      if (index !== -1) {
        this.pagfilterCriteriaList[index] = filterCriteria;
      } else {
        this.pagfilterCriteriaList.push(filterCriteria);
      }
    }
  }


  getPaginationFilterField(field: String) {
    let fieldValue = "";
    if (this.chartTitle == "Building") {
      fieldValue = "bl_code";
    } else if (this.chartTitle == "Division") {
      fieldValue = "div_code";
    } else if (this.chartTitle == "Room Category") {
      fieldValue = "rm_cat";
    } else if (this.chartTitle == "Space Standard") {
      fieldValue = "space_standard";
    } else if (this.chartTitle == "Room Use") {
      fieldValue = "rm_use";
    } else if (this.chartTitle == "Floor") {
      if (field == "firstParamValue") {
        fieldValue = "fl_code";
      } else if (field == "secondParamValue") {
        fieldValue = "bl_code";
      }
    } else if (this.chartTitle == "Department") {
      if (field == "firstParamValue") {
        fieldValue = "dep_code";
      } else if (field == "secondParamValue") {
        fieldValue = "div_code";
      }
    } else if (this.chartTitle == "Room Type") {
      if (field == "firstParamValue") {
        fieldValue = "rm_type";
      } else if (field == "secondParamValue") {
        fieldValue = "rm_cat";
      }
    } else if (this.chartTitle == "Sub Department") {
      if (field == "firstParamValue") {
        fieldValue = "sub_dep_code";
      } else if (field == "secondParamValue") {
        fieldValue = "dep_code";
      } else if (field == "thirdParamValue") {
        fieldValue = "div_code";
      }
    }
    return fieldValue;
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blServ.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blServ.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
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
    }
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

  getViewByLable(value: any) {
    let data = this.viewByData.find(each => each.value == value);
    return data.lable
  }

}
