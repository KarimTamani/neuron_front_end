import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from 'src/app/classes/Appointment';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';

@Component({
  selector: 'app-appointments-loader',
  templateUrl: './appointments-loader.component.html',
  styleUrls: ['./appointments-loader.component.css']
})
export class AppointmentsLoaderComponent implements OnInit {
  public appointments : Appointment[] = []  ; 
  public waitingRoom : WaitingRoom = null ; 
  constructor(private route : ActivatedRoute) { }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams ; 
    if (params["appointments"]) 
      this.appointments = JSON.parse(decodeURIComponent(params["appointments"])) ; 
    if (params["waiting-room"]) 
      this.waitingRoom = JSON.parse(decodeURIComponent(params["waiting-room"])) ; 
     
  }

}
