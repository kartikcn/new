import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { BLList } from '../../model/bl-list.model';
import { BuildingService } from '../../services/bl.service';
import { BuildingFilterInput } from '../../model/DTO/blFilterInput.model';
import { BLModalDialogueProvider } from '../../provider/bl.provider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-bl-list',
  templateUrl: './bl-list.component.html',
  styleUrls: ['./bl-list.component.scss'],
  providers: [MessageService]
})
export class BlListComponent implements OnInit {

  confirmationResult: any;
  bl_data: any[] = [];
  value: any;
  isHide: Boolean=  true;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isBlList: boolean = true;
  isView: boolean = false;
  blFilter!: any;
  displayedColumns: string[] = ['id', 'blId', 'blName', 'siteId', 'blInfo', 'longitude', 'latitude', 'blContactName', 'blContactPhone'];
  dataSource!: MatTableDataSource<BLList>;
  selectedSite:string=""; 
  rowCount: number = UtilConstant.ROW_COUNT;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["blId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @Output() parentFun = new EventEmitter();
  constructor(
    private blSrv: BuildingService,
    private blProvider: BLModalDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
  }

  loadRecords(data: any) {//BuildingFilterInput
    this.blFilter = data;
    this.loading = true;
    this.isBlList = true;
    let filterData = {...data,filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList}};
    this.blSrv.getBlListPaginated(filterData).subscribe((res: any) => {
      if (res.status != 202) {
        this.isBlList = false;
        this.isFiltered = false;
        this.bl_data =  res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.isBlList = true;
        this.bl_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(bl_id: any,blCode:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      blCode:blCode,
      bl_id: bl_id,
      isEdit: true,
      newRecord: false
    };
    this.blProvider.openDialog(dialogConfig);
    this.blProvider.onDialogueClosed.subscribe((result: any) => {
      if(result[0]==true)
        this.loadRecords(this.blFilter);
    })
  }

  onAddBuilding() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      bl_id: null,
      isEdit: true,
      newRecord: true
    };
    this.blProvider.openDialog(dialogConfig);
    this.blProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.blFilter);
    })
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event.data);
  }
  onClearSite() {
    this.parentFun.emit(true);
  }
  deleteBuilding(bl:any) {
    this.userDeleteConfirm(bl);
  }
  deleteRecord(blId: any) {
    this.blSrv.deleteBuilding(blId).subscribe((res:any) => {
      if (res.code == 200) {
        this.messageService.add({ key: 'blSuccessMessage', severity: 'success', summary: 'Record deleted successfully', detail: res.text });
        this.loadRecords(this.blFilter);
      }else{
        this.messageService.add({ key: 'blFailureMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
      }

    });
  }
  userDeleteConfirm(bl: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + bl.blCode + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(bl.blId);
      },
      key: "blGrid"
    });
  }
  onViewDetails(bl_id:any){
    this.isView = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      isView: true,
      bl_id: bl_id,
      isEdit: true,
      newRecord: false
    };
    this.blProvider.openDialog(dialogConfig);
    this.blProvider.onDialogueClosed.subscribe((result: any) => {
      if(result[0]==true)
        this.loadRecords(this.blFilter);
    })
  } 

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.blFilter);
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
            let filterCriteria={};
            if(field=="siteSiteName"){
              filterCriteria = { fieldName: "site.siteName", value: filterValue, matchMode: matchMode };
            }else if (field=="latitude"){
              filterCriteria = { fieldName: "Latitude", value: filterValue, matchMode: matchMode };
            }
            else{
              filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
            }
            this.updateFilterCriteriaList(filterCriteria);
          }
        });
        // if (this.filterCriteriaList.length!=0) {
        //   this.paginationObj.pageNo = 0;
        // }
        this.paginationObj.pageNo = 0;
        this.loadRecords(this.blFilter);
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
