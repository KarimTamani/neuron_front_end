import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general-analytics',
  templateUrl: './general-analytics.component.html',
  styleUrls: ['./general-analytics.component.css']
})
export class GeneralAnalyticsComponent implements OnInit {
  @Input() analytics: any;
  @Input() updateSubject: Subject<any>;
  @Output() periodSelectedEvent: EventEmitter<number>;
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];

  public lineChartOptions: ChartOptions = null;
  public lineChartColors: Color[] = [];

  // Set true to show legends
  lineChartLegend = false;

  // Define type of chart
  lineChartType = 'line';

  lineChartPlugins = [];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  @ViewChild("chart", { static: true }) chartCanvas;

  public totalGain: number = 0;
  public totalExpenses: number = 0;
  public totalPureGain: number = 0;
  public numberOfVisits: number = 0;


  public dataSets: any[] = [
    {
      label: "Visits",
      chartLabel: "Visites",
      data: []
    },
    {
      label: "Gain",
      chartLabel: "Gain",
      data: []
    },
    {
      label: "Expenses",
      chartLabel: "Les Frais",
      data: []
    },
    {
      label: "Gain-net",
      chartLabel: "Gain-net",
      data: []
    },
  ]
  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.periodSelectedEvent = new EventEmitter<number>();
  }

  ngOnInit(): void {
    const dataService = this.dataService;
    var devider = null;

    this.lineChartOptions = {
      responsive: true,

      responsiveAnimationDuration: 0,

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
              if (devider == null)
                return dataService.castFRDate(new Date(value));
              return value;
            }
          }
        }],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: 0,

              maxTicksLimit: 2,
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
    this.updateSubject.subscribe((analytics) => {
      this.analytics = analytics;
      this.update();
      this.drawAnalytics(this.route.snapshot.queryParams);
    })

    this.update();

    var ctx = this.chartCanvas.nativeElement.getContext("2d");
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
    
    this.route.queryParams.subscribe((params) => {
      this.drawAnalytics(params);
    })
  }

  private update() {

    this.totalGain = 0;
    this.totalExpenses = 0;
    this.totalPureGain = 0;
    this.numberOfVisits = 0;

    this.dataSets[0].data = this.analytics.getAnalyticsVisits.map(slice => slice.value);
    this.dataSets[1].data = this.analytics.getAnalyticsGain.map(slice => slice.value);
    this.dataSets[2].data = this.analytics.getAnalyticsExpenses.map(slice => slice.value);
    this.dataSets[3].data = this.analytics.getAnalyticsPureGain.map(slice => slice.value);

    this.lineChartLabels = this.analytics.getAnalyticsGain.map(value => this.dataService.castDateYMD(value.endTime));

    this.analytics.getAnalyticsVisits.forEach(slice => this.numberOfVisits += slice.value);
    this.analytics.getAnalyticsGain.forEach(slice => this.totalGain += slice.value);
    this.analytics.getAnalyticsExpenses.forEach(slice => this.totalExpenses += slice.value);
    this.analytics.getAnalyticsPureGain.forEach(slice => this.totalPureGain += slice.value);

  }

  private drawAnalytics(params) {
    this.lineChartData = [];
    this.lineChartColors = [];

    if (params.primaryOption == null && params.secondaryOption == null) {

      this.showAxis("A");
      this.showAxis('B');

      this.lineChartData = [
        { label: this.dataSets[0].label, data: this.dataSets[0].data, yAxisID: 'A' },
        {
          label: this.dataSets[1].label,
          data: this.dataSets[1].data,
          yAxisID: 'B'
        }
      ]

      this.lineChartColors.push({
        backgroundColor: 'transparent',
        borderColor: '#265ED7',
      });

      this.lineChartColors.push({
        backgroundColor: 'transparent',
        borderColor: '#FE6555',
      })

      var primaryOptionStepSize = this.dataService.getStepSize(this.dataSets[0].data);
      var secondaryOptionStepSize = this.dataService.getStepSize(this.dataSets[1].data);

      this.lineChartOptions.scales.yAxes[0].ticks.stepSize = primaryOptionStepSize;
      this.lineChartOptions.scales.yAxes[1].ticks.stepSize = secondaryOptionStepSize;


    } else {

      if (params.primaryOption) {

        var option = parseInt(params.primaryOption);

        this.showAxis("A");

        this.lineChartData.splice(0, 0, {
          label: this.dataSets[option - 1].label,
          data: this.dataSets[option - 1].data,
          yAxisID: 'A'
        });

        var primaryOptionStepSize = this.dataService.getStepSize(this.dataSets[option - 1].data);
        this.lineChartOptions.scales.yAxes[0].ticks.stepSize = primaryOptionStepSize;
        console.log("primary step size ", primaryOptionStepSize);

        this.lineChartColors.push({
          backgroundColor: 'transparent',
          borderColor: '#265ED7',
        })
      } else
        this.hideAxis("A");


      if (params.secondaryOption) {
        this.showAxis("B");
        var option = parseInt(params.secondaryOption);

        this.lineChartData.splice(1, 0, {
          label: this.dataSets[option - 1].label,
          data: this.dataSets[option - 1].data,
          yAxisID: 'B'
        });

        var secondaryOptionStepSize = this.dataService.getStepSize(this.dataSets[option - 1].data);
        this.lineChartOptions.scales.yAxes[1].ticks.stepSize = secondaryOptionStepSize;
        console.log("secondary step size ", secondaryOptionStepSize)
        this.lineChartColors.push({
          backgroundColor: 'transparent',
          borderColor: '#FE6555',
        })

      } else
        this.hideAxis("B");
    }

  }
  private showAxis(axis) {

    if (axis == "A")
      this.lineChartOptions.scales.yAxes[0].display = true;
    else
      this.lineChartOptions.scales.yAxes[1].display = true;

    if (this.chart && this.chart.chart) {
      if (axis == "A")
        this.chart.chart.config.options.scales.yAxes[0].display = true
      else
        this.chart.chart.config.options.scales.yAxes[1].display = true;
    }
  }

  private hideAxis(axis) {
    if (axis == "A")
      this.lineChartOptions.scales.yAxes[0].display = false;
    else
      this.lineChartOptions.scales.yAxes[1].display = false;

    if (this.chart && this.chart.chart) {
      if (axis == "A")
        this.chart.chart.config.options.scales.yAxes[0].display = false
      else
        this.chart.chart.config.options.scales.yAxes[1].display = false
    }
  }


  public periodSelected($event) {
    this.periodSelectedEvent.emit($event);
  }
}
