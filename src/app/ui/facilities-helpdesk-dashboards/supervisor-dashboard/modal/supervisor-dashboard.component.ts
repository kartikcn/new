import { Component, OnInit, ViewChild } from '@angular/core';
import { EnumService } from 'src/app/services/enum.service';
import { AddWorkRequestService } from 'src/app/ui/Helpdesk/work-request/service/add-work-request.services';
import { AppParamsService } from 'src/app/ui/app-params/services/app-params.service';
import { DashboardStatusPieChartComponent } from '../../widgets/dashboard-status-pie-chart/modal/dashboard-status-pie-chart.component';
import { EscalationAlertsGridComponent } from '../../widgets/escalation-alerts-grid/modal/escalation-alerts-grid.component';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { CompleteByAlertComponent } from '../../widgets/complete-by-alert/modal/complete-by-alert.component';
import { UtilConstant } from 'src/common/UtilConstant';
import { EnumList } from 'src/app/model/enum-list.model';


@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.scss']
})
export class SupervisorDashboardComponent {

  dateRequestedFrom: any;
  dateRequestedTo: any;
  allRequestData: any[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumWr: EnumList[] = [];
  enumStatus: EnumList[] = [];
  noEsctdData: any[] = [];
  myRequestsData: any[] = [];
  noEscalatedPercent: any = 0;
  intervalId:any;
  statusChartData:any = [];
  autoRefreshTime:any = 60;
  escalatedData: any=[];
  allEscalatedData: any = [];
  detailsPopUpData: any[] = [];
  showPopupFlag: boolean = false;
  basicData: any;
  viewForEscalation : boolean = true;
  
  initialStatusChartData: any = {
    requested: {
      id: 'requested',
      label: 'Requested',
      data: []
    },
    approved: {
      id: 'approved',
      label: 'Approved',
      data: []
    },
    rejected: {
      id: 'rejected',
      label: 'Rejected',
      data: []
    },
    inProcess: {
      id: 'inProcess',
      label: 'In Process',
      data: []
    },
    onHoldForAccess: {
      id: 'onHoldForAccess',
      label: 'On Hold For Access',
      data: []
    },
    onHoldForParts: {
      id: 'onHoldForParts',
      label: 'On Hold For Parts',
      data: []
    },
    onHoldForLabour: {
      id: 'onHoldForLabour',
      label: 'On Hold For Labour',
      data: []
    },
    completed: {
      id: 'completed',
      label: 'Completed',
      data: []
    },
    close: {
      id: 'close',
      label: 'Close',
      data: []
    },
    cancelled: {
      id: 'cancelled',
      label: 'Cancelled',
      data: []
    }
  };

  months: any = [
    {
      id: 0,
      label: 'Make a selection'
    },
    {
      id: 1,
      label: "January"
    },
    {
      id: 2,
      label: "February"
    },
    {
      id: 3,
      label: "March"
    },
    {
      id: 4,
      label: "April"
    },
    {
      id: 5,
      label: "May"
    },
    {
      id: 6,
      label: "June"
    },
    {
      id: 7,
      label: "July"
    },
    {
      id: 8,
      label: "August"
    },
    {
      id: 9,
      label: "September"
    },
    {
      id: 10,
      label: "October"
    },
    {
      id: 11,
      label: "November"
    },
    {
      id: 12,
      label: "December"
    }
  ];

  hrOptions: any = {
    indexAxis: 'y',
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      callbacks: {
        label(tooltipItem: any, data: any) {
          const tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return parseInt(tooltipValue, 10).toLocaleString();
        },
        title(tooltipItem: any, data: any) {
          return data.labels[tooltipItem[0].index];
        },
      },
      position: 'average',
      zIndex: 1000,
    },
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutBounce'
    },
    layout: {
      padding: {
        left: 0,
        right: 10,
      },
    },
    legend: {
      display: false,
     
    },
    plugins: {
      datalabels: {
        display: true,
        anchor: 'start',
        align: 'start',
        formatter(value: any) {
          return parseInt(value, 10).toLocaleString();
        },
        color: '#777777',
        font: {
          weight: 500,
          family: 'Roboto',
          size: 10,
        },
        clamp: true,
      },
      legend:{
        display:false
      }
    },
    scales: {
      x: {
        display: true,
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: true,
          text: 'Request Count',
          fontStyle: 'bold',
        },
      },
      y: {
        display: true,
        barThickness: 30,
        stacked: true,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  };
  
  @ViewChild(DashboardStatusPieChartComponent, { static: false }) dashboardStatusPieChartComponent!: DashboardStatusPieChartComponent;
  @ViewChild(EscalationAlertsGridComponent, { static: false }) escalationAlertsGridComponent!: EscalationAlertsGridComponent;
  @ViewChild(CompleteByAlertComponent, { static: false }) completeByAlertComponent!: CompleteByAlertComponent;

  constructor(
    private addWorkRequestService: AddWorkRequestService,
    private appParamsServ: AppParamsService,
    private enumsrv: EnumService,
    private authServ: AuthService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadEnums()
    this.loadAppParamsById()
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
      }
    )
  }

  loadAppParamsById() {
    this.appParamsServ.getAppParamByCode('financial_year').subscribe((res: any) => {
      if (res) {
        const selectedMonth = res.paramValue;
        const selectedMonthData = this.months.find((month: any) => month.label.toUpperCase() === selectedMonth.toUpperCase());
        const selectedMonthId = selectedMonthData.id;
        if (selectedMonthId > 0) {
          const endYearData = this.calculateFinancialYear(selectedMonthId);
          this.dateRequestedFrom = endYearData.startDate;
          this.dateRequestedTo = endYearData.endDate;
          this.loadWrRecords();
        }
      }
    })
  }

  loadWrRecords() {
    const filterData = {
      dateRequestedFrom: this.dateRequestedFrom,
      dateRequestedTo: this.dateRequestedTo
    }
    this.addWorkRequestService.getAllWrByFilter(filterData).subscribe((res: any[]) => {

      if (res) {

        this.allRequestData = res.map((each: any)=>{
          return {
            ...each,
            formatedDateRequested : this.datePipe.transform(each.dateRequested, 'dd MMM yyyy'),
            fromatedDateToRespond : each.escDateResponded ? this.datePipe.transform(each.escDateResponded, 'dd MMM yyyy') + " " + this.convertToDisplayTime(each.escTimeResponded) : '',
            formatedDateResponded : each.dateResponded ? this.datePipe.transform(each.dateResponded,'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.timeResponded) : '',
            formatedDateToComplete : each.escDateCompleted ?  this.datePipe.transform(each.escDateCompleted,'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.escTimeCompleted) : '',
            formatedDateCompleted : each.dateCompleted ?  this.datePipe.transform(each.dateCompleted,'dd MMM yyyy') + ' ' + this.convertToDisplayTime(each.timeCompleted) : '',
          }
        })


        this.completeByAlertComponent.createAlerts(this.allRequestData);
        this.filterByStatus();
        this.filterByEscaltion();
        this.filterByMyRequest();
      }
    })
  }

  filterByStatus() {
    this.statusChartData = {...this.initialStatusChartData}
    setTimeout(() => {
      this.statusChartData.requested.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('Requested'));
      this.statusChartData.approved.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('Approved'));
      this.statusChartData.rejected.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('Rejected'));
      this.statusChartData.onHoldForAccess.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('On Hold For Access'));
      this.statusChartData.onHoldForParts.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('On Hold For Parts'));
      this.statusChartData.onHoldForLabour.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('On Hold For Labour'));
      this.statusChartData.inProcess.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('In Process'));
      this.statusChartData.completed.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('Completed'));
      this.statusChartData.close.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('Close'));
      this.statusChartData.cancelled.data = this.allRequestData.filter(wr => wr.status === this.getIdByStatus('Cancelled'));
    }, 0);

    setTimeout(() => {
      this.dashboardStatusPieChartComponent.loadPieData(this.statusChartData);
    }, 10);
  }

  filterByEscaltion() {
    this.noEscalatedPercent = 0;
    this.noEsctdData = [];
    this.escalatedData = [];
    this.allEscalatedData = [];
    setTimeout(() => {
      let currentDate = new Date();
      this.allRequestData.forEach((item: any) => {
        const { dateResponded, escDateResponded, dateCompleted, escDateCompleted, timeResponded, timeCompleted, escTimeResponded, escTimeCompleted, status } = item;

        const isEscalatedForResponse =
          (dateResponded && new Date(dateResponded + 'T' + timeResponded).getTime() > new Date(escDateResponded + 'T' + escTimeResponded).getTime()) ||
          (!dateResponded && currentDate.getTime() > new Date(escDateResponded + 'T' + escTimeResponded).getTime());

        const isEscalatedForComplete =
          (dateCompleted && new Date(dateCompleted + 'T' + timeCompleted).getTime() > new Date(escDateCompleted + 'T' + escTimeCompleted).getTime()) ||
          (!dateCompleted && currentDate.getTime() > new Date(escDateCompleted + 'T' + escTimeCompleted).getTime());


        if (!isEscalatedForResponse && !isEscalatedForComplete && this.getValueById(status)?.toUpperCase() !== 'Cancelled'.toUpperCase()) {
          this.noEsctdData.push(item);
        }
        if ((isEscalatedForResponse || isEscalatedForComplete) && this.getValueById(status)?.toUpperCase() !== 'Cancelled'.toUpperCase()) {
          this.escalatedData.push(item);
        }
      });
      this.allEscalatedData = this.noEsctdData.concat(this.escalatedData);
      this.noEscalatedPercent = ((this.noEsctdData.length / this.allEscalatedData.length) * 100).toFixed(2);  // upto two decimal 
    }, 0);

    setTimeout(() => {
      this.escalationAlertsGridComponent.setEscalatedPercantage(this.noEscalatedPercent);
      this.setChartData(this.allEscalatedData.length, this.noEsctdData.length, this.escalatedData.length);
    }, 10);
  }

  filterByMyRequest() {
    this.myRequestsData = [];
    setTimeout(() => {
      const loggedInUserId = this.authServ.getLoggedInUserEMId();
      this.allRequestData.sort((a : any, b: any)=> b.wrId - a.wrId).filter((eachRecord: any) => {
        if (eachRecord.requestedFor === loggedInUserId || eachRecord.requestedBy === loggedInUserId || eachRecord.isTechnician === '1') {
          this.myRequestsData.push(eachRecord);
        } 
      })
    }, 0);

  }

  getIdByStatus(status: any) {
    return this.enumStatus.find((t: any) => t.enumValue.toUpperCase() === status.toUpperCase())?.enumKey;
  };

  getValueById(enumKey: any) {
    return this.enumStatus.find((t: any) => t.enumKey === enumKey)?.enumValue;
  };

  calculateFinancialYear(startingMonth: any) {
    const today = new Date(); // Get the current date
    const currentYear = today.getFullYear(); // Get the current year

    // Create a new date object for the start of the financial year
    const financialYearStart = new Date(currentYear, startingMonth - 1, 1);

    // Get the start day of the financial year
    const startDay = financialYearStart.getDate();

    // Create a new date object for the end of the financial year
    const financialYearEnd = new Date(currentYear + 1, startingMonth - 1, 0);

    // Get the end day of the financial year
    const endDay = financialYearEnd.getDate();

    const endMonth = financialYearEnd.getMonth() + 1;

    const SelectedEndMonthLable = this.months.find((month: any) => month.id === endMonth);
    const endMonthLable = SelectedEndMonthLable.label;
    // Format the start and end dates as full dates
    const startDate = this.datePipe.transform(financialYearStart,"yyyy-MM-dd");
    const endDate = this.datePipe.transform(financialYearEnd,"yyyy-MM-dd");

    // Return the start and end dates
    return {
      startDay,
      startDate,
      endDay,
      endDate,
      endMonthLable
    };
  }
   
  onClickBarChart(event: any) {
    this.detailsPopUpData = [];
    const selectedLabel = this.basicData.labels[event.element.index];
    switch (selectedLabel) {
      case 'Total':
        this.detailsPopUpData.push(...this.allEscalatedData);
        break;
      case 'Non Escalated':
        this.detailsPopUpData.push(...this.noEsctdData);
        break;
      case 'Escalated':
        this.detailsPopUpData.push(...this.escalatedData);
        break;
      default:
        break;
    }
    this.showPopupFlag = true;
  }
  
  setChartData(total: any, nonEscalated: any, escalated: any) {
    this.basicData = {
      labels:
        ['Total', 'Non Escalated', 'Escalated'],
      datasets: [
        {
          label: '',
          backgroundColor: ['blue', 'green', 'red'],
          data: [total, nonEscalated, escalated],
        },
      ]
    };
  }

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }
}
