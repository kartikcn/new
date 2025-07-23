import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { event } from 'jquery';

import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-table-request',
  templateUrl: './table-request.component.html',
  styleUrls: ['./table-request.component.scss']
})
export class RequestComponent implements OnInit {

  cols:any[]=[];
  dataRecords: any[]=[];
  rowCount: number = UtilConstant.ROW_COUNT;

  @Input() data:any;
  @Input() columns: any[]=[];
  @Input() loading = false;
  @Output() clickEvent = new EventEmitter();
  constructor(
    private authSrv:AuthService,
    private router:Router,
  ) {
   }

  
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.columns &&  changes.columns.currentValue) {
      this.loadDynamicColumns();
    }
    if (changes && changes.data &&  changes.data.currentValue) {
      this.loadData();
    }
    
  }
  loadDynamicColumns(){
    this.cols = this.columns;
  }

  loadData(){
    this.dataRecords = this.data;
  }
 onRowSelect(event:any){
    this.clickEvent.emit(event.data);
  }
  onViewDetails(data:any){
    this.clickEvent.emit(data);
  }
  
}
