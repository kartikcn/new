import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CraftspersonService } from 'src/app/ui/Helpdesk/craftsperson/services/craftsperson.service';
import { TradesService } from 'src/app/ui/Helpdesk/trades/services/trades.services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-trade-details',
  templateUrl: './trade-details.component.html',
  styleUrls: ['./trade-details.component.scss']
})
export class TradeDetailsComponent {
  tradeFormPanel!: FormGroup;
  index: number = 0;
  selectedTab: String = '';
  cfData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  @Input() selectedTrade: any;
  constructor(
    private formBuilder: FormBuilder,
    private tradeService: TradesService,
    private cfService: CraftspersonService,
  ) {
    this.tradeFormPanel = this.formBuilder.group({
      tradeId: ['',],
      tradeCode:[""],
      rateHourly: ['',],
      rateDouble: ['',],
      rateOver: ['',],
      stdHoursAvail: ['',],
      description: [''],
    });
  }


  ngOnInit(): void {
    this.setTradeFormDetails(this.selectedTrade);
  }

  setTradeFormDetails(value: any) {
    setTimeout(() => {
      this.tradeFormPanel.patchValue({
        tradeId: value.tradeId,
        tradeCode:value.tradeCode,
        rateHourly: value.rateHourly,
        rateDouble: value.rateDouble,
        rateOver: value.rateOver,
        stdHoursAvail: value.stdHoursAvail,
        description: value.description,
        compId: value.compId,
      });
    });
  }

  handleChange(event: any) {
    if (event != null) {
      this.index = event.index;
      this.selectedTab = event.originalEvent.target.innerText;
    }
    switch (this.selectedTab) {
      case "Trade Details":
        break;
      case "Technicians":
        this.getAllByTradeId(this.selectedTrade.tradeId);
        break;
    }
  }

  getAllByTradeId(tradeId: any) {
    this.cfData = [];
    this.cfService.getAllCraftspersonByTradeId(tradeId).subscribe((res: any) => {
      this.cfData = res;
    })
  }

}
