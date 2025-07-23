import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Dimensions, ImageCroppedEvent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-user-photo',
  templateUrl: './add-user-photo.component.html',
  styleUrls: ['./add-user-photo.component.scss']
})
export class AddUserPhotoComponent implements OnInit {
display:boolean=false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  selectedFile!: any;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  NotImage: boolean = true;
  canvasRotation = 0;
  transform: ImageTransform = {};
  fileName:string="No File Chooseen";
  errorMsg:string = ''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUserPhotoComponent>,
    public userSrv:UsersService,
    public authSrv:AuthService
  ) { }

  ngOnInit(): void {
    this.display = this.data.display;
  }

  fileChangeEvent(event: any): void {
    this.NotImage = true;
    this.imageChangedEvent = event;
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name;
    var idxDot = this.fileName.lastIndexOf(".") + 1;
    var extFile = this.fileName.substr(idxDot, this.fileName.length).toLowerCase();
      if (extFile=="jpg" || extFile=="jpeg" || extFile=="png"){
        var imgSize = event.target.files[0].size;
          this.fileName = this.selectedFile.name;
          if(imgSize > 1000000) {
            this.NotImage = true;
            this.errorMsg = 'Image Size should not be greater than 1 MB';
          }else{
            this.NotImage = false;
            this.errorMsg = '';
          }  
      }else{
          this.NotImage = true;
          //alert("Only jpg/jpeg and png files are allowed!");
          this.errorMsg = 'Only jpg/jpeg and png files are allowed!';
      }
  }

  imageCropped(event: ImageCroppedEvent) {
    let file = new File([event.blob??""],this.fileName);
    this.selectedFile = file;
  }
  imageLoaded() {
    this.showCropper = true;
    //console.log('Image loaded');
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    //console.log('Cropper ready', sourceImageDimensions);
  }
  loadImageFailed() {
    // show message
  }
 
  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  confirmDialog(){
    this.dialogRef.close(false);
  }
  uploadImage(){
    if(this.errorMsg.length > 0 || this.NotImage){
      return;
    }
    const uploadData =  new FormData();
    uploadData.set('imageFile', this.selectedFile);
    // uploadData.append("imageFile", this.croppedImage);
    uploadData.set("tableName", 'em');
    uploadData.set("fieldName", 'em_photo');
    uploadData.set("pkeyValue", this.authSrv.getLoggedInUserEMId());
    // uploadData.set("imageName", this.fileName);

    this.userSrv.uploadProfilePhto(uploadData).subscribe((res)=>{
      console.log(res);
      this.dialogRef.close(true);
    })

  }
  dataURItoBlob(dataURI:any) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  }
}
