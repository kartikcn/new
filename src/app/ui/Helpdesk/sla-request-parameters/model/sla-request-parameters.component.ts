import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { SLARequestServices } from '../services/sla-request-parameters.service';
import { MessageService } from 'primeng/api';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-sla-request-parameters',
  templateUrl: './sla-request-parameters.component.html',
  styleUrls: ['./sla-request-parameters.component.scss'],
  providers: [MessageService]
})
export class SlaRequestParametersComponent implements OnInit {
  sla_data: any[] = [];
  value: any;
  loading: boolean = false;
  compId!: number;
  rowCount: number = UtilConstant.ROW_COUNT;
  isDefaultSla: boolean = false;
  totalElements: number = 0;
  paginationObj: PaginationObj = {
    pageNo: 0,
    pageSize: this.rowCount,
    sortBy: ["slaRequestParametersId"],
    sortOrder: "ASC"
  }
  filterCriteria: any = {};
  isFiltered: boolean = false;
  filterCriteriaList: any[] = [];
  constructor(
    private authSrv: AuthService,
    private service: SLARequestServices,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    let data = { paginationDTO: this.paginationObj, filterCriteria: this.filterCriteriaList };
    this.service.getAllSLARequestsPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered = false;
        let content = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
        this.sla_data = content.map((each: any) => {
          if (each.probTypeId === null) {
            return {
              ...each,
              problemTypeString: 'Default',
            }
          }
          return each;
        }
        )
      }
      else {
        this.sla_data = [];
      }
      this.loading = false;
    }
    );
  }

  onAddSla() {
    this.authSrv.setPreviousUrl(this.router.url);
    this.router.navigate(["/add-edit-sla"], { queryParams: { slaRequestParametersId: 0, slaRequest: null }, skipLocationChange: true });

  }

  onEditSla(slaRequest: any) {
    if (slaRequest) {
      if (slaRequest.probTypeId === null && slaRequest.siteId === null && slaRequest.blId === null && slaRequest.eqStdId === null) {
        this.isDefaultSla = true;
      } else {
        this.isDefaultSla = false;
      }
      this.authSrv.setPreviousUrl(this.router.url);
      this.router.navigate(["/add-edit-sla"], { queryParams: { slaRequestParametersId: slaRequest.slaRequestParametersId, isDefaultSla: this.isDefaultSla }, skipLocationChange: true });
    }
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onInnerFilter(event: any) {
    if (this.isFiltered) {
      this.filterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined) {
          let filterCriteria = {};
          if (field == "problemTypeString") {
            filterCriteria = { fieldName: "probType.probType", value: filterValue, matchMode: matchMode };
          } else if (field == "siteSiteName") {
            filterCriteria = { fieldName: "site.siteName", value: filterValue, matchMode: matchMode };
          } else if (field == "blBlName") {
            filterCriteria = { fieldName: "bl.blName", value: filterValue, matchMode: matchMode };
          } else if (field == "eqStdEqStd") {
            filterCriteria = { fieldName: "eqStd.eqStd", value: filterValue, matchMode: matchMode };
          } else {
            filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadRecords();
    }
    this.isFiltered = true;
  }

  updateFilterCriteriaList(filterCriteria: any) {
    let index = this.filterCriteriaList.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if (filterCriteria['value'] == null) {
      if (index !== -1) {
        this.filterCriteriaList.splice(index, 1);
      }
    } else {
      if (index !== -1) {
        this.filterCriteriaList[index] = filterCriteria;
      } else {
        this.filterCriteriaList.push(filterCriteria);
      }
    }
  }


}
