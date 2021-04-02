import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-diagnosis-percentage',
  templateUrl: './diagnosis-percentage.component.html',
  styleUrls: ['./diagnosis-percentage.component.css']
})
export class DiagnosisPercentageComponent implements OnInit {
  @Input() slice : any = {} 

  constructor() { }

  ngOnInit(): void {
    this.slice.percentage = Math.trunc( this.slice.percentage * 100 ) ;  
  }

  get percentage() { 
    return 440 - (440 * this.slice.percentage) / 100 
  }
}
