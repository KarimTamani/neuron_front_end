import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { valueFromASTUntyped } from 'graphql';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  public interval: any = {
    startDate: null,
    endDate: null
  }
  public analytics: any = null;
  constructor(private apollo: Apollo, private dataService: DataService) { }

  ngOnInit(): void {

    this.apollo.query({
      query: gql`
        {
           getCurrentDate 
        }`
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {
      this.interval.startDate = this.dataService.castDateYMD(data);
      this.interval.endDate = this.interval.startDate;
      console.log(this.interval);
      this.apollo.query({
        query: gql`
        query GET_ANALYTICS($interval: IntervalInput!) {
          getAnalyticsGain(interval: $interval) {
            startTime
            endTime
            value
          }
        
          getAnalyticsExpenses(interval: $interval) {
            startTime
            endTime
            value
          }
           
          getAnalyticsPureGain(interval: $interval) {
            startTime
            endTime
            value
          }
          
          getAnalyticsVisits(interval: $interval) {
            startTime
            endTime
            value
          }
          
          getAnalyticsAge(interval : $interval) {
            group percentage value
          }
          getAnalyticsGender(interval : $interval) {
            group percentage value
          }
          getAnalyticsDiseases(interval : $interval) {
            group percentage value
          }
        }
        ` , variables: {
          interval: this.interval
        }
      }).pipe(map(value => value.data)).subscribe((data) => {
        this.analytics = data;
        console.log(this.analytics);
      })

    })

  }

}
