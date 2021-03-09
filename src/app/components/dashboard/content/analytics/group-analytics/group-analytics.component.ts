import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-group-analytics',
  templateUrl: './group-analytics.component.html',
  styleUrls: ['./group-analytics.component.css']
})
export class GroupAnalyticsComponent implements OnInit {
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

  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: "#FE655588",
      borderColor: '#FE6555',

    }
  ]

  public dataset: any[] = [
    {
      data: [],
      label: "Maladie",
      labels: []
    }, {
      data: [],
      label: "Age",
      labels: []
    }, {
      data: [],
      label: "Sexe",
      labels: []
    }
  ];
  public radarChartLabels: Label[] = [];
  public radarChartData: ChartDataSets[] = [];
  public radarChartType: ChartType = 'radar';

  constructor() { }

  ngOnInit(): void {

    this.dataset[0].data = this.analytics.getAnalyticsDiseases.map(value => value.value);
    this.dataset[1].data = this.analytics.getAnalyticsAge.map(value => value.value);
    this.dataset[2].data = this.analytics.getAnalyticsGender.map(value => value.value);

    this.dataset[0].labels = this.analytics.getAnalyticsDiseases.map(value => value.group);
    this.dataset[1].labels = this.analytics.getAnalyticsAge.map(value => value.group);
    this.dataset[2].labels = this.analytics.getAnalyticsGender.map(value => value.group);
    

    this.radarChartLabels = this.dataset[0].labels ; 

    this.radarChartData = [ 
      { data : this.dataset[0].data , label : this.dataset[0].label}
    ]
  }

  selectOption($event) {
    this.radarChartLabels = this.dataset[$event.id -1].labels ; 
    this.radarChartData = [ 
      { data : this.dataset[$event.id -1].data , label : this.dataset[$event.id -1].label}
    ]
  }
}
