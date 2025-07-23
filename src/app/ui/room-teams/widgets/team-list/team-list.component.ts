import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Enums } from 'src/app/model/enums.model';
import { TeamService } from 'src/app/ui/Helpdesk/team/services/team.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {
  teamsData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  enumTeams: Enums[]=[];
  enumTeamType: Enums[] = [];
  enumList : Enums[]=[];
  enumClonedList: Enums[]=[];
  @Output() parentFun = new EventEmitter();
  constructor(
    private teamService: TeamService,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.teamService.getTeamsHavingEmployee().subscribe((res: any) => {
      if (res.status != 202) {
        this.teamsData = res;
      }
      else {
        this.teamsData = [];
      }
    }
    );
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event);
  }

}
