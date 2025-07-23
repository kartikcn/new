import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { TeamService } from '../../../team/services/team.service';
import { EnumService } from 'src/app/services/enum.service';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-assign-teams',
  templateUrl: './assign-teams.component.html',
  styleUrls: ['./assign-teams.component.scss'],
  providers: [MessageService]
})
export class AssignTeamsComponent implements OnInit {
  @Output() assignSgPanels= new EventEmitter();
  rowCount: number = UtilConstant.ROW_COUNT;
  teamsData: any[] = [];
  selectedScreens: any[] = [];
  cfId!: number ;
  emId!: string;
  enumTeamType: EnumList[] = [];
  enumClonedList: EnumList[]=[];
  selectedPerson:String = ''
  constructor(
    private teamService: TeamService,
    private messageService: MessageService,
    private enumsrv: EnumService
  ) { }

  ngOnInit(): void {
    this.loadEnums();
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

  loadRecords(data: any) {
    this.teamsData = [];
    this.selectedScreens = [];
    this.cfId = data.cfId;
    this.emId = data.emId;
    this.teamService.getUnAssignedTeams(data).subscribe((res: any) => {
      this.teamsData = res;
    })
  }

  onAssign() {
    let selectedTeamsList: any[] = [];
    this.selectedScreens.map(team => {
      const data = {
        workTeamId: 0,
        teamId: team.teamId,
        cfId: this.cfId,
        emId: this.emId,
      }
      selectedTeamsList.push(data);
    })
    this.teamService.saveWorkTeams(selectedTeamsList).subscribe((res: any) => {
      this.messageService.clear();
      if (res.code === 200) {
        this.messageService.add({ key: 'UsgGrid', severity: 'success', summary: 'Record(s) Assigned successfully', detail: 'Record(s) Assigned successfully' });
        this.refreshPanel();
      }
    })
  }

  refreshPanel() {
    this.assignSgPanels.emit(true)
  }


}
