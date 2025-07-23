import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';


@Injectable({
  providedIn: 'root'
})
export class FinancialYearService {

  constructor(
    private service: DataService<any>,
    
  ) { }

  public getFinancialYearData(paramId : any){
    return this.service.getSingleById('ap', 'get', paramId);
  }
  
  
}
