import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';import { AddEditRequestToolsComponent } from '../widgets/add-edit-request-tools/add-edit-request-tools.component';


@Injectable({
    providedIn: 'root' // just before your class
})
export class RequestToolsDialogueProvider {

    public isDialogOpen: Boolean = false;
    onDialogueClosed: Subject<any> = new Subject<any>();
    constructor(public dialog: MatDialog) { }
    openDialog(matDialogConfig: MatDialogConfig): any {
        if (this.isDialogOpen) {
            return false;
        }
        this.isDialogOpen = true;
        const dialogRef = this.dialog.open(AddEditRequestToolsComponent, matDialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.onDialogueClosed.next(result);
            this.isDialogOpen = false;
        });
    }

}