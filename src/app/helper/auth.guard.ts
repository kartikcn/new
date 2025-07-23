import { Injectable } from '@angular/core';
import { Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';


export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router,
    private ss: SharedService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    return this.checkLogin(url);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    return this.checkLogin(url);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  canDeactivate(component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    let url: string = state.url;

    return component.canDeactivate ? component.canDeactivate() : true;
  }

  checkLogin(url: string) {
    // Return true if logged in otherwise return false
    if (this.authService.isLoggedIn()) {
      // setTimeout(() => {
      //   this.ss.change(this.authService.isLoggedIn());
      // });
      return true;
    }
    this.authService.redirectUrl = url;
    // Return login url with where it from 
    return this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
  }
}


