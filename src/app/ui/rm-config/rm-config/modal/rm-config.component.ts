import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RmConfigService } from '../services/rm-config.service';
import { RmConfigListComponent } from '../widgets/rm-config-list/rm-config-list.component';

@Component({
  selector: 'app-rm-config',
  templateUrl: './rm-config.component.html',
  styleUrls: ['./rm-config.component.scss'],
  providers: [MessageService]
})
export class RmConfigComponent implements OnInit {
  @ViewChild(RmConfigListComponent, { static: false }) roomConfigsList!: RmConfigListComponent;
  isHide: boolean = true;
  constructor(
    private rmService: RmConfigService,
  ) { }

  ngOnInit(): void {
  }

  getRmConfig(event: any) {
    this.isHide = false;
    this.roomConfigsList.getRoomConfigData(event);
    let data = {
      blId: event.data.blId,
      flId: event.data.flId,
      rmId: event.data.rmId,
    };
    this.roomConfigsList.roomConfigsRecords.splice(0, this.roomConfigsList.roomConfigsRecords.length);
    this.rmService.getRmConfig(data).subscribe((res: any) => {
      if (res !== null) {
        this.roomConfigsList.loaddata(res);
      }
    });

  }

  refreshPanels(event: any) {
    if (event === true) {
      this.isHide = true;
    }
  }

}
