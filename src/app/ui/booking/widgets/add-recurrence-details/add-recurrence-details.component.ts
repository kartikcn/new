import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { BookingService } from '../../services/booking.services';

@Component({
  selector: 'app-add-recurrence-details',
  templateUrl: './add-recurrence-details.component.html',
  styleUrls: ['./add-recurrence-details.component.scss']
})
export class AddRecurrenceDetailsComponent implements OnInit {
  recurrenceDetailsForm: UntypedFormGroup;
  today: Date = new Date();
  radioValue: string = '';
  tab_name_clicked: string = "";
  selectedWeekNumbers!: any;
  selectedDayNumbers!: any;
  selectedWeekNames!: any[];
  typeOfMonthSelection: string = 'dayOfMonth';
  weekNames: any[] = [{ dayName: "Monday" }, { dayName: "Tuesday" }, { dayName: "Wednesday" }, { dayName: "Thursday" },
  { dayName: "Friday" }, { dayName: "Saturday" }, { dayName: "Sunday" }]
  weekNums: any[] = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
  dayOfMonth: any[] = [{ day: '1' }, { day: '2' }, { day: '3' }, { day: '4' }, { day: '5' }, { day: '6' }, { day: '7' }, { day: '8' }, { day: '9' }, { day: '10' }, { day: '11' },
  { day: '12' }, { day: '13' }, { day: '14' }, { day: '15' }, { day: '16' }, { day: '17' }, { day: '18' }, { day: '19' },
  { day: '20' }, { day: '21' }, { day: '22' }, { day: '23' }, { day: '24' }, { day: '25' }, { day: '26' }, { day: '27' }, { day: '28' },
  { day: '29' }, { day: '30' }, { day: '31' }];
  isDayOfMonthVisible: boolean = true;
  isWeekOfMonthVisible: boolean = false;
  recurrenceDetails!: any;
  weeksArray = ['0', '0', '0', '0', '0', '0', '0'];
  recurrenceMsg: String = '';
  isError: boolean = false;
  weeksIncluded: any[] = [];
  totalOccurence: number = 0;
  displayRecurrencePatern: boolean = false;
  weekNamesString: string = '';
  allDates: any[] = [];
  maxDate!: Date;
  errorMsg: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddRecurrenceDetailsComponent>,
    private formBuilder: UntypedFormBuilder,
    private confirmationService: ConfirmationService,
    private bookingService: BookingService,

  ) {
    this.recurrenceDetailsForm = this.formBuilder.group({
      dateStart: [null, [Validators.required, this.checkDateValidation()]],
      dateEnd: [null, [Validators.required, this.checkDateValidation()]],
      noOfOccurence: [''],
      daysFrequency: [1],
      weeksFrequency: [1],
      Sunday: [''],
      Monday: [''],
      Tuesday: [''],
      Wednesday: [''],
      Thursday: [''],
      Friday: [''],
      Saturday: [''],
      selectedWeekNumbers: [""],
      selectedDayNumbers: [""],
      monthsFrequency: [1],
      selectedWeekNames: [''],
      monthsFrequency2: [1],
      yearFrequency: [1]
    });
  }

  ngOnInit(): void {
    this.loadTabData('daily');
    var month = new Date().getMonth() + 6;
    this.maxDate = new Date(new Date().setMonth(month));
    var date = this.data.dateStart;
   // var nextDay = date.setDate(date.getDate() + 1);
    var nextDate =new Date(new Date().setDate(date.getDate() + 1));
    setTimeout(() => {
      this.recurrenceDetailsForm.patchValue({
        dateStart: date,
        dateEnd: nextDate
      });

    }, 10);
  }
  saveRecurrence() {
    var startDate = this.formatDate(this.recurrenceDetailsForm.controls.dateStart.value);
    var endDate = this.formatDate(this.recurrenceDetailsForm.controls.dateEnd.value);
    switch (this.tab_name_clicked) {
      case "daily": {
        this.recurrenceMsg = '';
        var frequency = this.recurrenceDetailsForm.controls.daysFrequency.value;
        if (!frequency) {
          return;
        }
        this.recurrenceMsg = "Every " + (frequency > 1 ? frequency : '') + ' day(s)';
        this.recurrenceDetails = {
          dateStart: startDate,
          dateEnd: endDate,
          type: "daily",
          frequency: frequency,
          monthDays: '',
          weekDays: '',
          weeks: ''
        }
        break;
      }
      case "weekly": {
        var Sunday = '';
        var Monday = '';
        var Tuesday = '';
        var Wednesday = '';
        var Thursday = '';
        var Friday = '';
        var Saturday = '';
        this.weeksIncluded = [];
        this.recurrenceMsg = '';
        if (this.recurrenceDetailsForm.controls.Sunday.value != '') {
          Sunday = "1";
          this.recurrenceMsg = this.recurrenceMsg + this.recurrenceDetailsForm.controls.Sunday.value + ", ";
          this.weeksIncluded.push('Sunday');
        } else {
          Sunday = "0";
        }
        if (this.recurrenceDetailsForm.controls.Monday.value != '') {
          Monday = "1";
          this.recurrenceMsg = this.recurrenceMsg + this.recurrenceDetailsForm.controls.Monday.value + ", ";
          this.weeksIncluded.push("Monday");
        } else {
          Monday = "0";
        }
        if (this.recurrenceDetailsForm.controls.Tuesday.value != '') {
          Tuesday = "1";
          this.recurrenceMsg = this.recurrenceMsg + this.recurrenceDetailsForm.controls.Tuesday.value + ", ";
          this.weeksIncluded.push("Tuesday");
        } else {
          Tuesday = "0";
        }
        if (this.recurrenceDetailsForm.controls.Wednesday.value != '') {
          Wednesday = "1";
          this.recurrenceMsg = this.recurrenceMsg + this.recurrenceDetailsForm.controls.Wednesday.value + ", ";
          this.weeksIncluded.push('Wednesday');
        } else {
          Wednesday = "0";
        }
        if (this.recurrenceDetailsForm.controls.Thursday.value != '') {
          Thursday = "1";
          this.recurrenceMsg = this.recurrenceMsg + this.recurrenceDetailsForm.controls.Thursday.value + ", ";
          this.weeksIncluded.push('Thursday');
        } else {
          Thursday = "0";
        }
        if (this.recurrenceDetailsForm.controls.Friday.value != '') {
          Friday = "1";
          this.recurrenceMsg = this.recurrenceMsg + this.recurrenceDetailsForm.controls.Friday.value + ", ";
          this.weeksIncluded.push('Friday');
        } else {
          Friday = "0";
        }
        if (this.recurrenceDetailsForm.controls.Saturday.value != '') {
          Saturday = "1";
          this.recurrenceMsg = this.recurrenceMsg + this.recurrenceDetailsForm.controls.Saturday.value + ", ";
          this.weeksIncluded.push('Saturday');
        } else {
          Saturday = "0";
        }
        var frequency = this.recurrenceDetailsForm.controls.weeksFrequency.value;
        if (this.weeksIncluded.length == 0 || !frequency) {
          this.isError = true;
          return;
        }
        this.recurrenceMsg = "Every " + (frequency > 1 ? frequency : '') + " week(s) on " + this.recurrenceMsg.slice(0, this.recurrenceMsg.lastIndexOf(','));
        this.weekNamesString = this.weeksIncluded.toString();
        this.recurrenceDetails = {
          dateStart: startDate,
          dateEnd: endDate,
          type: "weekly",
          frequency: frequency,
          monthDays: '',
          weekDays: Monday + "," + Tuesday + "," + Wednesday + "," + Thursday + "," + Friday + "," + Saturday + "," + Sunday,
          weeks: ''
        }

        break;
      }
      case "monthly": {
        if (this.typeOfMonthSelection == 'dayOfMonth') {
          this.recurrenceMsg = '';
          this.isError = false
          var days: any[] = [];
          this.recurrenceDetailsForm.controls.selectedDayNumbers.value ? this.recurrenceDetailsForm.controls.selectedDayNumbers.value.forEach((element: { day: string; }) => {
            days.push(element.day);
          }) : '';
          days = days.sort();
          var Stringdays = days.toString();
          this.recurrenceMsg =  "Every " + this.recurrenceDetailsForm.controls.monthsFrequency.value + " month(s) on day(s) " +Stringdays + " of month";
          if (!Stringdays || this.recurrenceDetailsForm.controls.monthsFrequency.value <= 0) {
            this.isError = true;
            return;
          }
          this.recurrenceDetails = {
            dateStart: startDate,
            dateEnd: endDate,
            type: "monthly",
            frequency: this.recurrenceDetailsForm.controls.monthsFrequency.value,
            monthDays: Stringdays,
            weekDays: '',
            weeks: ''
          }
        } else if (this.typeOfMonthSelection == 'weekOfMonth') {
          this.recurrenceMsg = '';
          this.isError = false;
          this.weeksArray = ["0", "0", "0", "0", "0", "0", "0"];
          this.weekNamesString = '';
          this.recurrenceDetailsForm.controls.selectedWeekNames.value ? this.recurrenceDetailsForm.controls.selectedWeekNames.value.forEach((element: any) => {
            switch (element.dayName) {
              case "Monday": {
                this.weeksArray[0] = '1';
                this.weekNamesString = this.weekNamesString + element.dayName + ", ";
                break;
              }
              case "Tuesday": {
                this.weeksArray[1] = '1';
                this.weekNamesString = this.weekNamesString + element.dayName + ", ";
                break;
              }
              case "Wednesday": {
                this.weeksArray[2] = '1';
                this.weekNamesString = this.weekNamesString + element.dayName + ", ";
                break;
              }
              case "Thursday": {
                this.weeksArray[3] = '1';
                this.weekNamesString = this.weekNamesString + element.dayName + ", ";
                break;
              }
              case "Friday": {
                this.weeksArray[4] = '1';
                this.weekNamesString = this.weekNamesString + element.dayName + ", ";
                break;
              }
              case "Saturday": {
                this.weeksArray[5] = '1';
                this.weekNamesString = this.weekNamesString + element.dayName + ", ";
                break;
              }
              case "Sunday": {
                this.weeksArray[6] = '1';
                this.weekNamesString = this.weekNamesString + element.dayName + ", ";
                break;
              }
              default: {
                break;
              }
            }

          }) : "";
          this.weekNamesString = this.weekNamesString.slice(0, this.weekNamesString.lastIndexOf(','))
          var weeks = '';
          var daysOfWek = this.weeksArray.toString();
          this.recurrenceDetailsForm.controls.selectedWeekNumbers.value ? this.recurrenceDetailsForm.controls.selectedWeekNumbers.value.forEach((element: { id: string; }) => {
            weeks = weeks + element.id + ",";
          }) : '';
          weeks = weeks.slice(0, weeks.lastIndexOf(","));
          if (!weeks || !this.recurrenceDetailsForm.controls.selectedWeekNames.value.length || this.recurrenceDetailsForm.controls.monthsFrequency2.value <= 0) {
            this.isError = true;
            return;
          }
          this.recurrenceMsg = "Every " + this.recurrenceDetailsForm.controls.monthsFrequency2.value + " month(s) on "  + weeks + " " + this.weekNamesString + " of month" ;
          this.recurrenceDetails = {
            dateStart: startDate,
            dateEnd: endDate,
            type: "monthly",
            frequency: this.recurrenceDetailsForm.controls.monthsFrequency2.value,
            monthDays: '',
            weekDays: daysOfWek,
            weeks: weeks
          }
        }

        break;
      }
      case "annually": {
        this.recurrenceMsg = '';
        this.isError = false;
        var frequency = this.recurrenceDetailsForm.controls.yearFrequency.value;
        if (!frequency) {
          //this.isError = true;
          return;
        }
        this.recurrenceMsg = "Every " + frequency + " year(s)";
        this.recurrenceDetails = {
          dateStart: startDate,
          dateEnd: endDate,
          type: "annually",
          frequency: frequency,
          monthDays: "",
          weekDays: "",
          weeks: ''
        }
        break;
      }
      default: {
        break;
      }
    }
    this.bookingService.getCountOfOccurence(this.recurrenceDetails).subscribe((res: any) => {
      this.allDates = res;
      this.totalOccurence = res.length;
      this.displayRecurrencePatern = true;
      this.confirmRecurrenceDialog();
    })
    // this.dialogRef.close(result);
  }
  onSelection(event: any, name: any) {
    this.loadTabData(name);
    event.preventDefault();

  }
  loadTabData(name: any) {
    this.hidePrevTab(this.tab_name_clicked);
    this.tab_name_clicked = name;
    $("#locTabContent").hide();

    switch (this.tab_name_clicked) {
      case "daily": {
        $("#locTabContent,#daily").show();
        this.isError = false;
        break;
      }
      case "weekly": {
        $("#locTabContent,#weekly").show();
        this.isError = false;
        break;
      }
      case "monthly": {
        $("#locTabContent,#monthly").show();
        this.isError = false;
        break;
      }
      case "annually": {
        $("#locTabContent,#annually").show();
        var year = new Date().getFullYear() + 10;
        this.maxDate = new Date(new Date().setFullYear(year));
        this.isError = false;
        break;
      }
      default: {
        break;
      }
    }

  }
  hidePrevTab(name: any) {
    switch (name) {
      case "daily": {
        $("#daily").hide();
        break;
      }
      case "weekly": {
        $("#weekly").hide();
        break;
      }
      case "monthly": {
        $("#monthly").hide();
        break;
      }
      case "annually": {
        $("#annually").hide();
        break;
      }
      default: {
        break;
      }
    }
  }
  onSelectMonthlyType(event: any) {
    if (event.currentTarget.id == 'dayOfMonth') {
      this.isError = false;
      this.isDayOfMonthVisible = true;
      this.isWeekOfMonthVisible = false;
      this.typeOfMonthSelection = 'dayOfMonth';
      setTimeout(() => {
        this.recurrenceDetailsForm.patchValue({
          monthsFrequency2: 1,
          selectedWeekNames: '',
          selectedWeekNumbers: ''
        });

      }, 10);


    } else if (event.currentTarget.id == 'weekOfMonth_months') {
      this.isError = false;
      this.isWeekOfMonthVisible = true;
      this.isDayOfMonthVisible = false;
      this.typeOfMonthSelection = 'weekOfMonth';
      setTimeout(() => {
        this.recurrenceDetailsForm.patchValue({
          monthsFrequency: 1,
          selectedDayNumbers: ''
        });

      }, 10);
    }
  }


  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'onCancel',
      accept: () => {
        this.dialogRef.close(false);

      }
    });
  }
  confirmRecurrenceDialog(): void {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      key: 'onSaveRecurrence',
      accept: () => {
        this.dialogRef.close();
      }
    });
  }
  clickWeekName(event: any) {
  }
  onContinue() {
    this.displayRecurrencePatern = false;
    var result = [this.recurrenceDetails, this.recurrenceMsg, this.totalOccurence, this.allDates]
    this.dialogRef.close(result)
  }
  formatDate(date: Date) {
    if (date != null) {
      var date = new Date(date);
      var userTimezoneOffset = date.getTimezoneOffset() * 60000;
      var a = new Date(date.getTime() - userTimezoneOffset);
      return a;
    } else {
      return null;
    }
  }

  checkDateValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null) {
        this.recurrenceDetailsForm.controls['dateStart'].setErrors(null);
        this.recurrenceDetailsForm.controls['dateEnd'].setErrors(null);
        this.recurrenceDetailsForm.clearAsyncValidators();
        this.recurrenceDetailsForm.updateValueAndValidity();

        var dateFrom = new Date(this.recurrenceDetailsForm.controls['dateStart'].value);
        var dateTo = new Date(this.recurrenceDetailsForm.controls['dateEnd'].value);

        if (dateFrom.getTime() >= dateTo.getTime() && this.recurrenceDetailsForm.controls['dateEnd'].value != null) {
          this.recurrenceDetailsForm.controls['dateStart'].setErrors({ 'incorrect': true });
          this.recurrenceDetailsForm.updateValueAndValidity();
          this.errorMsg = ' date end should be greater than date start.'
          return { 'incorrect': true };
        } else {
          return null;
        }
      }
      return null;
    };
  }

  checked(){
    this.isError = false;
  }
}
