import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { UtilConstant } from 'src/common/UtilConstant';
import { PartsUsageanalysisService } from '../../parts-usage-analysis/services/parts-usage-analysis.service';
import { MessageService } from 'primeng/api';
import { AddWorkRequestService } from '../../work-request/service/add-work-request.services';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-analysis',
  templateUrl: './budget-analysis.component.html',
  styleUrls: ['./budget-analysis.component.scss'],
  providers: [MessageService]
})
export class BudgetAnalysisComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  budgetalysisData: any[] = [];
  budgetalysisDataForAll: any[] = [];
  requestId: any[] = [];
  allRequests: any[] = [];
  actualCostSum: number = 0;
  sumOfDiffernces: number = 0;
  estimateCostSum: number = 0;
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;

  datesReadOnly : boolean = false;
  showRequestsTypeList:any[] = [{label:"Preventive Maintenance",value:"ppm"},
  {label:"Facilities Helpdesk",value:"facilities"},
  {label:"All",value:"all"}]
  @Input() isReadOnly: boolean = false;
  @Input() hideFilterPanel: boolean = false;
  @Input()showType:string = "facilities";
  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private wrServ: AddWorkRequestService,
    private partsUsageanalysisService: PartsUsageanalysisService
  ) {
    this.filterPanel = this.formBuilder.group({
      wrId: [null],
      dateRequestedFrom: [new Date(new Date().getFullYear(), new Date().getMonth(), 1)],
      dateRequestedTo: [new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
      showType : [this.showType]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.filterPanel.patchValue({
        showType: this.showType
      });
      const filterData = this.getFilterData();
      this.getRequestBugdet(filterData);
    });
    this.loadRequests();
  }
  onSearch() {
  const filterData = this.getFilterData();
    this.getRequestBugdet(filterData);
  }

  getRequestBugdet(filterData: any) {
    this.loading = true
    this.partsUsageanalysisService.getRequestByBugdet(filterData).subscribe((res: any) => {
      this.loading = false;
      this.budgetalysisDataForAll = [];
      if (this.hideFilterPanel) {
        this.createDataToDisplay(res[0]);
      } else {
        res.map((data: any) => {
          this.createDataForMultipleRequests(data);
        });
      }
   })
  }

  loadRequests() {
    this.wrServ.getAllWr().subscribe((res: any) => {
      this.allRequests = res;
      this.allRequests.unshift(new Object({ wrId: "Make a selection" }));
    })
  }

  getFilterData() {
    var dateRequestedFrom = this.filterPanel.controls.dateRequestedFrom.value;
    var dateRequestedTo = this.filterPanel.controls.dateRequestedTo.value;
    var wrId = this.filterPanel.controls.wrId.value;
    var filterData = {

      "dateRequestedFrom": this.datePipe.transform(dateRequestedFrom, "yyyy-MM-dd"),
      "dateRequestedTo": this.datePipe.transform(dateRequestedTo, "yyyy-MM-dd"),
      "wrId": wrId,
      "showRequestType": this.filterPanel.controls.showType.value
     };
    return filterData;
  }

  createDataToDisplay(data: any) {
    const dataArray: any[] = [];
    for (const key in data) {
      if (key !== "RequestId") {
        const items = data[key];
        items.forEach((item: any) => {
          const obj = {
            label: key,
            EstimateCost: item.EstimateCost,
            ActualCost: item.ActualCost
          };
          dataArray.push(obj);
        });
      }
    }

    this.estimateCostSum = 0;
    this.actualCostSum = 0;
    this.sumOfDiffernces = 0;

    dataArray.forEach(record => {
      this.estimateCostSum += parseFloat(record.EstimateCost);
      this.actualCostSum += parseFloat(record.ActualCost);
      this.sumOfDiffernces += (parseFloat(record.EstimateCost) - parseFloat(record.ActualCost));
    });

    this.budgetalysisData = dataArray;
  }

  createDataForMultipleRequests(data: any) {
    const requestId = data.RequestId;
    let sumOfEstimated = 0;
    let sumOfActual = 0;

    for (const part of data.Part) {
      sumOfEstimated += part.EstimateCost;
      sumOfActual += part.ActualCost;
    }

    for (const technician of data.Technician) {
      sumOfEstimated += technician.EstimateCost;
      sumOfActual += technician.ActualCost;
    }

    for (const tool of data.Tools) {
      sumOfEstimated += tool.EstimateCost;
      sumOfActual += tool.ActualCost;
    }

    for (const cost of data['Other Cost']) {
      sumOfEstimated += cost.EstimateCost;
      sumOfActual += cost.ActualCost;
    }

    for (const cost of data.Trade) {
      sumOfEstimated += cost.EstimateCost;
      sumOfActual += cost.ActualCost;
    }

    const sumOfDifference = sumOfEstimated - sumOfActual;

    const requestObject = {
      requestId: requestId,
      sumOfEstimated: sumOfEstimated,
      sumOfActual: sumOfActual,
      sumOfDifference: sumOfDifference
    };
    this.budgetalysisDataForAll.push(requestObject);
  }

  onClickView(data: any) {
    const wrId = data.requestId;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/work-request-details"], { queryParams: { requestId: wrId, index: 0, action: "details", viewDetails: true, isNavigationFromReport: true } })
    );
    window.open(url, '_blank');
  }

  getColorCode(data: any) {
    var currDate = new Date();

    if (data.sumOfDifference < 0) {
      return '#FF9999'
    }
    else {
      return '#CCFFFF'
    }
  }

  onSelectRequst(data: any){
    if(data.wrId !== 'Make a selection'){
      this.filterPanel.patchValue({
        wrId : data.wrId,
        dateRequestedFrom : null,
        dateRequestedTo : null
      })
      this.datesReadOnly = true;
    }else{
      this.filterPanel.patchValue({
        wrId : null
      })
      this.datesReadOnly = false;
    }
  }

  onClickClear(){
    this.filterPanel.patchValue({
      wrId: null,
      dateRequestedFrom : null,
      dateRequestedTo : null ,
      showType: this.showType
    });
    this.datesReadOnly = false;
  }
}