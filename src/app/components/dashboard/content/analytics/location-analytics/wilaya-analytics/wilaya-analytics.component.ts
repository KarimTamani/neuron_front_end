import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-wilaya-analytics',
  templateUrl: './wilaya-analytics.component.html',
  styleUrls: ['./wilaya-analytics.component.css']
})
export class WilayaAnalyticsComponent implements OnInit {
  @Input() analytics: any = null;
  @Input() updateSubject: Subject<any>;

  public radarChartLabels: Label[] = [];
  public radarChartData: ChartDataSets[] = [];
  public radarChartType: ChartType = 'radar';
  public radarChartOptions: RadialChartOptions = null;
  public dataset: any = {
    data: [],
    labels: [] , 
    percentages : []
  }
  constructor() { }

  ngOnInit(): void {



    var dataset = this.dataset;

    this.radarChartOptions = {
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
      },
      tooltips: {

        mode: 'nearest',
        callbacks: {
          label: function (tooltipItems, data) {

            return " "+  dataset.percentages[tooltipItems.index]+" % "+ dataset.labels[tooltipItems.index]  +" | "+ tooltipItems.yLabel + " Patient "  ;
          },
          title: () => {
            return "";
          }
        }
      }
    };

    this.loadAnalytics() ; 

    if (this.updateSubject) 
      this.updateSubject.subscribe((data) => { 
        this.analytics = data.analytics ; 
        this.loadAnalytics() ; 
      })

    
  }



  private loadAnalytics() { 
    this.radarChartLabels = this.analytics.getWilayaAnalytics.map(value => value.group);
    this.radarChartData = [{ data: this.analytics.getWilayaAnalytics.map(value => value.value), label: "Patient" }];
    this.dataset.labels = this.radarChartLabels;
    this.dataset.percentages = this.analytics.getWilayaAnalytics.map(value => Math.trunc(value.percentage * 100) )
  }
}
