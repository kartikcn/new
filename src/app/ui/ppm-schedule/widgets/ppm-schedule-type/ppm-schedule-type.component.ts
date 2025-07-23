import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { PlanScheduleService } from '../../services/plan-schedule-services';
import { DatePipe } from '@angular/common';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-ppm-schedule-type',
  templateUrl: './ppm-schedule-type.component.html',
  styleUrls: ['./ppm-schedule-type.component.scss'],
  providers: [MessageService]
})
export class PpmScheduleTypeComponent {
  scheduleDetailsForm: FormGroup;
  today: Date = new Date();
  radioValue: string = '';
  selectedWeekNumbers!: any;
  selectedDayNumbers!: any;
  selectedWeekNames!: any[];
  typeOfMonthSelection: string = 'dayOfMonth';
  weekNames: any[] = [
    { dayName: "Monday", isSelected: false },
    { dayName: "Tuesday", isSelected: false },
    { dayName: "Wednesday", isSelected: false },
    { dayName: "Thursday", isSelected: false },
    { dayName: "Friday", isSelected: false },
    { dayName: "Saturday", isSelected: false },
    { dayName: "Sunday", isSelected: false }
  ];
  weekNums: any[] = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
  weekDays: any[] = [
    { dayName: "Monday" },
    { dayName: "Tuesday" },
    { dayName: "Wednesday" },
    { dayName: "Thursday" },
    { dayName: "Friday" },
    { dayName: "Saturday" },
    { dayName: "Sunday" }
  ];
  dayOfMonth: any[] = [{ day: '1' }, { day: '2' }, { day: '3' }, { day: '4' }, { day: '5' }, { day: '6' }, { day: '7' }, { day: '8' }, { day: '9' }, { day: '10' }, { day: '11' },
  { day: '12' }, { day: '13' }, { day: '14' }, { day: '15' }, { day: '16' }, { day: '17' }, { day: '18' }, { day: '19' },
  { day: '20' }, { day: '21' }, { day: '22' }, { day: '23' }, { day: '24' }, { day: '25' }, { day: '26' }, { day: '27' }, { day: '28' },
  { day: '29' }, { day: '30' }, { day: '31' }];
  isDayOfMonthVisible: boolean = false;
  isWeekOfMonthVisible: boolean = false;
  scheduleDetails!: any;
  weeksArray = ['0', '0', '0', '0', '0', '0', '0'];
  scheduleDetailsMsg: String = '';
  isError: boolean = false;
  weeksIncluded: any[] = [];
  totalOccurence: number = 0;
  displaySchedulePattern: boolean = false;
  weekNamesString: string = '';
  allDates: any[] = [];
  maxDate!: Date;
  errorMsg: string = '';
  selectedCard: any = '';
  enumList: EnumList[] = [];
  enumPlanShedData: EnumList[] = [];
  planScheduleId: number = 0;
  scheduleDates: any[] = [];
  displaySchedulePreview: boolean = false;
  uniqueMonths: any[] = [];
  scheduleDataList: any[] = [];
  scheduleDescription: any = '';
  data: any;
  priorityList: any[] = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
  priorityErr: string = '';
  displayPriorityDetails: boolean = false;
  isEdit: boolean = false;
  monthDates: any[] = [];
  expandedIndex: number | null = null;
  uniqueMonthsData: any[] = [];
  displayScheduleExist: boolean = false;
  scheduleExistsMsg: string = '';
  maxScheduledDate: any;
  isMsgAcptd:boolean = false;
  selectedScheduleData:any;
  enumIsActiveData:Enums[]= [];
  @Input() planLocEqId: number = 0;
  @Output() parentFun = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private enumsrv: EnumService,
    private planScheduleService: PlanScheduleService,
    private datePipe: DatePipe,
    private messageService: MessageService,
  ) {
    this.scheduleDetailsForm = this.formBuilder.group({
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
      yearFrequency: [1],
      priority: [null, [Validators.required]],
      isActive: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadEnums();
  }

  setDefaultDates(dateStart: any, dateEnd: any, priority: any,isActive:any) {
    setTimeout(() => {
      this.scheduleDetailsForm.patchValue({
        dateStart: dateStart,
        dateEnd: dateEnd,
        priority: priority,
        isActive: isActive
      });

    }, 0);
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumPlanShedData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plan_sched'.toLocaleUpperCase() && t.fieldName.toLowerCase() === 'type'.toLowerCase());
        this.enumIsActiveData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plan_sched'.toLocaleUpperCase() && t.fieldName.toLowerCase() === 'is_active'.toLowerCase());
        this.enumIsActiveData.unshift(new EnumList(0,'','','Make a selection',null));
      },
      error => {
      }
    );
  }

  getScheduleTypesByPlanLocEqId() {
    this.scheduleDetailsForm.reset();
    this.setEmptyForm();
    this.selectedScheduleData = this.data.scheduleData;
    if (this.selectedScheduleData) {
      const type = this.getEnumById(this.selectedScheduleData.type);
      this.selectedCard = type;
      const planSchedule = this.selectedScheduleData;
      this.planScheduleId = planSchedule.planScheduleId;
      let dateStart = this.formatDate(planSchedule.dateStart);
      let dateEnd = this.formatDate(planSchedule.dateEnd);
      this.setDefaultDates(dateStart, dateEnd, planSchedule.priority,planSchedule.isActive);
      switch (type) {
        case "daily": {
          setTimeout(() => {
            this.scheduleDetailsForm.patchValue({
              daysFrequency: planSchedule.freq
            });

          }, 0);
          break
        }
        case "weekly": {
          const weekDaysArr = planSchedule.weekDays.split(",");
          weekDaysArr.map((value: any, index: any) => {
            if (value === "1") {
              this.weekNames[index].isSelected = true;
            }
          })
          setTimeout(() => {
            this.scheduleDetailsForm.patchValue({
              weeksFrequency: planSchedule.freq
            });

          }, 0);
          break
        }
        case "monthly": {
          if (planSchedule.monthDays.length > 0) {//check for month days 
            this.typeOfMonthSelection = 'dayOfMonth';
            this.isDayOfMonthVisible = true;
            this.isWeekOfMonthVisible = false;
            const daysArr = planSchedule.monthDays.split(",").sort();
            let selectedDays: any[] = [];
            daysArr.map((d: any) => {
              selectedDays.push({ day: d })
            })
            setTimeout(() => {
              this.scheduleDetailsForm.patchValue({
                selectedDayNumbers: selectedDays,
                monthsFrequency: planSchedule.freq
              });

            }, 0);
          } else {
            this.typeOfMonthSelection = 'weekOfMonth';
            this.isWeekOfMonthVisible = true;
            this.isDayOfMonthVisible = false;
            const weekDaysArr = planSchedule.weekDays.split(",");
            const selectedWeekNamesArr: any[] = weekDaysArr.reduce((acc: any[], value: any, index: any) => {
              if (value === "1") {
                acc.push({ dayName: this.weekDays[index].dayName });
              }
              return acc;
            }, []);

            const weeksArr = planSchedule.weeks.split(",").sort();
            let selectedWeeks: any[] = [];
            weeksArr.map((w: any) => {
              selectedWeeks.push({ id: w })
            })

            setTimeout(() => {
              this.scheduleDetailsForm.patchValue({
                selectedWeekNumbers: selectedWeeks,
                monthsFrequency2: planSchedule.freq,
                selectedWeekNames: selectedWeekNamesArr
              });
            }, 0)
          }
          break
        }
        case "annually": {
          setTimeout(() => {
            this.scheduleDetailsForm.patchValue({
              yearFrequency: planSchedule.freq
            });

          }, 0);
          break
        }
      }
    } else {
      var month = new Date().getMonth() + 6;
      this.maxDate = new Date(new Date().setMonth(month));
      var date = new Date();
      var nextDate = new Date(new Date().setDate(date.getDate() + 1));
      this.setDefaultDates(date, nextDate, 0,null);//need to be dynamic in edit case
      this.planLocEqId = this.data.planLocEqId;
      this.selectedCard = "daily";
    }

  }

  getEnumById(enumKey: any) {
    return enumKey ? this.enumPlanShedData.find(t => t.enumKey == enumKey) != null ? this.enumPlanShedData.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }

  getIdByEnum(enumValue: any) {
    return enumValue ? this.enumPlanShedData.find(t => t.enumValue == enumValue) != null ? this.enumPlanShedData.find(t => t.enumValue == enumValue)?.enumKey : '' : '';
  }

  saveRecurrence() {
    const bool = this.getScheduleDetails();
    if (bool) {
      if (this.isEdit && this.selectedScheduleData.description.slice(0, -1) != this.scheduleDescription.slice(0, -1) && !this.isMsgAcptd) {
        this.planScheduleService.checkIsScheduleGenerated(this.selectedScheduleData.planScheduleId).subscribe((res: any) => {
          if (res.text) {
            this.confirmUpdate();
          } else {
            this.maxScheduledDate = res;
            this.scheduleExistsMsg = `The Requests have already been generated for this schedule until ${this.datePipe.transform(new Date(res), "dd MMM yyyy")}.
            Any modifications to the schedule will take effect starting from the ${this.datePipe.transform(new Date(res).setDate(new Date(res).getDate()+1), "dd MMM yyyy")}
            Would you like to proceed with these changes?`;
            this.displayScheduleExist = true;
          }
        })
      } else if (this.isEdit && this.selectedScheduleData.description == this.scheduleDescription) {
        this.scheduleDetailsForm.reset();
        this.setEmptyForm();
        this.updateParent('save');
      } else {
        this.confirmUpdate();
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
        this.scheduleDetailsForm.patchValue({
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
        this.scheduleDetailsForm.patchValue({
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
      key: 'wrGrid',
      accept: () => {
        this.scheduleDetailsForm.reset();
        this.setEmptyForm();
        this.updateParent('cancel');

      }
    });
  }

  onContinue() {
    this.displaySchedulePattern = false;
    var startDate = this.datePipe.transform(this.scheduleDetailsForm.controls.dateStart.value, "yyyy-MM-dd");
    var endDate = this.datePipe.transform(this.scheduleDetailsForm.controls.dateEnd.value, "yyyy-MM-dd");
    let planScheduleData = {
      planScheduleId: this.planScheduleId,
      planLocEqId: this.planLocEqId,
      type: this.getIdByEnum(this.scheduleDetails.type),
      freq: this.scheduleDetails.frequency,
      iterations: this.totalOccurence,
      weekDays: this.scheduleDetails.weekDays,
      weeks: this.scheduleDetails.weeks,
      monthDays: this.scheduleDetails.monthDays,
      dateStart: startDate,
      dateEnd: endDate,
      description: this.scheduleDescription,
      priority: this.scheduleDetails.priority,
      scheduleDates: this.scheduleDates,
      isEdit: this.isEdit,
      isActive: this.scheduleDetails.isActive,
    }

    this.planScheduleService.savePlanSchedule(planScheduleData).subscribe((res: any) => {
      if (res.planScheduleId) {
        this.scheduleDetailsForm.reset();
        this.setEmptyForm();
        this.updateParent('save');
      }
    })
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
        this.scheduleDetailsForm.controls['dateStart'].setErrors(null);
        this.scheduleDetailsForm.controls['dateEnd'].setErrors(null);
        this.scheduleDetailsForm.clearAsyncValidators();
        this.scheduleDetailsForm.updateValueAndValidity();

        var dateFrom = new Date(this.scheduleDetailsForm.controls['dateStart'].value);
        var dateTo = new Date(this.scheduleDetailsForm.controls['dateEnd'].value);

        if (dateFrom.getTime() >= dateTo.getTime() && this.scheduleDetailsForm.controls['dateEnd'].value != null) {
          this.scheduleDetailsForm.controls['dateStart'].setErrors({ 'incorrect': true });
          this.scheduleDetailsForm.updateValueAndValidity();
          this.errorMsg = ' date end should be greater than date start.'
          return { 'incorrect': true };
        } else {
          return null;
        }
      }
      return null;
    };
  }

  checked() {
    this.isError = false;
  }

  selectCard(cardType: string) {
    this.selectedCard = cardType;
    this.displaySchedulePreview = false;
    if (cardType == 'monthly') {
      this.isDayOfMonthVisible = true;
    } else {
      this.isDayOfMonthVisible = false;
      this.isWeekOfMonthVisible = false;
    }
  }

  setEmptyForm() {
    this.typeOfMonthSelection == '';
    this.isDayOfMonthVisible = false;
    this.isWeekOfMonthVisible = false;
    this.planScheduleId = 0;
    setTimeout(() => {
      this.scheduleDetailsForm.patchValue({
        daysFrequency: 1,
        weeksFrequency: 1,
        monthsFrequency: 1,
        monthsFrequency2: 1,
        yearFrequency: 1,
        selectedWeekNames: []

      });

    }, 0);
  }

  getScheduleDetails() {
    var startDate = this.formatDate(this.scheduleDetailsForm.controls.dateStart.value);
    var endDate = this.formatDate(this.scheduleDetailsForm.controls.dateEnd.value);
    let startDateStr = this.datePipe.transform(startDate, "dd MMM yyyy");
    let endDateStr = this.datePipe.transform(endDate, "dd MMM yyyy");
    switch (this.selectedCard) {
      case "daily": {
        const frequency = this.scheduleDetailsForm.controls.daysFrequency.value;
        if (!frequency) {
          return;
        }
        this.scheduleDetails = {
          dateStart: startDate,
          dateEnd: endDate,
          type: "daily",
          frequency: frequency,
          monthDays: '',
          weekDays: '',
          weeks: ''
        };
        this.scheduleDetailsMsg = `Recurring every ${frequency > 1 ? this.convertToOrdinal(frequency) : ""} day between ${startDateStr} and ${endDateStr}`;
        break;
      }
      case "weekly": {
        const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        this.weeksIncluded = [];
        this.scheduleDetailsMsg = '';

        const weekDaysValues = weekDays.map(day => {
          const control = this.scheduleDetailsForm.controls[day];
          return control.value ? "1" : "0";
        });
        this.weeksIncluded = weekDays.filter((day, index) => weekDaysValues[index] === "1");
        const frequency = this.scheduleDetailsForm.controls.weeksFrequency.value;
        const weekLabel = frequency > 1 ? `${this.convertToOrdinal(frequency)} week` : 'week';

        if (this.weeksIncluded.length === 0 || !frequency) {
          this.isError = true;
          return;
        }

        this.scheduleDetails = {
          dateStart: startDate,
          dateEnd: endDate,
          type: "weekly",
          frequency: frequency,
          monthDays: '',
          weekDays: weekDaysValues.join(","),
          weeks: ''
        };

        this.scheduleDetailsMsg = `Recurring every ${weekLabel} on ${this.weeksIncluded.join(", ")} between ${startDateStr} and ${endDateStr}`;
        break;
      }
      case "monthly": {
        this.scheduleDetailsMsg = '';
        this.isError = false;

        if (this.typeOfMonthSelection === 'dayOfMonth') {
          const selectedDayNumbers = this.scheduleDetailsForm.controls.selectedDayNumbers.value || [];

          if (selectedDayNumbers.length === 0 || this.scheduleDetailsForm.controls.monthsFrequency.value <= 0) {
            this.isError = true;
            return;
          }

          const sortedDays = selectedDayNumbers.map((element: any) => element.day).sort();
          const frequency = this.scheduleDetailsForm.controls.monthsFrequency.value;
          const monthLabel = frequency > 1 ? "months " : "month ";

          this.scheduleDetails = {
            dateStart: startDate,
            dateEnd: endDate,
            type: "monthly",
            frequency: frequency,
            monthDays: sortedDays.toString(),
            weekDays: '',
            weeks: ''
          };

          const ordinalDayList = sortedDays.map((day: any) => this.convertToOrdinal(day)).join(", ");
          this.scheduleDetailsMsg = `Recurring every ${frequency > 1 ? frequency : ""} ${monthLabel} on  ${ordinalDayList}  of month between ${startDateStr} and ${endDateStr}`;
        } else if (this.typeOfMonthSelection === 'weekOfMonth') {
          this.weeksArray = ["0", "0", "0", "0", "0", "0", "0"];
          this.weekNamesString = '';

          this.scheduleDetailsForm.controls.selectedWeekNames.value?.forEach((element: any) => {
            const foundDay = this.weekDays.find(day => day.dayName === element.dayName);
            if (foundDay) {
              const dayIndex = this.weekDays.indexOf(foundDay);
              this.weeksArray[dayIndex] = '1';
              this.weekNamesString += foundDay.dayName + ", ";
            }
          });

          this.weekNamesString = this.weekNamesString.slice(0, -2);

          const selectedWeekNumbers = this.scheduleDetailsForm.controls.selectedWeekNumbers.value || [];

          if (selectedWeekNumbers.length === 0 || !this.weekNamesString || this.scheduleDetailsForm.controls.monthsFrequency2.value <= 0) {
            this.isError = true;
            return;
          }

          const frequency = this.scheduleDetailsForm.controls.monthsFrequency2.value;
          const weekLabel = frequency === 1 ? 'month' : frequency + ' months';

          const weeks = selectedWeekNumbers.map((element: any) => element.id).join(",");
          const weekNumbers = selectedWeekNumbers.map((element: any) => { return this.convertToOrdinal(element.id) })
          const daysOfWeek = this.weeksArray.join(",");

          this.scheduleDetails = {
            dateStart: startDate,
            dateEnd: endDate,
            type: "monthly",
            frequency: frequency,
            monthDays: '',
            weekDays: daysOfWeek.toString(),
            weeks: weeks.toString()
          };

          this.scheduleDetailsMsg = `Recurring every ${weekLabel} on ${weekNumbers.join(", ")} ${this.weekNamesString} of a month between ${startDateStr} and ${endDateStr}`;
        }
        break;
      }
      case "annually": {
        const frequency = this.scheduleDetailsForm.controls.yearFrequency.value;
        if (!frequency) {
          return;
        }
        this.scheduleDetails = {
          dateStart: startDate,
          dateEnd: endDate,
          type: "annually",
          frequency: frequency,
          monthDays: "",
          weekDays: "",
          weeks: ''
        };
        this.scheduleDetailsMsg = `Recurring every ${frequency > 1 ? this.convertToOrdinal(frequency) : ""} year between ${startDateStr} and ${endDateStr}`;
        break;
      }

      default: {
        break;
      }
    }
    this.scheduleDetails.priority = this.scheduleDetailsForm.controls.priority.value;
    this.scheduleDetails.isActive = this.scheduleDetailsForm.controls.isActive.value;
    // this.scheduleDescription = `Once ${this.scheduleDetailsMsg} from ${this.datePipe.transform(startDate, "dd MMM yyyy")} to ${this.datePipe.transform(endDate, "dd MMM yyyy")}`
    this.scheduleDescription = this.scheduleDetailsMsg + " " + this.scheduleDetailsForm.controls.priority.value;
    return true;
  }

  previewDates() {
    this.displaySchedulePreview = false;
    const bool = this.getScheduleDetails();
    if (bool) {
      this.planScheduleService.getCountOfOccurence(this.scheduleDetails).subscribe((res: any) => {
        this.scheduleDates = res;
        this.totalOccurence = res.length;
        this.uniqueMonths = this.getUniqueMonths();
        this.uniqueMonthsData = this.uniqueMonths.map(month => {
          let datesLen = this.getDatesForMonth(month).length;
          return { month: month, count: datesLen }
        })
        this.displaySchedulePreview = true;
      })
    }

  }

  // Helper function to get all unique months
  getUniqueMonths(): Date[] {
    const months: Date[] = [];
    this.scheduleDates.forEach((date) => {
      date = new Date(date);
      const month = new Date(date.getFullYear(), date.getMonth(), 1);
      if (!months.some((m) => m.getTime() === month.getTime())) {
        months.push(month);
      }
    });
    return months;
  }

  // Helper function to get all dates for a specific month
  getDatesForMonth(month: Date): Date[] {
    return this.scheduleDates.filter(
      (date) => new Date(date).getMonth() === month.getMonth() && new Date(date).getFullYear() === month.getFullYear()
    );
  }

  checkScheduleExists() {
    const planSchedule = this.scheduleDataList.length ? this.scheduleDataList.find((schedule: any) => schedule.description === this.scheduleDescription) : null;
    return planSchedule
  }

  updateParent(event: any) {
    this.parentFun.emit(event);
  }

  onTabOpen(event: any) {
    this.expandedIndex = event.index;
    let month = this.uniqueMonths[event.index];
    this.monthDates = this.getDatesForMonth(month);
  }

  onTabClose(event: any) {
    this.expandedIndex === null;
  }

  convertToOrdinal(number: number) {
    switch (number % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
    }
  }

  confirmUpdate() {
    const planSchedule = this.checkScheduleExists();
    if (planSchedule) {
      this.messageService.clear();
      this.messageService.add({ key: 'exists', severity: 'warn', summary: 'Schedule Exists', detail: 'Same schedule for this plan already exists' });
      return
    }
    this.planScheduleService.getCountOfOccurence(this.scheduleDetails).subscribe((res: any) => {
      this.scheduleDates = res;
      this.totalOccurence = res.length;
      this.onContinue();
    })
  }

  updateScheduleDates() {
    var date = new Date(this.maxScheduledDate);
    var nextDate = new Date(date.setDate(date.getDate() + 1));
    this.selectedScheduleData.dateStart = nextDate;
    this.today = nextDate;
    if (new Date(nextDate) >= new Date(this.selectedScheduleData.dateEnd)) {
      this.selectedScheduleData.dateEnd = new Date(new Date(nextDate).setDate(new Date(nextDate).getDate() + 1))
    }
    this.getScheduleTypesByPlanLocEqId();
    this.isMsgAcptd = true;
    this.displayScheduleExist = false;

  }
}

