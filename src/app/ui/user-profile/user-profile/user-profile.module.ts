import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileModalDialogueProvider } from '../provider/user-profile.provider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { UserChangePwdModule } from '../widgets/user-change-pwd/user-change-pwd.module';
import { SidebarModule } from 'primeng/sidebar';
import { AddUserPhotoModule } from '../widgets/add-user-photo/add-user-photo.module';



@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
     ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    AntDesignModule,
    PrimeNGModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    UserChangePwdModule,
    SidebarModule,
    AddUserPhotoModule
    
  ]
  , providers: [UserProfileModalDialogueProvider]
})
export class UserProfileModule { }
