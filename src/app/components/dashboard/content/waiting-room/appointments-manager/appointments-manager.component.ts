import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, QueryList } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject, Subscription } from 'rxjs';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';
import { InteractionService } from 'src/app/services/interaction.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { AppointmentsControllerComponent } from './appointments-controller/appointments-controller.component';
import { Message } from 'src/app/classes/Message';

@Component({
  selector: 'app-appointments-manager',
  templateUrl: './appointments-manager.component.html',
  styleUrls: ['./appointments-manager.component.css']
})
export class AppointmentsManagerComponent implements OnInit, OnDestroy {
  public waitingVisits: Visit[] = [];
  public visitsDone: Visit[] = []
  public nextSubject: Subject<number>;
  public currentVisit: Visit;

  public subscriptions: Subscription[] = [];
  @Input() waitingRoom: WaitingRoom;
  @Input() updateSubject: Subject<WaitingRoom>;
  @Input() controllable: boolean;
  @ViewChild(PatientsListComponent) patientsLists: QueryList<PatientsListComponent[]>;
  @ViewChild(AppointmentsControllerComponent) controller: QueryList<AppointmentsControllerComponent[]>;


  public updateController: Subject<null>;
  public updateVisits: Subject<null>;

  constructor(private apollo: Apollo, private dataService: DataService, private interactionService: InteractionService) {

    this.nextSubject = new Subject<number>();
    this.updateVisits = new Subject<null>();
    this.updateController = new Subject<null>();

  }

  ngOnInit(): void {
    this.getVisits();
    if (this.updateSubject) {
      this.subscriptions.push(this.updateSubject.subscribe((data) => {
        this.waitingRoom = data;
        this.getVisits();


        (<any>this.patientsLists).visits = this.waitingVisits;
        (<any>this.patientsLists).currentVisit = this.currentVisit;
        if (this.controllable) {
          (<any>this.controller).waitingRoom = this.waitingRoom;
          this.updateController.next();
        }
        this.updateVisits.next();

      }));
    }

  }

  private getVisits() {
    // get the waiting visits including the one in the doctor office
    this.waitingVisits = <any[]>this.waitingRoom.visits.filter(visit => visit.status == "waiting" || visit.status == "in visit");

    var quitedVisits = <any[]>this.waitingRoom.visits.filter(visit => visit.status == "visit quited");
    this.waitingVisits = this.waitingVisits.concat(quitedVisits);
    // get the current visit
    this.currentVisit = this.waitingRoom.visits.find(visit => visit.status == "in visit");
    // get the visits dones
    this.visitsDone = this.waitingRoom.visits.filter(visit => visit.status == "visit payed" || visit.status == "visit done");
    this.visitsDone = this.visitsDone.reverse();
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
        query: gql`
        {
          getCurrentDate 
        }
        `
      }).pipe(map(value => (<any>value.data).getCurrentDate)).toPromise();
      const currentTime = this.dataService.getTime(new Date(currentDate));
      // if there is a visit in the doctor office then :
      if (this.currentVisit) {
        // delete the visit from the waiting visits 
        // and add it to the done visits
        const index = this.waitingVisits.findIndex(value => value.id == this.currentVisit.id);
        this.waitingVisits.splice(index, 1);
        (<any>this.currentVisit).newDone = true;
        this.visitsDone.splice(0, 0, this.currentVisit);
        this.currentVisit.endTime = currentTime;
        this.currentVisit.status = "visit done";
      }
      // if there is a waiting patients in the waiting room then
      if (this.waitingVisits.length > 0) {
        // notify the visit subject to go to the doctor office
        // and assign it to the current visit
        const index = this.waitingVisits.findIndex(value => value.status == "waiting");
        if (index != -1) {
          this.nextSubject.next(this.waitingVisits[index].id);
          this.currentVisit = this.waitingVisits[index];
          this.currentVisit.startTime = currentTime;
          this.currentVisit.status = "in visit";
        } else
          // in case there is no waiting patients
          // assign current visit to null 
          this.currentVisit = null;
      }

      this.interactionService.updateReport.next();
      this.interactionService.showMessage.next(<Message>{
        message : "Prochaine visite commencée"
      })
    })
  }
  public inVisit($event) {
    this.currentVisit = $event;

  }
  public outVisit($event) {
    this.currentVisit = null;

  }

  public ignoreVisit($event) {
    // get the index of the visit and delete it 
    var index = this.waitingVisits.findIndex(value => value.id == $event.id);
    this.waitingVisits.splice(index, 1);


    // try to find the propper index for the insertion
    // either there is no ignored visits then insert the new ignored visit at the bottom of the list
    // else try to find the order between the ignored visits 
    for (; index < this.waitingVisits.length; index++) {
      if (this.waitingVisits[index].status == "waiting")
        continue;
      else if (this.waitingVisits[index].order < $event.order)
        continue;
      break;
    }
    this.waitingVisits.splice(index, 0, $event);

  }

  public restoreVisit($event) {
    // delete the restored visit from the waiting visits to reorder it
    var index = this.waitingVisits.findIndex(value => value.id == $event.id);
    this.waitingVisits.splice(index, 1);


    // find the proper index  to insert the restored visit
    for (index = 0; index < this.waitingVisits.length; index++) {
      if (this.waitingVisits[index].order < $event.order && this.waitingVisits[index].status == "waiting")
        continue;
      break;
    }
    this.waitingVisits.splice(index, 0, $event);

  }



  public visitDone($event) {
    // find the visit from the waiting visits to delete it 
    // and mark it as new done visit and added it to the visitsDone

    const index = this.waitingVisits.findIndex(value => value.id == this.currentVisit.id);
    this.waitingVisits.splice(index, 1);
    (<any>this.currentVisit).newDone = true;
    this.visitsDone.splice(0, 0, this.currentVisit);
    this.currentVisit = null;
  }
  public ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

}
