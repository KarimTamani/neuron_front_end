import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-diagnosis-analytics',
  templateUrl: './diagnosis-analytics.component.html',
  styleUrls: ['./diagnosis-analytics.component.css']
})
export class DiagnosisAnalyticsComponent implements OnInit {
  public analytics: any[] = [];
  public interval: any = {
    startDate: null,
    endDate: null
  }

  constructor(private dataService: DataService , private apollo : Apollo) { }

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
      query : gql`   
      query GET_ANALYTICS($interval: IntervalInput!) {
        getAnalyticsDiagnosis(interval : $interval) {
          group percentage value
        }
      }`, variables : { 
        interval : this.interval 
      }
    }).pipe(map(value => (<any>value.data).getAnalyticsDiagnosis)).subscribe((data) => { 
      // replace the text group with symptmatique diagnosis
      for (let index = 0 ; index <data.length ; index++) { 
        if (data[index].group == "text") { 
          data[index].group = "Diagnostic symptomatique" ; 
          break ; 
        }
      }
      this.analytics = data ; 
    })
  }

  public periodSelected($event) {
    this.loadAnalytics($event);
  }
}
