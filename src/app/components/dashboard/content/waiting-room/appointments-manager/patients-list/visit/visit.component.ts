import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  @Input() visit: Visit;
  @Input() nextSubject: Subject<null>;
  @Input() done: boolean = false;
  @Input() newDone: boolean = false;
  @Input() currentVisit: boolean = false;
  @Input() waitingRoom: WaitingRoom;
  public next: boolean = false;
  public doneAnimate: boolean = false;
  public totalMoney: number;
  public fadeIn: boolean = false;
  public hide: boolean = false;
  public fadeOut: boolean = false;
  public endAnimation: boolean = false;
  public ignore: boolean = false;

  @Output() inVisitEvent: EventEmitter<Visit>;
  @Output() ignoreVisitEvent: EventEmitter<Visit>;
  @Output() restoreVisitEvent: EventEmitter<Visit>;
  @Output() outVisitEvent: EventEmitter<Visit>;
  @Output() visitDoneEvent: EventEmitter<Visit>;
  constructor(private apollo: Apollo, private router: Router, private interactionService: InteractionService) {
    this.inVisitEvent = new EventEmitter<Visit>();
    this.ignoreVisitEvent = new EventEmitter<Visit>();
    this.restoreVisitEvent = new EventEmitter<Visit>();
    this.outVisitEvent = new EventEmitter<Visit>();
    this.visitDoneEvent = new EventEmitter<Visit>();
  }
  ngOnInit(): void {

    // if the next subject is defined subsscribe for it to perform animation
    if (this.nextSubject) {
      this.nextSubject.subscribe(() => {
        this.next = true;
      })
    }
    // if the status of the vsit is quited sset ifnored to true
    this.ignore = this.visit.status == "visit quited";

    // if the visit is done
    if (this.done) {
      // and it's new done play the done animation 
      // and end it after 100 miliseconds
      if (this.newDone) {
        this.doneAnimate = true;
        setTimeout(() => {
          this.endAnimation = true
        }, 100)
      }
      // calculate the total money that cost the visit
      this.totalMoney = 0;
      this.visit.medicalActs.forEach(act => {
        this.totalMoney += act.price
      })
    }
  }
  public toVisit() {
    // send the patient to the visit room 
    this.apollo.mutate({
      mutation: gql`
        mutation{
          inVisit(waitingRoomId : ${this.visit.waitingRoomId} , visitId : ${this.visit.id}) {
            startTime 
          }
        }
      `
    }).pipe(map(value => (<any>value.data).inVisit)).subscribe((data) => {
      // fade the visit from the list and emit the event to the parent to deal with
      this.fadeIn = true;
      setTimeout(() => {
        this.hide = true;
        this.fadeOut = true;
        this.visit.status = "in visit";
        this.visit.startTime = data.startTime;
        this.inVisitEvent.emit(this.visit);

        this.interactionService.updateReport.next();
      }, 1000)
    })
  }

  public ignoreVisit() {
    // ignore a visit
    this.apollo.mutate({
      mutation: gql`
        mutation {
          ignoreVisit(visitId : ${this.visit.id}) {
            id            
          }
        }
      `
    }).pipe(map(value => (<any>value.data).ignoreVisit)).subscribe((data) => {

      this.visit.status = "visit quited";
      this.fadeIn = true;

      setTimeout(() => {
        this.ignore = true;
        this.fadeIn = false;
        this.ignoreVisitEvent.emit(this.visit);

        this.interactionService.updateReport.next();
      }, 1000)
    })
  }

  public restoreVisit() {
    // restore visit 
    this.apollo.mutate({
      mutation: gql`
          mutation {
            restoreVisit(visitId : ${this.visit.id}) {
              id
            }
          }`
    }).pipe(map(value => (<any>value.data).restoreVisit)).subscribe((data) => {
      this.visit.status = "waiting";
      this.ignore = false;
      this.fadeIn = true;
      setTimeout(() => {
        this.fadeIn = false;
        this.restoreVisitEvent.emit(this.visit);

        this.interactionService.updateReport.next();

      }, 500)
    })
  }

  outVisit() {

    this.apollo.mutate({
      mutation: gql`
        mutation {
          outVisit(waitingRoomId : ${this.visit.waitingRoomId} , visitId : ${this.visit.id}) { 
            id
          }
        }`
    }).pipe(map(value => (<any>value.data).outVisit)).subscribe((data) => {

      this.visit.status = "waiting";
      this.outVisitEvent.emit(this.visit);
      this.next = false;
      this.currentVisit = false;
      this.fadeOut = false;
      this.hide = false;
      this.fadeIn = false;
      this.interactionService.updateReport.next();

    })
  }

  public payeVisit() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "paye-visit",
        "title": "Payé la visite",
        "visit": encodeURIComponent(JSON.stringify(this.visit))
      }
    });
    const subscription = this.interactionService.visitPayed.subscribe((visit) => {
      this.visit = visit;
      this.interactionService.updateReport.next();

      subscription.unsubscribe();
    })
  }

  editVisit() {

    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "new-visit",
        "title": "Modifier la visite",
        "waiting-room": encodeURIComponent(JSON.stringify(this.waitingRoom)),
        "visit": encodeURIComponent(JSON.stringify(this.visit))
      }
    })
  }

  visitDone() {

    this.apollo.mutate({
      mutation : gql`
        mutation {
          visitDone(waitingRoomId : ${this.waitingRoom.id} , visitId : ${this.visit.id}) { 
            endTime
            status
          }
        }`
    }).pipe(map(value => (<any>value.data).visitDone)).subscribe((data) => {
      this.visit.endTime = data.endTime ; 
      this.visit.status = data.status ; 
      this.visitDoneEvent.emit(this.visit) ; 
    })

  }
}
