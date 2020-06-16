import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Photo } from '../models/photo.inteface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  public photos: Photo[] = [];
  constructor(private photoSvc: PhotoService) {
    this.photos = this.photoSvc.getPhotos();
  }

  newPhoto(): void {
    this.photoSvc.addNewToGallery();
  }
}
