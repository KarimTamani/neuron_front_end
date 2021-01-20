import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments-controller',
  templateUrl: './appointments-controller.component.html',
  styleUrls: ['./appointments-controller.component.css']
})
export class AppointmentsControllerComponent implements OnInit {
  @Output() nextEvent : EventEmitter<null> ; 
  constructor(private router : Router) {
    this.nextEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {
    
  }
  next() { 
    this.nextEvent.emit() ; 
  }

  newVisit() { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "title" : "Nouvelle visit" , 
        'window-page' : "new-visit"  
      }
    })
  }
}
