import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { Ctry } from '../../../model/country-list.model';
import { CountryService } from '../../../services/country.service';
import { CountryFilterInput } from './countryFilterInput.model';
import { CntryModalDialogueProvider } from '../provider/cntry.provider';
import { RegnService } from '../services/regn.service';
import { StateService } from '../services/state.service';
import { CityService } from '../services/city.service';
import { RegnFilterInput } from '../widgets/region-list/regnFilterInput.model';
import { StateFilterInput } from '../widgets/state-list/stateFilterInput.model';
import { CityFilterInput } from '../widgets/city-list/cityFilterInput.model';
import { RegionListComponent } from '../widgets/region-list/region-list.component';
import { StateListComponent } from '../widgets/state-list/state-list.component';
import { CityListComponent } from '../widgets/city-list/city-list.component';
import { UtilConstant } from '../../../../common/UtilConstant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';

declare var $: any;
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  cntryFilterPanel: UntypedFormGroup;
  confirmationResult: any;
  EnumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumCntry: CountryFilterInput[] = [];
  enumRegn: RegnFilterInput[] = [];
  enumState: StateFilterInput[] = [];
  enumCity: CityFilterInput[] = [];
  GLACCList: Enums[] = [];
  GL_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isGLList: boolean = true;
  cntryFilter!: CountryFilterInput
  displayedColumns: string[] = ['id', 'ctryId', 'ctryName'];
  dataSource!: MatTableDataSource<Ctry>;
  tab_name_clicked: string = "";
  selectedCtry: string = '';
  selectedRegn: string = '';
  selectedState: string = '';
  rowCount: number = UtilConstant.ROW_COUNT;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["ctryId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  isFiltered:boolean = false;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  @ViewChild(RegionListComponent, { static: false }) regnListPanel!: RegionListComponent;
  @ViewChild(StateListComponent, { static: false }) stateListPanel!: StateListComponent;
  @ViewChild(CityListComponent, { static: false }) cityListPanel!: CityListComponent;
  constructor(
    private fb: UntypedFormBuilder,
    private cntrySrv: CountryService,
    private regnSrv: RegnService,
    private stateSrv: StateService,
    private citySrv: CityService,
    private cntryModalDialogueProvider: CntryModalDialogueProvider,
    private cdRef: ChangeDetectorRef
  ) {
    this.cntryFilterPanel = this.fb.group({
      cntryId: [""],
      regnId: [""],
      stateId: [""],
      cityId: [""]

    });
  }

  ngOnInit(): void {
    this.loadCntry();
    this.onFilter();
  }

  ngAfterViewInit() {
   // this.onFilter();
    this.tab_name_clicked = 'Country';
    $("#locTabContent,#Country").show();
     this.cdRef.detectChanges(); 
  }

  loadCntry() {
    this.cntrySrv.getALLCountry().subscribe((res: any) => {
      this.enumCntry = res;
      this.enumCntry = res.map((i: any) => { i.name = i.code + ' - ' + i.name; return i; });
      this.enumCntry.unshift(new CountryFilterInput('', 'Make a selection'));
    });
  }

  loadRegn() {
    this.regnSrv.getALLRegn().subscribe((res: any) => {
      this.enumRegn = res;
      this.enumRegn = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumRegn.unshift(new RegnFilterInput('', 'Make a selection', ''));
    });
  }

  loadState() {
    this.stateSrv.getALLState().subscribe((res: any) => {
      this.enumState = res;
      this.enumState = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumState.unshift(new StateFilterInput('', 'Make a selection', '', ''));
    });
  }

  loadCity() {
    this.citySrv.getALLCity().subscribe((res: any) => {
      this.enumCity = res;
      this.enumCity = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumCity.unshift(new CityFilterInput('', 'Make a selection', '', '', ''));
    });
  }

  onClear() {
    this.isGLList = true;
    this.GL_data = [];
    this.loadRecords(new CountryFilterInput("", ""));
  }
  onFilter() {
    var cntry = this.cntryFilterPanel.controls.cntryId.value ? this.cntryFilterPanel.controls.cntryId.value : 0;
    var regn = this.cntryFilterPanel.controls.regnId.value ? this.cntryFilterPanel.controls.regnId.value : 0;
    var state = this.cntryFilterPanel.controls.stateId.value ? this.cntryFilterPanel.controls.stateId.value : 0;
    var city = this.cntryFilterPanel.controls.cityId.value ? this.cntryFilterPanel.controls.cityId.value : 0;
    let cntryData = {
      id: cntry,
      name: "",
      ctryCode:"",
      filterDto:{ paginationDTO: this.paginationObj,filterCriteria:this.filterCriteriaList}
    };
    let regnData = {
      id: regn,
      name: "",
      cntryId: cntry
    };
    let stateData = {
      stateId: state,
      name: "",
      regnId: regn,
      ctryId: cntry
    };
    let cityData = {
      cityId: city,
      name: "",
      regnId: regn,
      cntryId: cntry,
      stateId: state
    }
    this.loadRecords(cntryData);
  }
  loadRecords(data: CountryFilterInput) {

    this.cntryFilter = data;
    this.loading = true;
    this.isGLList = true;
    this.isFiltered = false;
    //this.GL_data = [];
    this.cntrySrv.getCountryList(data).subscribe((res: any) => {
      if (res.status != 202) {
        this.isGLList = false;
        this.isFiltered = false;
        this.GL_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.isGLList = true;
        this.GL_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(cntry_name: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      cntry_id: cntry_name,
      isEdit: true,
      newRecord: false
    };
    this.cntryModalDialogueProvider.openDialog(dialogConfig);
    this.cntryModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.cntryFilter);

    })
  }

  onAddCtry() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      cntry_id: null,
      isEdit: true,
      newRecord: true
    };
    this.cntryModalDialogueProvider.openDialog(dialogConfig);
    this.cntryModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords(this.cntryFilter);
    })
  }

  openClickCountry(event: any, name: any) {
    this.loadTabData(name);
    event.preventDefault();

  }

  loadTabData(name: any) {
   
    this.hidePrevTab(this.tab_name_clicked);
    this.tab_name_clicked = name;
    $("#locTabContent").hide();

    switch (this.tab_name_clicked) {
      case "Country": {
        this.loadCntry()
        this.selectedRegn="";
        this.selectedState="";
        $("#locTabContent,#Country").show();
        break;
      }
      case "Region": {
        this.regnListPanel.isHide = true;
        this.selectedState="";
        if (this.selectedCtry != '' && this.selectedCtry != null) {
          this.regnListPanel.selectedCtry = 'Country : ' + this.cityListPanel.getCtryNameById(this.selectedCtry);
          this.regnListPanel.isHide = false;

        } else {
          this.regnListPanel.selectedCtry = '';
        }
        let data: any = {
          id: 0,
          name: '',
          cntryId: this.selectedCtry!=''?this.selectedCtry:0,
          filterDto:{paginationDTO:{},filterCriteria:[]}
        }
        this.regnListPanel.loadRecords(data); // any need to change RegnFilterInput
        $("#locTabContent,#Region").show();
        break;
      }
      case "State": {
        this.stateListPanel.isHide = true;
        if (this.selectedCtry != '' && this.selectedCtry != null) {
          this.stateListPanel.selectedCtry = 'Country : ' + this.cityListPanel.getCtryNameById(this.selectedCtry);
          this.stateListPanel.isHide = false;
        } else {
          this.stateListPanel.selectedCtry = '';
        }
        if (this.selectedRegn != '' && this.selectedRegn != null) {
          this.stateListPanel.selectedRegn = 'Region : ' + this.cityListPanel.getRegnNameById(this.selectedRegn);
          this.stateListPanel.isHide = false;
        } else {
          this.stateListPanel.selectedRegn = '';
        }
        let data = {
          stateId: 0,
          stateCode: '',
          name: '',
          regnId: this.selectedRegn!=''?this.selectedRegn:0,
          ctryId: this.selectedCtry!=''?this.selectedCtry:0,
          filterDto:{paginationDTO:{},filterCriteria:[]}
        }
        this.stateListPanel.loadRecords(data); //StateFilterInput
        $("#locTabContent,#State").show();
        break;
      }
      case "City": {
        this.cityListPanel.isHide = true;
        if (this.selectedCtry != '' && this.selectedCtry != null) {
          this.cityListPanel.selectedCtry = 'Country : ' + this.cityListPanel.getCtryNameById(this.selectedCtry);
          this.cityListPanel.isHide = false;
        } else {
          this.cityListPanel.selectedCtry = '';
        }
        if (this.selectedRegn != '' && this.selectedRegn != null) {
          this.cityListPanel.selectedRegn = 'Region : ' + this.cityListPanel.getRegnNameById(this.selectedRegn);
          this.cityListPanel.isHide = false;
        } else {
          this.cityListPanel.selectedRegn = '';
        }
        if (this.selectedState != '' && this.selectedState != null) {
          this.cityListPanel.selectedState = 'State : ' + this.cityListPanel.getStateNameById(this.selectedState);
          this.cityListPanel.isHide = false;
        } else {
          this.cityListPanel.selectedState = '';
        }

        let cityData = {
          cityId: 0,
          cityCode: "",
          name:"",
          stateId:this.selectedState!=''?this.selectedState:0,
          regnId:this.selectedRegn!=''?this.selectedRegn:0,
          cntryId:this.selectedCtry!=''?this.selectedCtry:0,
          filterDto:{paginationDTO:{},filterCriteria:[]}
        }


        this.cityListPanel.loadRecords(cityData);//CityFilterInput
        $("#locTabContent,#City").show();
        break;
      }
      default: {
        break;
      }
    }

  }

  hidePrevTab(name: any) {
    switch (name) {
      case "Country": {
        $("#Country").hide();
        break;
      }
      case "Region": {
        $("#Region").hide();
        break;
      }
      case "State": {
        $("#State").hide();
        break;
      }
      case "City": {
        $("#City").hide();
        break;
      }
      default: {
        break;
      }
    }
  }

  onRowSelect(event: any) {
    this.regnListPanel.loadCntry();
    $("#Country").hide();
    var regn = this.cntryFilterPanel.controls.regnId.value != "" ? this.cntryFilterPanel.controls.regnId.value : 0;
    // regn = regn != null ? regn.substring(regn.indexOf("-") + 1, regn.length).trim() : "";
    let regnData = {
      id: regn,
      name: "",
      cntryId: event.data.ctryId,
      filterDto:{paginationDTO:{},filterCriteria:[]}
    };
    this.selectedCtry = event.data.ctryId;
    this.regnListPanel.selectedCtry = 'Country : ' + event.data.ctryName;
    this.regnListPanel.isHide = false;
    this.regnListPanel.loadRecords(regnData);
    this.tab_name_clicked = "Region";
    $("#locTabContent,#Region").show();


  }

  loadStateTabPanel(data: any) {
    if (data == 'regionAdded') {
      this.stateListPanel.loadCntry();
      this.stateListPanel.loadRegn();
    }
    else if (data == true) {
      this.selectedCtry = '';
      this.selectedRegn = '';
      this.regnListPanel.isHide = true;
      let data = {
        id: 0,
        name: "",
        cntryId: 0,
        filterDto:{paginationDTO:{},filterCriteria:[]}
      }
      this.regnListPanel.loadRecords(data); //) data need to be the type new RegnFilterInput(0, "", 0
    } else {
      $("#Region").hide();
      let stateData = {
        stateId: 0,
        name: "",
        stateCode: "",
        regnId: data.regnId,
        ctryId: data.ctryId,
        filterDto:{paginationDTO:{},filterCriteria:[]}
      };
      this.selectedRegn = data.regnId;
      this.stateListPanel.selectedCtry = 'Country : ' + data.ctryCtryName;
      this.stateListPanel.selectedRegn = 'Region : ' + data.regnName;
      this.stateListPanel.isHide = false;
      this.stateListPanel.loadRecords(stateData);
      this.tab_name_clicked = "State";
      $("#locTabContent,#State").show();
    }
  }

  loadCityTabPanel(data: any) {
    if (data == 'stateAdded') {
      this.cityListPanel.loadCntry();
      this.cityListPanel.loadRegn();
      this.cityListPanel.loadState();
    }
    else if (data == true) {
      this.selectedCtry = '';
      this.selectedRegn = '';
      this.stateListPanel.isHide = true;
      let stateData = {
        stateId: 0,
        name: "",
        stateCode: "",
        regnId: 0,
        ctryId: 0,
        filterDto:{paginationDTO:{},filterCriteria:[]}
      };
      this.stateListPanel.loadRecords(stateData);//StateFilterInput
    } else {
      $("#State").hide();
      let cityData = {
        cityId: 0,
        cityCode: "",
        name:"",
        stateId:data.stateId,
        regnId:data.regnId,
        cntryId:data.ctryId,
        filterDto:{paginationDTO:{},filterCriteria:[]}
      }
      this.selectedState = data.stateId;
      this.selectedCtry = data.ctryId;
      this.selectedRegn = data.regnId;
      this.cityListPanel.selectedCtry = 'Country : ' + data.ctryCtryName;
      this.cityListPanel.selectedRegn = 'Region : ' + data.regnRegnName;
      this.cityListPanel.selectedState = 'State : ' + data.stateName;
      this.cityListPanel.isHide = false;
      this.cityListPanel.loadRecords(cityData);
      this.tab_name_clicked = "City";
      $("#locTabContent,#City").show();
    }
  }

  updateCityTabPanel(event:any){
    if(event==true){
      this.selectedCtry = '';
      this.selectedRegn = '';
      this.selectedState = '';
    }
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.onFilter();
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
            let filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
            this.updateFilterCriteriaList(filterCriteria);
          }
        });
        // if (this.filterCriteriaList.length!=0) {
        //   this.paginationObj.pageNo = 0;
        // }
        this.paginationObj.pageNo = 0;
        this.onFilter();
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
