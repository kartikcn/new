import { Component, EventEmitter, OnInit,Output,ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { CityFilterInput } from './cityFilterInput.model';
import { CityList } from '../../model/city-list.model';
import { CityService } from '../../services/city.service';
import { CityModalDialogueProvider } from '../../provider/city.provider';
import { CountryFilterInput } from '../../modal/countryFilterInput.model';
import { RegnFilterInput } from '../region-list/regnFilterInput.model';
import { CountryService } from '../../../../services/country.service';
import { RegnService } from '../../services/regn.service';
import { StateService } from '../../services/state.service';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css']
})
export class CityListComponent implements OnInit {

  confirmationResult: any;
  EnumList: Enums[] = [];
  enumCntry: CountryFilterInput[] = [];
  enumRegn: RegnFilterInput[] = [];
  enumState: any[] = [];
  enumCity: CityFilterInput[] = [];
  city_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isCityList: boolean = true;
  cityFilter!: any;
  selectedCtry: string = "";
  selectedRegn: string = "";
  selectedState: string = ""
  isHide: Boolean = true;
  displayedColumns: string[] = ['id', 'cityId', 'cityName', 'countryId', 'regnId', 'stateId'];
  dataSource!: MatTableDataSource<CityList>;
  rowCount: number = UtilConstant.ROW_COUNT;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["ctryId","regnId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  isFiltered:boolean = false;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @Output() parentFun = new EventEmitter();
  constructor(
    private citySrv: CityService,
    private cntrySrv: CountryService,
    private regnSrv: RegnService,
    private stateSrv: StateService,
    private cityModalDialogueProvider: CityModalDialogueProvider,
  ) {
  }

  ngOnInit(): void {
    // this.loadCntry();
    // this.loadRegn();
    // this.loadState();
  }

  loadCntry() {
    this.cntrySrv.getALLCountry().subscribe((res: any) => {
      this.enumCntry = res;
    });
  }

  loadRegn() {
    this.regnSrv.getALLRegn().subscribe((res: any) => {
      this.enumRegn = res;
    });
  }

  loadState() {
    this.stateSrv.getALLState().subscribe((res: any) => {
      this.enumState = res;
    });
  }

  getCtryNameById(id: any) {
    
    return id ? this.enumCntry.find(t => t.id == id) != null ? this.enumCntry.find(t => t.id == id)?.name : '' : '';
  }

  getRegnNameById(id: any) {
    return id ? this.enumRegn.find(t => t.id == id) != null ? this.enumRegn.find(t => t.id == id)?.name : '' : '';
  }

  getStateNameById(id: any) {
    return id ? this.enumState.find(t => t.stateId == id) != null ? this.enumState.find(t => t.stateId == id)?.name : '' : '';
  }

  loadRecords(data: any) {//CityFilterInput
    this.loading = true;
    this.cityFilter = data;
    this.cityFilter.filterDto.paginationDTO = this.paginationObj;
    this.cityFilter.filterDto.filterCriteria = this.filterCriteriaList;
    this.isCityList = true;
    //this.city_data = [];
    this.citySrv.getCityList(this.cityFilter).subscribe((res: any) => {
      if (res.status != 202) {
        this.isCityList = false;
        this.isFiltered = false;
        this.city_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.isCityList = true;
        this.city_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(city_id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      city_id: city_id,
      isEdit: true,
      newRecord: false
    };
    this.cityModalDialogueProvider.openDialog(dialogConfig);
    this.cityModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.cityFilter);
    })


  }

  onAddCity() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      city_id: null,
      isEdit: true,
      newRecord: true
    };
    this.cityModalDialogueProvider.openDialog(dialogConfig);
    this.cityModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.cityFilter);
    })


  }

  onRowSelect(event: any) {
    //alert(event.data);
  }

  onClearCity() {
    this.selectedCtry = '';
    this.selectedRegn = '';
    this.selectedState = '';
    this.isHide = true;
    let cityData = {
      cityId: 0,
      cityCode: "",
      name:"",
      stateId:0,
      regnId:0,
      cntryId:0,
      filterDto:{paginationDTO:{},filterCriteria:[]},
    }
    this.loadRecords(cityData);//CityFilterInput
    this.parentFun.emit(true);
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.cityFilter);
  }

  onSort(event: any) {
   // this.isSorted = true;
  }
  

  onInnerFilter(event: any) {
    this.isSorted = false;
    setTimeout(() => {
      if (this.isFiltered && !this.isSorted) {
        this.isSorted = false;
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined ) {
            let filterCriteria={};
            if (field == "ctryCtryName") {
              filterCriteria = { fieldName: "ctry.ctryName", value: filterValue, matchMode: matchMode };
            } else if (field == "regnRegnName") {
              filterCriteria = { fieldName: "regn.regnName", value: filterValue, matchMode: matchMode };
            } else if (field == "stateStateName") {
              filterCriteria = { fieldName: "state.stateName", value: filterValue, matchMode: matchMode };
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
        this.loadRecords(this.cityFilter);
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
