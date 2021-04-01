import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-location-analytics',
  templateUrl: './location-analytics.component.html',
  styleUrls: ['./location-analytics.component.css']
})
export class LocationAnalyticsComponent implements OnInit {
  public analytics: any;
  public interval: any = {
    startDate: null,
    endDate: null
  }
  public updateSubject: Subject<any>;

  constructor(private apollo: Apollo, private dataService: DataService) {
    this.updateSubject = new Subject<any>();
  }

  ngOnInit(): void {

    this.apollo.query({
      query: gql`
        {
          getCurrentDate 
        }`
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {

      this.interval.endDate = this.dataService.castDateYMD(data);
      this.loadAnalytics(this.dataService.MONTH);
    })
  }

  private loadAnalytics(period) {
    if (period != this.dataService.DAY)
      this.interval.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.interval.endDate, period));
    else
      this.interval.startDate = this.interval.endDate;

    this.apollo.query({
      query: gql`
        query GET_LOCATION_ANALYTICS($interval : IntervalInput!){ 

          getWilayaAnalytics(interval : $interval){ 
            group 
            value 
            percentage 
          }

          getCommuneAnalytics(interval : $interval){ 
            group 
            value 
            percentage 
          }
        }` ,
      variables: {
        interval: this.interval
      }
    }).pipe(map(value => value.data)).subscribe((data) => {
      this.analytics = data;
      console.log(this.analytics) ; 
      this.updateSubject.next({
        analytics: this.analytics,
        period: period
      });
    })



  }
  public periodSelected($event) {
    this.loadAnalytics($event);
  }
}
