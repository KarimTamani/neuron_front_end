import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit {
  // bind to the file input 
  // create event emitter to emit every time and image selected
  @ViewChild("file") file;
  @ViewChild("image", { static: true }) image;
  //@Input("clearImage") clearImage: Subject<null>
  @Output("imageSelectedEvent") imageSelectedEvent: EventEmitter<any>
  @Input() initImage: any = null;
  constructor() {
    this.imageSelectedEvent = new EventEmitter<any>()
  }

  ngOnInit(): void {
    /*
    //  whene the parent component is done with the image we clear it  
    this.clearImage.subscribe(() => {
      this.image.nativeElement.src = "" ; 
      this.file.nativeElement.value = "" 
    })
  */
    if (this.initImage) {
      let fileReader = new FileReader(); 
      // file reader load listener
      fileReader.onload = (event) => {
        this.image.nativeElement.src = event.target.result
      }
      // read the image 
      fileReader.readAsDataURL(this.initImage)
    }
  }
  render(image) {

    // check if image changes
    // render it 
    // and emiit it to the parent component  
    if (this.file.nativeElement.files.length > 0) {
      let imageFile = this.file.nativeElement.files[0]
      let fileReader = new FileReader()

      // file reader load listener
      fileReader.onload = (event) => {
        image.src = event.target.result
      }
      // read the image 
      fileReader.readAsDataURL(imageFile)
      // emit to the parent component 
      this.imageSelectedEvent.emit(imageFile)
    }
  }
}
