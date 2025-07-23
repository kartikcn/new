import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { Enums } from '../model/enums.model';
import { EnumList } from '../model/enum-list.model';
import { EnvService } from '../env.service';
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  // Declare and initialize variables
  // serverUrl = environment.baseUrl;
  serverUrl =this.env.baseUrl;
  errorData!: {};

  private enumCache$!: Observable<EnumList[]>;
  private ENUMSERVICE: string = 'enums';
  private ENUM: string = 'all';


  constructor(private enumService: DataService<EnumList>,private env: EnvService,) { }

  getEnums() {

    if (!this.enumCache$) {
      console.log("reading enums from api");
      this.enumCache$ = this.requestEnums().pipe(shareReplay(CACHE_SIZE));
    } else {
      console.log("reading enums from cache");
    }

    return this.enumCache$;
  }
  
  // getting name by id
  public getNameById(enullist: Enums[], table: string, fieldName: string, id: number) {
    return enullist.find(t => t.tableName == table && t.fieldName == fieldName && t.id === id) ? enullist.find(t => t.tableName == table && t.fieldName == fieldName && t.id === id)?.enumValue : '';
  }

  private requestEnums() {
    this.ENUM="all";
    return this.enumService.getAll(this.ENUMSERVICE, this.ENUM);
  }
 
  
}
