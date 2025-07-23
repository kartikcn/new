import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SiteDetailsList } from '../model/site-details-list.model';
import { SiteFilterInput } from '../ui/site/modal/siteFilterInput.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(
    private siteService: DataService<any>,
    //private siteDetailService:DataService<SiteDetailsList[]>
    private siteDetailService:DataService<SiteDetailsList>
    
  ) { }

  public getSiteList(data:SiteFilterInput){
    return this.siteService.search('site', 'list', data);
  }

   public getSiteById(id:any){
    return this.siteDetailService.getSingleById('site', 'get',id);
  }

   public getALLSites() {
     return this.siteService.getAll('site', 'getList');
   }

  
   public saveSite(site: SiteDetailsList): Observable<SiteDetailsList> {
     return this.siteDetailService.add('site', 'saveSite', site);
   }
   public deleteSite(id:any){
     return this.siteService.deleteById('site','delete',id);
   }

   public checkSiteIdExists( data : any ){
    return this.siteService.search('site','checksiteidexists',data);
  }

  public getAllSiteByScroll( data : any ){
    return this.siteService.search('site','getAllSiteByScroll',data);
  }
  
}
