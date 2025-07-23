import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumService } from 'src/app/services/enum.service';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { RmConfigService } from 'src/app/ui/rm-config/rm-config/services/rm-config.service';
import { UtilConstant } from 'src/common/UtilConstant';

import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  rowCount: number = UtilConstant.ROW_COUNT;
  rm_data: any[] = [];
  isRmList: boolean = true;
  loading: boolean = false;
  rmFilter!:any;
  enumRmData: EnumList[] = [];
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["rmId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  @Input() isRmConfig!: boolean;
  @Output() parentFun= new EventEmitter();
  constructor(
    private blSrv: BuildingService,
    private rmConfigSrv: RmConfigService,
    private enumsrv: EnumService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loadPageData();
    }, 1000);
  }
  loadPageData(){
    !this.isRmConfig?this.loadRecords({}):this.loadRmConfigRoomList();
  }
  loadRecords(data: any) {
    this.rmFilter = data;
    this.loading = true;
    this.isRmList = true;
    //this.rm_data = [];
    let filterdata ={...data,filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList}};
    this.blSrv.getRmListByPagination(filterdata).subscribe((res: any) => {
      if (res) {
        this.isRmList = false;
        this.isFiltered= false;
        this.rm_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
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

  onRowSelect(event: any) {
    this.parentFun.emit(event); 
  }

  loadRmConfigRoomList(){
    let filterdata ={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.rmConfigSrv.getReservableRoomsPaginated(filterdata).subscribe((res:any) => {
      if (res) {
        this.isRmList = false;
        this.isFiltered= false;
        this.rm_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.isRmList = true;
        this.rm_data = [];
      }
      this.loading = false;
    });
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadPageData();
  }

  onInnerFilter(event: any) {
    setTimeout(() => {
      if(this.isFiltered ){
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
        this.paginationObj.pageNo = 0;
        this.loadRmConfigRoomList();
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
