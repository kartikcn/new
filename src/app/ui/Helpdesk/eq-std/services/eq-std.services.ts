import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class EqStdService {

  constructor(
    private equipmentService: DataService<any>,

  ) { }


  public getAllEqStds() {
    return this.equipmentService.getAll('eqStd', 'getAll');
  }

  public getAllEqStdsPaginated(data:any) {
    return this.equipmentService.search('eqStd', 'getAllPaginated',data);
  }

  public getEqStdById(id: any) {
    return this.equipmentService.getSingleById("eqStd", "geteqStdById", id);
  }

  public saveEqStd(data: any): Observable<any> {
    return this.equipmentService.add('eqStd', 'save', data);
  }

  public validateEqStd(eqStd: any) {
    return this.equipmentService.getSingleById('eqStd', 'check', eqStd);
  }

  public deleteById(eqStd: any) {
    return this.equipmentService.deleteById("eqStd", "deleteById", eqStd);
  }

}
