import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private teamService: DataService<any>,

  ) { }


  public getAllTeams() {
    return this.teamService.getAll('team', 'getAll');
  }

  public getAllTeamsPaginated(data:any) {
    return this.teamService.search('team', 'getAllPaginated',data);
  }

  public getTeamById(teamId: any) {
    return this.teamService.getSingleById("team", "getById", teamId);
  }

  public saveTeam(data: any): Observable<any> {
    return this.teamService.add('team', 'save', data);
  }

  public validateTeam(teamId: any) {
    return this.teamService.getSingleById('team', 'check', teamId);
  }

  public deleteById(teamId: any) {
    return this.teamService.getSingleById("team", "delete", teamId);
  }

  public getAssignedTeams(data: any): Observable<any> {
    return this.teamService.search('team', 'getAssignedTeams', data);
  }

  public getUnAssignedTeams(data: any): Observable<any> {
    return this.teamService.search('team', 'getUnAssignedTeams', data);
  }

  public saveWorkTeams(data: any): Observable<any> {
    return this.teamService.add('wt', 'save', data);
  }

  public deleteWorkTeams(data: any): Observable<any> {
    return this.teamService.add('wt', 'delete', data);
  }

  public getTeamsHavingTechnician() : Observable<any> {
   return this.teamService.getAll('team', 'getTeamsHavingtechnician');
  }

  public getTeamsHavingEmployee() : Observable<any> {
    return this.teamService.getAll('team', 'getTeamsHavingemployee');
   }

}
