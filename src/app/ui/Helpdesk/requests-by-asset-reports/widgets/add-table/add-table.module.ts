import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTableComponent } from './add-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
    declarations: [
        AddTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MaterialModule,
        PrimeNGModule,
        TabViewModule,
        TimelineModule,
        ProgressSpinnerModule,
        NgxSpinnerModule,
        ReactiveFormsModule,
        NgSelectModule,
        AntDesignModule,
        SelectButtonModule,
        DirectiveModule,
        MatTooltipModule
    ],
    exports: [AddTableComponent],
    providers: []
})
export class AddTableModule { }
