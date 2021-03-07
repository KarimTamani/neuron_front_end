import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-general-analytics',
  templateUrl: './general-analytics.component.html',
  styleUrls: ['./general-analytics.component.css']
})
export class GeneralAnalyticsComponent implements OnInit {
  @Input() analytics: any;

  public lineChartData: ChartDataSets[] = [
    { data: [15, 19, 26, 24, 33, 30, 34, 31, 35, 37, 40, 39], label: 'Consultations' },
    { data: [18, 20, 25, 29, 30, 40, 32, 35, 38, 47, 49, 45], label: 'Gain' }
  ];
  public lineChartLabels: Label[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', "Août", "Sempte", "Octobre", "Nov", "Dec"];

  public lineChartOptions: ChartOptions = {
    responsive: true ,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],

      yAxes: [{
        gridLines: {
          display: false
        }
      }],
    }
  };

  public lineChartColors: Color[] = [

    { // dark grey
      backgroundColor: 'transparent',
      borderColor: '#FE6555',

    },
    { // red
      backgroundColor: 'transparent',
      borderColor: '#265ED7',
    }
  ];

  // Set true to show legends
  lineChartLegend = false;

  // Define type of chart
  lineChartType = 'line';

  lineChartPlugins = [];

  @ViewChild("chart", { static: true }) chart;
  constructor() { }

  ngOnInit(): void {
 
    var ctx = this.chart.nativeElement.getContext("2d")
    var originalStroke = ctx.stroke
    ctx.stroke = function () {
      ctx.save()

      ctx.shadowColor = this.strokeStyle + "aa"
      ctx.shadowBlur = 28
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      originalStroke.apply(this, arguments)
      ctx.restore()
    }

  }

}
