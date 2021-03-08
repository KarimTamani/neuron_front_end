import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from 'src/app/classes/Appointment';

@Component({
  selector: 'app-analytics-appointment',
  templateUrl: './analytics-appointment.component.html',
  styleUrls: ['./analytics-appointment.component.css']
})
export class AnalyticsAppointmentComponent implements OnInit {
  @Input() appointment : Appointment ; 
  constructor() { }

  ngOnInit(): void {
  }

}
