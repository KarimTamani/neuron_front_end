import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  @Input() header: string;
  @Input() color: string;
  @Input() visits: Visit[] = [];
  public visitsSubjects: any[] = [];
  @Input() nextSubject: Subject<number>;
  @Input() done: boolean = false;
  constructor() { }

  ngOnInit(): void {
    console.log(this.done) ; 
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
        console.log(visitSubject , this.done)  ; 
        visitSubject.subject.next()
      })
    }
  }
}
