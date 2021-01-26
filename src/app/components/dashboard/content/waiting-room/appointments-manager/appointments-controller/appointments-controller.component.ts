import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';

@Component({
  selector: 'app-appointments-controller',
  templateUrl: './appointments-controller.component.html',
  styleUrls: ['./appointments-controller.component.css']
})
export class AppointmentsControllerComponent implements OnInit {
  @Output() nextEvent : EventEmitter<null> ; 
  @Input() activate : boolean = false;  
  @Input() waitingRoom : WaitingRoom ; 
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
        'window-page' : "new-visit"  ,
        "waiting-room" : JSON.stringify(this.waitingRoom)  
      }
    })
  }
}
