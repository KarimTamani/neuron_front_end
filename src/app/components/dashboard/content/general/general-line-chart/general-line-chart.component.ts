import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general-line-chart',
  templateUrl: './general-line-chart.component.html',
  styleUrls: ['./general-line-chart.component.css']
})
export class GeneralLineChartComponent implements OnInit {

  @Input() analytics: any;
  @Input() updateAnalytics: Subject<any>;
  @Output() periodSelectedEvent: EventEmitter<any>;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions;
  public lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'transparent',
      borderColor: '#265ED7',

    },
    { // red
      backgroundColor: 'transparent',
      borderColor: '#FE6555',
    }
  ];

  // Set true to show legends
  lineChartLegend = false;

  // Define type of chart
  lineChartType = 'line';

  lineChartPlugins = [];

  @ViewChild("chart", { static: true }) chart;
  constructor(private dataService: DataService) {
    this.periodSelectedEvent = new EventEmitter<any>();
  }

  ngOnInit(): void {

    const dataService = this.dataService;
    var devider = null;
    this.lineChartOptions = {
      responsive: true,
      responsiveAnimationDuration: 0, // animation duration after a resize
      scales: {
        xAxes: [{

          gridLines: {
            display: false
          },
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
            maxTicksLimit: 10,

            callback: function (value, index, values) {
              if (devider == null)
                return dataService.castFRDate(new Date(value));
              return value ; 
            }
          }
        }],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 10
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
              min: 0, 
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
        data: this.analytics.getAnalyticsVisits.map(slice => slice.value),
        label: "Visites",
        yAxisID: 'A'
      }, {
        data: this.analytics.getAnalyticsGain.map(slice => slice.value),
        label: "le Gain", yAxisID: 'B'
      }
    ];
    this.lineChartLabels = this.analytics.getAnalyticsGain.map(value => this.dataService.castDateYMD(value.endTime));
     
    var visitStepSize = this.dataService.getStepSize(this.analytics.getAnalyticsVisits.map(slice => slice.value));
    var gainStepSize = this.dataService.getStepSize(this.analytics.getAnalyticsGain.map(slice => slice.value));

    this.lineChartOptions.scales.yAxes[0].ticks.stepSize = visitStepSize;
    this.lineChartOptions.scales.yAxes[1].ticks.stepSize = gainStepSize;

    var ctx = this.chart.nativeElement.getContext("2d");

    var originalStroke = ctx.stroke

    ctx.stroke = function () {
      ctx.save()

      ctx.shadowColor = this.strokeStyle + "88"
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 8
      originalStroke.apply(this, arguments)
      ctx.restore()
    }



    if (this.updateAnalytics)
      this.updateAnalytics.subscribe((data) => {
        this.analytics = data.analytics;
  
        this.lineChartData = [
          {
            data: this.analytics.getAnalyticsVisits.map(slice => slice.value),
            label: "Visites",
            yAxisID: 'A'
          }, {
            data: this.analytics.getAnalyticsGain.map(slice => slice.value),
            label: "le Gain", yAxisID: 'B'
          }
        ];

        if (data.period !== this.dataService.DAY) {

          this.lineChartLabels = this.analytics.getAnalyticsGain.map(value => this.dataService.castDateYMD(value.endTime));
          devider = null;

        } else {
          this.lineChartLabels = this.analytics.getAnalyticsGain.map(value => this.dataService.getTime(new Date(value.endTime)));
          devider = dataService.HOUR;
        }
        var visitStepSize = this.dataService.getStepSize(this.analytics.getAnalyticsVisits.map(slice => slice.value));
        var gainStepSize = this.dataService.getStepSize(this.analytics.getAnalyticsGain.map(slice => slice.value));

        this.lineChartOptions.scales.yAxes[0].ticks.stepSize = visitStepSize;
        this.lineChartOptions.scales.yAxes[1].ticks.stepSize = gainStepSize;
      })
  }
  periodSelected($event) {
    this.periodSelectedEvent.emit($event);
  }
}
