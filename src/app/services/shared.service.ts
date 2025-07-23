import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  @Output() fire: EventEmitter<any> = new EventEmitter();
  private sharedData = new BehaviorSubject<boolean>(false);
  cast = this.sharedData.asObservable();


  constructor() {
    console.log('shared service started');
  }

  change(vlaue: boolean) {
    console.log('change started');
    // alert(vlaue)
    this.fire.emit(vlaue);
  }

  getEmittedValue() {
    return this.fire;
  }
  updateLogin(value:any) {
    this.sharedData.next(value);
  }

  


}
