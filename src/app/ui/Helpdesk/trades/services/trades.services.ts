import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class TradesService {

  constructor(
    private tradesService: DataService<any>,

  ) { }


  public getAllTrades() {
    return this.tradesService.getAll('trade', 'getAll');
  }

  public getAllTradesPaginated(data:any) {
    return this.tradesService.search('trade', 'getAllPaginated',data);
  }


  public getTradeById(tradeId: any) {
    return this.tradesService.getSingleById("trade", "getTradeById", tradeId);
  }

  public saveTrade(data: any): Observable<any> {
    return this.tradesService.add('trade', 'save', data);
  }

  public deleteById(tradeId: any) {
    return this.tradesService.deleteById("trade", "deleteTradeById", tradeId);
  }

  public checkTradeExists(tradeId: any) {
    return this.tradesService.getSingleById("trade", "check", tradeId);
  }
}
