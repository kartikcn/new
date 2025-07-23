import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { RegnList } from '../../../../model/regn-list.model';
import { RegnService } from '../../services/regn.service';
import { RegnFilterInput } from './regnFilterInput.model';
import { RegnModalDialogueProvider } from '../../provider/regn.provider';
import { CountryService } from '../../../../services/country.service';
import { CountryFilterInputDTO } from '../../modal/CountryFilterInputDTO.model';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';


@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.css']
})
export class RegionListComponent implements OnInit {

  confirmationResult: any;
  EnumList: Enums[] = [];
  enumRegn: RegnFilterInput[] = [];
  regn_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isRegnList: boolean = true;
  regnFilter!: any;
  displayedColumns: string[] = ['id', 'regnId', 'regnName', 'ctryId'];
  dataSource!: MatTableDataSource<RegnList>;
  enumCntry: CountryFilterInputDTO[] = [];
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @Output() parentFun = new EventEmitter();
  rowCount: number = UtilConstant.ROW_COUNT;
  isHide: Boolean = true;
  selectedCtry: string = "";
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
    private regnSrv: RegnService,
    private cntrySrv: CountryService,
    private regnModalDialogueProvider: RegnModalDialogueProvider,
  ) {
  }

  ngOnInit(): void {
    //this.loadCntry();
  }

  loadCntry() {
    this.cntrySrv.getALLCountry().subscribe((res: any) => {
      this.enumCntry = res;

    });
  }

  getNameById(id: any) {
    return id ? this.enumCntry.find(t => t.id == id) != null ? this.enumCntry.find(t => t.id == id)?.name : '' : '';
  }

  loadRecords(data: any) { // any need to change RegnFilterInput
    this.regnFilter = data;
    this.regnFilter.filterDto.paginationDTO = this.paginationObj;
    this.regnFilter.filterDto.filterCriteria = this.filterCriteriaList;
    this.loading = true;
    this.isRegnList = true;
    this.isFiltered = false;
    //this.regn_data = [];
    this.regnSrv.getRegnList(this.regnFilter).subscribe((res: any) => {
      if (res.status != 202) {
        this.isRegnList = false;
        this.isFiltered = false;
        this.regn_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.isRegnList = true;
        this.regn_data = [];
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
      regn_id: regn_id,
      isEdit: true,
      newRecord: false
    };
    this.regnModalDialogueProvider.openDialog(dialogConfig);
    this.regnModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.regnFilter);
      
    })
  }

  onAddRegion() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      regn_id: null,
      isEdit: true,
      newRecord: true
    };
    this.regnModalDialogueProvider.openDialog(dialogConfig);
    this.regnModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.regnFilter);
      this.parentFun.emit('regionAdded');
    })
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event.data);
  }

  onClearCtry() {
    this.parentFun.emit(true);
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.regnFilter);
  }

  onSort(event: any) {
    //this.isSorted = true;
  }

  onInnerFilter(event: any) {
    this.isSorted = false;
    setTimeout(() => {
      if (this.isFiltered && !this.isSorted) {
        this.isSorted = false;
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined) {
            let filterCriteria={};
            if(field == "ctryCtryName" ) {
              filterCriteria = { fieldName: "ctry.ctryName", value: filterValue, matchMode: matchMode };
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
        this.loadRecords(this.regnFilter);
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
