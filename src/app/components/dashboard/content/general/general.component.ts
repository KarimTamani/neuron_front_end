import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  public evolutionParams : any[] = [
    {
      icon : "fa fa-calendar-check" ,
      name : "Consultations" , 
      period : "Semain"  ,
      backgroundColor : "#FE6555" , 
      evolutionPercentage : 56.8 , 
      evolutionValue : 256 , 
    } , 
    {
      icon : "fa fa-money-bill-wave" ,
      name : "Gain" , 
      period : "Semain"  ,
      backgroundColor : "#265ED7" , 
      evolutionPercentage : 26.8 , 
      evolutionValue : "1025 DA" , 
    } 
  ] 
  constructor() { }

  ngOnInit(): void {

    
  }

}
