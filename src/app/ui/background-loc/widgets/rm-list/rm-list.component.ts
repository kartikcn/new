import { Component, EventEmitter, OnInit,  Output,  ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { BuildingService } from '../../services/bl.service';
import { RMList } from '../../model/rm-list.model';
import { RMModalDialogueProvider } from '../../provider/rm.provider';
import { RMFilterInputDTO } from '../../model/DTO/rmFilterInput.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-rm-list',
  templateUrl: './rm-list.component.html',
  styleUrls: ['./rm-list.component.scss'],
  providers: [MessageService]
})
export class RmListComponent implements OnInit {
  isView: boolean = false;
  confirmationResult: any;
  rm_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isRmList: boolean = true;
  rmFilter!: any;
  displayedColumns: string[] = ['id', 'blId', 'flId', 'rmId', 'rmName', 'rmCat', 'rmType', 'rmInfo', 'rmArea'];
  dataSource!: MatTableDataSource<RMList>;
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedSite: string = "";
  selectedBldg: string = "";
  selectedFloor: string = "";
  isHide: Boolean = true;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["rmId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  @Output() parentFun = new EventEmitter();
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  constructor(
    private blSrv: BuildingService,
    private rmProvider: RMModalDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
  }

  loadRecords(data: any) {//RMFilterInputDTO
    this.rmFilter = data;
    this.rmFilter.paginationDTO = this.paginationObj;
    this.loading = true;
    this.isRmList = true;
    //this.rm_data = [];
    this.isFiltered = false;
    let filterData = {...data,filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList}};
    this.blSrv.getRmListByPagination(filterData).subscribe((res: any) => {
      if (res.status != 202) {
        this.isRmList = false;
        this.isFiltered = false;
        this.rm_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
        ;
      }
      else {
        this.isRmList = true;
        this.rm_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(blCode:string,flCode:string,rmCode:string,rm_id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      bl_id: blCode,
      fl_id: flCode,
      rmCode:rmCode,
      rm_id: rm_id,
      isEdit: true,
      newRecord: false
    };
    this.rmProvider.openDialog(dialogConfig);
    this.rmProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.rmFilter);
    })
  }

  onAddRoom() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      bl_id: null,
      fl_id: null,
      rm_id: null,
      isEdit: true,
      newRecord: true
    };
    this.rmProvider.openDialog(dialogConfig);
    this.rmProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.rmFilter);
    })
  }

  

  onClearFloor() {
    let rmData = {
      rmId:0 ,
      flId:0,
      blId:0,
    };
    this.loadRecords(rmData);
    this.isHide = true; 
    this.parentFun.emit(true);
  }

  deleteRoom(blCode:string,flCode:string,rmCode:string, rm_id:string){
    this.userDeleteConfirm(blCode,flCode,rmCode,rm_id);
  }
  deleteRecord(rm_id:string) {
    this.messageService.clear();
   
    this.blSrv.deleteRoom(rm_id).subscribe((res: any) => {
      if (res.code == 200) {
        this.messageService.add({ key: 'rmSuccessMessage', severity: 'success', summary: 'Record deleted successfully', detail: res.text });
        this.loadRecords(this.rmFilter);
      }
      else{
        this.messageService.add({ key: 'rmFailureMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
      }
    });
  }
  userDeleteConfirm(blCode: string, flCode: string,rmCode:string, rm_id:string): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + blCode + ' - ' + flCode +' - ' +rmCode+' ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(rm_id);
      },
      key: "rmGrid"
    });
  }
  onViewDetails(bl_id: any, fl_id: any,rm_id: any) {
    this.isView = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      isView: true,
      bl_id: bl_id,
      fl_id: fl_id,
      rm_id: rm_id,
      isEdit: true,
      newRecord: false
    };
    this.rmProvider.openDialog(dialogConfig);
    this.rmProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.rmFilter);
    })
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.rmFilter);
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
          if (filterValue !== undefined) {
            let filterCriteria={};
            if(field=="blBlName"){
              filterCriteria = { fieldName: "bl.blName", value: filterValue, matchMode: matchMode };
            }else if (field=="flFlName"){
              filterCriteria = { fieldName: "fl.flName", value: filterValue, matchMode: matchMode };
            }else if (field=="rmcatRmCat"){
              filterCriteria = { fieldName: "rmcat.rmCat", value: filterValue, matchMode: matchMode };
            }else if (field=="rmtypeRmType"){
              filterCriteria = { fieldName: "rmtype.rmType", value: filterValue, matchMode: matchMode };
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
        this.loadRecords(this.rmFilter);
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
