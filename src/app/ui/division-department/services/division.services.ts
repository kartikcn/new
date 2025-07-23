import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  constructor(
    private divisionService: DataService<any>,

  ) { }

  public getAllDivisions() {
    return this.divisionService.getAll('division', 'getAll');
  }

  public getById(divId: any) {
    return this.divisionService.getSingleById("division", "getById", divId);
  }

  public saveDivision(data: any): Observable<any> {
    return this.divisionService.add('division', 'save', data);
  }

  public deleteById(divId: any) {
    return this.divisionService.deleteById("division", "deleteById", divId);
  }

  public checkDivisonExists(divId: any) {
    return this.divisionService.getSingleById("division", "check", divId);
  }

  public getDivisionList(data:any){
    return this.divisionService.search('division', 'list', data);
  }

  public getAllDivisionTreeList(){
    return this.divisionService.getAll('division', 'gettreelist');
  }

  public getDivisionAreaByFloor(data:any){
    return this.divisionService.search('division', 'getareabyfloor', data);
  }

  public getDivisionWithAllocatedArea(data:any){
    return this.divisionService.search("division", "getallocatedarea", data);
  }
}
