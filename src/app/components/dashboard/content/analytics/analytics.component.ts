import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { valueFromASTUntyped } from 'graphql';
import gql from 'graphql-tag';
import { Subject } from 'rxjs';
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
  public updateSubject : Subject<any> ; 

  constructor(private apollo: Apollo, private dataService: DataService) {
    this.updateSubject = new Subject<null>() ; 
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
    this.interval.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.interval.endDate, period));

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
        
        
        getAnalyticsGender(interval : $interval) {
          group percentage value
        }
        getAnalyticsDiseases(interval : $interval) {
          group percentage value
        }
        getGainEvolution(interval : $interval) { 
          value percentage
        }
        getPatientsEvolution(interval : $interval) { 
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
      this.updateSubject.next({ 
        analytics : this.analytics , 
        period : period 
      }) ; 
    })

    /*
    
      getAnalyticsAge(interval : $interval) {
          group percentage value
        }
    
    */
  }


  public periodSelected($event) {
    
    this.loadAnalytics($event) ; 
  }

}
