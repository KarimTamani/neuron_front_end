import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';
import { InteractionService } from 'src/app/services/interaction.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-appointments-manager',
  templateUrl: './appointments-manager.component.html',
  styleUrls: ['./appointments-manager.component.css']
})
export class AppointmentsManagerComponent implements OnInit {
  public waitingVisits: Visit[] = [];
  public visitsDone: Visit[] = []
  public nextSubject: Subject<number>;
  public currentVisit: Visit;


  @Input() waitingRoom: WaitingRoom;
  constructor(private apollo: Apollo , private dataService :DataService) { }

  ngOnInit(): void {
    this.nextSubject = new Subject<number>();
    // get the waiting visits including the one in the doctor office
    this.waitingVisits = <any[]>this.waitingRoom.visits.filter(visit => visit.status == "waiting" || visit.status == "quited" || visit.status == "in visit");
    // get the current visit
    this.currentVisit = this.waitingRoom.visits.find(visit => visit.status == "in visit");
    // get the visits dones
    this.visitsDone = this.waitingRoom.visits.filter(visit => visit.status == "visit payed" || visit.status == "visit done");
  }

  next() {
  
    
  
    this.apollo.mutate({
      mutation: gql`
        mutation {
          nextVisit(waitingRoomId : ${this.waitingRoom.id}) {
            id 
          }
        }`
    }).pipe(map(value => (<any>value.data).nextVisit)).subscribe(async (data) => {
      // get the current time 
      const currentDate = await this.apollo.query({
        query : gql`
        {
          getCurrentDate 
        }
        `
      }).pipe(map(value => (<any>value.data).getCurrentDate)).toPromise() ; 
      const currentTime = this.dataService.getTime(new Date ( currentDate )) ; 
  

      // if there is a visit in the doctor office then :
      if (this.currentVisit) {
        // delete the visit from the waiting visits 
        // and add it to the done visits
        this.waitingVisits.splice(0, 1);
        (<any>this.currentVisit).newDone = true;
        this.visitsDone.splice(0, 0, this.currentVisit);
        this.currentVisit.endTime = currentTime ; 
        this.currentVisit.status = "visit done" ; 
      }
      // if there is a waiting patients in the waiting room then
      if (this.waitingVisits.length > 0) {
        // notify the visit subject to go to the doctor office
        // and assign it to the current visit
        this.nextSubject.next(this.waitingVisits[0].id);
        this.currentVisit = this.waitingVisits[0];
        this.currentVisit.startTime = currentTime ;
        this.currentVisit.status = "in visit" ;  
      } else
        // in case there is no waiting patients
        // assign current visit to null 
        this.currentVisit = null;


    })





  }
}
