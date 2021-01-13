import { Component, OnInit } from '@angular/core';
import { RadialChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-general-disease-report',
  templateUrl: './general-disease-report.component.html',
  styleUrls: ['./general-disease-report.component.css']
})
export class GeneralDiseaseReportComponent implements OnInit {
  public radarChartOptions: RadialChartOptions = {
    responsive: true ,
    scale: {
      
      gridLines: {
        circular: true
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
    layout : {
      padding : 0 
    }


  };
  public radarChartLabels: Label[] = ['Anémie', 'Appendicite', 'goitre',
    'Covid-19'];

  public radarChartData: ChartDataSets[] = [
    { data: [7, 2, 5, 10], label: '' }
  ];
  public radarChartType: ChartType = 'radar';

  constructor() { }

  ngOnInit(): void {
    console.log(this.radarChartOptions)
  }

}
