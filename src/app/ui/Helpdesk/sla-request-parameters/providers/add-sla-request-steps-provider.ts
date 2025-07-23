import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';import { AddSlaRequestStepsComponent } from '../widgets/add-sla-request-steps/add-sla-request-steps.component';

@Injectable({
        providedIn: 'root' // just before your class
})
export class AddSlaRequestDialogueProvider {
    public isDialogOpen: Boolean = false;

    onDialogueClosed: Subject<any> = new Subject<any>();

    constructor(public dialog: MatDialog) { }

    openDialog(matDialogConfig: MatDialogConfig): any {
        if (this.isDialogOpen) {
                return false;
        }
        this.isDialogOpen = true;

      const dialogRef = this.dialog.open(AddSlaRequestStepsComponent, matDialogConfig);  //SlaTabsComponent

        dialogRef.afterClosed().subscribe(result => {
                this.onDialogueClosed.next(result);

                this.isDialogOpen = false;
        });
    }

}
