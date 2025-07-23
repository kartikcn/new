import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserSreenProcs } from '../model/dto/user-screen-procs.dto';
import { UserScreenOutput } from '../model/UserScreenOutput.model';

@Injectable({
  providedIn: 'root'
})
export class UserProcsService {

  EVENT:string="";
  API_NAME: string = "screen";
  constructor(
    private UserProcsSrv:DataService<any>,
    private UserProcsSaveSrv: DataService<UserSreenProcs>
  ) { }

  public getUnAssignUserScreens(items:any){
    this.API_NAME="screen";
    this.EVENT ="get-unassign"
    return this.UserProcsSrv.search(this.API_NAME,this.EVENT,items);
  }
  public getAssignUserScreens(items:any){
    this.API_NAME = "user/screen";
    this.EVENT = "search"
    return this.UserProcsSrv.search(this.API_NAME, this.EVENT, items);
  }
  public saveUserAssignScreens(data: UserSreenProcs){
    this.API_NAME = "user/screen";
    this.EVENT = "save"
    return this.UserProcsSaveSrv.add(this.API_NAME,this.EVENT,data);
  }
  public deleteUserAssignScreens(data: UserSreenProcs) {
    this.API_NAME = "user/screen";
    this.EVENT = "delete"
    return this.UserProcsSaveSrv.add(this.API_NAME, this.EVENT, data);
  }
}
