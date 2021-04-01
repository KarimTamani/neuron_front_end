import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-commune-analytics',
  templateUrl: './commune-analytics.component.html',
  styleUrls: ['./commune-analytics.component.css']
})
export class CommuneAnalyticsComponent implements OnInit {
  @Input() analytics: any;
  @Output() periodSelectedEvent: EventEmitter<any>;
  @Input() updateSubject: Subject<any>;

  public barChartOptions: ChartOptions = {
    responsive: true,
    responsiveAnimationDuration: 0,

    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
          maxTicksLimit: 8,
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          maxTicksLimit: 2,
        },
      }]
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors : Color[] =[
    { 
      backgroundColor : "#265ED7ee" , 
      
    }
  ]

  public barChartData: ChartDataSets[] = [];

  constructor() {
    this.periodSelectedEvent = new EventEmitter<any>();
  }
  ngOnInit(): void {

    this.loadAnalytics() ; 

    if (this.updateSubject) { 
      this.updateSubject.subscribe((data) => { 
        this.analytics = data.analytics ; 
        this.loadAnalytics() ; 
      })
    }
  }

  private loadAnalytics() { 
    this.barChartLabels = this.analytics.getCommuneAnalytics.map(value => value.group);
    this.barChartData = [{ data: this.analytics.getCommuneAnalytics.map(value => value.value), label: "Patient" }];

  }

}
