import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SlaTabsComponent } from '../widgets/sla-tabs/sla-tabs/sla-tabs.component';
import { AddEditSlaModule } from '../widgets/add-edit-sla/add-edit-sla.module';
import { AddEditSlaComponent } from '../widgets/add-edit-sla/add-edit-sla.component';

@Injectable({
        providedIn: 'root' // just before your class
})
export class SlaRequestDialogueProvider {
    public isDialogOpen: Boolean = false;

    onDialogueClosed: Subject<any> = new Subject<any>();

    constructor(public dialog: MatDialog) { }

    openDialog(matDialogConfig: MatDialogConfig): any {
        if (this.isDialogOpen) {
                return false;
        }
        this.isDialogOpen = true;

      const dialogRef = this.dialog.open(SlaTabsComponent, matDialogConfig);  //SlaTabsComponent

        dialogRef.afterClosed().subscribe(result => {
                this.onDialogueClosed.next(result);

                this.isDialogOpen = false;
        });
    }

}
