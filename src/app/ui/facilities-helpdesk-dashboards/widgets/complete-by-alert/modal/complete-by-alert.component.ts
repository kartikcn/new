import { Component, OnInit } from '@angular/core';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';

@Component({
  selector: 'app-complete-by-alert',
  templateUrl: './complete-by-alert.component.html',
  styleUrls: ['./complete-by-alert.component.scss']
})
export class CompleteByAlertComponent implements OnInit {
  requestCount: number = 5;
  allRequestsData: any[] = [];
  esctdResponseData: any[] = [];
  esctdCompleteData: any[] = [];
  esctdCompleteAndResponseData: any[] = [];
  completeTodayData: any[] = [];
  approvalRequiredData: any[] = [];
  completeByThisWeekData: any[] = [];
  alertsData: any[] = [];
  isShowDialog: boolean = false;
  displayData: any[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumWr: Enums[] = [];
  enumStatus: Enums[] = [];
  viewForEscalation: boolean = true;
  constructor(
    private enumsrv: EnumService,
  ) { }

  ngOnInit(): void {
    this.loadEnums();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());

      }
    );
  }

  getEnumById(id: any) {
    return this.enumStatus.find((t: any) => t.id === id)?.enumValue;
  };

  createAlerts(data: any[]) {
    this.esctdResponseData = [];
    this.esctdCompleteData = [];
    this.esctdCompleteAndResponseData = [];
    this.completeTodayData = [];
    this.completeByThisWeekData = [];
    this.approvalRequiredData = data.filter((request: any) => request.isApprover === '1' && this.getEnumById(request.status) !== "Cancelled");
    const currentDate = new Date();
    const onlyCurrDate = new Date().setHours(0, 0, 0, 0);// date with time 0
    const oneWeekFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);//this week
    data.forEach((item) => {
      const { dateResponded, escDateResponded, dateCompleted, escDateCompleted, timeResponded, timeCompleted, escTimeResponded, escTimeCompleted, status } = item;

      const isEscalatedForResponse =
        (dateResponded && new Date(dateResponded + 'T' + timeResponded).getTime() > new Date(escDateResponded + 'T' + escTimeResponded).getTime()) ||
        (!dateResponded && currentDate.getTime() > new Date(escDateResponded + 'T' + escTimeResponded).getTime());

      const isEscalatedForComplete =
        (dateCompleted && new Date(dateCompleted + 'T' + timeCompleted).getTime() > new Date(escDateCompleted + 'T' + escTimeCompleted).getTime()) ||
        (!dateCompleted && currentDate.getTime() > new Date(escDateCompleted + 'T' + escTimeCompleted).getTime());
      const isCompleteByToday = (dateCompleted === null
        && ((new Date(onlyCurrDate)).getTime() === (new Date(escDateCompleted + 'T' + "00:00:00")).getTime()));
      const statusEnum = this.getEnumById(status);
      const isCompleteByWeek = (dateCompleted === null && ((new Date(oneWeekFromNow)).getTime() >= (new Date(escDateCompleted + 'T' + "00:00:00")).getTime())
        && (new Date(onlyCurrDate)).getTime() <= (new Date(escDateCompleted + 'T' + "00:00:00")).getTime());

      if (isEscalatedForResponse && statusEnum !== "Cancelled") {
        this.esctdResponseData.push(item);
      }

      if (isEscalatedForComplete && statusEnum !== "Cancelled" && statusEnum !== "Rejected") {
        this.esctdCompleteData.push(item);
      }

      if (isCompleteByToday && statusEnum !== "Cancelled" && statusEnum !== "Rejected") {
        this.completeTodayData.push(item);
      }

      if (isCompleteByWeek && statusEnum !== "Cancelled" && statusEnum !== "Rejected") {
        this.completeByThisWeekData.push(item);
      }
    });
    this.setAlertData();
  }

  setAlertData() {
    this.alertsData = [];
    if (this.approvalRequiredData.length > 0) {
      this.alertsData.push(
        { requestCount: this.approvalRequiredData.length, label: "Requests Need Approval", bgColor: '#82CAFF' }
      )
    }
    if (this.esctdResponseData.length > 0) {
      this.alertsData.push(
        { requestCount: this.esctdResponseData.length, label: "Requests Escalated for  Response", bgColor: '#C34A2C' }
      )
    }

    if (this.esctdCompleteData.length > 0) {
      this.alertsData.push(
        { requestCount: this.esctdCompleteData.length, label: "Requests Escalated for Completion", bgColor: '#F75D59' }
      )
    }

    if (this.completeTodayData.length > 0) {
      this.alertsData.push(
        { requestCount: this.completeTodayData.length, label: "Requests Due for Completion Today", bgColor: '#FDBD01' }
      )
    }

    if (this.completeByThisWeekData.length > 0) {
      this.alertsData.push(
        { requestCount: this.completeByThisWeekData.length, label: "Requests Due for Completion in a Week", bgColor: '#228B22' }
      )
    }
  }

  onRowSelect(data: any) {
    this.isShowDialog = false;
    this.viewForEscalation = true;
    switch (data.label) {
      case "Requests Need Approval":
        this.displayData = this.approvalRequiredData;
        this.isShowDialog = true;
        // this.viewForEscalation = false;
        break;
      case 'Requests Escalated for  Response':
        this.displayData = this.esctdResponseData;
        this.isShowDialog = true;
        break;
      case 'Requests Escalated for Completion':
        this.displayData = this.esctdCompleteData;
        this.isShowDialog = true;
        break;
      case "Requests Escalated For Both Response and Completion":
        this.displayData = this.esctdCompleteAndResponseData;
        this.isShowDialog = true;
        break;
      case "Requests Due for Completion Today":
        this.displayData = this.completeTodayData;
        this.isShowDialog = true;
        break;
      case "Requests Due for Completion in a Week":
        this.displayData = this.completeByThisWeekData;
        this.isShowDialog = true;
        break;
      default:
        this.isShowDialog = false;
        break;
    }
  }
}


