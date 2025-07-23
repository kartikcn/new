import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { StateList } from '../../model/state-list.model';
import { StateService } from '../../services/state.service';
import { StateFilterInput } from './stateFilterInput.model';
import { StateModalDialogueProvider } from '../../provider/state.provider';
import { CountryFilterInput } from '../../modal/countryFilterInput.model';
import { RegnFilterInput } from '../region-list/regnFilterInput.model';
import { CountryService } from '../../../../services/country.service';
import { RegnService } from '../../services/regn.service';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.css']
})
export class StateListComponent implements OnInit {

  confirmationResult: any;
  EnumList: Enums[] = [];
  enumState: StateFilterInput[] = [];
  state_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isStateList: boolean = true;
  stateFilter!: any;
  displayedColumns: string[] = ['id', 'stateId', 'stateName', 'countryId','regnId'];
  dataSource!: MatTableDataSource<StateList>;
  enumCntry: CountryFilterInput[] = [];
  enumRegn: RegnFilterInput[] = [];
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @Output() parentFun = new EventEmitter();
  isHide: Boolean = true;
  selectedCtry: string = "";
  selectedRegn: string = "";
  rowCount: number = UtilConstant.ROW_COUNT;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["ctryId","regnId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  constructor(
    private stateSrv: StateService,
    private ctrySrv: CountryService,
    private regnSrv: RegnService,
    private stateModalDialogueProvider: StateModalDialogueProvider,
  ) {
  }

  ngOnInit(): void {
    // this.loadCntry();
    // this.loadRegn();
  }

  loadCntry() {
    this.ctrySrv.getALLCountry().subscribe((res: any) => {
      this.enumCntry = res;
    });
  }

  loadRegn() {
    this.regnSrv.getALLRegn().subscribe((res: any) => {
      this.enumRegn = res;
    });
  }

  getCtryNameById(id: any) {
    return id ? this.enumCntry.find(t => t.id == id) != null ? this.enumCntry.find(t => t.id == id)?.name : '' : '';
  }

  getRegnNameById(id: any) {
    return id ? this.enumRegn.find(t => t.id == id) != null ? this.enumRegn.find(t => t.id == id)?.name : '' : '';
  }

  loadRecords(data: any) {//StateFilterInput
    this.stateFilter = data;
    this.stateFilter.filterDto.paginationDTO = this.paginationObj;
    this.stateFilter.filterDto.filterCriteria = this.filterCriteriaList;
    this.loading = true;
    this.isStateList = true;
    //this.state_data = [];
    this.stateSrv.getStateList(this.stateFilter).subscribe((res: any) => {
      if (res.status != 202) {
        this.isStateList = false;
        this.isFiltered = false;
        this.state_data =  res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;;
      }
      else {
        this.isStateList = true;
        this.state_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(regn_id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      state_id: regn_id,
      isEdit: true,
      newRecord: false
    };
    this.stateModalDialogueProvider.openDialog(dialogConfig);
    this.stateModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.stateFilter);
    })
  }

  onAddState() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      state_id: null,
      isEdit: true,
      newRecord: true
    };
    this.stateModalDialogueProvider.openDialog(dialogConfig);
    this.stateModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.stateFilter);
      this.parentFun.emit('stateAdded');
      
    })
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event.data);
  }

  onClearState() {
    this.parentFun.emit(true);
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.stateFilter);
  }

  onSort(event: any) {
   // this.isSorted = true;
  }

  onInnerFilter(event: any) {
    this.isSorted = false;
    setTimeout(() => {
      if (this.isFiltered && !this.isSorted) {
        this.isSorted = false;
        // this.paginationObj.pageNo = 0;
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined ) {
            let filterCriteria={};
            if (field == "ctryCtryName") {
              filterCriteria = { fieldName: "ctry.ctryName", value: filterValue, matchMode: matchMode };
            } else if (field == "regnRegnName") {
              filterCriteria = { fieldName: "regn.regnName", value: filterValue, matchMode: matchMode };
            } else {
              filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
            }
            this.updateFilterCriteriaList(filterCriteria);
          }
        });
        // if (this.filterCriteriaList.length!=0) {
        //   this.paginationObj.pageNo = 0;
        // }
        this.paginationObj.pageNo = 0;
        this.loadRecords(this.stateFilter);
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
