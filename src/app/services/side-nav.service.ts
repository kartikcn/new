import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { DataService } from './data.service';
import { TokenStorageService } from './tokenStorage.service';

const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  public sideMenuCache$!: Observable<any[]>;
  constructor(
    private srv: DataService<any>,
    private tokenSrv:TokenStorageService
  ) { }
  getSideMenu(items: any) {

    if (this.tokenSrv.getToken()) {
      console.log("reading enums from api");
      this.sideMenuCache$ = this.getSideNavMenus(items).pipe(shareReplay(CACHE_SIZE));
    } else {
      console.log("reading enums from cache");
    }

    return this.sideMenuCache$;
  }

  private getSideNavMenus(items:any){
    return this.srv.search("side-nav", "get", items);
  }
}
