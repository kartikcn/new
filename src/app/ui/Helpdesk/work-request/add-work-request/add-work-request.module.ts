import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/material/material.module';
import { AddWorkRequestComponent } from './add-work-request.component';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SvgViewModule } from 'src/app/ui/svg-view/svg-view.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';

@NgModule({
    declarations: [AddWorkRequestComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MaterialModule,
        AntDesignModule,
        PrimeNGModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        MatTooltipModule,
        SvgViewModule,
        NgxSpinnerModule,
        MatTooltipModule,
        DirectiveModule
    ],
    exports: [AddWorkRequestComponent]
})
export class AddRequestsFormModule { }