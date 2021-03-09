import { Component, Input, OnInit } from '@angular/core';
import { RadialChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-general-disease-report',
  templateUrl: './general-disease-report.component.html',
  styleUrls: ['./general-disease-report.component.css']
})
export class GeneralDiseaseReportComponent implements OnInit {
  @Input() analytics: any;

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

  }
  public lineChartColors: Color[] = [
    {
      backgroundColor: "#FE655588",
      borderColor: '#FE6555',

    }
  ]
  public radarChartLabels: Label[] = [];

  public radarChartData: ChartDataSets[] = [];
  public radarChartType: ChartType = 'radar';

  constructor() { }

  ngOnInit(): void { 
    console.log(this.analytics) ; 

    this.radarChartData = [ 
      { data : this.analytics.getAnalyticsDiseases.map(value => value.value) , label : "Maladie"}
    ]
    this.radarChartLabels =  this.analytics.getAnalyticsDiseases.map(value => value.group) ; 

  }

}
