import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { UserRoles } from '../../model/user-role.model';
import { RoleService } from '../../service/role.service';
import { UtilConstant } from '../../../../../../common/UtilConstant';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-user-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  roles_data: UserRoles[] = [];
  @Output() parentFun= new EventEmitter();
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["userRoleId"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isFiltered:boolean = false;
  constructor(private roleSrv: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();

  }

  loadRoles(): void {
    let data ={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.isFiltered= false;
    this.roleSrv.getUserRoles(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.roles_data = res.content ? res.content : [];
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
    this.loadRoles();
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
      this.loadRoles();
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
