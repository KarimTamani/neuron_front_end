import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {

  public currentMonth: number;
  public currentYear: number;
  public currentDay: number;
  public currentDate : string ; 

  public waitingRoom : WaitingRoom ; 
  
  constructor(private apollo: Apollo, public dataService: DataService , private interactionService : InteractionService) {}
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
      this.currentDate = data ; 
      this.currentMonth = date.getMonth();
      this.currentYear = date.getFullYear();
      this.currentDay = date.getDate();
      this.loadWaitingRoom();
    })


    this.interactionService.newVisitAdded.subscribe(() => {
      this.waitingRoom = null ;
      this.loadWaitingRoom(); 
    })
  }
  private loadWaitingRoom() {
    this.apollo.query({
      query : gql`
        {
          getWaitingRoom(waitingRoom : {
            date : "${this.dataService.castDateYMD(this.currentDate)}"
          }) {
            id date visits {
              id 
              arrivalTime 
              status 
              order 
              startTime 
              endTime 

              waitingRoomId  
              debt 
              payedMoney 
              medicalFile {
                id 
                name 
                gender
                lastname
                birthday 
                phone 
                email
              }
              medicalActs {
                id 
                name 
                price
              }
            }
          }
        }
      `
    }).pipe(map(value => (<any>value.data).getWaitingRoom)).subscribe((data) => { 
      this.waitingRoom = data ;     

      
    })
  }
  public createWaitingRoom() {
    this.apollo.mutate({
      mutation : gql`
        mutation {
          addWaitingRoom(waitingRoom : {
            date : "${this.dataService.castDateYMD(this.currentDate)}"
          }) {
            id date visits {
              id
            }
          }
        } 
      `
    }).pipe(map(value => (<any>value.data).addWaitingRoom)).subscribe((data) => {
      this.waitingRoom = data ; 
      this.waitingRoom.visits = [] ; 
    })
  }
  
}
