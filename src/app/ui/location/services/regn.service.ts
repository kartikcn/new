import { Injectable } from '@angular/core';
import { RegnList } from '../../../model/regn-list.model';
import { RegnFilterInput } from '../widgets/region-list/regnFilterInput.model';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RegnService {

  constructor(
    private cntryService: DataService<any>,
    private cntryDetailService: DataService<RegnList>
    
  ) { }

  public getRegnList(data: RegnFilterInput){
    return this.cntryService.search('regn', 'search', data);
  }
  public getRegnById(id:any){
    return this.cntryService.getSingleById('regn', 'getRegn',id);
  }

  public getALLRegn() {
    return this.cntryService.getAll("regn", "list");
  }

  public saveRegn(regn: RegnList): Observable<RegnList> {
    return this.cntryDetailService.add('regn', 'saveRegn', regn);
  }

  public validateRegn(regn: any) {
    return this.cntryService.add('regn', 'check', regn);
  }
}
