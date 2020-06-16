import { Injectable } from '@angular/core';
import { Photo } from '../models/photo.inteface';
import {
  Plugins,
  CameraResultType,
  Capacitor,
  FilesystemDirectory,
  CameraPhoto,
  CameraSource,
} from '@capacitor/core';

const Camera = Plugins.Camera,
  FileSystem = Plugins.Filesystem,
  Storage = Plugins.Storage;
@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  photos: Photo[] = [];
  constructor() {}

  async addNewToGallery() {
    const capturePhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savaImageFile = await this.savePhoto(capturePhoto);
    this.photos.unshift(savaImageFile);
  }

  getPhotos(): Photo[] {
    return this.photos;
  }

  private async savePhoto(cameraPhoto: CameraPhoto) {
    // metodo para convertir a base64
    const base64Data = await this.readAsBase64(cameraPhoto);

    const fileName = new Date().getTime() + '.jpg';
    await FileSystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    return await this.getPhotoFile(cameraPhoto, fileName);
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();

    return (await this.convertBlobToBase64(blob)) as string;
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    });

  private async getPhotoFile(
    cameraPhoto: CameraPhoto,
    fileName: string
  ): Promise<Photo> {
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
    };
  }
}
