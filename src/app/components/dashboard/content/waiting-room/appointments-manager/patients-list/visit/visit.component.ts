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
  @Input() done: boolean = false;
  @Input() newDone: boolean = false;
  @Input() currentVisit: boolean = false;
  public doneAnimate: boolean = false;
  public totalMoney: number;

  public endAnimation : boolean = false;  
  constructor() { }
  ngOnInit(): void {

    if (this.nextSubject) {
      this.nextSubject.subscribe(() => {
        this.next = true;
      })
    }
    if (this.done) {
      if (this.newDone) {
        this.doneAnimate = true;
        setTimeout(() => {
          this.endAnimation = true
        } , 100 )
      }
      this.totalMoney = 0;
      this.visit.medicalActs.forEach(act => {
        this.totalMoney += act.price
      })
    }
  }
}
