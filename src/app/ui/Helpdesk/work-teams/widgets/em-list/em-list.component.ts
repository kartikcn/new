import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PaginationObj } from 'src/app/model/pagination-model';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-em-list',
  templateUrl: './em-list.component.html',
  styleUrls: ['./em-list.component.scss']
})
export class EmListComponent implements OnInit {
  @Output() parentFun = new EventEmitter();
  emData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["emId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  constructor(
    private empServ: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    let data ={filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList}};
    this.isFiltered = false;
    this.empServ.getAllEmployeeListPaginated(data).subscribe((res: any) => {
      if (res.status != 202) {
        this.isFiltered = false;
        let content =  res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
        this.emData = [...content]
        
      }
      else {
        this.emData = [];
      }
    });
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event);
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onSort(event: any) {
    //this.isSorted = true;
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
            let filterCriteria= {};
            if(field=="name"){
              filterCriteria = { fieldName: "firstName", value: filterValue, matchMode: matchMode };
            }else{
              filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
            }
            this.updateFilterCriteriaList(filterCriteria);
          }
        });
        // if (this.filterCriteriaList.length!=0) {
        //   this.paginationObj.pageNo = 0;
        // }
        this.paginationObj.pageNo = 0;
        this.loadRecords();
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
