import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignTeamsComponent } from '../widgets/assign-teams/assign-teams.component';
import { UnAssignTeamsComponent } from '../widgets/un-assign-teams/un-assign-teams.component';

@Component({
  selector: 'app-work-teams',
  templateUrl: './work-teams.component.html',
  styleUrls: ['./work-teams.component.scss']
})
export class WorkTeamsComponent implements OnInit {
  tab_name_clicked: string = "";
  data: any = {};
  @ViewChild(AssignTeamsComponent) assignSgPanel!: AssignTeamsComponent;
  @ViewChild(UnAssignTeamsComponent) unAssignSgPanel!: UnAssignTeamsComponent;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.tab_name_clicked = 'cf';
    $("#rmtabContent,#cf").show();
  }
  openClickTab(event: any, name: any) {
    this.loadTabData(name);
    event.preventDefault();
  }

  loadTabData(name: any) {
    this.hidePrevTab(this.tab_name_clicked);
    this.tab_name_clicked = name;
    $("#rmtabContent").hide();

    switch (this.tab_name_clicked) {
      case "cf": {
        $("#rmtabContent,#cf").show();
        break;
      }
      case "em": {
        $("#rmtabContent,#em").show();
        break;
      }
      default: {
        break;
      }
    }

  }

  hidePrevTab(name: any) {
    switch (name) {
      case "cf": {
        $("#cf").hide();
        break;
      }
      case "em": {
        $("#em").hide();
        break;
      }
      default: {
        break;
      }
    }
  }
  
  getData(event: any) {
    this.data = {
      cfId: event.data.cfId ? event.data.cfId : null,
      emId: event.data.emId ? event.data.emId : null,
      enumValue : event.data.cfId ? 'Technician' : 'Employee',
    }
    this.assignSgPanel.selectedPerson = event.data.name;
    this.unAssignSgPanel.selectedPerson = event.data.name;
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
