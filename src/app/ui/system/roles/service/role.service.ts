import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserRoles } from '../model/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  API_NAME: string ="userRole";
  EVENT:string="";
  constructor(
    private roleSrv:DataService<any>,
    private roleSaveSrv:DataService<any>
  ) { }

  public getUserRoles(data:any){
    this.EVENT="all";
    return this.roleSrv.search(this.API_NAME, this.EVENT,data);
  }
  public getUserRoleById(id:any){
    this.EVENT = "get";
    return this.roleSrv.getSingleById(this.API_NAME,this.EVENT,id);
  }
  public saveRecord(items:any){
    this.EVENT = "save";
    return this.roleSaveSrv.add(this.API_NAME,this.EVENT,items);
  }
  public deleteRecord(id:any){
    this.EVENT = "delete";
    return this.roleSrv.delete(this.API_NAME,this.EVENT,id);
  }
  public checkUserRoleExists(user_role: any) {
    return this.roleSrv.getSingleById(this.API_NAME, 'check', user_role);
  }
}
