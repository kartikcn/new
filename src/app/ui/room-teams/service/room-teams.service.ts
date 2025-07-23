import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class RmTeamsService {

  constructor(
    private rmteamsService: DataService<any>,

  ) { }


  public getAssignedRooms(data: any) {
    return this.rmteamsService.getAllById('roomteam', 'getassignedrooms', data);
  }

  public getUnAssignedRooms(data: any) {
    return this.rmteamsService.getAllById('roomteam', 'getunassignedrooms', data);
  }

  public getAllRmTeams() {
    return this.rmteamsService.getAll('roomteam', 'getAll');
  }

  public saveRmTeam(data: any): Observable<any> {
    return this.rmteamsService.add('roomteam', 'save', data);
  }

  public deleteRmTeam(data: any): Observable<any> {
    return this.rmteamsService.add('roomteam', 'delete', data);
  }

  public getUnAssignedRmTeams(data: any) {
    return this.rmteamsService.getAllById('roomteam', 'getunassignedrmteams', data);
  }

  public updateRmTeam(data: any): Observable<any> {
    return this.rmteamsService.add('roomteam', 'update', data);
  }

}