import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from 'src/app/classes/Appointment';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-analytics-appointment',
  templateUrl: './analytics-appointment.component.html',
  styleUrls: ['./analytics-appointment.component.css']
})
export class AnalyticsAppointmentComponent implements OnInit {
  @Input() appointment : Appointment ; 
  constructor(private dataSerice : DataService) { }

  ngOnInit(): void {

  }

  public frDate(date : string) { 
    return this.dataSerice.castFRDate(new Date(date)) ; 
  }

}
