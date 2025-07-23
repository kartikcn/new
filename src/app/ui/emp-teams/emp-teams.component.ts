import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignTeamsComponent } from '../Helpdesk/work-teams/widgets/assign-teams/assign-teams.component';
import { UnAssignTeamsComponent } from '../Helpdesk/work-teams/widgets/un-assign-teams/un-assign-teams.component';

@Component({
  selector: 'app-emp-teams',
  templateUrl: './emp-teams.component.html',
  styleUrls: ['./emp-teams.component.scss']
})
export class EmpTeamsComponent implements OnInit {
  data: any = {};
  @ViewChild(AssignTeamsComponent) assignSgPanel!: AssignTeamsComponent;
  @ViewChild(UnAssignTeamsComponent) unAssignSgPanel!: UnAssignTeamsComponent;
  constructor() { }

  ngOnInit(): void {
  }

  getData(event:any){
    this.data = {
      cfId: null,
      emId: event.data.emId,
      enumValue : 'Employee',
    }
    this.assignSgPanel.selectedPerson = event.data.firstName;
    this.unAssignSgPanel.selectedPerson = event.data.firstName;
   this.assignSgPanel.loadRecords(this.data);
    this.unAssignSgPanel.loadRecords(this.data);
    
  }

  refreshPanels(event: any) {
    if (event === true) {
      this.assignSgPanel.loadRecords(this.data);
      this.unAssignSgPanel.loadRecords(this.data);
    }
  }

}
