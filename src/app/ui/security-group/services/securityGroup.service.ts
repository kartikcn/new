import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../services/data.service';


@Injectable({
  providedIn: 'root'
})
export class SgServices {

  constructor(
    private sgServices: DataService<any>,

  ) { }


  public getAll() {
    return this.sgServices.getAll('sg', 'getSgList');
  }

  public getScurityGroupPaginated(data:any) {
    return this.sgServices.search('sg', 'getSgListPaginated',data);
  }

  public getSgBySecurityGroupId(securityGroupId: any) {
    return this.sgServices.getSingleById("sg", "getSgBySecurityGroupId", securityGroupId);
  }

  public save(data: any): Observable<any> {
    return this.sgServices.add('sg', 'save', data);
  }
  public checkExists(geoupName: any) {
    return this.sgServices.getSingleById('sg', 'check', geoupName);
  }

  public getAssignedSg(data: any): Observable<any> {
    return this.sgServices.search('sg', 'getAssignedSg', data);
  }

  public getUnAssignedSg(data: any): Observable<any> {
    return this.sgServices.search('sg', 'getUnAssignedSg', data);
  }

  public saveUserSecurityGroup(data: any): Observable<any> {
    return this.sgServices.add('usg', 'save', data);
  }

  public deleteUserSecurityGroup(data: any): Observable<any> {
    return this.sgServices.add('usg', 'delete', data);
  }
}
