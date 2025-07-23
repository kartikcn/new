import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AddEditRegnComponent } from '../widgets/add-edit-regn/add-edit-regn.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
        providedIn: 'root' // just before your class
})
export class RegnModalDialogueProvider {
        public isDialogOpen: Boolean = false;

        onDialogueClosed: Subject<any> = new Subject<any>();

        constructor(public dialog: MatDialog) { }

        openDialog(matDialogConfig: MatDialogConfig): any {
                if (this.isDialogOpen) {
                        return false;
                }
                this.isDialogOpen = true;

          const dialogRef = this.dialog.open(AddEditRegnComponent, matDialogConfig);

                dialogRef.afterClosed().subscribe(result => {
                        this.onDialogueClosed.next(result);

                        this.isDialogOpen = false;
                });
        }

}
