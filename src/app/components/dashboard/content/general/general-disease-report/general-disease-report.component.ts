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

  public radarChartOptions: RadialChartOptions = null ; 
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

    this.radarChartData = [
      {
        data: this.analytics.getAnalyticsDiseases.map(value => value.value),
        label: "Patient",       
      }
    ]
    var percentages =this.analytics.getAnalyticsDiseases.map(value =>Math.trunc( value.percentage * 100) )  ; 
    
    var labels = this.analytics.getAnalyticsDiseases.map(value => value.group);
    this.radarChartLabels = labels.map(this.processLabels) ; 
    
    
    this.radarChartOptions = {
      responsive: true,  
      scale: {
       
        gridLines: {
          circular: true,
          display: false ,     
        },
        ticks: {
          beginAtZero: true,
          display: false,  
        }, 
        
  
      },
      
      legend : {
        display : true , 
      } , 
      elements: {
        line: {
          tension: 0.3
        }
      },
      layout: {
        padding: 0
      }, 
  
      tooltips : { 
  
        mode: 'nearest',   
        callbacks: {
          label: function (tooltipItems, data) {
            
            return " " + tooltipItems.yLabel + " " + data.datasets[tooltipItems.datasetIndex].label+ " : " + labels[tooltipItems.index] + " , "+ percentages[tooltipItems.index] + "%";
          },
          title : () => { 
            return "" ;  
          } 
        }
      }
    } ;
  }
  private processLabels(label : string) {
    if ( label.length > 10) 
      return label.slice(0 , 10) + "..." ; 
    return label ; 
  }

}
