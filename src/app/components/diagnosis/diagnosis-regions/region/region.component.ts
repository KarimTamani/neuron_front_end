import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  @Input() region: any = null;
  @Input() image: HTMLImageElement = null;
  @ViewChild("region", { static: true }) regionCanvas: any;

  public color: string = null;
  public progress: number = 0;
  constructor() { }

  ngOnInit(): void {

    const srcX = Math.ceil(this.region.location[0])
    const srcY = Math.ceil(this.region.location[1])

    const srcWidth = Math.ceil(this.region.location[2] - this.region.location[0])
    const srcHeight = Math.ceil(this.region.location[3] - this.region.location[1]);

    var context = this.regionCanvas.nativeElement.getContext("2d");
    context.drawImage(this.image, srcX, srcY, srcWidth, srcHeight, 0, 0, 80, 80)
    this.color = this.getColor();
    this.progress = this.region.propa * 100;
  }
  private getColor() {
    // getthe color of the text and the progress bar based on the propability
    if (this.region.propa < 0.25)
      return "rgb(254, 101, 85)"
    else if (this.region.propa < 0.50)
      return "#FCC419"
    else if (this.region.propa < 0.75)
      return "#1AC98E"
    return "rgb(38, 94, 215)"
  }

  public roundPropability(propa) {
    return Math.round(propa * 100) / 100
  }

  public getPossibility() {
    // get the possibility 
    if (this.progress < 25) {
      return "faible"

    } else if (this.progress < 50) {
      return "moyene"
    }

    else if (this.progress < 75) {
      return "modérée"

    } else {
      return "grande"
    }

  }
}
