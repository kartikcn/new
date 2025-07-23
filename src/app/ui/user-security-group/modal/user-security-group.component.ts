import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SgServices } from '../../security-group/services/securityGroup.service';
import { AssignSecurityGroupComponent } from '../widgets/assign-security-group/assign-security-group.component';
import { UnAssignSecurityGroupComponent } from '../widgets/un-assign-security-group/un-assign-security-group.component';

@Component({
  selector: 'app-user-security-group',
  templateUrl: './user-security-group.component.html',
  styleUrls: ['./user-security-group.component.scss']
})
export class UserSecurityGroupComponent implements OnInit {
  tab_name_clicked: string = "";
  data: any = {};
  @ViewChild(AssignSecurityGroupComponent) assignSgPanel!: AssignSecurityGroupComponent;
  @ViewChild(UnAssignSecurityGroupComponent) unAssignSgPanel!: UnAssignSecurityGroupComponent;
  constructor(
    private sgSrv: SgServices,
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.tab_name_clicked = 'Role';
    $("#rmtabContent,#Role").show();
    this.cdr.detectChanges();
  }
  openClickTab(event: any, name: any) {
    this.loadTabData(name);
    event.preventDefault();
  }

  loadTabData(name: any) {
    this.hidePrevTab(this.tab_name_clicked);
    this.assignSgPanel.Sg_data = [];
    this.unAssignSgPanel.Sg_data = [];
    this.tab_name_clicked = name;
    $("#rmtabContent").hide();

    switch (this.tab_name_clicked) {
      case "Role": {
        $("#rmtabContent,#Role").show();
        break;
      }
      case "User": {
        $("#rmtabContent,#User").show();
        break;
      }
      default: {
        break;
      }
    }

  }

  hidePrevTab(name: any) {
    switch (name) {
      case "Role": {
        $("#Role").hide();
        break;
      }
      case "User": {
        $("#User").hide();
        break;
      }
      default: {
        break;
      }
    }
  }
  
  getData(event: any) {
    this.data = {
      userId: event.data.id ? event.data.id : null,
      userRoleId: event.data.userRoleId ? event.data.userRoleId : null
    }
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
