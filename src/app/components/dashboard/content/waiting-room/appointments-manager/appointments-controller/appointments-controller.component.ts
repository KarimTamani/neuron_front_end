import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Appointment } from 'src/app/classes/Appointment';
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
  public appointments : Appointment[] = [] ; 
  constructor(private router : Router , private apollo : Apollo) {
    this.nextEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {
    console.log(this.waitingRoom.date) ; 
    // load the appointments for today
    this.apollo.query({
      query : gql`
        {
          searchAppointments(startDate : "${this.waitingRoom.date}" , endDate : "${this.waitingRoom.date}") { 
            rows { 
              id 
              date 
              time
              visit {
                id createdAt 
                medicalFile {
                  id name lastname birthday phone email gender
                }
              }
            }
            count  
          }
        }`
    }).pipe(map(value => (<any>value.data).searchAppointments)).subscribe((data) => { 
      this.appointments = data.rows ; 
      
    })  
    
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
        "waiting-room" : encodeURIComponent(JSON.stringify( this.waitingRoom) )   
      }
    })
  }

  public openAppointmentsLoader() { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "title" : "Les Rendez-Vous de aujourd-hui" , 
        'window-page' : "appointments-loader"  ,
        "appointments" : encodeURIComponent(JSON.stringify( this.appointments) )   , 
        "waiting-room" : encodeURIComponent(JSON.stringify( this.waitingRoom) )   
      }
    })
  }
}
