import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';

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


  @Input() waitingRoom : WaitingRoom ; 
  constructor() { }

  ngOnInit(): void {
    this.nextSubject = new Subject<number>();
    this.waitingVisits = <any[]>this.waitingRoom.visits.filter(visit => visit.status == "waiting" || visit.status == "quited") ; 
    console.log(this.waitingVisits) ; 
  }
  next() {
    if (this.currentVisit) { 

      this.waitingVisits.splice(0 , 1) ;
      this.visitsDone.splice( 0 , 0 , this.currentVisit) ;  

    }
    if (this.waitingVisits.length > 0) {
      this.nextSubject.next(this.waitingVisits[0].id);
      this.currentVisit = this.waitingVisits[0] ; 
    }
  }
}
