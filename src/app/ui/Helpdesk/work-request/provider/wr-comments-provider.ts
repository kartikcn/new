import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';import { AddWrCommentsComponent } from '../widgets/add-wr-comments/add-wr-comments.component';

@Injectable({
    providedIn: 'root' // just before your class
})
export class WrCommentsProvider {
    public isDialogOpen: Boolean = false;
    onDialogueClosed: Subject<any> = new Subject<any>();
    constructor(public dialog: MatDialog) { }

    openDialog(matDialogConfig: MatDialogConfig): any {
        if (this.isDialogOpen) {
            return false;
        }
        this.isDialogOpen = true;
        const dialogRef = this.dialog.open(AddWrCommentsComponent, matDialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.onDialogueClosed.next(result);
            this.isDialogOpen = false;
        });
    }
}