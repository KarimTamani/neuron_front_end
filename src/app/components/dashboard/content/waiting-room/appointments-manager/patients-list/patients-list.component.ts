import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';
import { InteractionService } from 'src/app/services/interaction.service';

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
  @Input() currentVisit : Visit ; 
  constructor(private interactionService: InteractionService) { }
  
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
}
