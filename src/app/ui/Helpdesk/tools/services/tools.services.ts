import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(
    private service: DataService<any>,

  ) { }


  public getAllTools() {
    return this.service.getAll('tools', 'getList');
  }

  public getAllToolsPaginated(data:any) {
    return this.service.search('tools', 'getListPaginated',data);
  }

  public getToolById(id: any) {
    return this.service.getSingleById("tools", "getById", id);
  }

  public saveTool(toolType: any): Observable<any> {
    return this.service.add('tools', 'save', toolType);
  }

  public deleteById(id: any) {
    return this.service.getSingleById("tools", "delete", id);
  }
  public checkExists(id: any) {
    return this.service.getSingleById("tools", "check", id);
  }
}
