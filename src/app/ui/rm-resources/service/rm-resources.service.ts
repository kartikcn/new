import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../services/data.service';
import { Resources } from '../../resources/model/resourcesDTO';
import { RmResourcesDTO } from '../model/rm-resourcesDTO';



@Injectable({
  providedIn: 'root'
})
export class RmResourcesService {

  constructor(
    private rmResourceService: DataService<any>,
    private rmResourceDetailService: DataService<RmResourcesDTO>

  ) { }

  public getUnAssignedResources(data:any) {
    return this.rmResourceService.search('resources', 'getUnAssigned',data);
  }

  public getAssignedResources(data:any) {
    return this.rmResourceService.search('resources', 'getAssigned',data);
  }
  
  public saveRmResource(data: any): Observable<any> {
    return this.rmResourceDetailService.add('rmResources', 'save', data);
  }

  public deleteUserUnAssignedScreens(data: any) {
    
    return this.rmResourceDetailService.add('rmResources', 'delete', data);
  }
  public getAllRmResources(){
    return this.rmResourceService.getAll('rmResources','getAllRmResources');
  }
}
