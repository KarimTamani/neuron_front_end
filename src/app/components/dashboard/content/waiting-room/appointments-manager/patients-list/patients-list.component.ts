import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  public visitsSubjects: any[] = [];
  @Input() header: string;
  @Input() color: string;
  @Input() visits: Visit[] = [];
  @Input() nextSubject: Subject<number>;
  @Input() done: boolean = false;
  @Input() currentVisit: Visit;
  @Output() inVisitEvent: EventEmitter<Visit>;
  @Output() ignoreVisitEvent: EventEmitter<Visit>;
  @Output() restoreVisitEvent: EventEmitter<Visit>;
  @Output() outVisitEvent: EventEmitter<Visit>;
  @Output() visitDoneEvent : EventEmitter<Visit> ; 

  @Input() waitingRoom: WaitingRoom;
  constructor(private apollo: Apollo) {
    this.inVisitEvent = new EventEmitter<Visit>();
    this.ignoreVisitEvent = new EventEmitter<Visit>();
    this.restoreVisitEvent = new EventEmitter<Visit>();
    this.outVisitEvent = new EventEmitter<Visit>();
    this.visitDoneEvent = new EventEmitter<Visit>() ; 
  }

  ngOnInit(): void {
    this.initSubjects();
  }

  private initSubjects() {
    this.visitsSubjects = [];
    // init subjects of the visits ; 
    this.visits.forEach((visit) => {
      this.visitsSubjects.push({
        id: visit.id,
        subject: new Subject<null>()
      })
    });
    // check if the next subject is defined 
    if (this.nextSubject && !this.done) {
      this.nextSubject.subscribe((id) => {
        let visitSubject = this.visitsSubjects.find((value) => value.id == id)
        visitSubject.subject.next()
      })
    }
  }


  public inVisit($event) {
    // set the current visit to the given visit 
    // and emit it ti the parent to deal with
    this.currentVisit = $event;
    this.inVisitEvent.emit(this.currentVisit);
  }


  public drop($event: CdkDragDrop<Visit[]>) {


    // get the visit that we want to deplace based from the previous index 
    // get the order that we want to order it 
    var visit = this.visits[$event.previousIndex];
    var order = this.visits[$event.currentIndex].order;
    // if the visit is ignored or somethings like that to take it in considiration
    if (visit.status != "waiting")
      return;
    this.apollo.mutate({
      mutation: gql`
        mutation {
          reorderVisits(visitId : ${visit.id} , order : ${order}) {
            id
          }
        }`
    }).pipe(map(value => (<any>value.data).reorderVisits)).subscribe((data) => {

      // check if the we want to go up or down  
      var up = $event.previousIndex < $event.currentIndex;

      var visits = [];
      // get the visits based on the direction of the reordination
      if (up)
        visits = this.visits.filter(value => value.order > visit.order && value.order <= order);
      else
        visits = this.visits.filter(value => value.order < visit.order && value.order >= order);


      // update visits order
      for (let index = 0; index < visits.length; index++) {
        visits[index].order = visits[index].order + ((up) ? (-1) : (1));
      }
      // set the order of the visit to the order of the visit that we want to take place
      visit.order = order;
      // update the visits array 
      moveItemInArray(this.visits, $event.previousIndex, $event.currentIndex);
    })
  }
}
