import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-appointments-controller',
  templateUrl: './appointments-controller.component.html',
  styleUrls: ['./appointments-controller.component.css']
})
export class AppointmentsControllerComponent implements OnInit {
  @Output() nextEvent : EventEmitter<null> ; 
  constructor() {
    this.nextEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {
    
  }
  next() { 
    this.nextEvent.emit() ; 
  }

}
