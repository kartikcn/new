import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../services/data.service';
import { Resources } from '../model/resourcesDTO';


@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(
    private resourceService: DataService<any>,
    private resourceDetailService: DataService<Resources>

  ) { }


  public getAllResources() {
    return this.resourceService.getAll('resources', 'getResourcesList');
  }

  public getResourcesPaginated(data:any) {
    return this.resourceService.search('resources', 'getResourcesListPaginated',data);
  }
  public getResourceById(id: any) {
    return this.resourceService.getSingleById("resources", "getResourceById", id);
  }

  public saveResource(data: Resources): Observable<Resources> {
    return this.resourceDetailService.add('resources', 'save', data);
  }
  public validateResourceTitle(title: any) {
    return this.resourceService.getSingleById('resource', 'check', title);
  }


}
