import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmStd } from '../../model/emstd.model';
import { EmStdService } from '../../service/emstd.service';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { PaginationObj } from 'src/app/model/pagination-model';


@Component({
  selector: 'app-emstd-list',
  templateUrl: './emstd-list.component.html',
  styleUrls: ['./emstd-list.component.scss']
})
export class EmstdListComponent  implements OnInit {
  emStd_data: EmStd[] = [];
  @Output() parentFun= new EventEmitter();
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["emStd"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  isFiltered:boolean = false;
  constructor(private emstdSrv: EmStdService) { }

  ngOnInit(): void {
    this.loadEmStd();

  }

  loadEmStd(): void {
    let data ={
      paginationDTO:this.paginationObj,
      filterCriteria:this.filterCriteriaList
    }
    this.isFiltered= false;
    this.emstdSrv.getEmStdPaginated(data).subscribe((res: any) => {
      if (res) {
        this.emStd_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
        this.isFiltered = false;
      }
    }, error => {
      console.log(error);
    }
    );
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event);
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadEmStd();
  }

  onSort(event: any) {
   // this.isSorted = true;
  }

  onInnerFilter(event: any) {
    this.isSorted = false;
    setTimeout(() => {
      if(this.isFiltered && !this.isSorted){
        this.isSorted = false;
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined ) {
            let filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
            this.updateFilterCriteriaList(filterCriteria);
          }
        });
        // if (this.filterCriteriaList.length!=0) {
        //   this.paginationObj.pageNo = 0;
        // }
        this.paginationObj.pageNo = 0;
        this.loadEmStd();
      }
      this.isFiltered = true;
    }, 0);
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

