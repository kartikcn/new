import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { resourcesDialogueProvider } from '../provider/resources-provider';
import { ResourcesService } from '../service/resources.service';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  providers: [MessageService]
})
export class ResourcesComponent implements OnInit {
  resourcesData: any[] = [];
  loading: boolean = false;
  enumList: EnumList[] = [];
  enumUsers: EnumList[] = [];
  enummTypeData: EnumList[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["resourcesId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  constructor(
    private resourcesProvider: resourcesDialogueProvider,
    private service: ResourcesService,
    private enumsrv: EnumService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.loadRecords();

  }

  loadRecords() {
    this.loading = true;
    //this.resourcesData = [];
    let data ={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.service.getResourcesPaginated(data).subscribe((res: any) => {
      if (res) {
        this.loading = false;
        this.isFiltered= false;
        this.resourcesData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
    },
      error => {
        this.loading = false;
      }
    );
  }


  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res.map(x => Object.assign({}, x));
        // this.enumUsers = this.enumList.filter(t => t.tableName.toLocaleUpperCase() === 'resources'.toLocaleUpperCase());
        this.enummTypeData = this.enumList.filter(t =>t.tableName.toLocaleUpperCase() === 'resources'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'resources_type'.toLocaleUpperCase());
       // this.enummTypeData.unshift(new Enums(0, "", "", 'Make a selection'));
      },
    );
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      isEdit: false,
      newRecord: true
    };
    this.resourcesProvider.openDialog(dialogConfig);
    this.resourcesProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result != null) {
        this.messageService.add({ key: 'resourceGrid', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }
  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      resourcesId: id,
      isEdit: true,
      newRecord: false
    };
    this.resourcesProvider.openDialog(dialogConfig);
    this.resourcesProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result != null) {
        this.messageService.add({ key: 'resourceGrid', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }
  onView(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      resourcesId: id,
      isView: true,
      newRecord: false
    };
    this.resourcesProvider.openDialog(dialogConfig);
    this.resourcesProvider.onDialogueClosed.subscribe((result: any) => {
    });
  }

  getTypeById(id: any) {
    return id ? this.enummTypeData.find(t => t.enumKey == id) != null ? this.enummTypeData.find(t => t.enumKey == id)?.enumValue : '' : '';
  }

  convertToTime(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      return time;
    } else {
      return null;
    }

  }
  formatDate(date: Date) {
    if (date != null) {
      var date = new Date(date);
      var userTimezoneOffset = date.getTimezoneOffset() * 60000;
      var a = new Date(date.getTime() - userTimezoneOffset);
      return a;
    } else {
      return null;
    }
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onInnerFilter(event: any) {
    if (this.isFiltered) {
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if(filterValue !== undefined){
          let filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadRecords();
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
