import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BuildingFilterInput } from 'src/app/ui/background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/flFilterInput.model';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { AddWorkRequestService } from '../../work-request/service/add-work-request.services';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { Router } from '@angular/router';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';

@Component({
  selector: 'app-sla-escalation-analysis',
  templateUrl: './sla-escalation-analysis.component.html',
  styleUrls: ['./sla-escalation-analysis.component.scss'],
  providers: [MessageService]
})
export class SlaEscalationAnalysisComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  enumBL: BuildingFilterInputDTO[] = [];
  enumAllBl: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  rm_data: any[] = [];
  compId: number = 1;
  allRequestList: any[] = [];
  allEmployees: any[] = []
  enumEm: any[] = [];
  fullName: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalRecords: number = 0;
  esctdResponseData: any[] = [];
  esctdCompleteData: any[] = [];
  esctdCompleteAndResponseData: any[] = [];
  selectedData: any[] = [];
  responseCheckbox: boolean = true;
  completeCheckbox: boolean = true;
  completeResponseCheckbox: boolean = true;
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumWr: Enums[] = [];
  enumStatus: Enums[] = [];
  showRequestsTypeList: any[] = [{ label: "Preventive Maintenance", value: "ppm" },
  { label: "Facilities Helpdesk", value: "facilities" },
  { label: "All", value: "all" }]
  @Input() showType: string = "facilities";
  useTabletProtrait = false;
  totalElements: number = 0;
  paginationObj: PaginationObj = {
    pageNo: 0,
    pageSize: this.rowCount,
    sortBy: [""],
    sortOrder: "ASC"
  }
  pagfilterCriteria: any = {};
  isFiltered: boolean = false;
  selectionFilterData: any = {};
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
  constructor(
    private blService: BuildingService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private wrServ: AddWorkRequestService,
    private employeeService: EmployeeService,
    private router: Router,
    private enumsrv: EnumService,
    private bps: BreakpointService
  ) {
    this.filterPanel = this.formBuilder.group({
      siteId: [null],
      blId: [null],
      flId: [null],
      dateRequestedFrom: [null],
      dateRequestedTo: [null],
      showType: [this.showType]
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.selectedData = [];
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
    this.loadAllEmployee();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }

  onSearch() {
    const filterData = {
      dateRequestedFrom: this.datePipe.transform(this.filterPanel.controls.dateRequestedFrom.value, "yyyy-MM-dd"),
      dateRequestedTo: this.datePipe.transform(this.filterPanel.controls.dateRequestedTo.value, "yyyy-MM-dd"),
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      showRequestType: this.filterPanel.controls.showType.value
    }
    this.selectionFilterData = { ...filterData };
    this.loadRecords(filterData);
  }

  loadRecords(filterData: any) {
    this.allRequestList = [];
    this.esctdResponseData = [];
    this.esctdCompleteData = [];
    this.esctdCompleteAndResponseData = [];
    this.isFiltered = false;
    this.selectedData = [];
    this.isFiltered = false;
    // this.responseCheckbox = true;
    // this.completeResponseCheckbox = true;
    // this.completeCheckbox = true;
    let data = { ...filterData
      // ,filterDto: { paginationDTO: this.paginationObj, filterCriteria: this.pagfilterCriteria } 
    };
    this.wrServ.getAllWrByFilter(data).subscribe((res: any) => {
      this.isFiltered = false;
      this.allRequestList = [];
      // let content = res.content ? res.content : [];
      // this.totalElements = res.totalElements ? res.totalElements : 0;
      this.allRequestList = res.map((each: any) => {
        return {
          ...each,
          formatedDateRequested: this.datePipe.transform(each.dateRequested, 'dd MMM yyyy'),
          fromatedDateToRespond: each.escDateResponded ? this.datePipe.transform(each.escDateResponded, 'dd MMM yyyy') + " " + this.convertToDisplayTime(each.escTimeResponded) : '',
          formatedDateResponded: each.dateResponded ? this.datePipe.transform(each.dateResponded, 'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.timeResponded) : '',
          formatedDateToComplete: each.escDateCompleted ? this.datePipe.transform(each.escDateCompleted, 'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.escTimeCompleted) : '',
          formatedDateCompleted: each.dateCompleted ? this.datePipe.transform(each.dateCompleted, 'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.timeCompleted) : '',
          formatedRequestedFor: this.getEmployeeFullName(each.requestedFor)
        }
      });
      
      this.esctdResponseData = [];
      this.esctdCompleteData = [];
      this.esctdCompleteAndResponseData = [];
      let currentDate = new Date();
      this.allRequestList.forEach((item) => {

        const { dateResponded, escDateResponded, dateCompleted, escDateCompleted, timeResponded, timeCompleted, escTimeResponded, escTimeCompleted, status } = item;

        const isEscalatedForResponse =
          (dateResponded && new Date(dateResponded + 'T' + timeResponded) > new Date(escDateResponded + 'T' + escTimeResponded)) ||
          (!dateResponded && currentDate > new Date(escDateResponded + 'T' + escTimeResponded));

        const isEscalatedForComplete =
          (dateCompleted && new Date(dateCompleted + 'T' + timeCompleted) > new Date(escDateCompleted + 'T' + escTimeCompleted)) ||
          (!dateCompleted && currentDate > new Date(escDateCompleted + 'T' + escTimeCompleted));

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
      });
      this.selectedData = []
      this.isFiltered = false;
      this.esctdResponseData.length > 0 && this.responseCheckbox ? this.selectedData = this.selectedData.concat(this.esctdResponseData) : [];
      this.isFiltered = false;
      this.esctdCompleteData.length > 0 && this.completeCheckbox ? this.selectedData = this.selectedData.concat(this.esctdCompleteData) : [];
      this.isFiltered = false;
      this.esctdCompleteAndResponseData.length > 0 && this.completeResponseCheckbox ? this.selectedData = this.selectedData.concat(this.esctdCompleteAndResponseData) : [];
    })
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
      this.selectedFl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
        });
      }, 10);
    }
  }


  onClear() {
    this.filterPanel.reset();
    this.selectedBl = {};
    this.selectedFl = {};
    setTimeout(() => {
      this.filterPanel.patchValue({
        showType: this.showType
      });
    }, 10);
  }

  getColorCode(data: any) {
    var currentDate = new Date();
    const { dateResponded, escDateResponded, dateCompleted, escDateCompleted,
      timeResponded, timeCompleted, escTimeResponded, escTimeCompleted } = data;

    const isEscalatedForResponse =
      (dateResponded && new Date(dateResponded + 'T' + timeResponded).getTime() > new Date(escDateResponded + 'T' + escTimeResponded).getTime()) ||
      (!dateResponded && currentDate.getTime() > new Date(escDateResponded + 'T' + escTimeResponded).getTime());

    const isEscalatedForComplete =
      (dateCompleted && new Date(dateCompleted + 'T' + timeCompleted).getTime() > new Date(escDateCompleted + 'T' + escTimeCompleted).getTime()) ||
      (!dateCompleted && currentDate.getTime() > new Date(escDateCompleted + 'T' + escTimeCompleted).getTime());

    if (isEscalatedForResponse && !isEscalatedForComplete) {
      return '#fbae5c';
    }

    if (isEscalatedForComplete && !isEscalatedForResponse) {
      return '#E77471';
    }

    if (isEscalatedForResponse && isEscalatedForComplete) {
      return '#F75D59';
    }
    return null;
  }

  getEmployeeFullName(id: any) {
    if (this.allEmployees) {
      this.enumEm = this.allEmployees.filter(em => em.emId === id);
      this.fullName = this.enumEm.map(em => {
        if (em.firstName.length > 0 && em.lastName.length > 0) {
          return em.firstName + " " + em.lastName + ' - ' + em.emId;
        } else {
          return em.firstName + ' - ' + em.emId;
        }
      })
    }
    return this.fullName;
  }

  onClickView(data: any) {
    const wrId = data.wrId;
    const status = data.status;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/work-request-details"], { queryParams: { requestId: wrId, index: 0, action: "details", status: status, viewDetails: true, isNavigationFromReport: true } })
    );

    window.open(url, '_blank');
  }

  updateSelectedData() {
    // Clear the previously selected data
    this.selectedData = [];
    this.isFiltered = false;

    // Check if the response checkbox is selected
    if (this.responseCheckbox) {
      this.selectedData = this.selectedData.concat(this.esctdResponseData);
    }

    // Check if the complete checkbox is selected
    if (this.completeCheckbox) {
      this.selectedData = this.selectedData.concat(this.esctdCompleteData);
    }

    // Check if the completeResponse checkbox is selected
    if (this.completeResponseCheckbox) {
      this.selectedData = this.selectedData.concat(this.esctdCompleteAndResponseData);
    }

    // if(!this.responseCheckbox && !this.completeCheckbox && !this.completeResponseCheckbox) {
    //   this.selectedData = this.allRequestList;
    // }
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

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());

      }
    );
  }

  getEnumById(id: any) {
    return this.enumStatus.find((t: any) => t.id === id)?.enumValue;
  };

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.selectionFilterData);
  }

  onInnerFilter(event: any) {
    if (this.isFiltered) {
      this.pagfilterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
          if (field == "wrId") {
            this.pagfilterCriteria = { fieldName: "wr_id", value: filterValue, matchMode: matchMode };
          } else if (field == "eqCode") {
            this.pagfilterCriteria = { fieldName: "eq_code", value: filterValue, matchMode: matchMode };
          } else {
            this.pagfilterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadRecords(this.selectionFilterData);
    }
    this.isFiltered = true;
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
