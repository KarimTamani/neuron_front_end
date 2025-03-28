import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subject, SubjectSubscriber } from 'rxjs/internal/Subject';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {


  public currentDate: Date;

  public currentMonth: number;
  public currentYear: number;
  public currentDay: number;

  public day: number;
  public month: number;
  public year: number;

  public loaded: boolean = false;
  public updateSubject: Subject<any>;

  @Output() dateChangedEvent: EventEmitter<any>;

  //public schedule: Schedule;
  ngOnInit(): void { }
  constructor(private apollo: Apollo, private dataService: DataService, private interactionService: InteractionService) {
    this.updateSubject = new Subject<any>();

    this.dateChangedEvent = new EventEmitter<any>();

    this.apollo.query({
      query: gql`
        { 
          getCurrentDate
        }`
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe(data => {

      this.currentDate = new Date(data);

      this.currentMonth = this.currentDate.getUTCMonth();
      this.currentYear = this.currentDate.getFullYear();
      this.currentDay = this.currentDate.getUTCDate();

      this.day = this.currentDay;
      this.month = this.currentMonth;
      this.year = this.currentYear;

      this.loaded = true;
    })
  }

  nextMonth() {

    this.day = 1;
    if (this.currentMonth != 11)
      this.currentMonth++;
    else {
      this.currentYear++;
      this.currentMonth = 0;
    }
    if (this.currentYear == this.year && this.currentMonth == this.month) {
      this.day = this.currentDay;
    }

    this.currentDate = new Date(this.currentMonth + 1 + " " + this.day + " " + this.currentYear);
    this.currentDate = new Date(this.currentDate.getTime() + this.dataService.HOUR * 1000 );

    this.dateChangedEvent.emit(this.currentDate);
    this.updateSubject.next(this.currentDate);
  }

  previousMonth() {

    this.day = 1;
    if (this.currentMonth != 0)
      this.currentMonth--;
    else {
      this.currentYear--;
      this.currentMonth = 11;
    }
    if (this.currentYear == this.year && this.currentMonth == this.month) {
      this.day = this.currentDay;
    }
    this.currentDate = new Date(this.currentMonth + 1 + " " + this.day + " " + this.currentYear);
    this.currentDate = new Date(this.currentDate.getTime() + this.dataService.HOUR * 1000 );

    this.dateChangedEvent.emit(this.currentDate);
    this.updateSubject.next(this.currentDate);

  }

  private getStartOfMonth(date: Date) {

    let time = date.getTime();
    time = time - (date.getDate() - 1) * 24 * 3600 * 1000;
    let startDate = new Date(time);
    return startDate;

  }

  public getMonthDays(date: Date) {
    let startDay = this.getStartOfMonth(date).getDay();
    let days: string[] = [];
    for (let index = startDay; index < this.dataService.days.length; index++) {
      days.push(this.dataService.days[index]);
    }
    for (let index = 0; index < startDay; index++) {
      days.push(this.dataService.days[index]);
    }
    return days;
  }

  public buildDays() {
    let days = [];
    let end = 31;
    if ((this.currentMonth % 2) == 1) {
      end = 30;
    }
    if (this.currentMonth == 1) {
      if ((this.currentYear - 2020) % 4 == 0)
        end = 29;
      else
        end = 28;
    }
    for (let index = 1; index <= end; index++)
      days.push(index);
    return days;
  }
  getWeek(week: number) {
    let days = this.buildDays();
    return days.slice(week * 7, (week * 7) + 7);
  }

  selectDay(d) {

    this.day = d;
    this.currentDate = new Date(this.currentMonth + 1 + " " + this.day + " " + this.currentYear);
    this.currentDate = new Date(this.currentDate.getTime() + this.dataService.HOUR * 1000 );

    this.dateChangedEvent.emit(this.currentDate);
    this.updateSubject.next(this.currentDate);
  }

}
