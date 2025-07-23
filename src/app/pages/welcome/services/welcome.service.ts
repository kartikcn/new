import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {
  EVENT: string = "index";
  API_NAME: string = "home";
  constructor(
    private srv: DataService<any>,
  ) { }

  public getUserDashboard(filter:any){
    return this.srv.searchByType(this.API_NAME, this.EVENT, filter);
  }
}
