import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-date-interval',
  templateUrl: './date-interval.component.html',
  styleUrls: ['./date-interval.component.css']
})
export class DateIntervalComponent implements OnInit {
  @Input() placeholder: string;
  public isCustom: boolean = true;
  public options: string[] = [
    "tout le temps",
    "ce joure",
    "cet semain",
    "ce mois",
    "ce trimester",
    "ce semester",
    "cette année",
    "custumizable"
  ];
  public currentDate: string;
  public selectedOption: string;
  public startDate: string;
  public endDate: string;
  @Output() changeEvent : EventEmitter<any> ; 
  constructor(private apollo: Apollo, private dataService: DataService) {
  
    this.selectedOption = this.options[0];
    this.changeEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {
    this.apollo.query({
      query: gql`
        { 
          getCurrentDate 
        }`
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {
      this.currentDate = data;
    })
  }


  public selectPeriod() {
    // every time a period selected 
    // calculate the dates intervales
    this.endDate = this.dataService.castDateYMD(this.currentDate);
    switch (this.selectedOption) {
      case this.options[0]:
        this.startDate = null;
        this.endDate = null;
        break;
      case this.options[1]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.currentDate, this.dataService.DAY));
        break;
      case this.options[2]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.currentDate, this.dataService.WEEK));
        break;
      case this.options[3]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.currentDate, this.dataService.MONTH));
        break;
      case this.options[4]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.currentDate, this.dataService.TRIMESTER));
        break;
      case this.options[5]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.currentDate, this.dataService.SEMESTER));
        break;
      case this.options[6]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.currentDate, this.dataService.YEAR));
        break;
      default :   
        break;
    }
  
    this.changeEvent.emit({ 
      startDate : this.startDate , 
      endDate : this.endDate  
    })
  
  }

  public inputChange()  {  
    this.changeEvent.emit({ 
      startDate : this.startDate , 
      endDate : this.endDate  
    })
  } 
}
