import { Component, OnInit,ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { EmployeeModalDialogueProvider } from '../provider/employee.provider';
import { EnumService } from '../../../services/enum.service';
import { UtilConstant } from '../../../../common/UtilConstant';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-define-employee',
  templateUrl: './define-employee.component.html',
  styleUrls: ['./define-employee.component.scss']
})
export class DefineEmployeeComponent implements OnInit {

  confirmationResult: any;
  em_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumEmStatus: EnumList[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["emId"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  isFiltered:boolean = false;
  dialogClosedSubscription!: Subscription;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  constructor(
    private empServ: EmployeeService,
    private empProvider: EmployeeModalDialogueProvider,
    private enumsrv: EnumService,
  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.loadRecords();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumEmStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'em'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'em_status'.toLocaleUpperCase());
       this.enumEmStatus.unshift(new EnumList(null, '', '', 'Make a selection',null));
      },
      error => {
        // this.loginError = error.errorDesc;
      }
    );
  }

  getNameById(id: any) {
    return id ? this.enumEmStatus.find(t => t.enumKey == id) != null ? this.enumEmStatus.find(t => t.enumKey == id)?.enumValue : '' : '';
  }

  loadRecords() {
    let data ={
      filterDto:{paginationDTO: this.paginationObj,filterCriteria:this.filterCriteriaList}
    }
    this.isFiltered = false;
    this.empServ.getAllEmployeeListPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered = false;
        this.em_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
    });
  }

  openEditItem(em_id: any,edtiMode:boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      em_id: em_id,
      isEdit: edtiMode,
      newRecord: !edtiMode
    };

    this.empProvider.openDialog(dialogConfig);
    if (this.dialogClosedSubscription) {
      this.dialogClosedSubscription.unsubscribe();
    }
   this.dialogClosedSubscription = this.empProvider.onDialogueClosed.subscribe((result: any) => {
      if (result == true)
      this.loadRecords();
    })
  }

  onAddEmployee() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      em_id: 0,
      isEdit: true,
      newRecord: true
    };
    this.empProvider.openDialog(dialogConfig);
    this.empProvider.onDialogueClosed.subscribe((result: any) => {
      if(result ==true)
      this.loadRecords();
    })
  }

  onPageChange(event:any){
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
            let filterCriteria ={};
            if(field == "emStdEmStd"){
              filterCriteria = { fieldName: "emStd.emStd", value: filterValue, matchMode: matchMode };
            }else {
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
