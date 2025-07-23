import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ToolTypeService {

  constructor(
    private service: DataService<any>,
    
  ) { }

  
  public getAllToolTypes(){
    return this.service.getAll('toolType', 'getList');
  }
  public getAllToolTypesPaginated(data:any){
    return this.service.search('toolType', 'getListPaginated',data);
  }
  public getToolTypeById(id: any) {
    return this.service.getSingleById("toolType", "getById",id);
  }

  public saveToolType(toolType: any): Observable<any> {
    return this.service.add('toolType', 'save', toolType);
  }

  public deleteById(id: any) {
    return this.service.getSingleById("toolType", "delete", id);
  }
  public checkExists(id:any){
    return this.service.getSingleById("toolType","check",id);
  }
}
