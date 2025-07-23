import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppParamsService } from 'src/app/ui/app-params/services/app-params.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-edit-financial-year',
  templateUrl: './add-edit-financial-year.component.html',
  styleUrls: ['./add-edit-financial-year.component.scss']
})
export class AddEditFinancialYearComponent implements OnInit {

  fromMonthData: any[] = [];
  yearFormPanel: UntypedFormGroup;

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditFinancialYearComponent>,
    private formBuilder: UntypedFormBuilder,
    private confirmationService: ConfirmationService,
    private appParamsService: AppParamsService,
  ) {
    this.yearFormPanel = this.formBuilder.group({
      fromMonth: [null, [Validators.required]],
      toMonth: [null],
      paramId: [null],
      compId: [null],
      description: [null],
      paramValue: [null],
      isEditable: [null]
    });
  }

  ngOnInit(): void {
    this.fromMonthData = this.months;
    if (this.data.appParams !== null) {
      setTimeout(() => {
        this.yearFormPanel.patchValue({
          paramId: this.data.appParams.paramId,
          description: this.data.appParams.description,
          compId: this.data.appParams.compId,
          isEditable: this.data.appParams.isEditable
        })
      }, 0);
    }
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

  onSelectFromMonth(event: any) {
    if (event.id !== 0) {
      const endYearData = this.calculateFinancialYear(event.id)
      setTimeout(() => {
        this.yearFormPanel.patchValue({
          toMonth: endYearData.endMonthLable,
          paramValue: this.yearFormPanel.value.fromMonth
        })
      }, 0);
    } else {
      setTimeout(() => {
        this.yearFormPanel.patchValue({
          toMonth: null,
          fromMonth: null,
          paramValue: null
        })
      }, 0);
    }
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: "year"
    });
  }

  onSave() {
    if (this.yearFormPanel.valid) {
      const data = this.yearFormPanel.value;
      this.appParamsService.saveAppParam(data).subscribe((res: any) => {
        if (res.status != 202) {
          this.dialogRef.close(res);
        }
      })

    }
  }

}
