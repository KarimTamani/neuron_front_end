import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-diagnosis-regions',
  templateUrl: './diagnosis-regions.component.html',
  styleUrls: ['./diagnosis-regions.component.css']
})
export class DiagnosisRegionsComponent implements OnInit {
  @Input() detectionModel : any = null ; 
  @Input() image : any = null ; 
  public imageObj : any = null ; 
  public imageLoaded : boolean = false ;
  constructor() { }

  ngOnInit(): void {
    
    this.imageObj = new Image() ; 
    this.imageObj.src =  this.image ; 
    this.imageObj.onload = (event) => {
      this.imageLoaded = true ; 
    }
  }
}
