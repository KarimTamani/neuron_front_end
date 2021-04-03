import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { Appointment } from 'src/app/classes/Appointment';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  @Input() appointment : Appointment ;
  public medicalFile : MedicalFile ;  
  @Output() loadAppointmentEvent : EventEmitter<Appointment> ; 

  constructor(private dataService : DataService) {
    this.loadAppointmentEvent = new EventEmitter<Appointment>() ; 
  }

  ngOnInit(): void {
    this.medicalFile = this.appointment.visit.medicalFile ; 
  }

  get date() { 
    return this.dataService.castFRDate(new Date (this.appointment.date)) 
  }


  public openVisitSubmitter() { 
    this.loadAppointmentEvent.emit(this.appointment) ; 
  }
}
