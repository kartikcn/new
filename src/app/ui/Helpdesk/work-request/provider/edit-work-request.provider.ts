import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';import { EditWorkRequestComponent } from '../edit-work-request/edit-work-request.component';

@Injectable({
    providedIn: 'root' // just before your class
})
export class EditWorkRequestProvider {
    public isDialogOpen: Boolean = false;
    onDialogueClosed: Subject<any> = new Subject<any>();
    constructor(public dialog: MatDialog) { }

    openDialog(matDialogConfig: MatDialogConfig): any {
        if (this.isDialogOpen) {
            return false;
        }
        this.isDialogOpen = true;
        const dialogRef = this.dialog.open(EditWorkRequestComponent, matDialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.onDialogueClosed.next(result);
            this.isDialogOpen = false;
        });
    }
}