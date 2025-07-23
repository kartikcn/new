import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserRoles } from '../../system/roles/model/user-role.model';
import { EmStd } from '../model/emstd.model';
import { PaginationObj } from 'src/app/model/pagination-model';


@Injectable({
  providedIn: 'root'
})
export class EmStdService {
  API_NAME: string ="emStd";
  EVENT:string="";
  constructor(
     private emstdSrv:DataService<any>,

  ) { }

  public getEmStd(){
    this.EVENT="all";
    return this.emstdSrv.getAll(this.API_NAME, this.EVENT);
  }

  public getEmStdPaginated(data:any){
    this.EVENT="paginatedList";
    return this.emstdSrv.search(this.API_NAME, this.EVENT,data);
  }

  public saveRecord(items:EmStd){
    this.EVENT = "save";
    return this.emstdSrv.add(this.API_NAME,this.EVENT,items);
  }

  public checkEmStdExists(em_std: any) {
    return this.emstdSrv.getSingleById(this.API_NAME, 'check', em_std);
  }

  
}
