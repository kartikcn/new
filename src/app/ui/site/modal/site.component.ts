import { Component, OnInit,  ViewChild, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { UserDetailsList } from 'src/app/model/user-details-list.model';
import { EnumService } from 'src/app/services/enum.service';
import { SiteService } from 'src/app/services/site.service';
import { SiteModalDialogueProvider } from '../provider/site.provider';
import { SiteFilterInput } from './siteFilterInput.model';
import { UtilConstant } from '../../../../common/UtilConstant';
import { AddSiteItemComponent } from '../widgets/add-site-item/add-site-item.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';

declare var $ : any;
@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
  providers: [MessageService]
})

export class SiteComponent implements OnInit {

  siteFilterPanel: UntypedFormGroup;
  confirmationResult: any;
  EnumList: Enums[] = [];
  enumClonedList: Enums[]=[];
  enumCC_stat: Enums[] = [];
  enumSites: SiteFilterInput[]=[];
  GLACCList: Enums[] = [];
  GL_data: any[] = [];
  selectedUser!:SiteFilterInput;
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isGLList: boolean = true;
  isView: boolean = false;
  siteFilter!:any
  displayedColumns: string[] = ['SiteId','siteName', 'long', 'lat', 'siteInfo','sitePhoto','ctryId','stateId','regnId','cityId'];
  dataSource!: MatTableDataSource<UserDetailsList>;
  rowCount: number = UtilConstant.ROW_COUNT;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["siteId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(AddSiteItemComponent, { static: false }) addSiteListPanel!: AddSiteItemComponent;
  @Output() parentFun = new EventEmitter();
  constructor(
    private fb: UntypedFormBuilder,
    private enumsrv: EnumService,
    private router: Router,
    private siteSrv:SiteService,
    private siteModalDialogueProvider: SiteModalDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    
  ) { 
    this.siteFilterPanel = this.fb.group({
      site_id: [""]

    });
  }

  ngOnInit() {
   
  }

  loadRecords(data: any) {//SiteFilterInput
    this.siteFilter = data;
    this.siteFilter.filterDto.paginationDTO = this.paginationObj;
    this.siteFilter.filterDto.filterCriteria = this.filterCriteriaList;
    this.loading = true;
    this.isGLList = true;
    this.siteSrv.getSiteList(this.siteFilter).subscribe((res: any) => {
      if (res.status != 202) {
        this.isGLList = false;
        this.isFiltered = false;
        this.GL_data =  res.content ? res.content : [];
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
   

  openEditItem(siteCode:any,siteId:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      siteCode:siteCode,
      siteId: siteId,
      isEdit: true,
      newRecord: false
    };
    this.siteModalDialogueProvider.openDialog(dialogConfig);
    this.siteModalDialogueProvider.onDialogueClosed.subscribe((result:any)=>{
      if(result == true)
        this.loadRecords(this.siteFilter);
    })
  }

 openEditItem2() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '750px';
  dialogConfig.data = {
    siteId: null,
    isEdit: true,
    newRecord: true
  };
  this.siteModalDialogueProvider.openDialog(dialogConfig);
  this.siteModalDialogueProvider.onDialogueClosed.subscribe((result:any)=>{
    console.log(result);
    this.loadRecords(this.siteFilter);
  })
}

  writeValue(value:any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      // this.frmEquipmentPositionDetails.reset();
    }
  }

  registerOnChange(fn:any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  /// Start Of UI Related Non-Trivial Functionality ///
   clear(table:Table){
     table.clear()
   }
  onRowSelect(event:any){
    this.parentFun.emit(event.data);
  }
  deleteSite(siteCode:any, siteId:any){
    
    this.userDeleteConfirm(siteCode,siteId);
  }
  deleteRecord(siteId:string){
    this.messageService.clear();
    this.siteSrv.deleteSite(siteId).subscribe((res) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'siteSuccessMessage', severity: 'success', summary: 'Record deleted successfully', detail: res.text });
        this.loadRecords(this.siteFilter);
      }
      else{
        this.messageService.add({ key: 'siteFailureMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
      }

    });
  }
  userDeleteConfirm(siteCode:any,siteId:string):void{
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete '+siteCode+'?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteRecord(siteId);
        },
        key:"siteGrid"
      });
  }
  onViewDetails(siteId:any){
    this.isView = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      isView: true,
      siteId: siteId,
      isEdit: false,
      newRecord: false
    };
    this.siteModalDialogueProvider.openDialog(dialogConfig);
    this.siteModalDialogueProvider.onDialogueClosed.subscribe((result:any)=>{
      if(result == true)
        this.loadRecords(this.siteFilter);
    })
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.siteFilter);
  }

  onSort(event: any) {
    //this.isSorted = true;
  }

  onInnerFilter(event: any) {
    this.isSorted = false;
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
      this.loadRecords(this.siteFilter);
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
