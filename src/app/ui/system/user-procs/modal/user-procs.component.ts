import { Component, OnInit, ViewChild } from '@angular/core';
import { UserRoles } from '../../roles/model/user-role.model';
import { UserAssignScreensComponent } from '../widgets/user-assign-screens/user-assign-screens.component';
import { UserUnassignScreensComponent } from '../widgets/user-unassign-screens/user-unassign-screens.component';

@Component({
  selector: 'app-user-procs',
  templateUrl: './user-procs.component.html',
  styleUrls: ['./user-procs.component.scss']
})
export class UserProcsComponent implements OnInit {
  @ViewChild(UserAssignScreensComponent) assignPanel!: UserAssignScreensComponent;
  @ViewChild(UserUnassignScreensComponent) unAssignPanel!: UserUnassignScreensComponent;
  user_role:string="";
  selectedRole:any;
  constructor() { }

  ngOnInit(): void {
  }
  getData(event:any){
    this.selectedRole = event.data;
    if (event && event.data != null) {
      this.user_role = event.data.roleName;
    }
    else {
      this.user_role = "";
    }
    this.unAssignPanel.loadUserUnAssignScreens(event.data);
    this.assignPanel.loadAssignUsersScreen(event.data);
    
  }
  refreshPanels(event:string){
    if(event === "true"){
      this.unAssignPanel.loadUserUnAssignScreens(this.selectedRole);
      this.assignPanel.loadAssignUsersScreen(this.selectedRole);
    }

  }
}
