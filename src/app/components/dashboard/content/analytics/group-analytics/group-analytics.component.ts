import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-group-analytics',
  templateUrl: './group-analytics.component.html',
  styleUrls: ['./group-analytics.component.css']
})
export class GroupAnalyticsComponent implements OnInit {
  @Input() analytics : any   ; 
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
    scale: {

      gridLines: {
        circular: true,
        display: false

      },
      ticks: {
        beginAtZero: true,
        display: false
      },

    },

    elements: {
      line: {
        tension: 0.3
      }
    },
    layout: {
      padding: 0
    }

  };
  public lineChartColors : Color[] = [
    { 
      backgroundColor : "#FE655588" , 
      borderColor: 'transparent',
      
    }
  ]
  public radarChartLabels: Label[] = ['Anémie', 'Appendicite', 'goitre',
    'Covid-19' , "KACHIHAJA"];

  public radarChartData: ChartDataSets[] = [
    { data: [7, 2, 5, 10 , 25], label: '' }
  ];
  public radarChartType: ChartType = 'radar';

  constructor() { }

  ngOnInit(): void {
  }

}
