import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuildingService } from '../background-loc/services/bl.service';

@Component({
  selector: 'app-space-dashboard',
  templateUrl: './space-dashboard.component.html',
  styleUrls: ['./space-dashboard.component.scss']
})
export class SpaceDashboardComponent {
  single: any[]=[];
  dashboardDateRange : any = {dateFrom:'',dateTo:''};
  view: any[] = [200, 200];
  showLegend: boolean = true;
  showLabels: boolean = false;
  showDoughnut: boolean = true;
  isDashboardUse: boolean = false;
  hideSeriesLabel: boolean = true;
  colorSchemes = [
    {
      domain: ['#5AA454']
    },
    {
      domain: ['#E44D25']
    },
    {
      domain: ['#CFC0BB']
    },
    {
      domain: ['#7aa3e5']
    },
    {
      domain: ['#a8385d']
    }
  ];

  viewByData: any[] = [
    {
      "id": 0,
      "label": 'Current Month',
      "value": "current_month"
    },
    {
      "id": 1,
      "label": 'Current Year',
      "value": "current_year"
    },
    {
      "id": 2,
      "label": 'Current Financial Year',
      "value": "current_financial_year"
    }
  ];
 

  viewByValue: string = 'current_month';
  showSpinner: boolean = false;
  constructor(
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private blServ: BuildingService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.getDateRange();
    this.onSearch();
  }

  onViewByChange(event: any) {
    this.getDateRange();
    this.onSearch();
  }

  getDateRange(){
    this.isDashboardUse= false;
    this.cdr.detectChanges();
    let dateFrom ='';
    let dateEnd='';
    if(this.viewByValue=="current_month"){
      let result = this.getCurrentMonthFirstAndLastDate();
      let datestartvalue = result.firstDate;
      let dateendvalue = result.lastDate;
      dateFrom = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    }else if(this.viewByValue=="current_year"){
      let result = this.getCurrentYearFirstAndLastDate();
      let datestartvalue = result.firstDate;
      let dateendvalue = result.lastDate;
      dateFrom = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    }else if(this.viewByValue=="current_financial_year"){
      let result = this.getCurrentFinancialYearFirstAndLastDate();
      let datestartvalue = result.firstDate;
      let dateendvalue = result.lastDate;
      dateFrom = this.datePipe.transform(datestartvalue, "yyyy-MM-dd")!;
      dateEnd = this.datePipe.transform(dateendvalue, "yyyy-MM-dd")!;
    }
    this.dashboardDateRange.dateFrom = dateFrom;
    this.dashboardDateRange.dateTo = dateEnd;
    this.isDashboardUse = true;
    this.cdr.detectChanges();
  }

  onSearch(){
    this.showSpinner = true;
    this.spinner.show();
    this.single=[];
    this.blServ.getbuildingwiseallocation(this.dashboardDateRange).subscribe((res:any)=>{
      let result = res;
      result.forEach((blData:any)=>{
       if(blData.totalArea>0){
        this.single.push([{"name":blData.blCode,"value":blData.allocatedArea,"total":blData.totalArea}]);
       }
      })
      this.spinner.hide();
      this.showSpinner = false;
    })
  }

  getCurrentMonthFirstAndLastDate() {
    const date = new Date();
    const result = {
      firstDate: new Date(),
      lastDate: new Date(),
    };
    result.firstDate.setDate(1);
    result.firstDate.setHours(0, 0, 0, 0);
    result.lastDate.setMonth(date.getMonth() + 1, 0);
    result.lastDate.setHours(23, 59, 59, 999);
    return result;
  }

  getCurrentYearFirstAndLastDate(){
    const date = new Date();
    const firstDate = new Date(date.getFullYear(), 0, 1);
    const lastDate = new Date(date.getFullYear(), 11, 31);
    return{
      firstDate:firstDate,
      lastDate:lastDate,
    }
  }

  getCurrentFinancialYearFirstAndLastDate(){
    const currentDate = new Date();
    const financialYearStart = new Date(currentDate.getFullYear(), 3, 1);
    const nextYear = currentDate.getFullYear() + 1;
    const financialYearEnd = new Date(nextYear, 2, 31);
    return{
      firstDate:financialYearStart,
      lastDate:financialYearEnd,
    }
  }

  

}
