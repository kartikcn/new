import { Injectable } from '@angular/core';
import { UserDetailsList } from '../model/user-details-list.model';
import { UserFilterInput } from '../ui/user/modal/usersFilterInput.model';
import { DataService } from './data.service';
import { CountryFilterInput } from '../ui/location/modal/countryFilterInput.model';
import { Ctry } from '../model/country-list.model';
import { CountryOutputDto } from '../ui/location/model/DTO/countryOutputDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(
    private cntryService: DataService<any>,
    private cntryDetailService: DataService<CountryOutputDto>
    
  ) { }

  public getCountryList(data: CountryFilterInput){
    return this.cntryService.search('cntry', 'cntrys', data);
  }
  public getCntryById(id:any){
    return this.cntryService.getSingleById('ctry', 'getCntry',id);
  }

  public getALLCountry() {
    return this.cntryService.getAll("ctry", "list");
  }

  public saveCntry(countryOutputDto: CountryOutputDto) : Observable<CountryOutputDto>  {
    return this.cntryDetailService.add('cntry', 'saveCntry', countryOutputDto);
  }

  public validateCtry(ctryCode: any) {
    return this.cntryDetailService.getSingleById('ctry', 'check', ctryCode);
  }
}
