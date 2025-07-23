import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PaginationObj } from 'src/app/model/pagination-model';
import { UsersService } from 'src/app/services/users.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users_data:  any[]= [];
  rowCount: number = UtilConstant.ROW_COUNT;
  @Output() parentFun= new EventEmitter();
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["userId"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isFiltered:boolean = false;
  constructor(private userSrv: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.isFiltered= false;
    this.userSrv.getALLUsersPaginated(data).subscribe((res:any) => {
      if(res){
        this.isFiltered= false;
        this.users_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
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
    this.loadUsers();
  }

  onInnerFilter(event: any) {
    if(this.isFiltered){
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
          let filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadUsers();
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
