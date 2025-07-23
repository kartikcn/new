import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../services/data.service';
import { Holidays } from '../model/holiday.model';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(
    private holidayService: DataService<any>,
    private holidayDetailService: DataService<Holidays>
    
  ) { }

  
  public getHolidaysByCompId(){
    return this.holidayService.getAll('holidays', 'getHolidaysList');
  }

  public getHolidaysPaginated(data:any){
    return this.holidayService.search('holidays', 'getHolidaysListPaginated',data);
  }
  
  public getHolidayByDate(id: any) {
    return this.holidayService.getSingleById("holidays", "getHolidayByDate",id);
  }

  public saveHoliday(holiday: Holidays): Observable<Holidays> {
    return this.holidayDetailService.add('holidays', 'saveholidays', holiday);
  }

  public deleteById(holidaysId: any) {
    return this.holidayDetailService.deleteById("holidays", "deleteByHolidaysId", holidaysId);
  }

  public getHolidaysById(id:any){
    return this.holidayService.getAllById('holidays', 'getHolidays', id);
  }
}
