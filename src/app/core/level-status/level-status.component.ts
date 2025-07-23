import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'level-status',
  templateUrl: './level-status.component.html',
  styleUrls: ['./level-status.component.scss']
})
export class LevelStatusComponent implements OnInit {

  color:string="";
  @Input() status:string="";
  constructor() {
   }

  ngOnInit(): void {

    if (this.status != null){
      switch (this.status.toLowerCase()) {
        case 'active':
          this.color = "green";
          break;

        case 'in active':
        case 'inactive':
        case 'in-active':
          this.color = "red";
          break;

        case 'suspend':
        case 'on hold':
        case 'on stop':
          this.color = "orange";
          break;

        default:
          this.color = "white";
          break;
      }
    }else{
      this.color = "white";
    }
    
  }

}
