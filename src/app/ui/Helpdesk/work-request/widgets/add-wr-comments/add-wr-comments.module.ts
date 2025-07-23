import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddWrCommentsComponent } from './add-wr-comments.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';



@NgModule({
  declarations: [
    AddWrCommentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    PrimeNGModule,
    DirectiveModule,
    AntDesignModule
  ]
})
export class AddWrCommentsModule { }
