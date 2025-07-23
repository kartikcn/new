import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-mark-reserv',
  templateUrl: './mark-reserv.component.html',
  styleUrls: ['./mark-reserv.component.scss'],
  providers: [MessageService]
})
export class MarkReservComponent implements OnInit {
  rm_display_data: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedScreens: any[] = [];
  enumList: EnumList[] = [];
  enumRmData: EnumList[] = [];
  enumIsReservable: EnumList[] = [];
  enumIdIsReservable!: number;
  enumIdIsUnReservable!: number;
  enumIsHotelable: EnumList[] = [];
  enumIdIsHotelable!: number;
  enumIdIsUnHotelable!: number;
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
  constructor(
    private blSrv: BuildingService,
    private enumsrv: EnumService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.loadRecords();
  }

  loadRecords() {
    //this.rm_display_data=[];
    let rdata = {filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList}};
    this.blSrv.getPaginatedResevRoom(rdata).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.rm_display_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      } 
    });
  }

  markForReservation() {
    this.confirmationService.confirm({
      message: UtilConstant.MARK_RESERVE,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateForReservation();
      },
      key: "rmGrid"
    });
  }

  updateForReservation() {
    this.messageService.clear();
    this.selectedScreens.map(eachVal => {
      eachVal.isReservable = this.enumIdIsReservable;
      this.blSrv.saveRoom(eachVal).subscribe((res: any) => {
      });
    })
    this.messageService.add({ key: 'rmMessage', severity: 'success', summary: 'Records updated', detail: 'The selected rooms are now reservable' });
    this.selectedScreens = [];
  }

  markForUnReservation() {
    this.confirmationService.confirm({
      message: UtilConstant.MARK_NOT_RESERVE,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateForUnReservation();
      },
      key: "rmGrid"
    });
  }

  updateForUnReservation() {
    this.messageService.clear();
    this.selectedScreens.map(eachVal => {
      eachVal.isReservable = this.enumIdIsUnReservable;
      this.blSrv.saveRoom(eachVal).subscribe((res: any) => {
      });
    })
    this.messageService.add({ key: 'rmMessage', severity: 'success', summary: 'Records updated', detail: 'The selected rooms are no longer reservable' });
    this.selectedScreens = [];
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res.map(x => Object.assign({}, x));
        this.enumRmData = this.enumList.filter(t => t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase());
        this.enumIsReservable = this.enumRmData.filter(t => t.fieldName.toLocaleUpperCase() === 'is_reservable'.toLocaleUpperCase());
        this.enumIsReservable.map((item: any) => {
          if (item.enumValue == 'Yes') {
            this.enumIdIsReservable = item.enumKey;
          } else if (item.enumValue == 'No') {
            this.enumIdIsUnReservable = item.enumKey;
          }
        })
        this.enumIsHotelable = this.enumRmData.filter(t => t.fieldName.toLocaleUpperCase() === 'is_hotelable'.toLocaleUpperCase());
        this.enumIsHotelable.map((item: any) => {
          if (item.enumValue == 'Yes') {
            this.enumIdIsHotelable = item.enumKey;
          } else if (item.enumValue == 'No') {
            this.enumIdIsUnHotelable = item.enumKey;
          }
        })
      }
    );
  }

  getEnumById(id: any) {
    return id ? this.enumIsReservable.find(t => t.enumKey == id) != null ? this.enumIsReservable.find(t => t.enumKey == id)?.enumValue : '' : '';
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
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
        this.loadRecords();
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
