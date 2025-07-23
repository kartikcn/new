import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginationObj } from 'src/app/model/pagination-model';
import { EnumService } from 'src/app/services/enum.service';
import { EquipmentService } from 'src/app/ui/Helpdesk/equipment/services/equipment.services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss'],
  providers: [MessageService]
})
export class AssetListComponent {

  eqData: any[] = [];
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  enumList: any[] = []; //Enums
  enumClonedList: any[] = [];
  enumStatus: any[] = [];
  @Output() parentFun= new EventEmitter();
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["eqId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  @Input() screenName:String ="";
  constructor(
    private eqService: EquipmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private enumsrv: EnumService,
  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.loadRecords();
  }
 
  loadRecords() {
    this.loading = true;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.eqService.getAllEquipmentsPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.eqData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.eqData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: any[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'eq'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
      },
      error => {
      });
  }

  getEnumValue(enumKey:any) {
    return this.enumStatus.find(t => t.enumKey == enumKey).enumValue;
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event); 
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
          if(field=="eqStd"){
            filterCriteria = { fieldName: "eqStd.eqStd", value: filterValue, matchMode: matchMode };
          }else if(field=="blName"){
            filterCriteria = { fieldName: "bl.blName", value: filterValue, matchMode: matchMode };
          }else if(field=="flName"){
            filterCriteria = { fieldName: "fl.flName", value: filterValue, matchMode: matchMode };
          }else if(field=="rmName"){
            filterCriteria = { fieldName: "rm.rmName", value: filterValue, matchMode: matchMode };
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
