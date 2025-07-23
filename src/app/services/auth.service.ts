import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TokenStorageService } from './tokenStorage.service';
import { CookieService } from 'ngx-cookie-service';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Initialize variables
   USER_KEY:string = 'auth-user';
  // serverUrl = environment.baseUrl;
  serverUrl = this.env.baseUrl;
  errorData: any={};
  redirectUrl: string="";
  loginStatus: EventEmitter<boolean> = new EventEmitter<boolean>(false);

   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    })
  };
  // Declare private variables
  constructor(private http: HttpClient, private router: Router,private tokenStorage:TokenStorageService,
    private cokieSrv: CookieService,private env: EnvService,) { }

  // Login function
  login(username: string, password: string) {
    // Assigning the login credentials to the body
    var body = {
      "username": username, 
      "password" : password };
    // Return the logged information
    return this.http.post<any>(`${this.serverUrl}api/v1/auth/signin`, body,this.httpOptions)
      // .pipe(
      //   catchError(this.handleError)
      // );
    //return true;
  }
refreshToken(){
    let refreshAuth = this.getAuthorizationToken(); //get refresh token from storage
    let url: string = `${this.serverUrl}api/token`;

    let body= new FormData();  	  
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", refreshAuth)
    
    return this.http.post<any>(url, body).subscribe(token => {      		
			localStorage.setItem('token', JSON.stringify(token.access_token));
      localStorage.setItem('refresh_token', JSON.stringify(token.refresh_token));
      	return token.access_token;
		});
  }
  isLoggedIn() {
    // Return true  if logged in, Otherwise return false
    if (this.tokenStorage.getToken()) {
      return true;
    }
    return false;
  }

  getAuthorizationToken() {
    // Return access token if logged in
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.access_token;
  }
  setPreviousUrl(url:any){
    localStorage.setItem('previousUrl',url);
  }
  getPreviousUrl(){
    return localStorage.getItem('previousUrl');
  }

  getLoggedInUser() {
    // Return true  if logged in, Otherwise return false
    if (sessionStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser')|| '{}');
      return currentUser.userName;
    }
    return '';
  }

  getLoggedInUserId() {
    // Return true  if logged in, Otherwise return false
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      let userData = JSON.parse(user);
      return userData.userId;
    }
    return '';
  }
  getLoggedInUserCompId(){
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      let userData = JSON.parse(user);
      return userData.compId;
    }
    return 0;
  }

  getLoggedInUserEMId() {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      let userData = JSON.parse(user);
      return userData.emId;
    }
    return 0;
  }

  getLoggedInUserRole() {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if(user){
      let userData = JSON.parse(user);
      return userData.userRoleId;
    }
  }

  getLoggedInTechnicianId() {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if(user){
      let userData = JSON.parse(user);
      return userData.technicianId;
    }
  }

  
  logout() {
    // Clear all localStorage information

    this.tokenStorage.signOut();
    this.cokieSrv.deleteAll();
    this.router.navigate(['/login']);
  }

  // Handling the errors
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: error.error.error,
      errorDesc: error.error.message,
      errorStatus: error.status
    };
    return throwError(this.errorData);
  }
  getLoggedInUserName() {
    // Return username  if logged in, Otherwise return empty string
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      let userData = JSON.parse(user);
      return userData.username;
    }
    return '';
  }
}
