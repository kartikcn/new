import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
        providedIn: 'root' // just before your class
})
export class UserProfileModalDialogueProvider {
        public isDialogOpen: Boolean = false;

        onDialogueClosed: Subject<any> = new Subject<any>();

        constructor(public dialog: MatDialog) { }

        openDialog(matDialogConfig: MatDialogConfig): any {
                if (this.isDialogOpen) {
                        return false;
                }
                this.isDialogOpen = true;

                const dialogRef = this.dialog.open(UserProfileComponent, matDialogConfig);

                dialogRef.afterClosed().subscribe(result => {
                        this.onDialogueClosed.next(result);

                        this.isDialogOpen = false;
                });
        }

}
