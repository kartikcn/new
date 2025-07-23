import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';import { ConfirmBookingPageComponent } from '../widgets/confirm-booking-page/confirm-booking-page.component';

@Injectable({
        providedIn: 'root' // just before your class
})
export class BookingDialogueProvider {
        public isDialogOpen: Boolean = false;
        onDialogueClosed: Subject<any> = new Subject<any>();
        constructor(public dialog: MatDialog) { }
        openDialog(matDialogConfig: MatDialogConfig): any {
                if (this.isDialogOpen) {
                        return false;
                }
                this.isDialogOpen = true;

                const dialogRef = this.dialog.open(ConfirmBookingPageComponent, matDialogConfig);

                dialogRef.afterClosed().subscribe(result => {
                        this.onDialogueClosed.next(result);
                        this.isDialogOpen = false;
                });
        }
}
