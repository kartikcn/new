import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';


@Injectable({
  providedIn: 'root'
})
export class RequestPartsService {

  constructor(
    private service: DataService<any>,
    
  ) { }

  
  public getAllByRquestId(id:any){
    return this.service.getAllById('reqParts', 'getByRequestId',id);
  }
  
  public getById(id: any) {
    return this.service.getSingleById("reqParts", "getById",id);
  }

  public saveRequestPart(data: any): Observable<any> {
    return this.service.add('reqParts', 'save', data);
  }

  public deleteById(id: any) {
    return this.service.deleteById("reqParts", "deleteById", id);
  }

  public checkPartExist(requestId:any,partId:any) {
    return this.service.getAllByIds("reqParts", "checkExist", requestId,partId);
  }
 
}
