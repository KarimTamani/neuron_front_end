import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {

  public currentMonth: number;
  public currentYear: number;
  public currentDay: number;

  constructor(private apollo: Apollo, public dataService: DataService) {

  }
  ngOnInit(): void {
    // get the current date
    this.apollo.query({
      query: gql`
        {
          getCurrentDate
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {
      const date = new Date(data);

      this.currentMonth = date.getMonth();
      this.currentYear = date.getFullYear();
      this.currentDay = date.getDate();


    })
  }
}
