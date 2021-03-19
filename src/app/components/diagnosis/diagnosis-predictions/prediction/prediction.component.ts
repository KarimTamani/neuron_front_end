import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  @Input() prediction : any ; 
  @Input() small : boolean = false ; 
  public color : string = null ; 
  constructor() { }

  ngOnInit(): void { 
    this.color = this.getColor() 
  }

  private getColor() {
    // getthe color of the text and the progress bar based on the propability
    if (this.prediction.propa < 25) 
      return "rgb(254, 101, 85)"
    else if (this.prediction.propa < 50 ) 
      return "#FCC419"
    else if (this.prediction.propa < 75) 
      return "#1AC98E"
    return "rgb(38, 94, 215)"
    
  
  }
  getPossibility() {
    // get the possibility 
    if (this.prediction.propa < 25) {
      return "faible"
    
    } else if (this.prediction.propa < 50 ) {
      return "moyene"
    }
    
    else if (this.prediction.propa < 75) {
      return "modérée"
    
    }else {
      return "grande"
    }
  
  }

  public roundPropability(propa) {
    return Math.round(propa * 100) / 100 
  }
}
