import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ConfirmBoxDialogModalDialogueProvider } from '../confirm-box-dialog/provider/account_purchase.provider';
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
import { EnvService } from '../env.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept, x- client - key, x - client - token, x - client - secret, Authorization'
  })
};

const httpFileOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept, x- client - key, x - client - token, x - client - secret, Authorization'
  }),
  responseType: "arraybuffer" as const
};

const httpFormDataOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, x- client - key, x - client - token, x - client - secret, Authorization'
  })
};


@Injectable({
  providedIn: 'root'
})
export class DataService<Type> {

  private headers: HttpHeaders;
  // actionUrl = environment.baseUrl + 'api/v1/';
  actionUrl = this.env.baseUrl + 'api/v1/';
  //get rest api configuration from configuration.ts
  constructor(private http: HttpClient,
    private modalBox: ConfirmBoxDialogModalDialogueProvider,
    private autSrv: AuthService, private router: Router,
    private env: EnvService,
    private sharedSrv:SharedService) {
    this.headers = new HttpHeaders;
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    
  }

  public getAll(ns: string, event: string): Observable<Type[]> {
    console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns + '/' + event);
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/');
    return this.http.get(this.actionUrl + ns + '/' + event + '/', httpOptions)
      .pipe(map((response) => response as Type[]),
        catchError((err)=> this.handleError(err,this)));
  }

  public getAllById(ns: string, event: string, id: string): Observable<Type[]> {    
    console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns + '/' + event);
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/' + id + '/');
    return this.http.get(this.actionUrl + ns + '/' + event + '/' + id, httpOptions)
    .pipe(map((response) => response as Type[]),
        catchError((err)=> this.handleError(err,this)));
  }

  public getSingleByItem(ns: string, event: string, asset: Type): Observable<Type> {

    console.log('Entered DataService Filter');
    console.log('Filter ' + ns);
    console.log('asset', JSON.stringify(asset));
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/');
    return this.http.post(this.actionUrl + ns + '/' + event, asset, httpOptions)
      .pipe(map((response) => response as Type),
        catchError((err)=> this.handleError(err,this)));
  }

  public getAllByIdPost(ns: string, event: string, id: string): Observable<Type[]> {
    console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/' + id + '/');
    return this.http.post(this.actionUrl + ns + '/' + event + '/' + id, httpOptions)
      .pipe(map((response) => response as Type[]),
        catchError((err)=> this.handleError(err,this)));
  }

  public getAllByIds(ns: string, event: string, name: string, id: string): Observable<Type[]> {
    console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/' + name + '/' + id);
    return this.http.get(this.actionUrl + ns + '/' + event + '/' + name + '/' + id, httpOptions)
      .pipe(map((response) => response as Type[]),
        catchError((err)=> this.handleError(err,this)));
  }

  public getAllByAllIds(ns: string, event: string, name: string, cat: string, stat: string): Observable<Type[]> {
    console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/' + cat + '/' + stat + '/');
    return this.http.get(this.actionUrl + ns + '/' + event + '/' + name + '/' + cat + '/' + stat + '/', httpOptions)
      .pipe(map((response) => response as Type[]),
        catchError((err)=> this.handleError(err,this)));
  }

  public getSingle(ns: string, event: string, id: string): Observable<Type> {
    console.log('GetSingle ' + ns);
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/' + id + '/');
    return this.http.get(this.actionUrl + ns + '/' + event + '/' + id, httpOptions)
      .pipe(map((response) => response as Type),
        catchError((err)=> this.handleError(err,this)));
  }

  public add(ns: string, event: string, asset: Type): Observable<Type> {

    console.log('Entered DataService add');
    console.log('Add ' + ns);
    console.log('asset', JSON.stringify(asset));
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/');
    return this.http.post(this.actionUrl + ns + '/' + event, asset, httpOptions)
      .pipe(map((response) => response as Type),
        catchError((err)=> this.handleError(err,this)));
  }

  public update(ns: string, event: string,  itemToUpdate: Type): Observable<Type> {
    console.log('what is the updated item?', JSON.stringify(itemToUpdate));
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/');
    return this.http.put(`${this.actionUrl}${ns}/${event}`, itemToUpdate, httpOptions)
      .pipe(map((response) => response as Type),
        catchError((err)=> this.handleError(err,this)));
  }

  public deleteById(ns: string, event: string, id: string): Observable<Type> {
    console.log('Delete ' + ns);

    return this.http.delete(this.actionUrl + ns + '/' + event + '/' + id)
      .pipe(map((response) => response as Type),
        catchError((err)=> this.handleError(err,this)));
  }

  public delete(ns: string, event: string, asset: Type): Observable<Type> {
    console.log('Delete ' + ns);

    return this.http.put(this.actionUrl + ns + '/' + event, asset, httpOptions )
      .pipe(map((response) => response as Type),
        catchError((err)=> this.handleError(err,this)));
  }

  public search(ns: string, event: string, asset: Type): Observable<Type[]> {

    console.log('Entered DataService Filter');
    console.log('Filter ' + ns);
    console.log('asset', JSON.stringify(asset));
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/');
    return this.http.post(this.actionUrl + ns + '/' + event, asset, httpOptions)
      .pipe(map((response) => response as Type[]),
        catchError((err)=> this.handleError(err,this)));
  }

  public downloadFile(ns: string, event: string, asset: Type): Observable<Type[]> {

    console.log('Entered DataService Filter');
    console.log('Filter ' + ns);
    console.log('asset', JSON.stringify(asset));
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/');
    return this.http.post(this.actionUrl + ns + '/' + event, asset, httpFileOptions)
      .pipe(map((response) => response as any),
        catchError(this.handleError));
  }

  public getSingleById(ns: string, event: string, id: string): Observable<Type> {
    console.log('GetSingle ' + ns);
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/' + id + '/');
    return this.http.get(this.actionUrl + ns + '/' + event + '/' + id, httpOptions)
      .pipe(map((response) => response as Type) ,
        catchError((err)=> this.handleError(err,this)));
  }
  public download(ns: string, event: string, id: string): Observable<Type> {

    ;
    return this.http.get(this.actionUrl + ns + '/' + event + '/' + id, { responseType: 'blob' })
      .pipe(map((response) => response as any),
        catchError((err)=> this.handleError(err,this)));
  }

  public upload(ns: string, event: string, formData: Type): Observable<Type> {

    console.log('Entered DataService add');
    console.log('Add ' + ns);
    console.log('asset', JSON.stringify(formData));
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/');
    return this.http.post(this.actionUrl + ns + '/' + event, formData, { observe: 'response' })
      .pipe(map((response) => response as any),
        catchError((err)=> this.handleError(err,this)));
  }

  public getEvents(ns: string, event: string, id: string, flag: string): Observable<Type> {
    console.log('GetSingle ' + ns);
    console.log('payload ' + this.actionUrl + ns + '/' + event + '/' + id + '/' + flag);
    return this.http.get(this.actionUrl + ns + '/' + event + '/' + id + '/' + flag, httpOptions)
      .pipe(map((response) => response as Type),
        catchError((err)=> this.handleError(err,this)));
  }

  public searchByType(ns: string, event: string, asset: Type): Observable<Type> {

    console.log('Entered DataService getScheduleEvents');
    console.log('getScheduleEvents ' + ns);
    console.log('asset', JSON.stringify(asset));

    return this.http.post(this.actionUrl + ns + '/' + event, asset, httpOptions)
      .pipe(map((response) => response as Type),
        catchError((err)=> this.handleError(err,this)));
  }

  public sessionExpired(){
    
  }
 

  private handleError(error: HttpErrorResponse, context: any) {
    console.log("-----------------error------------------------")
    console.log(error)
    if(error.status == 406){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '550px';
      dialogConfig.data = {
        title: "Session Expired",
        message:"Please login Again"
      };
      context.modalBox.openDialog(dialogConfig);
      context.modalBox.onDialogueClosed.subscribe((result: any) => {
        context.autSrv.logout();
        context.router.navigate(['logout']);
      });

     
     
    }
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    // let errMsg = (error.message) ? error.message :
    //     error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    let errMsg = error ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return throwError(errMsg);
  }

  private extractData(res: Response): any {
    return res;
  }

}
