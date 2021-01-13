import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-images-grid',
  templateUrl: './images-grid.component.html',
  styleUrls: ['./images-grid.component.css']
})
export class ImagesGridComponent implements OnInit {
  @Input() diagnosisResult: any = null;
  @Input() images: any[] = []
  public selectedImages: any[] = [];
  public showFist: boolean = true;
  public models_map: any[] = []

  constructor() { }

  ngOnInit(): void {
    this.selectedImages = this.images.map(value => value)
    console.log(this.selectedImages)
  
  }

  onImageSelected(images) {
    // on every time an image selected 
    this.selectedImages = images;
  }

  ngAfterViewChecked() {
    // get all the canvases in components 
    // and associate to each one the height of the image that we want to draw boxes on it 
    var canvases = document.querySelectorAll(".detection-canvas");
    canvases.forEach((canvas) => {
      var img = canvas.parentElement.querySelector("img") ; 
      img.addEventListener("load" , event => {

        var clientHeight = img.clientHeight;
        var clientWidth = img.clientWidth;
        
        (<any>canvas).width = clientWidth;
        (<any>canvas).height = clientHeight;
      
      })
    })
    this.selectedImages.forEach((image) => {
      var canvas = document.getElementById(image.id)
      if (canvas && this.diagnosisResult) {
        // get the model output corespand to the image 
        // and extract regions of intrest
        var model_output = this.diagnosisResult.result.find((output) => output.id == image.id)
        var regions = model_output.output
        // get the context and begin the path for drawing 
        var context = (<HTMLCanvasElement>canvas).getContext("2d")
        // loop over regions and draw each one 
        context.clearRect( 0 , 0, canvas.clientWidth , canvas.clientHeight)
        for (let index = 0; index < regions.length; index++) {
          context.beginPath()
          // extract the region 
          // and draw it into the canvas 
          var region = regions[index]
          // rectify location to the new with and height 
          var start_x = Math.ceil((region.location[0] * canvas.clientWidth) / image.width)
          var start_y = Math.ceil((region.location[1] * canvas.clientHeight) / image.height);

          var end_x = Math.ceil((region.location[2] * canvas.clientWidth) / image.width)
          var end_y = Math.ceil((region.location[3] * canvas.clientHeight) / image.height)

          var strokeColor = "";
          if (region.prop < 0.25)
            strokeColor = "rgb(254, 101, 85)";
          
          else if (region.propa < 0.50)
            strokeColor = "#FCC419";
          
          else if (region.propa < 0.75)
            strokeColor = "#1AC98E";
          
          else
            strokeColor = "rgb(38, 94, 215)"

          context.strokeStyle = strokeColor
        
          context.rect(
            start_x,
            start_y,
            end_x - start_x,
            end_y - start_y
          )
          context.stroke()
          context.fillText(Math.ceil(region.propa * 100) + "%", start_x, start_y - 5)
        }
      }
    })
  }

}
