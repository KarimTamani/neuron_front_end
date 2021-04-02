import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-group-analytics',
  templateUrl: './group-analytics.component.html',
  styleUrls: ['./group-analytics.component.css']
})
export class GroupAnalyticsComponent implements OnInit {
  @Input() analytics: any;
  public radarChartOptions: RadialChartOptions = null ; 
  public lineChartColors: Color[] = [

  ]

  public dataset: any[] = [
    {
      data: [],
      label: "Age",
      labels: [], 
    

    }, {
      data: [],
      label: "Maladie",
      labels: [] , 
      originalLabels : [] 
    }, {
      data: [],
      label: "Sexe",
      labels: [] , 

    },
    { 
      data : [] , 
      label : "Profession" , 
      labels : [] , 
      originalLabels : [] 
    }

  ];
  public radarChartLabels: Label[] = [];
  public radarChartData: ChartDataSets[] = [];
  public radarChartType: ChartType = 'radar';
  public selectedOption: any = null;
  @Input() updateSubject: Subject<any>;

  constructor() {
    this.updateSubject = new Subject<any>();
  }

  ngOnInit(): void {
    var dataset = this.dataset ; 
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
      tooltips : { 
    
        mode: 'nearest',   
        callbacks: {
          label: function (tooltipItems, data) {
            
            if ( data.datasets[tooltipItems.datasetIndex].label == "Age") { 
              var selectedDataSet = dataset[0] ;
              return " " + tooltipItems.yLabel + " Patient " + selectedDataSet.labels[tooltipItems.index] + " ans ";  
            } 
            if ( data.datasets[tooltipItems.datasetIndex].label == "Maladie") { 
              var selectedDataSet = dataset[1] ;
              return " " + tooltipItems.yLabel + " Patient : " + selectedDataSet.originalLabels[tooltipItems.index] ;  
            } 
            if ( data.datasets[tooltipItems.datasetIndex].label == "Sexe") { 
              var selectedDataSet = dataset[2] ;
              return " " + tooltipItems.yLabel + " Patient : " + selectedDataSet.labels[tooltipItems.index] ;  
            }
            if ( data.datasets[tooltipItems.datasetIndex].label == "Profession") { 
              
              var selectedDataSet = dataset[3] ;
              console.log(selectedDataSet) ; 
              return " " + tooltipItems.yLabel + " Patient : " + selectedDataSet.labels[tooltipItems.index] ;  
            }    
           return "" ; 
          },
          title : () => { 
            return "" ;  
          } 
        }
      }
    };

    this.loadAnalytics();

    if (this.updateSubject)
      this.updateSubject.subscribe((data) => {
        this.analytics = data.analytics;
        this.loadAnalytics();
      })
  }

  private loadAnalytics() {

    this.dataset[1].data = this.analytics.getAnalyticsDiseases.map(value => value.value);
    this.dataset[0].data = this.analytics.getAnalyticsAge.map(value => value.value);
    this.dataset[2].data = this.analytics.getAnalyticsGender.map(value => value.value);
    this.dataset[3].data = this.analytics.getAnalyticsProfession.map(value => value.value) ; 
   
    this.dataset[1].originalLabels = this.analytics.getAnalyticsDiseases.map(value => (value.group)); 
    this.dataset[3].originalLabels = this.analytics.getAnalyticsProfession.map(value => (value.group)); 
   
    this.dataset[0].labels = this.analytics.getAnalyticsAge.map(value => value.group);
    this.dataset[1].labels = this.dataset[1].originalLabels.map(value =>this.processLabels(value)); 
    this.dataset[2].labels = this.analytics.getAnalyticsGender.map(value =>this.processSexeLabels(value.group));
    this.dataset[3].labels = this.dataset[3].originalLabels.map(value =>this.processLabels(value));

    this.radarChartLabels = this.dataset[0].labels;
    
    if (this.selectedOption == null) {
      this.radarChartData = [
        { data: this.dataset[0].data, label: this.dataset[0].label }
      ];
    }
    else { 
      this.selectOption(this.selectedOption) ; 
    }
  }

  private processLabels(label : string) {
    if ( label.length > 10) 
      return label.slice(0 , 10) + "..." ; 
    return label ; 
  }

  private processSexeLabels(label : boolean) { 
    return (label) ? ("Homme") : ("Femme") ; 
  }
  selectOption($event) {
    this.selectedOption = $event; 
    this.radarChartLabels = this.dataset[$event.id - 1].labels;
    this.radarChartData = [
      { data: this.dataset[$event.id - 1].data, label: this.dataset[$event.id - 1].label }
    ]
  }
}
