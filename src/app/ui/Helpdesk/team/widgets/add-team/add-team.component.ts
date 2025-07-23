import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddTeamComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddTeamComponent),
      multi: true
    }
  ]
})
export class AddTeamComponent implements OnInit {

  teamFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  @Input() isNew!:boolean;
  enumTeamType: any[] = [];
  enumList : any[]=[];
  enumClonedList: any[]=[];
  @Input() showType!:boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private enumsrv: EnumService,
  ) {
    this.teamFormPanel = this.formBuilder.group({
      teamId: [null,[Validators.required]],
      teamCode:['',[Validators.required]],
      teamType: ['',[Validators.required]],
      description: [''],
      highlightColor : ['#a6a6a6']
    });
    this.subscriptions.push(
      this.teamFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
   }

  ngOnInit(): void {
    this.loadEnums();
  }

  loadEnums(){
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: any[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumTeamType = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'team'.toLocaleUpperCase()
        && t.fieldName.toLocaleUpperCase() === 'team_type'.toLocaleUpperCase());
        this.enumTeamType.unshift({enumKey:'',enumValue:"Make a selection"});
      },
      error => {
      }
    );
  }

  get value(): any {
    const teamDetails: any = {
      teamId: this.teamFormPanel.controls.teamId.value,
      teamCode:this.teamFormPanel.controls.teamCode.value,
      teamType: this.teamFormPanel.controls.teamType.value,
      description: this.teamFormPanel.controls.description.value,
      highlightColor:this.teamFormPanel.controls.highlightColor.value,
    };
    return teamDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.teamFormPanel.patchValue({
        teamId: value.teamId,
        teamCode:value.teamCode,
        teamType: value.teamType,
        description: value.description,
        highlightColor:value.highlightColor??'#a6a6a6',
      });
    });
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.teamFormPanel.reset();
    }
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };

  validate(_: UntypedFormControl) {
    return this.teamFormPanel.valid ? null : { teamFormPanel: { valid: false } };
  }
  public isValid() {
    return this.getValidationErrors().length === 0;
  }
  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // checkTeamExist(control:any){
  //   if (control.value !== undefined && control.value != null && control.value.length > 1 && this.isNew) {
  //     this.teamFormPanel.controls['teamId'].setErrors(null);
  //     this.teamFormPanel.clearAsyncValidators();
  //     this.teamFormPanel.updateValueAndValidity();
  //     this.teamService.validateTeam(control.value).subscribe((res: any) => {
  //       if (res && res.text == "true") {
  //         this.teamFormPanel.controls['teamId'].setErrors({ 'incorrect': true });
  //         this.teamFormPanel.updateValueAndValidity();
  //         return { 'incorrect': true };
  //       }
  //       else {
  //         return null;
  //       }
  //     });

  //   }
  // }


}
