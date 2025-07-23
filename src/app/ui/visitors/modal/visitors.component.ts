import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { visitorsDialogueProvider } from '../provider/visitors.provider';
import { VisitorsService } from '../services/visitors.service';
import { PaginationObj } from 'src/app/model/pagination-model';
@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss'],
  providers: [MessageService]
})
export class VisitorsComponent implements OnInit {
  rowCount: number = UtilConstant.ROW_COUNT;
  visitorsData: any[] = [];
  loading: boolean = false;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["visitorsId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];

  constructor(
    private visitorsProvider: visitorsDialogueProvider,
    private service: VisitorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }
  loadRecords() {
    this.loading = true;
    let data ={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.service.getAllVisitorsPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.visitorsData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.visitorsData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '800px';
    dialogConfig.data = {
      holidayDate: null,
      isEdit: true,
      newRecord: true
    };
    this.visitorsProvider.openDialog(dialogConfig);
    this.visitorsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result != null) {
        this.messageService.add({ key: 'visitorsGrid', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
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
      visitorsId: id,
      isEdit: true,
      newRecord: false
    };
    this.visitorsProvider.openDialog(dialogConfig);
    this.visitorsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result != null) {
        this.messageService.add({ key: 'visitorsGrid', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
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
      visitorsId: id,
      isView: true,
      newRecord: false
    };
    this.visitorsProvider.openDialog(dialogConfig);
    this.visitorsProvider.onDialogueClosed.subscribe((result: any) => {
    });
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
    if(this.isFiltered){
      this.filterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
          let filterCriteria = {};
          if(field=="userUserName"){
            filterCriteria = { fieldName: "user.userName", value: filterValue, matchMode: matchMode };
          }else if (field=="blBlCode"){
            filterCriteria = { fieldName: "bl.blCode", value: filterValue, matchMode: matchMode };
          }else if (field=="flFlCode"){
            filterCriteria = { fieldName: "fl.flCode", value: filterValue, matchMode: matchMode };
          }else{
            filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
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
