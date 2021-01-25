import { Component, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';

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
  constructor() { }

  ngOnInit(): void {
    this.nextSubject = new Subject<number>();
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
