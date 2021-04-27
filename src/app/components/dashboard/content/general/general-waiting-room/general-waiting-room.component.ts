import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general-waiting-room',
  templateUrl: './general-waiting-room.component.html',
  styleUrls: ['./general-waiting-room.component.css']
})
export class GeneralWaitingRoomComponent implements OnInit {
  
  constructor(private apollo: Apollo ) { }
  public visits: Visit[] = [];
  ngOnInit(): void {
    this.apollo.query({
      query: gql`
      {
        getWaitingRoom(waitingRoom: {}) {
          id
          date
          visits {
            id
            arrivalTime 
            status 
            medicalFile {
              id name lastname gender birthday 
            }
            createdAt
          }
        }
      }`
    }).pipe(map(value => (<any>value.data).getWaitingRoom)).subscribe((data) => {
      
      if (data && data.visits)
        this.visits = data.visits.filter(value => value.status == "waiting");
    })

  }

}
