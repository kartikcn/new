import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { UsersService } from 'src/app/services/users.service';
import { BuildingFilterInput } from 'src/app/ui/background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/flFilterInput.model';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';import { UserFilterInput } from 'src/app/ui/user/modal/usersFilterInput.model';
import { VisitorsService } from '../../services/visitors.service';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';
import { UsersFilterInputDTO } from 'src/app/ui/user/modal/UsersFilterInputDTO.model';
import { UtilConstant } from 'src/common/UtilConstant';

declare var $: any;
@Component({
  selector: 'app-add-visitors-fom',
  templateUrl: './add-visitors-fom.component.html',
  styleUrls: ['./add-visitors-fom.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddVisitorsFomComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddVisitorsFomComponent),
      multi: true
    }
  ]
})
export class AddVisitorsFomComponent implements OnInit {
  visitorsFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumUsers: UsersFilterInputDTO[] = [];
  selectedFile!: any;
  isPhotoUploaded: boolean = false;
  displayImage: boolean = false;
  tempEmail: string = '';
  visitor_img: any = "assets/images/blank-image.png";

  @Input() isNew!: boolean;
  @Input() isView!: boolean;
  imageerrorMsg: string = '';
  NotImage: boolean = false;
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedBl: any = {};
  selectedFl: any = {};
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private visitorSrv: VisitorsService,
    private blSrv: BuildingService,
    private userSrv: UsersService,
    private authSrv: AuthService,
  ) {
    this.visitorsFormPanel = this.formBuilder.group({
      visitorsId: [null, [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      createdBy: [null, [Validators.required]],
      phoneNum: [''],
      blId: [null, [Validators.required]],
      flId: [null, [Validators.required]],
      picture: ['',],
      comments: [''],

    });
    this.subscriptions.push(
      this.visitorsFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    if (this.isView) {
      this.visitorsFormPanel.disable();
    }
    this.loadUsers();
  }


  loadUsers() {
    this.userSrv.getALLUsers().subscribe((res: any) => {
      this.enumUsers = res;
      // this.enumUsers = res.map((i:any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumUsers.unshift(new UsersFilterInputDTO(null, 'Make a selection', '', ''));
    });
  }
  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.visitorsFormPanel.patchValue({
        flId: null,
      });
    }, 10);
    if ($event.blId != null) {
      this.selectedBl = $event;
      this.selectedFl = {};
    }
    else {
      this.selectedBl = {};
      this.selectedFl = {};
    }

  }
  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];

    return validationErros;
  }

  onSelectFlCode($event: any) {
    if ($event.flId != null) {
      this.selectedFl = $event;
      const blData: any = {
        blId: $event.blId,
        blNameString: $event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.visitorsFormPanel.patchValue({
          blId: $event.blId,
        });
      }, 10);
    }
    else {
    }
  }

  get value(): any {
    const resourcesDetails: any = {
      visitorsId: this.visitorsFormPanel.controls.visitorsId.value,
      firstName: this.visitorsFormPanel.controls.firstName.value,
      lastName: this.visitorsFormPanel.controls.lastName.value,
      email: this.visitorsFormPanel.controls.email.value,
      createdBy: this.visitorsFormPanel.controls.createdBy.value,
      phoneNum: this.visitorsFormPanel.controls.phoneNum.value,
      blId: this.visitorsFormPanel.controls.blId.value,
      flId: this.visitorsFormPanel.controls.flId.value,
      comments: this.visitorsFormPanel.controls.comments.value,
    };
    return resourcesDetails;
  }

  set value(value: any) {
    if (value.blId) {
      const blData: any = {
        blId: value.blId,
        blNameString: value.blBlName != null ? value.blBlCode + " - " + value.blBlName : value.blBlCode,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData)
      const flData: any = {
        flId: value.flId,
        flNameString: value.flFlName != null ? value.flFlCode + " - " + value.flFlName : value.flFlCode,
        blId: value.blId,
        blNameString: value.blBlName != null ? value.blBlCode + " - " + value.blBlName : value.blBlCode,
      }
      this.selectedFl = flData;
      this.updateFlList(flData);
    }
    setTimeout(() => {
      this.visitorsFormPanel.patchValue({
        visitorsId: value.visitorsId,
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        createdBy: value.createdBy,
        phoneNum: value.phoneNum,
        blId: value.blId,
        flId: value.flId,
        comments: value.comments,
        picture: value.picture ? value.picture : null,
      });
    });
    this.onChange(value);
    this.onTouched();
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
  preview() {
    this.displayImage = true;
  }

  fileChangeEvent(event: any) {
    let me = this;
    let fileReader = new FileReader();
    var file = event.target.files[0];
    this.selectedFile = file;
    let filename = file.name;
    var extFile = filename.substr(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
      var imgSize = event.target.files[0].size;
      if (imgSize > 1000000) {
        this.NotImage = true;
        this.imageerrorMsg = 'Image Size should not be greater than 1 MB';
      } else {
        this.NotImage = false;
        this.imageerrorMsg = '';
        me.isPhotoUploaded = true;
        fileReader.readAsDataURL(file);
        console.log(fileReader.result);
        fileReader.onload = function () {
          me.visitor_img = fileReader.result;
        }
      }
    } else {
      this.NotImage = true;
      this.imageerrorMsg = 'Only jpg/jpeg and png files are allowed!';
    }
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.visitorsFormPanel.reset();
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
    return this.visitorsFormPanel.valid ? null : { visitorsFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blSrv.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blSrv.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumFL = res;
      this.updateFlList(this.selectedFl);
    })
  }

  searchBl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
    this.scrollToEndBl();
  }

  searchFl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "flName", value: event.term, matchMode: "contains" };
    this.scrollToEndFl();
  }

  updateBlList(blData: any) {
    if (blData.blId) {
      this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
    }
    this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
  }

  updateFlList(flData: any) {
    if(flData.flId) {
      this.enumFL = this.enumFL.filter(t => t.flId !== flData.flId);
    this.enumFL = this.enumFL.filter(t => t.flId !== null);
    this.enumFL.unshift(flData);
    }
    this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection', null));
  }

  createBlData(bl: any) {
    const blData: any = {
      blId: bl.blId,
      blNameString: bl.blName != null ? bl.blCode + " - " + bl.blName : bl.blCode,
      site: null
    }
    return blData;
  }

  createFlData(fl: any) {
    const flData: any = {
      flId: fl.flId,
      flNameString: fl.flName != null ? fl.flCode + " - " + fl.flName : fl.flCode,
      blId: fl.blId,
      blNameString: fl.bl.blName != null ? fl.bl.blCode + " - " + fl.bl.blName : fl.bl.blCode,
    }
    return flData;
  }

  onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndBl();
  }

  onOpenFl() {
    this.limitFl = 0;
    this.offsetFl = 0;
    if (this.selectedBl.blId) {
      this.filterCriteria = { fieldName: "bl.blId", value: this.selectedBl.blId, matchMode: "equals", limit: 0, offset: 0 }
    } else {
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
    }
    this.scrollToEndFl();
  }

}
