import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { TeamDialogueProvider } from '../providers/team.provider';
import { TeamService } from '../services/team.service';
import { EnumService } from 'src/app/services/enum.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  providers: [MessageService]
})
export class TeamComponent implements OnInit {
  @Input() showType :boolean = true;
  teamsData: any[] = [];
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  enumTeamType: EnumList[] = [];
  enumClonedList: EnumList[]=[];
  // enumTechnicianType!: number;
  enumEmployeeType: string|null=null;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["teamId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  constructor(
    private teamProvider: TeamDialogueProvider,
    private teamService: TeamService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private enumsrv : EnumService
  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.loadRecords();
  }

  loadEnums(){
    this.enumClonedList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumClonedList = res.map(x => Object.assign({}, x));
        this.enumTeamType = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'team'.toLocaleUpperCase()
        && t.fieldName.toLocaleUpperCase() === 'team_type'.toLocaleUpperCase());
        let enumEmployee = this.enumTeamType.filter(t => t.enumValue.toLocaleUpperCase()==='Employee'.toLocaleUpperCase());
        this.enumEmployeeType = enumEmployee[0].enumKey;
      },
    );
  }

  loadRecords() {
    this.loading = true;
    let data ={
      paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList
    }
    this.isFiltered = false;
    this.teamService.getAllTeamsPaginated(data).subscribe((res: any) => {
      if (res.status != 202) {
        this.isFiltered = false;
        let content =  res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
        if(!this.showType){
          this.teamsData = content.filter( (each:any) => each.teamType==this.enumEmployeeType);
        }else{
          this.teamsData = content;
        }
      }
      else {
        this.teamsData = [];
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
    dialogConfig.width = '500px';
    dialogConfig.data = {
      isEdit: false,
      newRecord: true,
      showType:this.showType,
      enumEmployeeType:this.enumEmployeeType
    };
    this.teamProvider.openDialog(dialogConfig);
    this.teamProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'teamSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      id: id,
      isEdit: true,
      newRecord: false,
      showType:this.showType,
      enumEmployeeType:this.enumEmployeeType
    };
    this.teamProvider.openDialog(dialogConfig);
    this.teamProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'teamSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onDelete(team: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete '+team.teamCode+'?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEqStandard(team.teamId);
      },
      key: "mygrid"
    });
  }

  deleteEqStandard(id: any) {
    this.teamService.deleteById(id).subscribe((res: any) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'teamSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords();
      } else {
        this.messageService.add({ key: 'teamSave', severity: 'error', summary: 'error', detail: res.text });
      }
    },
      error => {
      }
    );
  }

  getEnumValueById(id: any) {
    return  id ? this.enumTeamType.find((t: any) => t.enumKey == id)?.enumValue: '';
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onSort(event: any) {
   // this.isSorted = true;
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
