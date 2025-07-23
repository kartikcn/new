import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { TeamService } from '../../../team/services/team.service';
import { EnumService } from 'src/app/services/enum.service';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-un-assign-teams',
  templateUrl: './un-assign-teams.component.html',
  styleUrls: ['./un-assign-teams.component.scss'],
  providers: [MessageService]
})
export class UnAssignTeamsComponent implements OnInit {
  @Output() unAssignSgPanels= new EventEmitter();
  rowCount: number = UtilConstant.ROW_COUNT;
  teamsData: any[] = [];
  selectedScreens: any[] = [];
  cfId!: number ;
  emId!: string;
  selectedPerson:String = '';
  enumTeamType: EnumList[] = [];
  enumClonedList: EnumList[]=[];
  constructor(
    private sgService: TeamService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private enumsrv: EnumService
  ) { }

  ngOnInit(): void {
    this.loadEnums();
  }

  loadRecords(data: any) {
    this.teamsData = [];
    this.selectedScreens = [];
    this.cfId = data.cfId;
    this.emId = data.emId;
    this.sgService.getAssignedTeams(data).subscribe((res: any) => {
      this.teamsData = res;
    })
  }

  onUnAssign() {
    let selectedUsgList: any[] = [];
    this.selectedScreens.map(team => {
      const data = {
        workTeamId: 0,
        teamId: team.teamId,
        cfId: this.cfId,
        emId: this.emId,
      }
      selectedUsgList.push(data);
    })
    this.sgService.deleteWorkTeams(selectedUsgList).subscribe((res: any) => {
      this.messageService.clear();
      if (res.code === 200) {
        this.messageService.add({ key: 'unUsgGrid', severity: 'success', summary: 'Record(s) Unassigned successfully', detail: 'Record(s) Unassigned successfully' });
        this.refreshPanel();
      }
    })
  }

  refreshPanel() {
    this.unAssignSgPanels.emit(true)
  }

  confirmDialog() {
    this.confirmationService.confirm({
      message: UtilConstant.UnAssign_Warning,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onUnAssign();
      },
      key: "positionDialog"
    });
  }

  loadEnums(){
    this.enumClonedList = [];
    this.enumsrv.getEnums().subscribe(
      (res: any[]) => {
        this.enumClonedList = res.map(x => Object.assign({}, x));
        this.enumTeamType = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'team'.toLocaleUpperCase()
        && t.fieldName.toLocaleUpperCase() === 'team_type'.toLocaleUpperCase());
      },
    );
  }

  getEnumValueById(id: any) {
    return  id ? this.enumTeamType.find((t: any) => t.enumKey == id)?.enumValue: '';
  }
}
