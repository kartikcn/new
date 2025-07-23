import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';


@Injectable({
  providedIn: 'root'
})
export class ProblemDescriptionService {

  constructor(
    private pdService: DataService<any>,
    
   ) { }

 
   public getPdById(id:any){
    return this.pdService.getSingleById('helpDeskPd', 'getById',id);
   }

   public getALLPds() {
     return this.pdService.getAll('helpDeskPd', 'getAll');
   }

   public getALLPdsPaginated(data:any) {
    return this.pdService.search('helpDeskPd', 'getAllPaginated',data);
  }
  
   public savePd(pd: any): Observable<any> {
     return this.pdService.add('helpDeskPd', 'save', pd);
   }


   public deleteById(id: any) {
    return this.pdService.deleteById("helpDeskPd", "deleteById", id);
  }

  public checkExists(description: any) {
    return this.pdService.getSingleById('helpDeskPd', 'check', description);
  }
  
}
