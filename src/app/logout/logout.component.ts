import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TokenStorageService } from '../services/tokenStorage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private route:Router,
    private tokenSrv:TokenStorageService,
    private cokieSrv:CookieService
    ) { }

  ngOnInit(): void {
    this.tokenSrv.signOut();
    this.cokieSrv.deleteAll();
    this.route.navigate(['/login']);
  }

}
