import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PartsService } from 'src/app/ui/Helpdesk/parts/services/parts.service';
import { ToolsService } from 'src/app/ui/Helpdesk/tools/services/tools.services';
import { TradesService } from 'src/app/ui/Helpdesk/trades/services/trades.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CraftspersonService } from 'src/app/ui/Helpdesk/craftsperson/services/craftsperson.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { RequestTradeDialogueProvider } from 'src/app/ui/Helpdesk/work-request-details/widgets/request-trades/providers/request-trade.provider';
import { MessageService } from 'primeng/api';
import { PlanScheduleService } from 'src/app/ui/ppm-schedule/services/plan-schedule-services';
import { RequestPartsDialogueProvider } from 'src/app/ui/Helpdesk/work-request-details/widgets/request-parts/providers/request-parts.provider';
import { RequestTechnicianDialogueProvider } from 'src/app/ui/Helpdesk/work-request-details/widgets/request-technician/provider/request-technician';
import { RequestToolsDialogueProvider } from 'src/app/ui/Helpdesk/work-request-details/widgets/request-tools/provider/request-tool';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-pm-planner-req-details-table',
  templateUrl: './pm-planner-req-details-table.component.html',
  styleUrls: ['./pm-planner-req-details-table.component.scss'],
  providers: [MessageService]
})
export class PmPlannerReqDetailsTableComponent {
  @Input() data: any;
  @Input() rowCardDetails: any;
  @Output() reloadPmPlanner = new EventEmitter<boolean>();
  displayKey: string = '';
  rq_data: any = [];
  rq_array: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  enumStatusData: any[] = [];
  frmToolsDetail!: FormGroup;
  frmCfDetail!: FormGroup;
  displayRequestList: boolean = false;
  showTradeDetails: boolean = false;
  selectedTrade: any;
  tradeList: any[] = [];
  showPartDetails: boolean = false;
  selectedPart: any;
  partsList: any[] = [];
  showToolDetails: boolean = false;
  toolsList: any[] = [];
  showTechnicianDetails: boolean = false;
  technicianList: any[] = [];
  tradeDetailsDialogWidth='40vw';
  toolDetailsDialogWidth='35vw';
  useTabletProtrait = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private enumsrv: EnumService,
    private datePipe: DatePipe,
    private router: Router,
    private tradeService: TradesService,
    private partsService: PartsService,
    private toolsService: ToolsService,
    private craftspersonService: CraftspersonService,
    private formBuilder: FormBuilder,
    private requestTradeDialogueProvider: RequestTradeDialogueProvider,
    private requestToolsDialogueProvider: RequestToolsDialogueProvider,
    private requestPartsDialogueProvider: RequestPartsDialogueProvider,
    private requestTechnicianDialogueProvider: RequestTechnicianDialogueProvider,
    private messageService: MessageService,
    private planscheduleSrv: PlanScheduleService,
    private bps : BreakpointService
  ) {
    this.frmToolsDetail = this.formBuilder.group({
      toolsFormPanel: []
    });
    this.frmCfDetail = this.formBuilder.group({
      cfFormPanel: []
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadAllEnums();
    this.rq_data = this.data;
    this.cdr.detectChanges();
    this.loadTrades();
    this.loadParts();
    this.loadTools();
    this.loadAllTechnician();
    this.getDisplayKey();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.updateTradeDetailsDialog();
  }

  loadAllEnums() {
    this.enumsrv.getEnums().subscribe(
      (res) => {
        if (res) {
          this.enumStatusData = res.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() &&
            t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        }
      })
  }

  getEnumByid(id: any) {
    return this.enumStatusData.find((t: any) => t.enumKey === id)?.enumValue
  }

  loadTrades() {
    this.tradeService.getAllTrades().subscribe((res: any) => {
      this.tradeList = res;
    })
  }

  loadParts() {
    this.partsService.getAllParts().subscribe((res: any) => {
      this.partsList = res;
    })
  }

  loadTools() {
    this.toolsService.getAllTools().subscribe((res: any) => {
      this.toolsList = res;
    })
  }

  loadAllTechnician() {
    this.craftspersonService.getAllCraftsperson().subscribe((res: any) => {
      this.technicianList = res;
    })
  }

  getDisplayKey() {
    if (this.rowCardDetails.key == "request") {
      this.displayKey = "Request";
    } else if (this.rowCardDetails.key == "trade") {
      this.displayKey = "Trade";
    } else if (this.rowCardDetails.key == "tool") {
      this.displayKey = "Tool";
    } else if (this.rowCardDetails.key == "part") {
      this.displayKey = "Part";
    } else if (this.rowCardDetails.key == "technician") {
      this.displayKey = "Technician";
    }
  }

  exportExcel() {
    this.getDestructuredData(this.rq_data);
    var excelHeaders: string[] = [];
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.rq_array);
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];
      excelHeaders = ["Request Id", "Date To Perform", "Status", this.displayKey, this.rowCardDetails.key == 'part' ? 'Required Quantity' : 'Required Hours']
      const headers = excelHeaders.map((header, index) => ({ v: header, position: String.fromCharCode(65 + index) + 1 }));
      headers.forEach(header => {
        worksheet[header.position] = { v: header.v };
      });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "request");
    });
  }

  getDestructuredData(data: any) {
    this.rq_array = data.map((item: any) => {
      let countString = this.rowCardDetails.key == 'part' ? 'Required Quantity' : 'Required Hours';
      let label = this.displayKey;
      let obj = {
        "Request Id": item['requestId'],
        "Date To Perform": this.datePipe.transform(item['dateToPerform'], "dd MMM yyyy"),
        "Status": this.getEnumByid(item['status']),
      } as { [key: string]: any };
      obj[label] = item['name'];
      obj[countString] = item['count'];
      return obj;
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  onClickRequest(requestId: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/work-request-details"], { queryParams: { requestId: requestId, index: 0, action: "details", status: '', viewDetails: true, isNavigationFromReport: true } })
    );
    window.open(url, '_blank');
  }

  onClickName(name: any) {
    this.showToolDetails = false;
    if (this.rowCardDetails.key == 'tool') {
      this.onClickTool(name.id);
    } else if (this.rowCardDetails.key == 'trade') {
      this.onClickTrade(name.id);
    } else if (this.rowCardDetails.key == 'part') {
      this.onClickPart(name.id);
    } else if (this.rowCardDetails.key == 'technician') {
      this.onClickTechnician(parseInt(name.id));
    }
  }

  onEditName(rm: any) {
    let wrId = rm.requestId;
    let filterData = { wrId: wrId, partId: null, toolId: null, tradeId: null, technicianId: null };
    if (this.rowCardDetails.key == "trade") {
      filterData.tradeId = rm.id;
    } else if (this.rowCardDetails.key == "tool") {
      filterData.toolId = rm.id;
    } else if (this.rowCardDetails.key == "part") {
      filterData.partId = rm.id;
    } else if (this.rowCardDetails.key == "technician") {
      filterData.technicianId = rm.id;
    }
    this.planscheduleSrv.getPlannerRequestSelectionInfo(filterData).subscribe((res: any) => {
      if (res) {
        let isRequestor = res.request.isRequestor === "1" ? true : false;
        let isApprover = res.request.isApprover === "1" ? true : false;
        let isTechnician = res.request.isTechnician === "1" ? true : false;
        let isSupervisor = res.request.isSupervisor === "1" ? true : false;
        if (this.rowCardDetails.key == "trade") {
          this.onEditTradeDialog(wrId, isRequestor, isApprover, isTechnician, isSupervisor, res.trade.requestTradeId);
        }else if(this.rowCardDetails.key == "tool"){
          this.onEditToolDialog(wrId, isRequestor, isApprover, isTechnician, isSupervisor, res.tool.reqToolId);
        }else if(this.rowCardDetails.key == "part"){
          this.onEditPartDialog(wrId, isRequestor, isApprover, isTechnician, isSupervisor, res.part.requestPartId);
        }else if(this.rowCardDetails.key == "technician"){
          this.onEditTechnicianDialog(wrId, isRequestor, isApprover, isTechnician, isSupervisor, res.technician.requestTechnicianId);
        }
      }
    });
  }

  onEditTradeDialog(requestId: any, isRequestor: any, isApprover: any, isTechnician: any, isSupervisor: any, requestTradeId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: requestId,
      requestTradeId: requestTradeId,
      isEdit: true,
      newRecord: false,
      isView: false,
      userChecks: {isRequestor: isRequestor, isApprover: isApprover, isSupervisor: isSupervisor, isTechnician: isTechnician}
    };
    this.requestTradeDialogueProvider.openDialog(dialogConfig);
    this.requestTradeDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'pmReqSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.reloadPmPlanner.emit(true);
      }
      else if(result=="deleted"){
        this.messageService.add({ key: 'pmReqSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.reloadPmPlanner.emit(true);
      }else if (result =="not able to delete"){
        this.messageService.add({ key: 'pmReqWarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      }
    });
  }

  onEditToolDialog(requestId: any, isRequestor: any, isApprover: any, isTechnician: any, isSupervisor: any, requestToolId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: requestId,
      reqToolId: requestToolId,
      isEdit: true,
      newRecord: false,
      isView: false,
      userChecks: {isRequestor: isRequestor, isApprover: isApprover, isSupervisor: isSupervisor, isTechnician: isTechnician}
    };
    this.requestToolsDialogueProvider.openDialog(dialogConfig);
    this.requestToolsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'pmReqSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.reloadPmPlanner.emit(true);
      }
      else if(result=="deleted"){
        this.messageService.add({ key: 'pmReqSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.reloadPmPlanner.emit(true);
      }else if (result =="not able to delete"){
        this.messageService.add({ key: 'pmReqWarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The tool is associated with other records. Please change the tool before deleting the record.' });
      }
    });
  }

  onEditPartDialog(requestId: any, isRequestor: any, isApprover: any, isTechnician: any, isSupervisor: any, requestPartId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: requestId,
      requestPartId: requestPartId,
      isEdit: true,
      newRecord: false,
      isView: false,
      userChecks: {isRequestor: isRequestor, isApprover: isApprover, isSupervisor: isSupervisor, isTechnician: isTechnician}
    };
    this.requestPartsDialogueProvider.openDialog(dialogConfig);
    this.requestPartsDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'pmReqSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.reloadPmPlanner.emit(true);
      }
      else if(result=="deleted"){
        this.messageService.add({ key: 'pmReqSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.reloadPmPlanner.emit(true);
      }else if (result =="not able to delete"){
        this.messageService.add({ key: 'pmReqWarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      }
    });
  }

  onEditTechnicianDialog(requestId: any, isRequestor: any, isApprover: any, isTechnician: any, isSupervisor: any, requestTechnicianId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      requestId: requestId,
      requestTechId: requestTechnicianId,
      isEdit: true,
      newRecord: false,
      isView: false,
      userChecks: {isRequestor: isRequestor, isApprover: isApprover, isSupervisor: isSupervisor, isTechnician: isTechnician}
    };
    this.requestTechnicianDialogueProvider.openDialog(dialogConfig);
    this.requestTechnicianDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'pmReqSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.reloadPmPlanner.emit(true);
      }
      else if(result=="deleted"){
        this.messageService.add({ key: 'pmReqSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.reloadPmPlanner.emit(true);
      }else if (result =="not able to delete"){
        this.messageService.add({ key: 'pmReqWarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      }
    });
  }


onClickTool(toolId: any) {
  let selectedTool = this.toolsList.find((t: any) => t.toolsId === parseInt(toolId));
  setTimeout(() => {
    this.frmToolsDetail.patchValue({
      toolsFormPanel: selectedTool
    });
  }, 0);
  this.showToolDetails = true;
}

onClickTrade(tradeId: any) {
  this.selectedTrade = this.tradeList.find((t: any) => t.tradeId === parseInt(tradeId));
  this.showTradeDetails = true;
}

onClickPart(partId: any) {
  this.selectedPart = this.partsList.find((t: any) => t.partId === parseInt(partId));
  this.showPartDetails = true;
}
onClickTechnician(cfId: any) {
  let selectedTechnician = this.technicianList.find((t: any) => t.cfId === parseInt(cfId));
  setTimeout(() => {
    this.frmCfDetail.patchValue({
      cfFormPanel: selectedTechnician
    });
  }, 0);
  this.showTechnicianDetails = true;
}

getAvailableCountText(){
  let key = this.rowCardDetails.key;
  let rowDetails = this.rowCardDetails.rowDetails;
  let resultText='';
  if(key=='part'){
    resultText=`Available Quantity: ${rowDetails.availableCount} ${rowDetails.units}`;
  }else{
    resultText=`Available Hours: ${rowDetails.availableCount} hours`;
  }
  return resultText;
}

updateTradeDetailsDialog(){
  if(this.useTabletProtrait){
    this.tradeDetailsDialogWidth='60vw';
    this.toolDetailsDialogWidth='50vw';
  }else{
    this.tradeDetailsDialogWidth='40vw';
    this.toolDetailsDialogWidth='35vw';
  }
  if(this.showTradeDetails){
    this.showTradeDetails= false;
    setTimeout(() => {
      this.showTradeDetails= true;
      this.cdr.detectChanges();
    }, 100);
  }
  if(this.showToolDetails){
    this.showToolDetails= false;
    setTimeout(() => {
      this.showToolDetails= true;
      this.cdr.detectChanges();
    }, 100);
  }
}

ngOnDestroy() {
  this.bps.unregister(this);
}


}
