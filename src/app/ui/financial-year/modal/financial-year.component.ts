import { Component, OnInit} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { FinancialYearService } from '../services/financial-year.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { FinancialYearprovider } from '../provider/financial-year.provider';

@Component({
  selector: 'app-financial-year',
  templateUrl: './financial-year.component.html',
  styleUrls: ['./financial-year.component.scss'],
  providers: [MessageService]
})
export class FinancialYearComponent implements OnInit {

  rowCount: number = UtilConstant.ROW_COUNT;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  yearData: any[] = [];

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

  constructor(
    private messageService: MessageService,
    private financialYearServ: FinancialYearService,
    private financialyearProvider : FinancialYearprovider
  ) { }

  ngOnInit(): void {
    this.loadRecords();

  }

  loadRecords() {
    this.loading = true;
    this.financialYearServ.getFinancialYearData("financial_year").subscribe((res: any) => {
      if (res) {
        this.yearData = [res];
        this.loading = false;
      } else {
        this.yearData = [];
      }
    });
  }

  onEdit(appParams: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      appParams
    };
    this.financialyearProvider.openDialog(dialogConfig);
    this.financialyearProvider.onDialogueClosed.subscribe((result: any) => {
      if (result){
        this.messageService.clear();
        this.messageService.add({ key: 'year', severity: 'success', summary: 'Record saved successfully', detail: 'Record deleted successfully' });

        this.loadRecords();
      }
    });
  }

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
    const startDate = financialYearStart.toLocaleDateString();
    const endDate = financialYearEnd.toLocaleDateString();

    // Return the start and end dates
    return {
      startDay,
      startDate,
      endDay,
      endDate,
      endMonthLable
    };
  }

  getToMonthLable(toMonth : any){
    const selectedMonth = this.months.find((month: any) => month.label.toUpperCase() === toMonth.toUpperCase());
    const selectedMonthId = selectedMonth.id;
    if(selectedMonthId > 0){
      const toMonthData = this.calculateFinancialYear(selectedMonthId);
      return toMonthData.endMonthLable;
    }
  }

}
