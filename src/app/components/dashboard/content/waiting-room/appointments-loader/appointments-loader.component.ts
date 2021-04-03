import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/classes/Appointment';
import { Visit } from 'src/app/classes/Visit';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';

@Component({
  selector: 'app-appointments-loader',
  templateUrl: './appointments-loader.component.html',
  styleUrls: ['./appointments-loader.component.css']
})
export class AppointmentsLoaderComponent implements OnInit {
  public appointments: Appointment[] = [];
  public waitingRoom: WaitingRoom = null;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams;
    if (params["appointments"])
      this.appointments = JSON.parse(decodeURIComponent(params["appointments"]));
    if (params["waiting-room"])
      this.waitingRoom = JSON.parse(decodeURIComponent(params["waiting-room"]));

  }
  public loadAppointment($event) {
    var visit = new Visit()
    visit.medicalFile = $event.visit.medicalFile;
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "title": "Nouvelle visit",
        'window-page': "new-visit",
        "waiting-room": encodeURIComponent(JSON.stringify(this.waitingRoom)),
        "visit": encodeURIComponent(JSON.stringify(visit)),
        "edit": false
      }
    })
  }
}
