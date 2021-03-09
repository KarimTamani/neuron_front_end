import { Component, OnInit  } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
 
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  public evolutionParams : any[] = [
    {
      icon : "fa fa-calendar-check" ,
      name : "Visites" , 
      period : null  ,
      backgroundColor : "#FE6555" , 
      evolutionPercentage : null , 
      evolutionValue : null ,
      boxShadow : "0px 0px 26px #FE655566" 
    } , 
    {
      icon : "fa fa-money-bill-wave" ,
      name : "Gain" , 
      period : null  ,
      backgroundColor : "#265ED7" , 
      evolutionPercentage : null , 
      evolutionValue : null  , 
      boxShadow : "0px 0px 26px #265ED766" 
    } 
  ] ; 
  public interval: any = {
    startDate: null,
    endDate: null
  }
  public analytics : any ; 
  public currentDate : Date  ;
  
  
  constructor(private apollo : Apollo , private dataService : DataService) { }

  ngOnInit(): void {
    this.apollo.query({
      query : gql`
        {
          getCurrentDate
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => { 
      this.currentDate = new Date(data)  ; 
      this.interval.endDate = this.dataService.castDateYMD( data )  ; 
      this.loadAnalytics(this.dataService.MONTH) ; 
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
      
      this.evolutionParams[0].evolutionValue  = this.analytics.getVisitsEvolution.value 
      this.evolutionParams[0].evolutionPercentage  = this.analytics.getVisitsEvolution.percentage 
  
      this.evolutionParams[1].evolutionValue  = this.analytics.getGainEvolution.value 
      this.evolutionParams[1].evolutionPercentage  = this.analytics.getGainEvolution.percentage

      this.evolutionParams[0].evolutionValue = this.evolutionParams[0].evolutionValue + " Visite"
      this.evolutionParams[1].evolutionValue = this.evolutionParams[1].evolutionValue + " DA"
   
      this.evolutionParams[0].evolutionPercentage = this.evolutionParams[0].evolutionPercentage * 100 
      this.evolutionParams[1].evolutionPercentage = this.evolutionParams[1].evolutionPercentage * 100 
   
    })
  }

}
