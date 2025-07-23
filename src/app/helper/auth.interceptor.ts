import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/tokenStorage.service';

const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end
// const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    let token = this.token.getToken();
    if (token != null) {
      // for Spring Boot back-end
     // token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJGTSIsImlhdCI6MTY1NTQ2NDg3MywiZXhwIjoxNjU1NTUxMjczfQ.0sD3nRbBXw8cNDq4JhdwwieWpDtB1pfooaeDU5d0Ngm1uKy73XomBQILaxs_1Hqab3qOM9VBnVmIj5i2N7Gbkw";

      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

      // for Node.js Express back-end
      // authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
