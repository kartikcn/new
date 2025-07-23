import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProblemTypeComponent } from './add-problem-type.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
    declarations: [
        AddProblemTypeComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MaterialModule,
        AntDesignModule,
        PrimeNGModule,
        DirectiveModule
    ],
    exports: [AddProblemTypeComponent],
    providers: []
})
export class AddProblemTypeModule { }
