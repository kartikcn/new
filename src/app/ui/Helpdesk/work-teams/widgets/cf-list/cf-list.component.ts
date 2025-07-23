import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilConstant } from 'src/common/UtilConstant';
import { CraftspersonService } from '../../../craftsperson/services/craftsperson.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-cf-list',
  templateUrl: './cf-list.component.html',
  styleUrls: ['./cf-list.component.scss']
})
export class CfListComponent implements OnInit {
  @Output() parentFun = new EventEmitter();
  cfData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["cfId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  constructor(
    private cfService: CraftspersonService,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.cfService.getAllCraftspersonPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.cfData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.cfData = [];
      }
    })
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event);
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onInnerFilter(event: any) {
    if(this.isFiltered){
      this.filterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
          let filterCriteria={}
          if(field=="primaryTrade"){
            filterCriteria = { fieldName: "trades.tradeCode", value: filterValue, matchMode: matchMode };
          }else{
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

  updateFilterCriteriaList(filterCriteria:any){
    let index = this.filterCriteriaList.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if(filterCriteria['value']==null){
      if(index !==-1){
        this.filterCriteriaList.splice(index, 1);
      }
    }else {
      if (index !== -1) {
        this.filterCriteriaList[index] = filterCriteria;
      } else {
        this.filterCriteriaList.push(filterCriteria);
      }
    }
  }

}
