import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(
    private bookingService: DataService<any>,
  ) { }

  public saveBooking(data: any):Observable<any> {
    return this.bookingService.add('reservation', 'save', data);
  }

  
  public saveRecurrenceBookings(data: any):Observable<any> {
    return this.bookingService.add('recurrenceReservation', 'save', data);
  }

  public getCountOfOccurence(data: any):Observable<any> {
    return this.bookingService.add('reservation', 'getListOfOccurances', data);
  }

  public getAllBookingIds():Observable<any[]>{
    return this.bookingService.getAll('reservation', 'getallIds');
  }

  public SearchBookingsByFilter(data:any){
    return this.bookingService.search('reservation', 'searchbyfilter',data);
  }

  public SearchBookingsByFilterPaginated(data:any){
    return this.bookingService.search('reservation', 'searchbyfilterPaginated',data);
  }

  public getStatusReservations(status:any){
    return this.bookingService.getAllById('reservation', 'getbystatus',status)
  }

  public getStatusReservationsPaginated(data:any){
    return this.bookingService.search('reservation', 'getbystatusPaginated',data)
  }

  public getReqCheckBookings(){
    return this.bookingService.getAll('reservation', 'getallreqcheckin');
  }

  public getReqCheckBookingsPaginated(data:any){
    return this.bookingService.search('reservation', 'getallreqcheckinPaginated',data);
  }

  public deleteAttendeById(id:any){
    return this.bookingService.deleteById('reservation', 'deletereserveattendee',id);
 }

 public getReserveRsQtnInUse(data:any){
  return this.bookingService.search('reserveRs', 'getQuanitiyInUse',data);
}

public updateRecurrenceBookings(data: any):Observable<any> {
  return this.bookingService.add('recurrenceReservation', 'updateAll', data);
}
public getAllBookings():Observable<any>{
  return this.bookingService.getAll('reservation','getall');
}

public getCountByMonth(data:any) {
  return this.bookingService.search('reservation', 'countTotalByMonth',data);
}

public getReservationRequestByMonth(data: any){
  return this.bookingService.search("reservation", "countTotalReservationByMonth", data);
}

public printPdf(data: any){
  return this.bookingService.downloadFile('booking', 'printPdf', data);
}
}
