import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRequestPartsComponent } from './add-request-parts.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PartDetailsModule } from 'src/app/ui/common-components/part-details/part-details.module';



@NgModule({
    declarations: [
        AddRequestPartsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MaterialModule,
        AntDesignModule,
        DirectiveModule,
        InputNumberModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        PrimeNGModule,
        SelectButtonModule,
        PartDetailsModule
    ],
    exports: [AddRequestPartsComponent]
})
export class AddRequestPartsModule { }
