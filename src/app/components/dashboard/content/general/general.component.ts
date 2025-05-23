import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  public evolutionParams: any[] = [
    {
      icon: "fa fa-calendar-check",
      name: "Visites",
      period: this.dataService.MONTH,
      backgroundColor: "#FE6555",
      evolutionPercentage: null,
      evolutionValue: null,
      boxShadow: "0px 0px 26px #FE655588"
    },
    {
      icon: "fa fa-coins",
      name: "Gain",
      period: this.dataService.MONTH,
      backgroundColor: "#265ED7",
      evolutionPercentage: null,
      evolutionValue: null,
      boxShadow: "0px 0px 26px #265ED788"
    }
  ];
  public interval: any = {
    startDate: null,
    endDate: null
  }
  public analytics: any;
  public currentDate: Date;
  public updateAnalytics: Subject<any>;


  constructor(private apollo: Apollo, private dataService: DataService) {
    this.updateAnalytics = new Subject<any>();

  }

  ngOnInit(): void {
    this.apollo.query({
      query: gql`
        {
          getCurrentDate
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {
      this.currentDate = new Date(data);
      this.interval.endDate = this.dataService.castDateYMD(data);
      this.loadAnalytics(this.dataService.MONTH);
    })

  }

  private loadAnalytics(period) {
    if (period != this.dataService.DAY)
      this.interval.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.interval.endDate, period));
    else
      this.interval.startDate = this.interval.endDate;

    console.log(this.interval) ; 
    this.apollo.query({
      query: gql`
      query GET_ANALYTICS($interval: IntervalInput!) {
        getAnalyticsGain(interval: $interval) {
          startTime
          endTime
          value
        }  
        getAnalyticsVisits(interval: $interval) {
          startTime
          endTime
          value
        }
        getAnalyticsDiseases(interval : $interval) {
          group percentage value
        }
         
        getGainEvolution(interval : $interval) { 
          value percentage
        }
        
        getVisitsEvolution(interval : $interval) { 
          value percentage
        }

      }
      ` , variables: {
        interval: this.interval
      }
    }).pipe(map(value => value.data)).subscribe((data) => {
      this.analytics = data;

      this.evolutionParams[0].evolutionValue = this.analytics.getVisitsEvolution.value
      this.evolutionParams[0].evolutionPercentage = this.analytics.getVisitsEvolution.percentage

      this.evolutionParams[1].evolutionValue = this.analytics.getGainEvolution.value
      this.evolutionParams[1].evolutionPercentage = this.analytics.getGainEvolution.percentage


      if (this.evolutionParams[0].evolutionValue > 0)
        this.evolutionParams[0].evolutionValue = "+" + this.evolutionParams[0].evolutionValue
      if (this.evolutionParams[1].evolutionValue > 0)
        this.evolutionParams[1].evolutionValue = "+" + this.evolutionParams[1].evolutionValue


      this.evolutionParams[0].evolutionValue = this.evolutionParams[0].evolutionValue + " Visite"
      this.evolutionParams[1].evolutionValue = this.evolutionParams[1].evolutionValue + " DA"

      this.evolutionParams[0].evolutionPercentage = this.evolutionParams[0].evolutionPercentage * 100
      this.evolutionParams[1].evolutionPercentage = this.evolutionParams[1].evolutionPercentage * 100

      this.evolutionParams[0].period = period;
      this.evolutionParams[1].period = period;
      this.updateAnalytics.next({ analytics: this.analytics, period: period });
    })
  }


  public periodSelected($event) {
    this.loadAnalytics($event);
  }

}
