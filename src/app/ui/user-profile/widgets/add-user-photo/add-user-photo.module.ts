import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserPhotoComponent } from './add-user-photo.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [
    AddUserPhotoComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
    ImageCropperModule
  ],
  exports: [AddUserPhotoComponent]
})
export class AddUserPhotoModule { }
