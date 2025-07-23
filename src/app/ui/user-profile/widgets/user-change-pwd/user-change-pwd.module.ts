import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserChangePwdComponent } from './user-change-pwd.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';



@NgModule({
  declarations: [
    UserChangePwdComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    MatCardModule,
    MatDialogModule,
    PrimeNGModule,
    AntDesignModule
  ]
})
export class UserChangePwdModule { }
