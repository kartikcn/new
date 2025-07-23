import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Holidays } from '../model/holiday.model';
import { AuthService } from '../../../services/auth.service';
import { HolidayService } from '../services/holiday.service';
import { HolidayDialogueProvider } from '../provider/holiday.provider';
import { UtilConstant } from '../../../../common/UtilConstant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
  providers: [MessageService]
})
export class HolidaysComponent implements OnInit {

  holiday_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  dataSource!: MatTableDataSource<Holidays>;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["holidaysId"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isFiltered:boolean = false;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  constructor(
    private service: HolidayService,
    private holidayDialogueProvider: HolidayDialogueProvider,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private datePipe: DatePipe,
  ) { }


  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.isFiltered= false;
    this.service.getHolidaysPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.holiday_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.holiday_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onEditHoliday(holidaysId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      holidaysId: holidaysId,
      isEdit: true,
      newRecord: false
    };
    this.holidayDialogueProvider.openDialog(dialogConfig);
    this.holidayDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords();
    });
  }

  //add button code
  onAddHoliday() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      holidaysId: 0,
      isEdit: true,
      newRecord: true
    };
    this.holidayDialogueProvider.openDialog(dialogConfig);
    this.holidayDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.loadRecords();
    });
  }

  onDelete(holiday: any,holidaysId:any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + this.datePipe.transform(holiday, "dd MMM yyyy")  + ' ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteHoliday(holidaysId);
      },
      key: "holidayGrid"
    });
  }

  deleteHoliday(id: any) {
    this.service.deleteById(id).subscribe((res: any) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'holidayMessage', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords();
      } else {
        this.messageService.add({ key: 'holidayMessage', severity: 'error', detail: res.text });
      }
    },
      error => {

      }
    );

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
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
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
