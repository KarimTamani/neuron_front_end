import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general-line-chart',
  templateUrl: './general-line-chart.component.html',
  styleUrls: ['./general-line-chart.component.css']
})
export class GeneralLineChartComponent implements OnInit {
  @Input() analytics: any;
  public lineChartData: ChartDataSets[] = [] ;

  public lineChartLabels: Label[] = [];

  public lineChartOptions: ChartOptions ;

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
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.lineChartOptions = {
      responsive: true,

      scales: {

        xAxes: [{

          gridLines: {
            display: false
          },
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
            maxTicksLimit: 5,

            callback: function (value, index, values) {
              return value;
            }
          }
        }],
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            id: "A",
            gridLines: {
              display: false
            }
          },
          {
            id: "B",
            ticks: {
              beginAtZero: true,
              min: 0
            },
            position: "right",
            gridLines: {

              display: false
            }
          }

        ],
      }
    };


    this.lineChartData = [
      {
        data : this.analytics.getAnalyticsVisits.map(slice => slice.value) , 
        label : "Visites" , 
         yAxisID: 'A'
      } , {
        data : this.analytics.getAnalyticsGain.map(slice => slice.value) , 
        label : "le Gain", yAxisID: 'B'
      }
    ]; 

    this.lineChartLabels = this.analytics.getAnalyticsGain.map(value => this.dataService.castDateYMD(value.endTime));

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
