import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { CityList } from '../model/city-list.model';
import { CityFilterInput } from '../widgets/city-list/cityFilterInput.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(
    private cityService: DataService<any>,
    private cityDetailService: DataService<CityList>
    
  ) { }

  public getCityList(data: any){//CityFilterInput
    return this.cityService.search('city', 'search', data);
  }
  public getCityById(id:any){
    return this.cityService.getSingleById('city', 'getCity',id);
  }

  public getALLCity() {
    return this.cityService.getAll("city", "list");
  }

  public saveCity(city: any): Observable<any> {//CityList
    return this.cityDetailService.add('city', 'saveCity', city);
  }

  public validateCity(state: any) {
    return this.cityDetailService.add('city', 'check', state);
  }
}
