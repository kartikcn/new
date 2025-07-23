import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../services/data.service';
import { Visitors } from '../model/visitorsDTO';



@Injectable({
  providedIn: 'root'
})
export class VisitorsService {

  constructor(
    private visitorsService: DataService<any>,
    private visitorsDetailService: DataService<Visitors>

  ) { }


  public getAllVisitors() {
    return this.visitorsService.getAll('visitors', 'getVisitorsList');
  }

  public getAllVisitorsPaginated(data:any) {
    return this.visitorsService.search('visitors', 'getVisitorsListPaginated',data);
  }

  public getVisitorById(id: any) {
    return this.visitorsService.getSingleById("visitors", "getVisitorById", id);
  }

  public saveVisitor(data: Visitors): Observable<Visitors> {
    return this.visitorsDetailService.add('visitors', 'save', data);
  }
  public validateVisitorEmail(email: any) {
    return this.visitorsService.getSingleById('visitors', 'check', email);
  }


}
