import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid-controller',
  templateUrl: './grid-controller.component.html',
  styleUrls: ['./grid-controller.component.css']
})
export class GridControllerComponent implements OnInit {
  @Input() images: any[] = []
  @Output() selectedImageEvent : EventEmitter<any[]> 
  public selectedImages: any[] = []
  constructor() {
    this.selectedImageEvent = new EventEmitter<any[]>()
  }

  ngOnInit(): void {
    // in the intialization set all the images as selected images 
    this.selectedImages = this.images.map(value => value)
  }

  select(image) {
    // check if the image allready selected 
    // if it's not then add it 

    let existsImage = this.selectedImages.find((selected_image) => selected_image.id == image.id)
    if (existsImage) {
      // delete the image 
      // and take in considuration the originl image and the length 
      if (this.selectedImages.length > 1)
        for (let index = 0; index < this.selectedImages.length; index++) {
          if (this.selectedImages[index].id == image.id)
            this.selectedImages.splice(index, 1)
        }
    }
    else {
      this.selectedImages.push(image)
    }

    this.selectedImageEvent.emit(this.selectedImages)
  }

  isImageSelected(image) {
    // check if the image selected to apply the selected css class 
    return this.selectedImages.find((selected_image) => selected_image.id == image.id)
  }
}
