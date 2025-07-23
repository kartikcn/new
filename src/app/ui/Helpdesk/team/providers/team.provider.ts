import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AddEditTeamComponent } from '../widgets/add-edit-team/add-edit-team.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
        providedIn: 'root' // just before your class
})
export class TeamDialogueProvider {
        public isDialogOpen: Boolean = false;

        onDialogueClosed: Subject<any> = new Subject<any>();

        constructor(public dialog: MatDialog) { }

        openDialog(matDialogConfig: MatDialogConfig): any {
                if (this.isDialogOpen) {
                        return false;
                }
                this.isDialogOpen = true;

                const dialogRef = this.dialog.open(AddEditTeamComponent, matDialogConfig);

                dialogRef.afterClosed().subscribe(result => {
                        this.onDialogueClosed.next(result);

                        this.isDialogOpen = false;
                });
        }

}
