import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';


@Injectable({
  providedIn: 'root'
})
export class RequestOtherCostService {

  constructor(
    private service: DataService<any>,
    
  ) { }

  
  public getAllByRquestId(id:any){
    return this.service.getAllById('requestOtherCost', 'getAllCostType',id);
  }
  
  public getById(id: any) {
    return this.service.getSingleById("requestOtherCost", "getByrequestOtherCostId",id);
  }

  public saveRequestCost(data: any): Observable<any> {
    return this.service.add('requestOtherCost', 'save', data);
  }

  public deleteById(id: any) {
    return this.service.deleteById("requestOtherCost", "deleteByRequestOtherCostId", id);
  }

  public checkCostExist(requestId:any,costType:any) {
    return this.service.getAllByIds("requestOtherCost", "checkExist", requestId,costType);
  }
 
}
