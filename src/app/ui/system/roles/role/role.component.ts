import { Component, OnInit, ViewChild } from '@angular/core';
import { UserRoles } from '../model/user-role.model';
import { RoleService } from '../service/role.service';
import { AddRoleComponent } from '../widget/add-role/add-role.component';
import { RolesListComponent } from '../widget/roles-list/roles-list.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  @ViewChild(AddRoleComponent) rolePanel!:AddRoleComponent
  @ViewChild(RolesListComponent) roleGrid!: RolesListComponent;
 // roles_data: UserRoles[]=[];
  isNew:boolean=false;
  rec:UserRoles|null;
  title_suffix: string ="User Role";
  role_title: string = "";
  isShowPanel:boolean = false;
  constructor(private roleSrv:RoleService) { 
    this.rec =null;
  }

  ngOnInit(): void {
  }
  

  getData(event:any){
    if (event && event.data){
      this.isNew=false;
      this.isShowPanel=true;
      this.rec = event.data;
      this.role_title = "Edit " + this.title_suffix;
      this.rolePanel.preLoadData(this.rec);

    }
    else{
      this.isShowPanel = false;
    }
      
  }
  onAdd(){
    this.isShowPanel=true;
    this.isNew = true;
    this.rec = null;
    this.role_title = "Add " + this.title_suffix;
    this.rolePanel.preLoadData(this.rec);
  }
  getNotify(event:any){
    if(event == "cancel"){
      this.isShowPanel =false;
    }
    else if( event == "save"){
      this.roleGrid.loadRoles();
    }
  }
}
