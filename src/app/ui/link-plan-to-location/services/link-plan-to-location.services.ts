import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../services/data.service';
import { Resources } from '../../resources/model/resourcesDTO';



@Injectable({
  providedIn: 'root'
})
export class LinkPlanToLocationOrAssetService {

  constructor(
    private linkPlanToLocationorAssetService: DataService<any>,

  ) { }

  public getLinkedPlansForLocation(data:any) {
    return this.linkPlanToLocationorAssetService.search('linkPlanToLocation', 'getLinked',data);
  }

  public getUnLinkedPlansForLocation(data:any) {
    return this.linkPlanToLocationorAssetService.search('linkPlanToLocation', 'getUnLinked',data);
  }
  
  public save(data: any): Observable<any> {
    return this.linkPlanToLocationorAssetService.add('linkPlanToLocationOrAsset', 'save', data);
  }

  public delete(data: any) {
    
    return this.linkPlanToLocationorAssetService.add('linkPlanToLocationOrAsset', 'delete', data);
  }

  public getAll() {
    return this.linkPlanToLocationorAssetService.getAll('linkPlanToLocation','getAll')
  }

  public getAllPaginated(data:any) {
    return this.linkPlanToLocationorAssetService.search('linkPlanToLocation','getAllPaginated',data)
  }

  public getLocPlansByPlanId(planId:any) {
    return this.linkPlanToLocationorAssetService.getAllById('linkPlanToLocation','getAllByPlanId',planId)
  }

  public getLocPlansByPlanIdPaginated(data:any) {
    return this.linkPlanToLocationorAssetService.search('linkPlanToLocation','getAllByPlanIdPaginated',data)
  }

  public checkExists(data:any) {
    return this.linkPlanToLocationorAssetService.search('linkPlanToLocation', 'checkExists',data);
  }

  public deleteById(id:any) {
    return this.linkPlanToLocationorAssetService.getSingleById('linkPlanToLocation', 'daleteById',id)
  }
 
}
