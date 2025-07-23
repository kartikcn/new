import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { StateList } from '../model/state-list.model';
import { StateFilterInput } from '../widgets/state-list/stateFilterInput.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(
    private cntryService: DataService<any>,
    private cntryDetailService: DataService<StateList>
    
  ) { }

  public getStateList(data: any){//StateFilterInput
    return this.cntryService.search('state', 'search', data);
  }
  public getStateById(id:any){
    return this.cntryService.getSingleById('state', 'getState',id);
  }

  public getALLState() {
    return this.cntryService.getAll("state", "list");
  }
  public saveState(state: any): Observable<any> { //any need to replace StateList
    return this.cntryDetailService.add('state', 'saveState', state);
  }

  public validateState(state: any) {
    return this.cntryService.add('state', 'check', state);
  }
}
