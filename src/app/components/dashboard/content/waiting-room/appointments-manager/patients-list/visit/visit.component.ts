import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  @Input() visit: Visit;
  public next: boolean = false;
  @Input() nextSubject: Subject<null>;
  @Input() done : boolean = false ; 
  public doneAnimate : boolean = false ; 
  constructor() {}
  ngOnInit(): void {

    if (this.nextSubject) { 
      this.nextSubject.subscribe(() => {
        this.next = true;
      })
    }
    if (this.done)
    setTimeout(() => { 
      this.doneAnimate = true ; 
    } , 100) ; 
  }
}
