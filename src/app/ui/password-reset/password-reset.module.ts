import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordResetComponent } from './password-reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MaterialModule } from 'src/app/material/material.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';



@NgModule({
  declarations: [
    PasswordResetComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    MatCardModule,
    PrimeNGModule,
    AntDesignModule
  ]
})
export class PasswordResetModule { }
