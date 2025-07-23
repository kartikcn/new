import { Component, OnInit,  ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { BuildingService } from '../../services/bl.service';
import { FLList } from '../../model/fl-list.model';
import { FLModalDialogueProvider } from '../../provider/fl.provider';
import { FLFilterInputDTO } from '../../model/DTO/flFilterInput.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-fl-list',
  templateUrl: './fl-list.component.html',
  styleUrls: ['./fl-list.component.scss'],
  providers: [MessageService]
})
export class FlListComponent implements OnInit {
  isView: boolean = false;
  confirmationResult: any;
  fl_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isFlList: boolean = true;
  flFilter!: FLFilterInputDTO;
  displayedColumns: string[] = ['id', 'blId', 'flName', 'flId', 'flInfo'];
  dataSource!: MatTableDataSource<FLList>;
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedSite: string="";
  selectedBldg: string = "";
  isHide: Boolean = true;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["flId"],
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
    private flProvider: FLModalDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
  }

  loadRecords(data: any) {//FLFilterInputDTO
    this.flFilter = data;
    this.loading = true;
    this.isFlList = true;
    let filterData = {...data,filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList}};
    this.blSrv.getFlListPaginated(filterData).subscribe((res: any) => {
      if (res.status != 202) {
        this.isFlList = false;
        this.isFiltered = false;
        this.fl_data =  res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.isFlList = true;
        this.fl_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(fl: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      flCode:fl.flCode,
      fl_id: fl.flId,
      bl_id: fl.blBlName,
      isEdit: true,
      newRecord: false
    };
    this.flProvider.openDialog(dialogConfig);
    this.flProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.flFilter);
    })
  }

  onAddFloor() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      fl_id: null,
      bl_id: null,
      isEdit: true,
      newRecord: true
    };
    this.flProvider.openDialog(dialogConfig);
    this.flProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.flFilter);
    })
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event.data);
  }
  onClearBuilding() {
    this.parentFun.emit(true);
  }

  deleteFloor(fl: any){
    this.userDeleteConfirm(fl);
  }
  deleteRecord(fl_id:string) {
    
    this.blSrv.deleteFloor(fl_id).subscribe((res: any) => {
      if (res.code == 200) {
        this.messageService.add({ key: 'flSuccessMessage', severity: 'success', summary: 'Record deleted successfully', detail: res.text });
        this.loadRecords(this.flFilter);
      }else{
        this.messageService.add({ key: 'flFailureMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
      }
    });
  }
  userDeleteConfirm(fl:any): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + fl.blBlName + ' - '+ fl.flCode+' ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(fl.flId);
      },
      key: "flGrid"
    });
  }
  onViewDetails(bl_id: any,fl_id:any){
    this.isView = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      isView: true,
      fl_id: fl_id,
      bl_id: bl_id,
      isEdit: true,
      newRecord: false
    };
    this.flProvider.openDialog(dialogConfig);
    this.flProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.flFilter);
    })
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.flFilter);
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
            if(field=="blBlName"){
              filterCriteria = { fieldName: "bl.blName", value: filterValue, matchMode: matchMode };
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
        this.loadRecords(this.flFilter);
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
